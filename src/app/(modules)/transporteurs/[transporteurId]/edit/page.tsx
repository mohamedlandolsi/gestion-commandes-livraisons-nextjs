"use client";

import Link from "next/link";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTransporteurById, updateTransporteur } from '@/services/transporteurService';
import { Transporteur, UpdateTransporteurData } from '@/types/transporteur';
import { toast } from 'sonner';

export default function EditTransporteurPage() {
  const router = useRouter();
  const params = useParams();
  const transporteurId = params.transporteurId as string;

  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [note, setNote] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transporteurId) {
      const fetchTransporteur = async () => {
        setIsFetching(true);
        setError(null);
        try {
          const numericId = parseInt(transporteurId, 10);
          if (isNaN(numericId)) {
            throw new Error("ID du transporteur invalide.");
          }
          const data = await getTransporteurById(numericId);
          setNom(data.nom);
          setTelephone(data.telephone || '');
          setNote(data.note === null ? undefined : data.note);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération du transporteur.";
          setError(errorMessage);
          toast.error(errorMessage);
          // Optionally redirect if transporteur not found or ID is invalid
          // router.push('/transporteurs'); 
        } finally {
          setIsFetching(false);
        }
      };
      fetchTransporteur();
    }
  }, [transporteurId, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const numericId = parseInt(transporteurId, 10);
    if (isNaN(numericId)) {
      toast.error("ID du transporteur invalide pour la mise à jour.");
      setIsLoading(false);
      return;
    }

    const transporteurData: UpdateTransporteurData = {
      nom,
      telephone: telephone || null,
      note: note === undefined ? null : note,
    };

    try {
      await updateTransporteur(numericId, transporteurData);
      toast.success("Transporteur mis à jour avec succès!");
      router.push('/transporteurs');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la mise à jour du transporteur.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-1 justify-center items-center p-4 md:p-8">
        <p>Chargement des détails du transporteur...</p>
      </div>
    );
  }

  if (error && !isFetching) { // Show error only if not fetching anymore
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/transporteurs">
          <Button variant="outline">Retour à la liste</Button>
        </Link>
      </div>
    );
  }
  
  // If ID was invalid and fetch failed, nom might be empty.
  // Or if transporteurId is not available yet (though useEffect depends on it)
  if (!transporteurId && !isFetching) {
     router.push('/transporteurs'); // Or show a specific message
     return <p>ID du transporteur non trouvé, redirection...</p>;
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
          Modifier le Transporteur
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Détails du Transporteur</CardTitle>
          <CardDescription>
            Modifiez les informations ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="nom">Nom du Transporteur</Label>
              <Input
                id="nom"
                type="text"
                className="w-full"
                placeholder="Ex: SpeedyTrans"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                className="w-full"
                placeholder="Ex: 0123456789"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="note">Note (Optionnel)</Label>
              <Input
                id="note"
                type="number"
                className="w-full"
                placeholder="Ex: 4.5"
                value={note === undefined ? '' : note}
                onChange={(e) => setNote(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                step="0.1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Link href="/transporteurs">
                <Button type="button" variant="outline" disabled={isLoading}>Annuler</Button>
              </Link>
              <Button type="submit" disabled={isLoading || isFetching}>
                {isLoading ? 'Sauvegarde...' : <><Save className="mr-2 h-4 w-4" /> Sauvegarder les Modifications</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
