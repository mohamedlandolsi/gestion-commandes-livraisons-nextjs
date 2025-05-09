// app/(modules)/fournisseurs/page.tsx
"use client";

import Link from "next/link";
import { PlusCircle, Search, MoreHorizontal, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockFournisseurs = [
  {
    id: "four_1",
    nom: "TechDistri",
    contactNom: "Alice Wonderland",
    email: "contact@techdistri.com",
    telephone: "0123456700",
    adresse: "100 Tech Avenue, Silicon Valley",
    statut: "Actif",
  },
  {
    id: "four_2",
    nom: "Office Supplies Co.",
    contactNom: "Bob The Builder",
    email: "sales@officesupplies.co",
    telephone: "0987654300",
    adresse: "25 Paper Street, New York",
    statut: "Actif",
  },
];

export default function FournisseursPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Building className="h-6 w-6" /> Fournisseurs
        </h1>
        <Link href="/fournisseurs/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Ajouter Fournisseur
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Fournisseurs</CardTitle>
          <CardDescription>
            Gérez vos fournisseurs et leurs informations de contact.
          </CardDescription>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher fournisseur..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Fournisseur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFournisseurs.map((fournisseur) => (
                <TableRow key={fournisseur.id}>
                  <TableCell className="font-medium">{fournisseur.nom}</TableCell>
                  <TableCell>{fournisseur.contactNom}</TableCell>
                  <TableCell>{fournisseur.email}</TableCell>
                  <TableCell>{fournisseur.telephone}</TableCell>
                  <TableCell>
                    <Badge variant={fournisseur.statut === "Actif" ? "default" : "outline"}>
                      {fournisseur.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/fournisseurs/${fournisseur.id}`}>
                          <DropdownMenuItem>Voir / Modifier</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Affichage de <strong>1-{mockFournisseurs.length}</strong> sur <strong>{mockFournisseurs.length}</strong> fournisseurs
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
