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
import { ArrowLeft, Save } from "lucide-react"; // Changed Edit to Save
import { getClientById, updateClient } from "@/services/clientService";
import { Client, UpdateClientData } from "@/types/client";

export default function ClientEditPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = Number(params.clientId);

  const [formData, setFormData] = useState<UpdateClientData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(clientId)) {
      setError("ID Client invalide.");
      setIsLoading(false);
      return;
    }
    const fetchClient = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const clientData = await getClientById(clientId);
        setFormData({
          nom: clientData.nom,
          email: clientData.email,
          adresse: clientData.adresse,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération du client."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isNaN(clientId)) {
      setError("ID Client invalide pour la mise à jour.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateClient(clientId, formData);
      // TODO: Add success toast/notification
      router.push("/clients"); // Navigate back to the list or show a success message
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la mise à jour du client."
      );
      // TODO: Add error toast/notification
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p>Chargement des informations du client...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">
            Modifier le Client: {formData.nom || "Chargement..."}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du Client</CardTitle>
          <CardDescription>ID Client: {clientId}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm font-medium text-destructive mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                placeholder="Nom de famille"
                value={formData.nom || ""}
                onChange={handleChange}
                required
                disabled={isSaving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email || ""}
                onChange={handleChange}
                required
                disabled={isSaving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                placeholder="1 Rue de la Paix, Ville, Code Postal"
                value={formData.adresse || ""}
                onChange={handleChange}
                required
                disabled={isSaving}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/clients">
                <Button variant="outline" type="button" disabled={isSaving}>
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

      {/* Section for orders history can remain if needed, but is not part of the edit form */}
      {/* <Card>
        <CardHeader>
            <CardTitle>Historique des Commandes</CardTitle>
            <CardDescription>Liste des commandes passées par ce client.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">(Section pour l'historique des commandes à venir)</p>
        </CardContent>
      </Card> */}
    </div>
  );
}
