"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Loader2, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Livraison, UpdateLivraisonData, StatutLivraison } from "@/types/livraison";
import { Transporteur } from "@/types/transporteur";
import { Commande } from "@/types/commande";
import { getLivraisonById, updateLivraison } from "@/services/livraisonService";
import { getAllTransporteurs } from "@/services/transporteurService";
import { toast } from "sonner";

export default function LivraisonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const livraisonId = params.livraisonId as string;

  const [livraison, setLivraison] = useState<Livraison | null>(null);
  const [commande, setCommande] = useState<Commande | null>(null);
  const [transporteurs, setTransporteurs] = useState<Transporteur[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [editableDateLivraison, setEditableDateLivraison] = useState<string>("");
  const [editableAdresseLivraison, setEditableAdresseLivraison] = useState<string>("");
  const [editableCout, setEditableCout] = useState<string>("");
  const [editableTransporteurId, setEditableTransporteurId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!livraisonId) return;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const livraisonData = await getLivraisonById(parseInt(livraisonId));
        setLivraison(livraisonData);
        setCommande(livraisonData.commande);

        // Populate editable fields
        setEditableDateLivraison(new Date(livraisonData.dateLivraison).toISOString().slice(0, 16));
        setEditableAdresseLivraison(livraisonData.adresseLivraison);
        setEditableCout(livraisonData.cout?.toString() || "0");
        setEditableTransporteurId(livraisonData.transporteur?.id?.toString() || undefined);

        const transporteursData = await getAllTransporteurs();
        setTransporteurs(transporteursData);
      } catch (err) {
        console.error("Failed to fetch livraison details:", err);
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
        setError(`Impossible de charger les détails de la livraison: ${errorMessage}`);
        toast.error("Erreur de Chargement", {
          description: `Impossible de charger les détails: ${errorMessage}`,
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [livraisonId]);

  const handleEditToggle = () => {
    if (!livraison) return;
    if (!isEditing) {
      setEditableDateLivraison(new Date(livraison.dateLivraison).toISOString().slice(0, 16));
      setEditableAdresseLivraison(livraison.adresseLivraison);
      setEditableCout(livraison.cout?.toString() || "0");
      setEditableTransporteurId(livraison.transporteur?.id?.toString() || undefined);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!livraison) return;

    setIsSaving(true);
    setError(null);

    if (!editableDateLivraison || !editableAdresseLivraison || !editableCout) {
      setError("Veuillez remplir tous les champs obligatoires: Date de livraison, Adresse et Coût.");
      setIsSaving(false);
      return;
    }

    const updatedData: UpdateLivraisonData = {
      dateLivraison: new Date(editableDateLivraison).toISOString(),
      adresseLivraison: editableAdresseLivraison,
      cout: parseFloat(editableCout),
      transporteurId: editableTransporteurId ? parseInt(editableTransporteurId) : null,
    };

    try {
      const updated = await updateLivraison(livraison.id, updatedData);
      setLivraison(updated);
      setCommande(updated.commande);
      setIsEditing(false);
      toast.success("Livraison Mise à Jour", {
        description: "Les détails de la livraison ont été mis à jour avec succès.",
      });
    } catch (err) {
      console.error("Failed to update livraison:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue.";
      setError(`Erreur lors de la mise à jour: ${errorMessage}`);
      toast.error("Erreur de Mise à Jour", {
        description: `Impossible de mettre à jour la livraison: ${errorMessage}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Chargement des détails de la livraison...</p>
      </div>
    );
  }

  if (error && !livraison) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Erreur de chargement</h2>
        <p className="text-center text-red-600 bg-red-100 p-3 rounded-md mb-6">{error}</p>
        <Link href="/livraisons">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux livraisons
          </Button>
        </Link>
      </div>
    );
  }

  if (!livraison) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-muted-foreground">Livraison non trouvée.</p>
      </div>
    );
  }

  const displayStatut = (statut: StatutLivraison | undefined) => {
    if (!statut) return "N/A";
    return statut.replace(/_/g, " ");
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/livraisons">
          <Button variant="outline" size="icon" aria-label="Retour aux livraisons">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold md:text-2xl">
          Détails de la Livraison LIV-{String(livraison.id).padStart(4, "0")}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Informations de la Livraison</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Modifiez les informations ci-dessous."
                  : "Consultez les informations de la livraison."}
              </CardDescription>
            </div>
            {!isEditing &&
              livraison.statut !== StatutLivraison.LIVREE &&
              livraison.statut !== StatutLivraison.ANNULEE && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEditToggle}
                  disabled={isSaving}
                >
                  <Edit className="mr-2 h-4 w-4" /> Modifier
                </Button>
              )}
          </CardHeader>
          <CardContent className="space-y-6">
            {error && !isEditing && (
              <p className="text-sm font-medium text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="livraisonIdDisplay">ID Livraison</Label>
                <Input
                  id="livraisonIdDisplay"
                  value={`LIV-${String(livraison.id).padStart(4, "0")}`}
                  readOnly
                  disabled
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="statutDisplay">Statut</Label>
                <Input id="statutDisplay" value={displayStatut(livraison.statut)} readOnly disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="commandeIdDisplay">Commande Associée</Label>
                <Input
                  id="commandeIdDisplay"
                  value={
                    commande
                      ? `CMD-${String(commande.id).padStart(4, "0")} (Client: ${
                          commande.client?.nom || "N/A"
                        })`
                      : "N/A"
                  }
                  readOnly
                  disabled
                />
                {commande && (
                  <Link
                    href={`/commandes/${commande.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Voir détails commande
                  </Link>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="dateCreationDisplay">Date de Création</Label>
                <Input
                  id="dateCreationDisplay"
                  value={new Date(livraison.dateCreation).toLocaleString()}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="dateLivraison">Date et Heure de Livraison</Label>
                {isEditing ? (
                  <Input
                    id="dateLivraison"
                    type="datetime-local"
                    value={editableDateLivraison}
                    onChange={(e) => setEditableDateLivraison(e.target.value)}
                    min={getCurrentDateTimeLocal()}
                    required
                    disabled={isSaving}
                  />
                ) : (
                  <Input
                    value={new Date(livraison.dateLivraison).toLocaleString()}
                    readOnly
                    disabled
                  />
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="cout">Coût de Livraison (€)</Label>
                {isEditing ? (
                  <Input
                    id="cout"
                    type="number"
                    value={editableCout}
                    onChange={(e) => setEditableCout(e.target.value)}
                    placeholder="Ex: 25.50"
                    min="0"
                    step="0.01"
                    required
                    disabled={isSaving}
                  />
                ) : (
                  <Input
                    value={`${livraison.cout?.toFixed(2) || "0.00"} €`}
                    readOnly
                    disabled
                  />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="adresseLivraison">Adresse de Livraison</Label>
              {isEditing ? (
                <Input
                  id="adresseLivraison"
                  type="text"
                  value={editableAdresseLivraison}
                  onChange={(e) => setEditableAdresseLivraison(e.target.value)}
                  placeholder="Ex: 123 Rue de la Paix, 75000 Paris"
                  required
                  disabled={isSaving}
                />
              ) : (
                <Input value={livraison.adresseLivraison} readOnly disabled />
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="transporteurId">Transporteur</Label>
              {isEditing ? (
                <Select
                  value={editableTransporteurId}
                  onValueChange={setEditableTransporteurId}
                  disabled={isSaving || transporteurs.length === 0}
                >
                  <SelectTrigger id="transporteurId">
                    <SelectValue placeholder="Sélectionner un transporteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun / Non assigné</SelectItem>
                    {transporteurs.map((transporteur) => (
                      <SelectItem key={transporteur.id} value={transporteur.id.toString()}>
                        {transporteur.nom} ({transporteur.typeVehicule || "N/A"})
                      </SelectItem>
                    ))}
                    {transporteurs.length === 0 && (
                      <SelectItem value="no-transporteurs" disabled>
                        Aucun transporteur disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={
                    livraison.transporteur
                      ? `${livraison.transporteur.nom} (${livraison.transporteur.typeVehicule || "N/A"})`
                      : "Non assigné"
                  }
                  readOnly
                  disabled
                />
              )}
            </div>

            {isEditing && error && (
              <p className="text-sm font-medium text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Enregistrer les Modifications
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
    </div>
  );
}
