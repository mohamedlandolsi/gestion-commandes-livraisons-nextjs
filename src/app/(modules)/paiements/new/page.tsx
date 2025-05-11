"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import * as paiementService from '@/services/paiementService';
import * as commandeService from '@/services/commandeService';
import type { Commande } from '@/types/commande';
import { ModePaiement, modePaiementOptions, PaiementCreatePayload } from '@/types/paiement';

export default function NewPaiementPage() {
  const router = useRouter();
  const [commandeId, setCommandeId] = useState<string>('');
  const [modePaiement, setModePaiement] = useState<ModePaiement | ''>('');
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [isLoadingCommandes, setIsLoadingCommandes] = useState<boolean>(true);
  const [errorCommandes, setErrorCommandes] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchCommandes = async () => {
      setIsLoadingCommandes(true);
      setErrorCommandes(null);
      try {
        // TODO: Ideally, fetch only commandes that are eligible for paiement.
        // For now, fetching all and user needs to select appropriately.
        const fetchedCommandes = await commandeService.getAllCommandes();
        setCommandes(fetchedCommandes);
      } catch (error) {
        console.error("Failed to fetch commandes:", error);
        setErrorCommandes("Impossible de charger les commandes. Veuillez réessayer.");
        toast.error("Impossible de charger les commandes.");
      } finally {
        setIsLoadingCommandes(false);
      }
    };
    fetchCommandes();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!commandeId || !modePaiement) {
      toast.error('Veuillez sélectionner une commande et un mode de paiement.');
      return;
    }
    setIsSubmitting(true);

    const payload: PaiementCreatePayload = {
      commande: { id: parseInt(commandeId, 10) },
      mode: modePaiement as ModePaiement,
      // statut is defaulted by backend to EN_ATTENTE
    };

    try {
      await paiementService.createPaiement(payload);
      toast.success('Paiement créé avec succès !');
      router.push('/paiements'); 
    } catch (error: any) {
      console.error('Failed to create paiement:', error);
      const errorMessage = error.response?.data?.message || error.message || "Une erreur est survenue lors de la création du paiement.";
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Créer un Nouveau Paiement</CardTitle>
          <CardDescription>
            Sélectionnez une commande et un mode de paiement pour enregistrer un nouveau paiement.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="commandeId">Commande</Label>
              {isLoadingCommandes && <p className="text-sm text-muted-foreground">Chargement des commandes...</p>}
              {errorCommandes && <p className="text-sm text-red-500">{errorCommandes}</p>}
              {!isLoadingCommandes && !errorCommandes && (
                <Select
                  value={commandeId}
                  onValueChange={setCommandeId}
                  disabled={isSubmitting || commandes.length === 0}
                >
                  <SelectTrigger id="commandeId">
                    <SelectValue placeholder={commandes.length > 0 ? "Sélectionner une commande" : "Aucune commande disponible"} />
                  </SelectTrigger>
                  <SelectContent>
                    {commandes.length === 0 && !isLoadingCommandes && (
                       <SelectItem value="no-commande" disabled>Aucune commande à afficher</SelectItem>
                    )}
                    {commandes.map((commande) => (
                      <SelectItem key={commande.id} value={String(commande.id)}>
                        Commande #{commande.id}
                        {commande.client?.nom ? ` - Client: ${commande.client.nom}` : ''}
                        {typeof commande.montantTotal === 'number' ? ` - Total: ${commande.montantTotal.toFixed(2)} €` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
               {commandes.length === 0 && !isLoadingCommandes && !errorCommandes && (
                <p className="text-sm text-muted-foreground">
                  Aucune commande disponible pour la création de paiement. Vous pouvez en <Link href="/commandes/new" className="text-primary hover:underline">créer une nouvelle</Link>.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modePaiement">Mode de Paiement</Label>
              <Select
                value={modePaiement}
                onValueChange={(value) => setModePaiement(value as ModePaiement)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="modePaiement">
                  <SelectValue placeholder="Sélectionner un mode de paiement" />
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
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingCommandes || !commandeId || !modePaiement}>
              {isSubmitting ? 'Création en cours...' : 'Créer le Paiement'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
