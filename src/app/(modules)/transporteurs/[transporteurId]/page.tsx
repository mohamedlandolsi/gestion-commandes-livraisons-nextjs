"use client";

import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Truck, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for a single transporteur - in a real app, this would be fetched
const transporteurDetails = {
  id: "TRN001",
  nom: "SpeedyTrans",
  contactNom: "Jean Dupont",
  contactEmail: "contact@speedytrans.com",
  telephone: "0123456789",
  adresse: "123 Rue de la Logistique, 75000 Paris, France",
  statut: "Actif",
  notes: "Transporteur fiable pour les livraisons nationales. Service express disponible.",
  dateCreation: "2023-01-15",
};

export default function TransporteurDetailPage({ params }: { params: { transporteurId: string } }) {
  // In a real app, you would fetch transporteurDetails based on params.transporteurId
  // For now, we use the mock data.

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
          Détails du Transporteur: {transporteurDetails.nom}
        </h1>
        <Badge variant={transporteurDetails.statut === "Actif" ? "default" : "outline"} className="ml-auto sm:ml-0">
          {transporteurDetails.statut}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Supprimer
          </Button>
          <Link href={`/transporteurs/${params.transporteurId}/edit`}> {/* Assuming an edit page */}
            <Button size="sm">
              <Edit className="h-3.5 w-3.5 mr-1.5" /> Modifier
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Truck className="h-8 w-8 mr-3 text-primary" />
            <div>
              <CardTitle>{transporteurDetails.nom}</CardTitle>
              <CardDescription>ID: {transporteurDetails.id} | Créé le: {transporteurDetails.dateCreation}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informations de Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <strong>Email:</strong> <span className="ml-1">{transporteurDetails.contactEmail}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <strong>Téléphone:</strong> <span className="ml-1">{transporteurDetails.telephone}</span>
              </div>
              {transporteurDetails.contactNom && (
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-muted-foreground" /> {/* Re-using Truck icon for contact person */}
                  <strong>Personne à contacter:</strong> <span className="ml-1">{transporteurDetails.contactNom}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Adresse</h3>
            <div className="flex items-start text-sm">
              <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <p>{transporteurDetails.adresse}</p>
            </div>
          </div>

          {transporteurDetails.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{transporteurDetails.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 md:hidden">
            <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="w-full">
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Supprimer
                </Button>
                <Link href={`/transporteurs/${params.transporteurId}/edit`} className="w-full">
                    <Button size="sm" className="w-full">
                        <Edit className="h-3.5 w-3.5 mr-1.5" /> Modifier
                    </Button>
                </Link>
            </div>
        </CardFooter>
      </Card>
    </main>
  );
}
