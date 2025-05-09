// app/(modules)/produits/[produitId]/page.tsx
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
import { ArrowLeft, Edit, Trash2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for a single product
const mockProduit = {
  id: "prod_1",
  nom: "Ordinateur Portable XPS 15",
  description: "Un ordinateur portable puissant avec un écran InfinityEdge de 15.6 pouces, processeur Intel Core i7, 16Go de RAM, et 512Go SSD. Parfait pour les professionnels et les créateurs de contenu.",
  prix: 1500.99,
  stock: 50,
  categorie: "Électronique",
  sku: "DELL-XPS15-I7-16-512",
  fournisseur: "Dell Inc.",
  dateAjout: "2023-10-26",
};

export default function ProduitDetailsPage({ params }: { params: { produitId: string } }) {
  const produit = mockProduit; // Fetch product by params.produitId in real app

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/produits">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" /> {produit.nom}
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
          <CardTitle>Informations Détaillées</CardTitle>
          <CardDescription>SKU: {produit.sku} | Catégorie: <Badge variant="secondary">{produit.categorie}</Badge></CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Prix</p>
              <p className="text-2xl font-semibold">{`$${produit.prix.toFixed(2)}`}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Stock</p>
              <p className="text-2xl font-semibold">{produit.stock} unités</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fournisseur</p>
              <p className="text-lg font-medium">{produit.fournisseur}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-base">{produit.description}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date d'ajout</p>
            <p className="text-base">{produit.dateAjout}</p>
          </div>
        </CardContent>
      </Card>

      {/* Potential further sections */}
      {/* <Card>
        <CardHeader><CardTitle>Historique des Prix</CardTitle></CardHeader>
        <CardContent><p>(Graphique ou liste)</p></CardContent>
      </Card> */}
      {/* <Card>
        <CardHeader><CardTitle>Commandes Associées</CardTitle></CardHeader>
        <CardContent><p>(Liste des commandes contenant ce produit)</p></CardContent>
      </Card> */}
    </div>
  );
}
