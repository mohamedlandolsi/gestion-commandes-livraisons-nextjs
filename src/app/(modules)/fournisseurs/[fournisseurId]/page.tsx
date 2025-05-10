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
import { ArrowLeft, Save, Building } from "lucide-react";
import { getFournisseurById, updateFournisseur } from "@/services/fournisseurService";
import { Fournisseur, UpdateFournisseurData, NewFournisseur } from "@/types/fournisseur";

export default function FournisseurEditPage() {
  const router = useRouter();
  const params = useParams();
  const fournisseurId = Number(params.fournisseurId);

  const [formData, setFormData] = useState<UpdateFournisseurData>({});
  const [originalFournisseur, setOriginalFournisseur] = useState<Fournisseur | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(fournisseurId)) {
      setError("ID Fournisseur invalide.");
      setIsLoading(false);
      return;
    }
    const fetchFournisseur = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fournisseurData = await getFournisseurById(fournisseurId);
        setOriginalFournisseur(fournisseurData);
        setFormData({
          nom: fournisseurData.nom,
          email: fournisseurData.email,
          telephone: fournisseurData.telephone,
          adresse: fournisseurData.adresse,
          note: fournisseurData.note,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération du fournisseur."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchFournisseur();
  }, [fournisseurId]);

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
    setError(null);

    if (isNaN(fournisseurId)) {
      setError("ID Fournisseur invalide pour la mise à jour.");
      return;
    }

    if (!formData.nom || formData.nom.trim() === "") {
      setError("Le nom du fournisseur est obligatoire.");
      return;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }
    // Validate telephone number
    if (!formData.telephone || !/^[0-9]{10}$/.test(formData.telephone)) {
      setError("Le numéro de téléphone doit contenir 10 chiffres.");
      return;
    }
    if (formData.note !== undefined && (formData.note < 0 || formData.note > 5)) {
      setError("La note doit être un nombre entre 0 et 5.");
      return;
    }

    setIsSaving(true);
    try {
      // Ensure all fields expected by NewFournisseur are present for the update
      const dataToSend: NewFournisseur = {
        nom: formData.nom, // Already validated not null/empty
        email: formData.email, // Already validated not null/empty
        telephone: formData.telephone, // Already validated not null/empty
        adresse: formData.adresse || undefined,
        note: formData.note === undefined ? undefined : Number(formData.note),
      };

      await updateFournisseur(fournisseurId, dataToSend);
      router.push("/fournisseurs");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la mise à jour du fournisseur."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p>Chargement des informations du fournisseur...</p></div>;
  }

  if (error && !originalFournisseur) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <p>Erreur: {error}</p>
        <Link href="/fournisseurs">
          <Button variant="outline" className="mt-4">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/fournisseurs">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" /> 
            Modifier le Fournisseur: {originalFournisseur?.nom || "Chargement..."}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du Fournisseur</CardTitle>
          <CardDescription>ID Fournisseur: {fournisseurId}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm font-medium text-destructive mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom du Fournisseur</Label>
              <Input
                id="nom"
                placeholder="Nom du fournisseur"
                value={formData.nom || ""}
                onChange={handleChange}
                disabled={isSaving}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="contact@fournisseur.com"
                    value={formData.email || ""}
                    onChange={handleChange}
                    disabled={isSaving}
                    required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                    id="telephone"
                    type="tel"
                    placeholder="0123456789"
                    value={formData.telephone || ""}
                    onChange={handleChange}
                    disabled={isSaving}
                    required
                    />
                </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                placeholder="Adresse complète du fournisseur"
                value={formData.adresse || ""}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="note">Note (optionnel, 0-5)</Label>
                <Input
                  id="note"
                  type="number"
                  placeholder="Ex: 4.5"
                  value={formData.note === undefined || formData.note === null ? '' : formData.note}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  disabled={isSaving}
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Link href="/fournisseurs">
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
