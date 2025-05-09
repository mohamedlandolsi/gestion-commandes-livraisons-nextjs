"use client";

import Link from "next/link";
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

export default function NewFournisseurPage() {
  return (
    <div className="flex flex-col gap-4">
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
            Remplissez le formulaire pour ajouter un nouveau fournisseur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom du Fournisseur</Label>
              <Input id="nom" placeholder="Ex: Entreprise ABC" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contactNom">Nom du Contact</Label>
                <Input id="contactNom" placeholder="Ex: Jean Dupont" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPrenom">Prénom du Contact (Optionnel)</Label>
                <Input id="contactPrenom" placeholder="Ex: Marie" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contact@entreprise.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" type="tel" placeholder="0123456789" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adresse">Adresse Complète</Label>
              <Textarea id="adresse" placeholder="123 Rue Principale, Ville, Code Postal, Pays" />
            </div>
            {/* Add more fields like site web, notes, etc. */}
            <div className="flex justify-end gap-2">
              <Link href="/fournisseurs">
                <Button variant="outline">Annuler</Button>
              </Link>
              <Button type="submit">Enregistrer Fournisseur</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
