"use client";

import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Edit, Trash2, Truck, Phone, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTransporteurById, deleteTransporteur } from '@/services/transporteurService';
import { Transporteur } from '@/types/transporteur';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TransporteurDetailPage() { 
  const router = useRouter();
  const params = useParams();
  const transporteurId = params.transporteurId as string;

  const [transporteur, setTransporteur] = useState<Transporteur | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transporteurId) {
      const fetchTransporteurDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const numericId = parseInt(transporteurId, 10);
          if (isNaN(numericId)) {
            throw new Error("ID du transporteur invalide.");
          }
          const data = await getTransporteurById(numericId);
          setTransporteur(data);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des détails du transporteur.";
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTransporteurDetails();
    } else {
      setError("ID du transporteur non fourni.");
      setIsLoading(false);
    }
  }, [transporteurId]);

  const handleDelete = async () => {
    if (!transporteur || transporteur.id === undefined) {
      toast.error("Impossible de supprimer le transporteur : ID manquant.");
      return;
    }
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce transporteur ?")) {
      setIsDeleting(true);
      try {
        await deleteTransporteur(transporteur.id);
        toast.success("Transporteur supprimé avec succès.");
        router.push("/transporteurs");
      } catch (err) {
        const deleteError = err instanceof Error ? err.message : "Erreur lors de la suppression du transporteur.";
        toast.error(deleteError);
        setError(deleteError);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
        <p>Chargement des détails du transporteur...</p>
      </main>
    );
  }

  if (error && !transporteur) { 
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center">
        <Alert variant="destructive" className="w-full max-w-lg">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link href="/transporteurs">
          <Button variant="outline">Retour à la liste des transporteurs</Button>
        </Link>
      </main>
    );
  }
  
  if (!transporteur) { 
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center">
         <Alert className="w-full max-w-lg">
           <AlertTitle>Transporteur non trouvé</AlertTitle>
           <AlertDescription>
             Le transporteur avec l'ID '{transporteurId}' n'a pas pu être trouvé. Il a peut-être été supprimé ou l'ID est incorrect.
           </AlertDescription>
         </Alert>
        <Link href="/transporteurs">
          <Button variant="outline">Retour à la liste des transporteurs</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/transporteurs">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Détails du Transporteur: {transporteur.nom}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Suppression..." : <><Trash2 className="h-3.5 w-3.5 mr-1.5" /> Supprimer</>}
          </Button>
          <Link href={`/transporteurs/${transporteur.id}/edit`}>
            <Button size="sm" disabled={isDeleting}>
              <Edit className="h-3.5 w-3.5 mr-1.5" /> Modifier
            </Button>
          </Link>
        </div>
      </div>
      {error && transporteur && (
         <Alert variant="destructive" className="mb-4">
            <AlertTitle>Une erreur est survenue</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Truck className="h-8 w-8 mr-3 text-primary" />
            <div>
              <CardTitle>{transporteur.nom}</CardTitle>
              <CardDescription>ID: {transporteur.id}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informations du Transporteur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center col-span-full">
                <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                <strong>Nom:</strong> <span className="ml-1">{transporteur.nom}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <strong>Téléphone:</strong> <span className="ml-1">{transporteur.telephone || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                <strong>Note:</strong> <span className="ml-1">{transporteur.note !== null && transporteur.note !== undefined ? transporteur.note : "N/A"}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 md:hidden">
            <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="w-full" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Suppression..." : <><Trash2 className="h-3.5 w-3.5 mr-1.5" /> Supprimer</>}
                </Button>
                <Link href={`/transporteurs/${transporteur.id}/edit`} className="w-full">
                    <Button size="sm" className="w-full" disabled={isDeleting}>
                        <Edit className="h-3.5 w-3.5 mr-1.5" /> Modifier
                    </Button>
                </Link>
            </div>
        </CardFooter>
      </Card>
    </main>
  );
}
