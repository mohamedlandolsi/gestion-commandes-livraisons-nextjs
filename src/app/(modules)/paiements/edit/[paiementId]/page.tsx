"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, Info } from 'lucide-react';

import * as paiementService from '@/services/paiementService';
import type { Paiement, PaiementUpdatePayload, ModePaiement, StatutPaiement } from '@/types/paiement';
import { modePaiementOptions, statutPaiementOptions } from '@/types/paiement';

export default function EditPaiementPage() {
  const router = useRouter();
  const params = useParams();
  const paiementIdStr = params.paiementId as string;

  const [paiement, setPaiement] = useState<Paiement | null>(null);
  const [modePaiement, setModePaiement] = useState<ModePaiement | ''>('');
  const [statutPaiement, setStatutPaiement] = useState<StatutPaiement | ''>('');
  const [montantPaye, setMontantPaye] = useState<string>(''); // Store as string for input field
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paiementIdStr) {
      const paiementIdNum = parseInt(paiementIdStr, 10);
      if (isNaN(paiementIdNum)) {
        setError("ID de paiement invalide.");
        toast.error("ID de paiement invalide.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      paiementService.getPaiementById(paiementIdNum)
        .then(data => {
          setPaiement(data);
          setModePaiement(data.mode);
          setStatutPaiement(data.statut);
          setMontantPaye(data.montantPaye?.toString() ?? '');
          setError(null);
        })
        .catch(err => {
          console.error("Failed to fetch paiement for editing:", err);
          const errorMessage = err.response?.data?.message || err.message || "Impossible de charger le paiement pour modification.";
          setError(errorMessage);
          toast.error(errorMessage);
          setPaiement(null); // Ensure form is not shown if paiement load fails
        })
        .finally(() => setIsLoading(false));
    }
  }, [paiementIdStr]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!paiement || !modePaiement || !statutPaiement) {
      toast.error('Veuillez remplir tous les champs obligatoires (Mode et Statut).');
      return;
    }

    const montantPayeNum = parseFloat(montantPaye);
    if (montantPaye.trim() !== '' && isNaN(montantPayeNum)) {
        toast.error('Le montant payé doit être un nombre valide.');
        return;
    }
    if (montantPaye.trim() !== '' && montantPayeNum < 0) {
        toast.error('Le montant payé ne peut pas être négatif.');
        return;
    }

    setIsSubmitting(true);

    const payload: PaiementUpdatePayload = {
      id: paiement.id,
      mode: modePaiement as ModePaiement,
      statut: statutPaiement as StatutPaiement,
      montantPaye: montantPaye.trim() === '' ? undefined : montantPayeNum, // Send undefined if empty, so backend might ignore or set to null
      // Commande is not typically updated, so we use the existing one from `paiement.commande` if needed by backend
      // For this payload, we only send fields that can be updated.
      // The backend should handle partial updates.
    };

    try {
      await paiementService.updatePaiement(paiement.id, payload);
      toast.success('Paiement mis à jour avec succès !');
      router.push(`/paiements/${paiement.id}`); // Navigate to detail page or list
    } catch (err: any) {
      console.error('Failed to update paiement:', err);
      const errorMessage = err.response?.data?.message || err.message || "Une erreur est survenue lors de la mise à jour du paiement.";
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRetryFetch = () => {
    if (paiementIdStr) {
      const paiementIdNum = parseInt(paiementIdStr, 10);
      if (isNaN(paiementIdNum)) return;
      setIsLoading(true);
      setError(null);
      paiementService.getPaiementById(paiementIdNum)
        .then(data => {
          setPaiement(data);
          setModePaiement(data.mode);
          setStatutPaiement(data.statut);
          setMontantPaye(data.montantPaye?.toString() ?? '');
        })
        .catch(err => {
          console.error("Failed to fetch paiement for editing:", err);
          const errorMessage = err.response?.data?.message || err.message || "Impossible de charger le paiement pour modification.";
          setError(errorMessage);
          toast.error(errorMessage);
          setPaiement(null);
        })
        .finally(() => setIsLoading(false));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <p className="text-lg text-muted-foreground">Chargement du formulaire de modification...</p>
      </div>
    );
  }

  if (error && !paiement) { // Show error primarily if paiement could not be loaded
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            {error} <Button variant="link" onClick={handleRetryFetch} className="p-0 h-auto underline">Réessayer</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!paiement) { // Fallback if not loading and no specific error, but paiement is null
     return (
      <div className="container mx-auto p-4">
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle>Paiement non trouvé</AlertTitle>
          <AlertDescription>
            Le paiement avec l'ID #{paiementIdStr} n'a pas pu être trouvé. 
            <Link href="/paiements" className="underline ml-1">Retour à la liste</Link>.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
           <div className="flex items-center justify-between mb-2">
            <Button variant="outline" size="sm" onClick={() => router.back()} disabled={isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Annuler
            </Button>
          </div>
          <CardTitle>Modifier le Paiement #{paiement.id}</CardTitle>
          <CardDescription>
            Mettez à jour les informations du paiement. La commande associée ne peut pas être modifiée ici.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div>
              <Label className="font-semibold text-gray-700 dark:text-gray-300">Commande Associée (Non modifiable)</Label>
              <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-slate-100">ID Commande:</strong> <Link href={`/commandes/${paiement.commande.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">{paiement.commande.id}</Link></p>
                {paiement.commande.client && <p className="text-sm text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-slate-100">Client:</strong> {paiement.commande.client.nom}</p>}
                <p className="text-sm text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-slate-100">Montant Commande:</strong> {paiement.commande.montantTotal?.toFixed(2) ?? 'N/A'} €</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="montantPaye">Montant Payé (€)</Label>
              <Input 
                id="montantPaye"
                type="number"
                value={montantPaye}
                onChange={(e) => setMontantPaye(e.target.value)}
                placeholder="Ex: 123.45"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modePaiement">Mode de Paiement</Label>
              <Select
                value={modePaiement}
                onValueChange={(value) => setModePaiement(value as ModePaiement)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="modePaiement">
                  <SelectValue placeholder="Sélectionner un mode" />
                </SelectTrigger>
                <SelectContent>
                  {modePaiementOptions.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statutPaiement">Statut du Paiement</Label>
              <Select
                value={statutPaiement}
                onValueChange={(value) => setStatutPaiement(value as StatutPaiement)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="statutPaiement">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statutPaiementOptions.map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {statut.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push(`/paiements/${paiement.id}`)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading || !modePaiement || !statutPaiement}>
              {isSubmitting ? 'Mise à jour en cours...' : 'Enregistrer les Modifications'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
