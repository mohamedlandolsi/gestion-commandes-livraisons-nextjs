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
import { ArrowLeft, Building } from "lucide-react";
import { createFournisseur } from "@/services/fournisseurService";
import { NewFournisseur } from "@/types/fournisseur";

export default function NewFournisseurPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<NewFournisseur>({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    note: undefined, // Initialize as undefined for optional field
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "note" ? (value === '' ? undefined : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.note !== undefined && (formData.note < 0 || formData.note > 5)) {
      setError("La note doit être un nombre entre 0 et 5.");
      setIsLoading(false);
      return;
    }
    
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide.");
      setIsLoading(false);
      return;
    }

    // Validate telephone number
    if (!/^[0-9]{10}$/.test(formData.telephone)) {
      setError("Le numéro de téléphone doit contenir 10 chiffres.");
      setIsLoading(false);
      return;
    }

    try {
      const fournisseurToCreate: NewFournisseur = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse || undefined, // Ensure empty string becomes undefined if desired by backend
        note: formData.note,
      };
      await createFournisseur(fournisseurToCreate);
      router.push("/fournisseurs");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création du fournisseur."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/fournisseurs">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" /> Ajouter un Nouveau Fournisseur
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations du Fournisseur</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour ajouter un nouveau fournisseur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom du Fournisseur</Label>
              <Input
                id="nom"
                placeholder="Ex: Fournisseur XYZ"
                value={formData.nom}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: contact@fournisseur.xyz"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="Ex: 0123456789"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                placeholder="Adresse complète du fournisseur..."
                value={formData.adresse}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="note">Note (optionnel, 0-5)</Label>
              <Input
                id="note"
                type="number"
                placeholder="Ex: 4.5"
                value={formData.note === undefined ? '' : formData.note}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Link href="/fournisseurs">
                <Button variant="outline" type="button" disabled={isLoading}>
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer Fournisseur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
