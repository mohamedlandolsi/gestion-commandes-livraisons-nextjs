"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";
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
} from "@/components/ui/card";
import { NewLivraison } from "@/types/livraison";
import { Commande, StatutCommande } from "@/types/commande";
import { Transporteur } from "@/types/transporteur";
import { createLivraison, ApiError } from "@/services/livraisonService";
import { getAllCommandes } from "@/services/commandeService";
import { getAllTransporteurs } from "@/services/transporteurService";
import { toast } from "sonner";

export default function NewLivraisonPage() {
  const router = useRouter();
  const [commandeId, setCommandeId] = useState<string>("");
  const [transporteurId, setTransporteurId] = useState<string>("");
  const [dateLivraison, setDateLivraison] = useState<string>("");
  const [adresseLivraison, setAdresseLivraison] = useState<string>("");
  const [cout, setCout] = useState<string>("");

  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [transporteurs, setTransporteurs] = useState<Transporteur[]>([]);
  
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingRelatedData, setLoadingRelatedData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoadingRelatedData(true);
      setFormError(null);
      try {
        const [commandesData, transporteursData] = await Promise.all([
          getAllCommandes(),
          getAllTransporteurs(),
        ]);

        const eligibleCommandes = commandesData.filter(c => 
            c.statut !== StatutCommande.LIVREE && 
            c.statut !== StatutCommande.ANNULEE
        );

        setCommandes(eligibleCommandes);
        setTransporteurs(transporteursData);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        setFormError(`Erreur lors du chargement des données : ${errorMessage}`);
        toast.error("Erreur de Chargement", {
          description: `Impossible de charger les commandes ou transporteurs: ${errorMessage}`,
        });
      } finally {
        setLoadingRelatedData(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setFormError(null);

    if (!commandeId || !dateLivraison || !adresseLivraison || !cout) {
        setFormError("Veuillez remplir tous les champs obligatoires: Commande, Date de livraison, Adresse et Coût.");
        setLoadingSubmit(false);
        return;
    }
    
    let finalTransporteurId: number | null = null;
    if (transporteurId && transporteurId !== "@none@") {
      const parsedId = parseInt(transporteurId, 10);
      if (!isNaN(parsedId)) {
        finalTransporteurId = parsedId;
      }
    }

    const newLivraisonData: NewLivraison = {
      commandeId: parseInt(commandeId),
      transporteurId: finalTransporteurId,
      dateLivraison: new Date(dateLivraison).toISOString(),
      adresseLivraison,
      cout: parseFloat(cout),
    };

    try {
      const createdLivraison = await createLivraison(newLivraisonData);
      toast.success("Livraison Planifiée", {
        description: `La livraison LIV-${String(createdLivraison.id).padStart(4, '0')} a été créée avec succès.`,
      });
      router.push("/livraisons");
    } catch (error: any) {
      console.error("Failed to create livraison (raw error object):", error);
      let detailedErrorMessage: string;

      if (error instanceof ApiError) {
        console.error("Backend validation data (error.data):", error.data);
        // Default to ApiError's own message (e.g., "Validation failed" or specific message from handleResponse)
        detailedErrorMessage = error.message; 

        // If error.data is a non-empty object, try to get a more specific message
        if (error.data && typeof error.data === "object" && Object.keys(error.data).length > 0) {
          const errorData = error.data;
          if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0 &&
              typeof errorData.errors[0] === 'object' && errorData.errors[0] !== null && 'message' in errorData.errors[0]) {
            // Handle Spring Boot validation errors (field and message)
            detailedErrorMessage = errorData.errors
              .map((err: { field: string; message: string }) => `${err.field ? err.field + ': ' : ''}${err.message}`)
              .join("; ");
          } else if (errorData.error && typeof errorData.error === 'string' && errorData.message && typeof errorData.message === 'string') {
            // Handle general structured errors { error: "Type", message: "Details" }
            detailedErrorMessage = `${errorData.error}: ${errorData.message}`;
          } else if (errorData.message && typeof errorData.message === 'string') {
            // Handle errors like { message: "Details" } or if only message is present from the above case
            detailedErrorMessage = errorData.message;
          } else if (errorData.error && typeof errorData.error === 'string') {
            // Handle if only error field is present
            detailedErrorMessage = errorData.error;
          }
          // If error.data is a non-empty object but doesn't match these known structures, 
          // detailedErrorMessage remains the initial error.message.
        }
        // If error.data is null, undefined, or an empty object {}, detailedErrorMessage remains error.message.
        
      } else if (error instanceof Error) { // Fallback for other client-side JS errors
        detailedErrorMessage = error.message;
      } else { // Fallback for unknown errors
        detailedErrorMessage = "Une erreur inconnue est survenue lors de la création.";
      }
      
      setFormError(`Erreur lors de la création de la livraison: ${detailedErrorMessage}`);
      toast.error("Erreur de Création", {
        description: detailedErrorMessage, 
      });
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  if (loadingRelatedData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/livraisons">
          <Button variant="outline" size="icon" aria-label="Retour aux livraisons">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold md:text-2xl">
          Planifier une Nouvelle Livraison
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la Livraison</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour planifier une nouvelle livraison.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="commandeId">Commande (Obligatoire)</Label>
                <Select
                  value={commandeId}
                  onValueChange={setCommandeId}
                  required
                  disabled={loadingRelatedData || commandes.length === 0}
                >
                  <SelectTrigger id="commandeId">
                    <SelectValue placeholder="Sélectionner une commande" />
                  </SelectTrigger>
                  <SelectContent>
                    {commandes.length === 0 ? (
                        <SelectItem value="no-commandes" disabled>
                            {loadingRelatedData ? "Chargement..." : "Aucune commande éligible"}
                        </SelectItem>
                    ) : (
                        commandes.map((commande) => (
                        <SelectItem key={commande.id} value={commande.id.toString()}>
                            {`CMD-${String(commande.id).padStart(4, '0')} (Client: ${commande.client?.nom || 'N/A'}, Statut: ${commande.statut?.replace(/_/g, ' ') || 'N/A'})`}
                        </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                {!loadingRelatedData && commandes.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Aucune commande n'est actuellement éligible pour une nouvelle livraison. Vérifiez si des commandes sont en attente ou validées.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transporteurId">Transporteur (Optionnel)</Label>
                <Select
                  value={transporteurId}
                  onValueChange={setTransporteurId}
                  disabled={loadingRelatedData}
                >
                  <SelectTrigger id="transporteurId">
                    <SelectValue placeholder="Sélectionner un transporteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="@none@">Aucun / Non assigné</SelectItem>
                    {transporteurs.length === 0 && !loadingRelatedData && (
                        <SelectItem value="no-transporteurs" disabled>
                            Aucun transporteur disponible
                        </SelectItem>
                    )}
                    {transporteurs.map((transporteur) => (
                      <SelectItem key={transporteur.id} value={transporteur.id.toString()}>
                        {transporteur.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="dateLivraison">Date et Heure de Livraison (Obligatoire)</Label>
                    <Input
                    id="dateLivraison"
                    type="datetime-local"
                    value={dateLivraison}
                    onChange={(e) => setDateLivraison(e.target.value)}
                    min={getCurrentDateTimeLocal()}
                    required
                    disabled={loadingRelatedData}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cout">Coût de Livraison (€) (Obligatoire)</Label>
                    <Input
                    id="cout"
                    type="number"
                    value={cout}
                    onChange={(e) => setCout(e.target.value)}
                    placeholder="Ex: 25.50"
                    min="0"
                    step="0.01"
                    required
                    disabled={loadingRelatedData}
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresseLivraison">Adresse de Livraison (Obligatoire)</Label>
              <Input
                id="adresseLivraison"
                type="text"
                value={adresseLivraison}
                onChange={(e) => setAdresseLivraison(e.target.value)}
                placeholder="Ex: 123 Rue de la Paix, 75000 Paris"
                required
                disabled={loadingRelatedData}
              />
            </div>
            
            {formError && (
              <p className="text-sm font-medium text-red-600 bg-red-100 p-3 rounded-md">{formError}</p>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Link href="/livraisons">
                <Button type="button" variant="outline" disabled={loadingSubmit}>
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={loadingSubmit || loadingRelatedData || commandes.length === 0}>
                {loadingSubmit ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Planifier la Livraison
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
