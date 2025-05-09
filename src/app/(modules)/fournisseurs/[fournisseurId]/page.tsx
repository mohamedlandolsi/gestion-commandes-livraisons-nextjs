// app/(modules)/fournisseurs/[fournisseurId]/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Building, Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for a single fournisseur
const mockFournisseur = {
  id: "four_1",
  nom: "TechDistri",
  contactNom: "Alice Wonderland",
  contactPrenom: "",
  email: "contact@techdistri.com",
  telephone: "0123456700",
  adresse: "100 Tech Avenue, Silicon Valley, CA 94000, USA",
  siteWeb: "www.techdistri.com",
  statut: "Actif",
  dateAjout: "2022-08-15",
  notes: "Fournisseur principal pour les composants électroniques."
};

export default function FournisseurDetailsPage({ params }: { params: { fournisseurId: string } }) {
  const fournisseur = mockFournisseur; // Fetch by params.fournisseurId in real app

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/fournisseurs">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" /> {fournisseur.nom}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Informations du Fournisseur</CardTitle>
              <CardDescription>ID: {fournisseur.id} | Statut: <Badge variant={fournisseur.statut === "Actif" ? "default" : "outline"}>{fournisseur.statut}</Badge></CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">Ajouté le: {fournisseur.dateAjout}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Contact Principal</h3>
              <p className="text-sm">{fournisseur.contactNom} {fournisseur.contactPrenom}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{fournisseur.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{fournisseur.telephone}</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Adresse</h3>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>{fournisseur.adresse}</span>
              </div>
              {fournisseur.siteWeb && (
                <p className="text-sm mt-2">
                  <strong>Site Web:</strong> <a href={`http://${fournisseur.siteWeb}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{fournisseur.siteWeb}</a>
                </p>
              )}
            </div>
          </div>
          {fournisseur.notes && (
             <div>
                <h3 className="text-lg font-medium mb-1">Notes</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{fournisseur.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Produits Fournis</CardTitle></CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">(Liste des produits associés à ce fournisseur à venir)</p>
        </CardContent>
      </Card>
    </div>
  );
}
