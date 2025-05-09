"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PackagePlus, CalendarIcon, TruckIcon, ListOrderedIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewLivraisonPage() {
  const [selectedCommande, setSelectedCommande] = useState<string>("");
  const [selectedTransporteur, setSelectedTransporteur] = useState<string>("");
  const [dateLivraisonPrevue, setDateLivraisonPrevue] = useState<string>("");
  const [adresseLivraison, setAdresseLivraison] = useState<string>("123 Rue de la Livraison, Ville, Pays"); // Mock data
  const [notes, setNotes] = useState<string>("");

  // Mock data for commandes and transporteurs
  const commandes = [
    { id: "cmd_1", reference: "CMD001", client: "Client A" },
    { id: "cmd_2", reference: "CMD002", client: "Client B" },
    { id: "cmd_3", reference: "CMD003", client: "Client C" },
  ];

  const transporteurs = [
    { id: "trans_1", nom: "Transporteur Express" },
    { id: "trans_2", nom: "Logistique Rapide" },
    { id: "trans_3", nom: "Livraisons Sûres" },
  ];

  const handleScheduleLivraison = () => {
    // Logic to schedule livraison (to be implemented)
    console.log("Scheduling livraison:", {
      commandeId: selectedCommande,
      transporteurId: selectedTransporteur,
      dateLivraisonPrevue,
      adresseLivraison,
      notes,
    });
    // Redirect or show success message
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center">
          <PackagePlus className="mr-2 h-6 w-6" />
          Planifier une Nouvelle Livraison
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la Livraison</CardTitle>
          <CardDescription>
            Sélectionnez la commande, le transporteur et la date de livraison.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="commande">
                <ListOrderedIcon className="mr-1 h-4 w-4 inline-block" />
                Commande à Livrer
              </Label>
              <Select value={selectedCommande} onValueChange={setSelectedCommande}>
                <SelectTrigger id="commande">
                  <SelectValue placeholder="Sélectionner une commande" />
                </SelectTrigger>
                <SelectContent>
                  {commandes.map((commande) => (
                    <SelectItem key={commande.id} value={commande.id}>
                      {commande.reference} - {commande.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transporteur">
                <TruckIcon className="mr-1 h-4 w-4 inline-block" />
                Transporteur
              </Label>
              <Select value={selectedTransporteur} onValueChange={setSelectedTransporteur}>
                <SelectTrigger id="transporteur">
                  <SelectValue placeholder="Sélectionner un transporteur" />
                </SelectTrigger>
                <SelectContent>
                  {transporteurs.map((transporteur) => (
                    <SelectItem key={transporteur.id} value={transporteur.id}>
                      {transporteur.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateLivraisonPrevue">
              <CalendarIcon className="mr-1 h-4 w-4 inline-block" />
              Date de Livraison Prévue
            </Label>
            <Input
              id="dateLivraisonPrevue"
              type="date"
              value={dateLivraisonPrevue}
              onChange={(e) => setDateLivraisonPrevue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresseLivraison">Adresse de Livraison</Label>
            <Textarea
              id="adresseLivraison"
              placeholder="Entrez l'adresse complète de livraison"
              value={adresseLivraison}
              onChange={(e) => setAdresseLivraison(e.target.value)}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              L'adresse est généralement pré-remplie depuis la commande.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Instructions spéciales pour le transporteur ou la livraison..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/livraisons">Annuler</Link>
          </Button>
          <Button onClick={handleScheduleLivraison}>
            <PackagePlus className="mr-2 h-4 w-4" />
            Planifier la Livraison
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
