// app/(modules)/produits/new/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
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
import { ArrowLeft } from "lucide-react";
import { createProduit } from "@/services/produitService";
import { NewProduit } from "@/types/produit";

export default function NewProduitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<NewProduit>({
    nom: "",
    description: "",
    prix: 0,
    stock: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "prix" || id === "stock" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.prix <= 0) {
      setError("Le prix doit être un nombre positif.");
      setIsLoading(false);
      return;
    }
    if (formData.stock < 0) {
      setError("Le stock ne peut pas être négatif.");
      setIsLoading(false);
      return;
    }

    try {
      const produitToCreate: NewProduit = {
        nom: formData.nom,
        description: formData.description,
        prix: formData.prix,
        stock: formData.stock,
      };
      await createProduit(produitToCreate);
      router.push("/produits");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création du produit."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/produits">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Ajouter un Nouveau Produit</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations du Produit</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour ajouter un nouveau produit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom du Produit</Label>
              <Input
                id="nom"
                placeholder="Ex: T-shirt en coton"
                value={formData.nom}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description détaillée du produit..."
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prix">Prix (€)</Label>
                <Input
                  id="prix"
                  type="number"
                  placeholder="Ex: 19.99"
                  value={formData.prix}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Quantité en Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Ex: 150"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Link href="/produits">
                <Button variant="outline" type="button" disabled={isLoading}>
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer Produit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
