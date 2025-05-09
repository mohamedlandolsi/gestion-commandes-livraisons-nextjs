"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, CreditCard, CalendarDays, UserCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data for a single payment - replace with API call
const mockPayment = {
  id: "PAY001",
  commandeId: "CMD001",
  montant: 150.75,
  datePaiement: "2024-07-20",
  methodePaiement: "Carte de Crédit",
  statut: "Complété",
  client: {
    id: "CLI001",
    nom: "Jean Dupont",
  },
  factureId: "FACT2024-001",
};

export default function PaiementDetailPage() {
  const params = useParams();
  const paiementId = params.paiementId as string;

  // In a real app, you would fetch payment details based on paiementId
  const payment = mockPayment; // Using mock data for now

  if (!payment) {
    return <div>Paiement non trouvé</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href="/paiements">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Détails du Paiement: {payment.id}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Paiement {payment.id}</span>
            <Badge variant={payment.statut === "Complété" ? "default" : payment.statut === "En attente" ? "secondary" : "destructive"}>
              {payment.statut}
            </Badge>
          </CardTitle>
          <CardDescription>Référence Commande: {payment.commandeId}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center"><CreditCard className="w-4 h-4 mr-2" />Montant Payé</span>
              <p className="text-lg font-semibold">{payment.montant.toFixed(2)} €</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center"><CalendarDays className="w-4 h-4 mr-2" />Date de Paiement</span>
              <p>{new Date(payment.datePaiement).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center"><UserCircle className="w-4 h-4 mr-2" />Client</span>
              <p>{payment.client.nom} (ID: {payment.client.id})</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Méthode de Paiement</span>
              <p>{payment.methodePaiement}</p>
            </div>
          </div>
           {payment.factureId && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center"><FileText className="w-4 h-4 mr-2" />Facture Associée</span>
              <Link href={`/factures/${payment.factureId}`} className="text-blue-600 hover:underline">
                {payment.factureId}
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
