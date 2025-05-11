// app/(modules)/commandes/page.tsx
"use client";

import Link from "next/link";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  ShoppingCart,
  FileText,
  Trash2,
  XCircle,
  Loader2 // For loading spinner
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState, useEffect, useCallback, useMemo } from "react";
import { Commande, StatutCommande } from "@/types/commande";
import {
  getAllCommandes,
  deleteCommande,
  updateCommandeStatut,
} from "@/services/commandeService";
import { format } from 'date-fns'; // For date formatting

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [commandeToCancelId, setCommandeToCancelId] = useState<number | null>(null);

  const fetchCommandes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCommandes();
      setCommandes(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch commandes";
      setError(errorMessage);
      setCommandes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommandes();
  }, [fetchCommandes]);

  const handleDelete = async (commandeId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ? Ceci est irréversible.")) {
      try {
        await deleteCommande(commandeId);
        fetchCommandes(); // Refetch after delete
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      }
    }
  };

  const handleCancelOrder = (commandeId: number) => {
    setCommandeToCancelId(commandeId);
    setIsCancelDialogOpen(true);
  };

  const executeCancelCommande = async () => {
    if (commandeToCancelId === null) return;
    try {
      await updateCommandeStatut(commandeToCancelId, StatutCommande.ANNULEE);
      fetchCommandes(); // Refetch after update
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'annulation");
    } finally {
      setIsCancelDialogOpen(false);
      setCommandeToCancelId(null);
    }
  };

  const getStatusVariant = (status: StatutCommande | undefined): "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "info" => {
    switch (status) {
      case StatutCommande.LIVREE:
        return "success";
      case StatutCommande.EN_ATTENTE:
        return "warning";
      case StatutCommande.ANNULEE:
        return "destructive";
      case StatutCommande.EN_PREPARATION:
      case StatutCommande.EXPEDIEE:
        return "info";
      case StatutCommande.VALIDEE:
        return "default"; // Or another color like primary
      default:
        return "secondary";
    }
  };

  const filteredCommandes = useMemo(() => {
    if (!searchTerm) return commandes;
    return commandes.filter(cmd => {
      const clientNom = cmd.client && cmd.client.nom ? cmd.client.nom.toLowerCase() : '';
      const statut = cmd.statut ? cmd.statut.toLowerCase() : '';
      // Ensure cmd.date is valid before formatting
      const dateStr = cmd.date ? format(new Date(cmd.date), 'dd/MM/yyyy') : '';
      
      return (
        cmd.id.toString().includes(searchTerm.toLowerCase()) ||
        clientNom.includes(searchTerm.toLowerCase()) ||
        statut.includes(searchTerm.toLowerCase()) ||
        (dateStr && dateStr.includes(searchTerm)) // Check if dateStr is not empty
      );
    });
  }, [commandes, searchTerm]);

  if (loading && commandes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Chargement des commandes...</p>
      </div>
    );
  }

  if (error && commandes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <XCircle className="h-12 w-12 mb-2" />
        <p className="text-xl font-semibold">Erreur de chargement</p>
        <p>{error}</p>
        <Button onClick={fetchCommandes} className="mt-4">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" /> Commandes
        </h1>
        <Link href="/commandes/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Nouvelle Commande
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des Commandes</CardTitle>
          <CardDescription>
            Suivez et gérez toutes les commandes clients.
          </CardDescription>
          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Rechercher (ID, Client, Statut, Date dd/mm/yyyy)..."
                className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCommandes.length === 0 && !loading ? (
            <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Essayez de modifier vos termes de recherche." : "Aucune commande n'a encore été créée."}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link href="/commandes/new">
                    <Button type="button">
                      <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                      Créer une Commande
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Articles</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommandes.map((commande) => (
                <TableRow key={commande.id}>
                  <TableCell className="font-medium">
                    <Link href={`/commandes/${commande.id}`} className="hover:underline text-blue-600">
                        {`CMD-${String(commande.id).padStart(4, '0')}`}
                    </Link>
                  </TableCell>
                  <TableCell>{commande.client && commande.client.nom ? commande.client.nom : 'N/A'}</TableCell>
                  <TableCell>{commande.date ? format(new Date(commande.date), 'dd/MM/yyyy HH:mm') : 'N/A'}</TableCell>
                  <TableCell className="text-right">{`${typeof commande.montantTotal === 'number' ? commande.montantTotal.toFixed(2) : '0.00'} €`}</TableCell>
                  <TableCell className="text-center">{commande.lignesCommande ? commande.lignesCommande.length : 0}</TableCell>
                  <TableCell>
                    {commande.statut ? (
                      <Badge variant={getStatusVariant(commande.statut)}>
                        {commande.statut.replace(/_/g, ' ')}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">N/A</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/commandes/${commande.id}`}>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <FileText className="h-4 w-4"/> Voir Détails
                          </DropdownMenuItem>
                        </Link>
                        {commande.statut !== StatutCommande.ANNULEE && commande.statut !== StatutCommande.LIVREE && (
                          <DropdownMenuItem 
                            className="flex items-center gap-2 text-orange-600 hover:!text-orange-700 cursor-pointer"
                            onClick={() => handleCancelOrder(commande.id)}
                          >
                            <XCircle className="h-4 w-4"/> Annuler Commande
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-red-600 hover:!text-red-700 cursor-pointer"
                          onClick={() => handleDelete(commande.id)}
                        >
                          <Trash2 className="h-4 w-4"/> Supprimer Commande
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
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Affichage de <strong>{filteredCommandes.length}</strong> sur <strong>{commandes.length}</strong> commandes
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir annuler cette commande ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action mettra à jour le statut de la commande sur "Annulée".
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommandeToCancelId(null)}>Retour</AlertDialogCancel>
            <AlertDialogAction onClick={executeCancelCommande} className="bg-orange-600 hover:bg-orange-700">
              Confirmer l'Annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
