"use client";

import Link from "next/link";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Truck,
  FileText,
  Trash2,
  XCircle,
  Loader2,
  Edit,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Livraison, StatutLivraison } from "@/types/livraison";
import {
  getAllLivraisons,
  deleteLivraison,
  updateLivraisonStatut,
} from "@/services/livraisonService";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function LivraisonsPage() {
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [livraisonToDeleteId, setLivraisonToDeleteId] = useState<number | null>(null);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [livraisonToCancel, setLivraisonToCancel] = useState<Livraison | null>(null);

  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [livraisonToUpdateStatus, setLivraisonToUpdateStatus] = useState<Livraison | null>(null);
  const [selectedStatusForUpdate, setSelectedStatusForUpdate] = useState<StatutLivraison | undefined>();

  const fetchLivraisons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllLivraisons();
      setLivraisons(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch livraisons";
      setError(errorMessage);
      setLivraisons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivraisons();
  }, [fetchLivraisons]);

  const openDeleteDialog = (livraisonId: number) => {
    setLivraisonToDeleteId(livraisonId);
    setIsDeleteDialogOpen(true);
  };

  const executeDeleteLivraison = async () => {
    if (livraisonToDeleteId === null) return;
    try {
      await deleteLivraison(livraisonToDeleteId);
      fetchLivraisons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression de la livraison");
    } finally {
      setIsDeleteDialogOpen(false);
      setLivraisonToDeleteId(null);
    }
  };

  const openCancelDialog = (livraison: Livraison) => {
    setLivraisonToCancel(livraison);
    setIsCancelDialogOpen(true);
  };

  const executeCancelLivraison = async () => {
    if (!livraisonToCancel) return;
    setLoading(true);
    try {
      await updateLivraisonStatut(livraisonToCancel.id, StatutLivraison.ANNULEE);
      fetchLivraisons();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'annulation de la livraison");
    } finally {
      setIsCancelDialogOpen(false);
      setLivraisonToCancel(null);
      setLoading(false);
    }
  };

  const openUpdateStatusDialog = (livraison: Livraison) => {
    setLivraisonToUpdateStatus(livraison);
    setSelectedStatusForUpdate(livraison.statut);
    setIsUpdateStatusDialogOpen(true);
  };

  const executeUpdateStatus = async () => {
    if (!livraisonToUpdateStatus || selectedStatusForUpdate === undefined) return;
    setLoading(true);
    try {
      await updateLivraisonStatut(livraisonToUpdateStatus.id, selectedStatusForUpdate);
      fetchLivraisons();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour du statut");
    } finally {
      setIsUpdateStatusDialogOpen(false);
      setLivraisonToUpdateStatus(null);
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (
    status: StatutLivraison | undefined
  ): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
    switch (status) {
      case StatutLivraison.LIVREE:
        return "success";
      case StatutLivraison.EN_COURS:
        return "info";
      case StatutLivraison.EN_ATTENTE:
        return "warning";
      case StatutLivraison.RETARDEE:
        return "warning";
      case StatutLivraison.ANNULEE:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filteredLivraisons = useMemo(() => {
    if (!searchTerm) return livraisons;
    return livraisons.filter(liv => {
      const searchTermLower = searchTerm.toLowerCase();
      const commandeId = liv.commande?.id?.toString() || '';
      const transporteurNom = liv.transporteur?.nom?.toLowerCase() || '';
      const statut = liv.statut?.toLowerCase() || '';
      const dateLivraison = liv.dateLivraison ? format(new Date(liv.dateLivraison), 'dd/MM/yyyy', { locale: fr }) : '';

      return (
        liv.id.toString().includes(searchTermLower) ||
        commandeId.includes(searchTermLower) ||
        transporteurNom.includes(searchTermLower) ||
        statut.includes(searchTermLower) ||
        dateLivraison.includes(searchTermLower)
      );
    });
  }, [livraisons, searchTerm]);

  if (loading && livraisons.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Chargement des livraisons...</p>
      </div>
    );
  }

  if (error && livraisons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertTriangle className="h-12 w-12 mb-2" />
        <p className="text-xl font-semibold">Erreur de chargement</p>
        <p>{error}</p>
        <Button onClick={fetchLivraisons} className="mt-4">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Truck className="h-6 w-6" /> Livraisons
        </h1>
        <Link href="/livraisons/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Planifier une Livraison
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
          <CardTitle>Liste des Livraisons</CardTitle>
          <CardDescription>
            Suivez et gérez toutes les livraisons planifiées.
          </CardDescription>
          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Rechercher (ID, Commande, Transporteur, Statut, Date)..."
                className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLivraisons.length === 0 && !loading ? (
            <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune livraison trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Essayez de modifier vos termes de recherche." : "Aucune livraison n'a encore été planifiée."}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link href="/livraisons/new">
                    <Button type="button">
                      <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                      Planifier une Livraison
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Livraison</TableHead>
                <TableHead>ID Commande</TableHead>
                <TableHead>Transporteur</TableHead>
                <TableHead>Date Livraison</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLivraisons.map((livraison) => (
                <TableRow key={livraison.id}>
                  <TableCell className="font-medium">
                    <Link href={`/livraisons/${livraison.id}`} className="hover:underline text-blue-600">
                        {`LIV-${String(livraison.id).padStart(4, '0')}`}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {livraison.commande ? (
                        <Link href={`/commandes/${livraison.commande.id}`} className="hover:underline text-blue-600">
                            {`CMD-${String(livraison.commande.id).padStart(4, '0')}`}
                        </Link>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{livraison.transporteur ? livraison.transporteur.nom : 'Non assigné'}</TableCell>
                  <TableCell>{livraison.dateLivraison ? format(new Date(livraison.dateLivraison), 'dd/MM/yyyy HH:mm', { locale: fr }) : 'N/A'}</TableCell>
                  <TableCell className="text-right">{`${typeof livraison.cout === 'number' ? livraison.cout.toFixed(2) : 'N/A'} €`}</TableCell>
                  <TableCell>
                    {livraison.statut ? (
                      <Badge variant={getStatusBadgeVariant(livraison.statut)}>
                        {livraison.statut.replace(/_/g, ' ')}
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
                        <Link href={`/livraisons/${livraison.id}`}>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <FileText className="h-4 w-4"/> Voir Détails
                          </DropdownMenuItem>
                        </Link>
                        {livraison.statut !== StatutLivraison.LIVREE && livraison.statut !== StatutLivraison.ANNULEE && (
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => openUpdateStatusDialog(livraison)}
                          >
                            <Edit className="h-4 w-4"/> Modifier Statut
                          </DropdownMenuItem>
                        )}
                        {livraison.statut !== StatutLivraison.LIVREE && livraison.statut !== StatutLivraison.ANNULEE && (
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-orange-600 hover:!text-orange-700 cursor-pointer"
                                onClick={() => openCancelDialog(livraison)}
                            >
                                <XCircle className="h-4 w-4"/> Annuler Livraison
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600 hover:!text-red-700 cursor-pointer"
                          onClick={() => openDeleteDialog(livraison.id)}
                        >
                          <Trash2 className="h-4 w-4"/> Supprimer Livraison
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
            Affichage de <strong>{filteredLivraisons.length}</strong> sur <strong>{livraisons.length}</strong> livraisons
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette livraison ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement la livraison.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLivraisonToDeleteId(null)}>Retour</AlertDialogCancel>
            <AlertDialogAction onClick={executeDeleteLivraison} className="bg-red-600 hover:bg-red-700">
              Confirmer la Suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir annuler cette livraison ?</AlertDialogTitle>
            <AlertDialogDescription>
              La livraison {livraisonToCancel ? `LIV-${String(livraisonToCancel.id).padStart(4, '0')}` : ''} sera marquée comme annulée. Cette action peut être modifiée ultérieurement si nécessaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLivraisonToCancel(null)}>Retour</AlertDialogCancel>
            <AlertDialogAction onClick={executeCancelLivraison} className="bg-orange-500 hover:bg-orange-600">
              {loading && livraisonToCancel ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirmer l'Annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={(open) => {
          if (!open) {
              setLivraisonToUpdateStatus(null);
              setSelectedStatusForUpdate(undefined);
          }
          setIsUpdateStatusDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le statut de la livraison</DialogTitle>
            {livraisonToUpdateStatus && (
              <DialogDescription>
                Livraison: {`LIV-${String(livraisonToUpdateStatus.id).padStart(4, '0')}`}
                <br />
                Statut actuel: <Badge variant={getStatusBadgeVariant(livraisonToUpdateStatus.statut)}>{livraisonToUpdateStatus.statut?.replace(/_/g, ' ') || 'N/A'}</Badge>
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select
              value={selectedStatusForUpdate}
              onValueChange={(value) => setSelectedStatusForUpdate(value as StatutLivraison)}
              disabled={!livraisonToUpdateStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un nouveau statut" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(StatutLivraison)
                  .filter(status => 
                    status !== StatutLivraison.ANNULEE && 
                    status !== livraisonToUpdateStatus?.statut
                  ) 
                  .map(status => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/_/g, ' ')}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              onClick={executeUpdateStatus} 
              disabled={!selectedStatusForUpdate || selectedStatusForUpdate === livraisonToUpdateStatus?.statut || loading}
            >
              {loading && livraisonToUpdateStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
