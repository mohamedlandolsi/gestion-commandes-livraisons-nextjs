"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search, Edit, Trash2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { getAllPaiements, deletePaiement, updatePaiementStatut, processPaiement } from "@/services/paiementService";
import { type Paiement, StatutPaiement, ModePaiement } from "@/types/paiement";
import { ApiError } from "@/services/apiUtils";
import { format } from 'date-fns'; // For date formatting

// Helper to get badge variant based on payment status
const getStatusBadgeVariant = (status: StatutPaiement): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case StatutPaiement.EFFECTUE:
      return "default"; // Greenish in shadcn/ui default theme
    case StatutPaiement.EN_ATTENTE:
      return "secondary"; // Bluish/Grayish
    case StatutPaiement.ECHEC:
      return "destructive"; // Reddish
    case StatutPaiement.REMBOURSE:
      return "outline"; // Neutral
    default:
      return "outline";
  }
};

// Helper to format currency
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

export default function PaymentsPage() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paiementToDelete, setPaiementToDelete] = useState<Paiement | null>(null);

  const fetchPaiements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllPaiements();
      setPaiements(data);
    } catch (e) {
      const apiError = e as ApiError;
      setError(apiError.message || "Failed to fetch paiements.");
      toast.error(apiError.message || "Failed to fetch paiements.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, []);

  const handleDeleteConfirmation = (paiement: Paiement) => {
    setPaiementToDelete(paiement);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!paiementToDelete) return;
    try {
      await deletePaiement(paiementToDelete.id);
      toast.success(`Paiement ID: ${paiementToDelete.id} deleted successfully.`);
      setPaiements(paiements.filter(p => p.id !== paiementToDelete.id));
    } catch (e) {
      const apiError = e as ApiError;
      toast.error(`Failed to delete paiement: ${apiError.message}`);
    } finally {
      setShowDeleteConfirm(false);
      setPaiementToDelete(null);
    }
  };
  
  const handleUpdateStatus = async (id: number, statut: StatutPaiement) => {
    try {
      const updatedPaiement = await updatePaiementStatut(id, statut);
      setPaiements(paiements.map(p => p.id === id ? updatedPaiement : p));
      toast.success(`Statut du paiement ID: ${id} mis à jour à ${statut}.`);
    } catch (e) {
      const apiError = e as ApiError;
      toast.error(`Erreur lors de la mise à jour du statut: ${apiError.message}`);
    }
  };

  const handleProcessPaiement = async (id: number) => {
    try {
      const processedPaiement = await processPaiement(id);
      setPaiements(paiements.map(p => p.id === id ? processedPaiement : p));
      toast.success(`Paiement ID: ${id} traité. Nouveau statut: ${processedPaiement.statut}`);
    } catch (e) {
      const apiError = e as ApiError;
      toast.error(`Erreur lors du traitement du paiement: ${apiError.message}`);
    }
  };


  const filteredPaiements = paiements.filter(paiement =>
    paiement.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.commande.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (paiement.commande.client?.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    paiement.mode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.statut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Chargement des paiements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <XCircle className="h-10 w-10 text-destructive mb-4" />
        <p className="text-lg text-destructive mb-4">{error}</p>
        <Button onClick={fetchPaiements}>
          <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Paiements</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchPaiements} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
          <Link href="/paiements/new">
            <Button className="flex items-center gap-2">
              <PlusCircle size={20} />
              Enregistrer un Paiement
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Paiements</CardTitle>
          <CardDescription>
            Consultez et gérez tous les paiements enregistrés. Actuellement {filteredPaiements.length} paiement(s) affiché(s).
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par ID Paiement, ID Commande, Client, Mode, Statut..." 
              className="pl-8 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredPaiements.length === 0 && !isLoading ? (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">Aucun paiement trouvé.</p>
              {searchTerm && <p className="text-sm text-muted-foreground">Essayez d'affiner vos critères de recherche.</p>}
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Paiement</TableHead>
                <TableHead>ID Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Montant Commande</TableHead>
                <TableHead>Date Paiement</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaiements.map((paiement) => (
                <TableRow key={paiement.id}>
                  <TableCell className="font-medium">{`PAY-${String(paiement.id).padStart(4, '0')}`}</TableCell>
                  <TableCell>
                    <Link href={`/commandes/${paiement.commande.id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                      {`CMD-${String(paiement.commande.id).padStart(4, '0')}`}
                    </Link>
                  </TableCell>
                  <TableCell>{paiement.commande.client?.nom || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(paiement.commande.montantTotal)}
                  </TableCell>
                  <TableCell>{format(new Date(paiement.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>{paiement.mode.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(paiement.statut)}>
                      {paiement.statut.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/paiements/${paiement.id}`}>
                          <DropdownMenuItem>
                            <Search className="mr-2 h-4 w-4" />
                            Voir Détails
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/paiements/edit/${paiement.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        {paiement.statut === StatutPaiement.EN_ATTENTE && (
                           <DropdownMenuItem onClick={() => handleProcessPaiement(paiement.id)}>
                             <CheckCircle className="mr-2 h-4 w-4" />
                             Traiter le Paiement
                           </DropdownMenuItem>
                        )}
                        {paiement.statut !== StatutPaiement.EFFECTUE && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(paiement.id, StatutPaiement.EFFECTUE)}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Marquer comme Effectué
                          </DropdownMenuItem>
                        )}
                        {paiement.statut !== StatutPaiement.ECHEC && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(paiement.id, StatutPaiement.ECHEC)}>
                            <XCircle className="mr-2 h-4 w-4" /> Marquer comme Échec
                          </DropdownMenuItem>
                        )}
                         {paiement.statut !== StatutPaiement.REMBOURSE && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(paiement.id, StatutPaiement.REMBOURSE)}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Marquer comme Remboursé
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteConfirmation(paiement)} className="text-red-600 hover:!text-red-700">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le paiement ID: {paiementToDelete?.id}? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPaiementToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
