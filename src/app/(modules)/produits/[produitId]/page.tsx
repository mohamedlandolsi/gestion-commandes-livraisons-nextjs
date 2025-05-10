"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
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
import { ArrowLeft, Save } from "lucide-react";
import { getProduitById, updateProduit } from "@/services/produitService";
import { Produit, UpdateProduitData, NewProduit } from "@/types/produit";

export default function ProduitEditPage() {
  const router = useRouter();
  const params = useParams();
  const produitId = Number(params.produitId);

  const [formData, setFormData] = useState<UpdateProduitData>({});
  const [originalProduit, setOriginalProduit] = useState<Produit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(produitId)) {
      setError("ID Produit invalide.");
      setIsLoading(false);
      return;
    }
    const fetchProduit = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const produitData = await getProduitById(produitId);
        setOriginalProduit(produitData);
        setFormData({
          nom: produitData.nom,
          description: produitData.description,
          prix: produitData.prix,
          stock: produitData.stock,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération du produit."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduit();
  }, [produitId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "prix" || id === "stock" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (isNaN(produitId)) {
      setError("ID Produit invalide pour la mise à jour.");
      return;
    }

    if (!formData.nom || formData.nom.trim() === "") {
      setError("Le nom du produit est obligatoire et ne peut pas être vide.");
      return;
    }
    if (formData.prix === undefined || formData.prix === null || isNaN(Number(formData.prix)) || Number(formData.prix) <= 0) {
      setError("Le prix est obligatoire et doit être un nombre strictement positif.");
      return;
    }
    if (formData.stock === undefined || formData.stock === null || isNaN(Number(formData.stock)) || Number(formData.stock) <= 0) {
      setError("Le stock est obligatoire et doit être un nombre strictement positif.");
      return;
    }

    setIsSaving(true);
    try {
      const dataToSend: NewProduit = {
        nom: formData.nom,
        description: formData.description || "",
        prix: Number(formData.prix),
        stock: Number(formData.stock),
      };

      await updateProduit(produitId, dataToSend);
      router.push("/produits");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la mise à jour du produit."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p>Chargement des informations du produit...</p></div>;
  }

  if (error && !originalProduit) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <p>Erreur: {error}</p>
        <Link href="/produits">
          <Button variant="outline" className="mt-4">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/produits">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">
            Modifier le Produit: {originalProduit?.nom || "Chargement..."}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du Produit</CardTitle>
          <CardDescription>ID Produit: {produitId}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm font-medium text-destructive mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom du Produit</Label>
              <Input
                id="nom"
                placeholder="Nom du produit"
                value={formData.nom || ""}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description détaillée du produit"
                value={formData.description || ""}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prix">Prix (€)</Label>
                <Input
                  id="prix"
                  type="number"
                  placeholder="Prix"
                  value={formData.prix === undefined || formData.prix === null ? "" : formData.prix}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  disabled={isSaving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Quantité en Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Stock"
                  value={formData.stock === undefined || formData.stock === null ? "" : formData.stock}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Link href="/produits">
                <Button variant="outline" type="button" disabled={isSaving || isLoading}>
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving || isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
