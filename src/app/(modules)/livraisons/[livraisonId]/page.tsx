"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, CalendarDays, Package, User, MapPin, Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DeliveryDetailPageProps {
  params: { livraisonId: string };
}

export default function LivraisonDetailPage({ params }: DeliveryDetailPageProps) {
  // Mock data for a single delivery
  const delivery = {
    id: params.livraisonId,
    commandeId: "CMD001",
    transporteurId: "TRN001",
    dateExpedition: "2024-07-25",
    dateLivraisonPrevue: "2024-07-28",
    dateLivraisonReelle: "2024-07-27",
    statut: "Livrée",
    adresseLivraison: {
      rue: "123 Rue de la Livraison",
      ville: "VilleExemple",
      codePostal: "75000",
      pays: "France",
    },
    notes: "Colis remis en main propre.",
    transporteur: {
      nom: "Transporteur Express",
      contact: "contact@transporteur.com",
      telephone: "0123456789"
    },
    commande: {
      client: {
        nom: "Client Test",
        email: "client@example.com"
      },
      produits: [
        { id: "PROD001", nom: "Produit Alpha", quantite: 2, prixUnitaire: 50 },
        { id: "PROD002", nom: "Produit Beta", quantite: 1, prixUnitaire: 120 },
      ]
    }
  };

  const getStatusBadgeVariant = (status: string): "secondary" | "default" | "outline" | "destructive" => {
    if (status === "En préparation") return "secondary";
    if (status === "Expédiée") return "default";
    if (status === "En transit") return "outline";
    if (status === "Livrée") return "default"; // Changed from "success"
    if (status === "Annulée") return "destructive";
    return "secondary";
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center">
                <Truck className="mr-2 h-6 w-6" /> Détails de la Livraison #{delivery.id}
              </CardTitle>
              <CardDescription>
                Informations détaillées de la livraison.
              </CardDescription>
            </div>
            <Link href="/livraisons">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Package className="mr-2 h-5 w-5" /> Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>ID Commande:</strong> <Link href={`/commandes/${delivery.commandeId}`} className="text-blue-600 hover:underline">{delivery.commandeId}</Link></p>
                <p><strong>ID Transporteur:</strong> <Link href={`/transporteurs/${delivery.transporteurId}`} className="text-blue-600 hover:underline">{delivery.transporteurId}</Link></p>
                <p className="flex items-center"><strong>Statut:</strong> <Badge variant={getStatusBadgeVariant(delivery.statut)} className="ml-2">{delivery.statut}</Badge></p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><CalendarDays className="mr-2 h-5 w-5" /> Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Date d'expédition:</strong> {new Date(delivery.dateExpedition).toLocaleDateString()}</p>
                <p><strong>Date de livraison prévue:</strong> {new Date(delivery.dateLivraisonPrevue).toLocaleDateString()}</p>
                {delivery.dateLivraisonReelle && (
                  <p><strong>Date de livraison réelle:</strong> {new Date(delivery.dateLivraisonReelle).toLocaleDateString()}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><MapPin className="mr-2 h-5 w-5" /> Adresse de Livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{delivery.adresseLivraison.rue}</p>
              <p>{delivery.adresseLivraison.codePostal} {delivery.adresseLivraison.ville}</p>
              <p>{delivery.adresseLivraison.pays}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><Truck className="mr-2 h-5 w-5" /> Transporteur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Nom:</strong> {delivery.transporteur.nom}</p>
              <p><strong>Contact:</strong> {delivery.transporteur.contact}</p>
              <p><strong>Téléphone:</strong> {delivery.transporteur.telephone}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><User className="mr-2 h-5 w-5" /> Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Nom:</strong> {delivery.commande.client.nom}</p>
              <p><strong>Email:</strong> {delivery.commande.client.email}</p>
            </CardContent>
          </Card>

          {delivery.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{delivery.notes}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
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
