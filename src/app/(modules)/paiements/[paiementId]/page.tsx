"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, Info, Edit } from 'lucide-react';

import * as paiementService from '@/services/paiementService';
import { type Paiement, StatutPaiement, ModePaiement } from '@/types/paiement';
import { Badge } from '@/components/ui/badge';

const StatutPaiementDisplay: Record<StatutPaiement, string> = {
  [StatutPaiement.EN_ATTENTE]: 'En attente',
  [StatutPaiement.EFFECTUE]: 'Effectué',
  [StatutPaiement.ECHEC]: 'Échec',
  [StatutPaiement.REMBOURSE]: 'Remboursé',
};

const getStatutBadgeVariant = (statut: StatutPaiement): "default" | "secondary" | "destructive" | "outline" => {
    switch (statut) {
        case StatutPaiement.EFFECTUE:
            return "default";
        case StatutPaiement.EN_ATTENTE:
            return "secondary";
        case StatutPaiement.ECHEC:
            return "destructive";
        case StatutPaiement.REMBOURSE:
            return "outline";
        default:
            return "secondary";
    }
};

const ModePaiementDisplay: Record<ModePaiement, string> = {
  [ModePaiement.CARTE_CREDIT]: 'Carte de crédit',
  [ModePaiement.VIREMENT]: 'Virement bancaire',
  [ModePaiement.PAYPAL]: 'PayPal',
  [ModePaiement.ESPECES]: 'Espèces',
  [ModePaiement.CHEQUE]: 'Chèque',
};

export default function PaiementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const paiementIdStr = params.paiementId as string;

  const [paiement, setPaiement] = useState<Paiement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paiementIdStr) {
      const paiementIdNum = parseInt(paiementIdStr, 10);
      if (isNaN(paiementIdNum)){
        setError("ID de paiement invalide.");
        toast.error("ID de paiement invalide.");
        setIsLoading(false);
        return;
      }
      const fetchPaiement = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await paiementService.getPaiementById(paiementIdNum);
          setPaiement(data);
        } catch (err: any) {
          console.error("Failed to fetch paiement details:", err);
          const errorMessage = err.response?.data?.message || err.message || "Impossible de charger les détails du paiement.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
        setIsLoading(false);
      };
      fetchPaiement();
    }
  }, [paiementIdStr]);

  const handleRetry = () => {
    if (paiementIdStr) {
      const paiementIdNum = parseInt(paiementIdStr, 10);
       if (isNaN(paiementIdNum)){
        setError("ID de paiement invalide.");
        toast.error("ID de paiement invalide.");
        return;
      }
      setIsLoading(true);
      setError(null);
      paiementService.getPaiementById(paiementIdNum)
        .then(setPaiement)
        .catch((err: any) => {
          console.error("Failed to fetch paiement details:", err);
          const errorMessage = err.response?.data?.message || err.message || "Impossible de charger les détails du paiement.";
          setError(errorMessage);
          toast.error(errorMessage);
        })
        .finally(() => setIsLoading(false));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <p className="text-lg text-muted-foreground">Chargement des détails du paiement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {error} <Button variant="link" onClick={handleRetry} className="p-0 h-auto underline">Réessayer</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!paiement) {
    return (
      <div className="container mx-auto p-4">
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Aucun détail de paiement trouvé pour l'ID #{paiementIdStr}. Il se peut qu'il n'existe pas ou qu'il ait été supprimé.
            <Button variant="link" asChild className="p-0 h-auto ml-1 underline">
                <Link href="/paiements">Retour à la liste</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/paiements')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/paiements/edit/${paiement.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold">
            Détails du Paiement #{paiement.id}
          </CardTitle>
          <CardDescription>
            Informations complètes concernant le paiement sélectionné.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-primary">Informations Générales</h4>
              <div className="space-y-1.5">
                <p><strong>ID Paiement:</strong> {paiement.id}</p>
                <p><strong>Date:</strong> {format(new Date(paiement.date), 'dd/MM/yyyy HH:mm:ss')}</p>
                <p><strong>Montant Payé:</strong> <span className="font-semibold text-lg">{paiement.montantPaye?.toFixed(2) ?? 'N/A'} €</span></p>
                <p><strong>Statut:</strong> <Badge variant={getStatutBadgeVariant(paiement.statut)}>{StatutPaiementDisplay[paiement.statut]}</Badge></p>
                <p><strong>Mode de Paiement:</strong> {ModePaiementDisplay[paiement.mode]}</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2 text-primary">Informations sur la Commande</h4>
              {paiement.commande ? (
                <div className="space-y-1.5">
                  <p><strong>ID Commande:</strong> <Link href={`/commandes/${paiement.commande.id}`} className="text-blue-600 hover:underline">#{paiement.commande.id}</Link></p>
                  <p><strong>Montant Total Commande:</strong> {paiement.commande.montantTotal?.toFixed(2) ?? 'N/A'} €</p>
                  {paiement.commande.client && (
                    <div className="mt-3 pt-3 border-t">
                      <h5 className="font-medium mb-1">Client Associé</h5>
                      <p><strong>ID Client:</strong> <Link href={`/clients/${paiement.commande.client.id}`} className="text-blue-600 hover:underline">#{paiement.commande.client.id}</Link></p>
                      <p><strong>Nom Client:</strong> {paiement.commande.client.nom}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune information de commande disponible.</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-6">
            {/* Actions like Process Payment or Update Status could be added here if applicable directly on detail page */}
        </CardFooter>
      </Card>
    </div>
  );
}
