"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, PlusCircle } from "lucide-react";
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
import { createTransporteur } from '@/services/transporteurService';
import { NewTransporteur } from '@/types/transporteur';
import { toast } from 'sonner';

export default function NewTransporteurPage() {
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [note, setNote] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const transporteurData: NewTransporteur = {
      nom,
      telephone: telephone || null,
      note: note === undefined ? null : note,
    };

    try {
      await createTransporteur(transporteurData);
      toast.success("Transporteur créé avec succès!");
      router.push('/transporteurs');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la création du transporteur.";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

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
          Nouveau Transporteur
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Détails du Transporteur</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour ajouter un nouveau transporteur.
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : <><PlusCircle className="mr-2 h-4 w-4" /> Enregistrer Transporteur</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
