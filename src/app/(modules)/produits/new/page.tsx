// app/(modules)/produits/new/page.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Package } from "lucide-react";

export default function NewProduitPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href="/produits">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" /> Ajouter un Nouveau Produit
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Détails du Produit</CardTitle>
          <CardDescription>
            Remplissez le formulaire pour ajouter un nouveau produit au catalogue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom du Produit</Label>
              <Input id="nom" placeholder="Ex: T-shirt en coton" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Description détaillée du produit" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prix">Prix</Label>
                <Input id="prix" type="number" placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Quantité en Stock</Label>
                <Input id="stock" type="number" placeholder="0" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categorie">Catégorie</Label>
              <Input id="categorie" placeholder="Ex: Vêtements, Électronique" />
            </div>
            {/* Add more fields like SKU, fournisseur, images, etc. */}
            <div className="flex justify-end gap-2">
              <Link href="/produits">
                <Button variant="outline">Annuler</Button>
              </Link>
              <Button type="submit">Enregistrer Produit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
