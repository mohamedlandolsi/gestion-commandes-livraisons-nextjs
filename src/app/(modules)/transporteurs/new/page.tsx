"use client";

import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewTransporteurPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/transporteurs">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Nouveau Transporteur
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Détails du Transporteur</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour ajouter un nouveau transporteur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="nom">Nom du Transporteur</Label>
              <Input
                id="nom"
                type="text"
                className="w-full"
                placeholder="Ex: SpeedyTrans"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="contact-email">Email de Contact</Label>
              <Input
                id="contact-email"
                type="email"
                className="w-full"
                placeholder="Ex: contact@speedytrans.com"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                className="w-full"
                placeholder="Ex: 0123456789"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                className="w-full"
                placeholder="Entrez l'adresse complète du transporteur"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="statut">Statut</Label>
              <Select defaultValue="actif">
                <SelectTrigger id="statut" aria-label="Sélectionner statut">
                  <SelectValue placeholder="Sélectionner statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Link href="/transporteurs">
                <Button variant="outline">Annuler</Button>
              </Link>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Enregistrer Transporteur
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
