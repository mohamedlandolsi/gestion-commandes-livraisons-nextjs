// app/(modules)/commandes/[commandeId]/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Edit, Printer, FileText, Package, User, CalendarDays, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for a single commande
const mockCommande = {
  id: "cmd_12345",
  client: {
    id: "client_1",
    nom: "Jean Dupont",
    email: "jean.dupont@example.com",
    adresse: "1 Rue de la Paix, 75001 Paris"
  },
  dateCommande: "2024-05-09",
  dateLivraisonEstimee: "2024-05-15",
  statut: "En traitement",
  lignesCommande: [
    { produitId: "prod_1", nom: "Ordinateur Portable XPS 15", quantite: 1, prixUnitaire: 1500.99, total: 1500.99 },
    { produitId: "prod_3", nom: "Clavier Mécanique RGB", quantite: 2, prixUnitaire: 120.00, total: 240.00 },
  ],
  sousTotal: 1740.99,
  tva: 348.20, // Example TVA 20%
  totalCommande: 2089.19,
  adresseLivraison: "1 Rue de la Paix, 75001 Paris",
  adresseFacturation: "1 Rue de la Paix, 75001 Paris",
  notes: "Laisser le colis chez le gardien si absent."
};

export default function CommandeDetailsPage({ params }: { params: { commandeId: string } }) {
  const commande = mockCommande; // Fetch by params.commandeId in real app

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "livrée": return "success";
      case "en attente": return "warning";
      case "annulée": return "destructive";
      case "en traitement": return "info";
      default: return "default";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/commandes">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" /> Commande #{commande.id}
            </h1>
            <p className="text-sm text-muted-foreground">
                Passée le {new Date(commande.dateCommande).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" /> Imprimer
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" /> Modifier Statut
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Produits Commandés</span>
                        <Badge variant={getStatusVariant(commande.statut) as any}>{commande.statut}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead className="text-center">Qté</TableHead>
                        <TableHead className="text-right">Prix Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {commande.lignesCommande.map((ligne) => (
                        <TableRow key={ligne.produitId}>
                        <TableCell>
                            <div className="font-medium">{ligne.nom}</div>
                            <div className="text-xs text-muted-foreground">ID: {ligne.produitId}</div>
                        </TableCell>
                        <TableCell className="text-center">{ligne.quantite}</TableCell>
                        <TableCell className="text-right">{`$${ligne.prixUnitaire.toFixed(2)}`}</TableCell>
                        <TableCell className="text-right">{`$${ligne.total.toFixed(2)}`}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
                <CardFooter className="flex flex-col items-end space-y-1 pt-4 border-t">
                    <div className="flex justify-between w-full max-w-xs text-sm">
                        <span>Sous-total:</span>
                        <span>{`$${commande.sousTotal.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between w-full max-w-xs text-sm">
                        <span>TVA (20%):</span>
                        <span>{`$${commande.tva.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between w-full max-w-xs text-lg font-semibold">
                        <span>Total Commande:</span>
                        <span>{`$${commande.totalCommande.toFixed(2)}`}</span>
                    </div>
                </CardFooter>
            </Card>
            {commande.notes && (
                <Card>
                    <CardHeader><CardTitle>Notes de Commande</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">{commande.notes}</p></CardContent>
                </Card>
            )}
        </div>

        <div className="md:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="h-5 w-5"/> Informations Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <p className="font-medium">{commande.client.nom}</p>
                    <p className="text-muted-foreground">{commande.client.email}</p>
                    <p className="text-muted-foreground">ID: {commande.client.id}</p>
                    <Link href={`/clients/${commande.client.id}`} className="text-primary hover:underline text-xs">Voir profil client</Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5"/> Dates Clés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div>
                        <p className="font-medium">Date de Commande</p>
                        <p className="text-muted-foreground">{new Date(commande.dateCommande).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                        <p className="font-medium">Livraison Estimée</p>
                        <p className="text-muted-foreground">{new Date(commande.dateLivraisonEstimee).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Adresses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <p className="font-medium">Adresse de Livraison</p>
                        <p className="text-muted-foreground whitespace-pre-line">{commande.adresseLivraison}</p>
                    </div>
                    <div>
                        <p className="font-medium">Adresse de Facturation</p>
                        <p className="text-muted-foreground whitespace-pre-line">{commande.adresseFacturation}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
