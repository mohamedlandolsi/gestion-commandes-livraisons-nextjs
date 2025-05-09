"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign, CalendarIcon, CreditCard, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Mock data for commandes - in a real app, this would be fetched
const mockCommandes = [
  { id: "CMD001", description: "Commande #1 - Client A" },
  { id: "CMD002", description: "Commande #2 - Client B" },
  { id: "CMD003", description: "Commande #3 - Client C" },
];

export default function NewPaiementPage() {
  const [selectedCommande, setSelectedCommande] = useState("");
  const [montant, setMontant] = useState("");
  const [datePaiement, setDatePaiement] = useState("");
  const [methodePaiement, setMethodePaiement] = useState("");
  const [statutPaiement, setStatutPaiement] = useState("En attente");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      selectedCommande,
      montant,
      datePaiement,
      methodePaiement,
      statutPaiement,
    });
    // Likely redirect or show a success message
  };

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    setDatePaiement(today);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/paiements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold md:text-2xl">Nouveau Paiement</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enregistrer un nouveau paiement</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour ajouter un nouveau paiement.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="commandeId">Commande Associée</Label>
                <Select onValueChange={setSelectedCommande} value={selectedCommande}>
                  <SelectTrigger id="commandeId">
                    <SelectValue placeholder="Sélectionner une commande" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCommandes.map((commande) => (
                      <SelectItem key={commande.id} value={commande.id}>
                        {commande.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="montant">Montant du Paiement</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="montant"
                    type="number"
                    placeholder="0.00"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="datePaiement">Date de Paiement</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="datePaiement"
                    type="date"
                    value={datePaiement}
                    onChange={(e) => setDatePaiement(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="methodePaiement">Méthode de Paiement</Label>
                <Select onValueChange={setMethodePaiement} value={methodePaiement}>
                  <SelectTrigger id="methodePaiement">
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Carte de crédit">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Carte de crédit
                      </div>
                    </SelectItem>
                    <SelectItem value="Virement bancaire">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Virement bancaire
                      </div>
                    </SelectItem>
                    <SelectItem value="PayPal">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 2 3V2a1.5 1.5 0 0 1 1.5-1.5h11zm1.146 5.146a.5.5 0 0 1 .708 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L17.293 9H1.5a.5.5 0 0 1 0-1H17.293l-1.647-1.646a.5.5 0 0 1 0-.708z"/><path d="M4 14.5a1.5 1.5 0 0 1 1.5-1.5h4.751a1.5 1.5 0 0 1 1.45 1.017L13 18.5h-1.5a.5.5 0 0 0 0 1h1.5a.5.5 0 0 0 .485-.378L14.625 15H19.5a1.5 1.5 0 0 1 0 3h-4.751a1.5 1.5 0 0 1-1.45-1.017L12 13.5h1.5a.5.5 0 0 0 0-1H12a.5.5 0 0 0-.485.378L10.375 17H5.5a1.5 1.5 0 0 1 0-3H4z"/></svg>
                         PayPal
                      </div>
                    </SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="statutPaiement">Statut du Paiement</Label>
              <Select onValueChange={setStatutPaiement} value={statutPaiement}>
                <SelectTrigger id="statutPaiement">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" /> En attente
                    </div>
                  </SelectItem>
                  <SelectItem value="Effectué">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" /> Effectué
                    </div>
                  </SelectItem>
                  <SelectItem value="Échoué">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" /> Échoué
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Enregistrer Paiement</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
