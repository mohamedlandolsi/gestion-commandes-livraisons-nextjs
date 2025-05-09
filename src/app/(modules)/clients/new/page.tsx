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
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/services/clientService";
import { NewClient } from "@/types/client";

export default function NewClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<NewClient>({
    nom: "",
    email: "",
    adresse: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Ensure formData matches NewClient (which doesn't have prenom)
      const clientToCreate: NewClient = {
        nom: formData.nom,
        email: formData.email,
        adresse: formData.adresse,
      };
      await createClient(clientToCreate);
      // TODO: Add success toast/notification
      router.push("/clients");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création du client."
      );
      // TODO: Add error toast/notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Ajouter un Nouveau Client</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations du Client</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour ajouter un nouveau client.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                placeholder="Nom de famille"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
            {/* Prénom field removed as it's not in NewClient type */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                placeholder="1 Rue de la Paix, Ville, Code Postal"
                value={formData.adresse}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <div className="flex justify-end gap-2">
              <Link href="/clients">
                <Button variant="outline" type="button" disabled={isLoading}>
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer Client"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
