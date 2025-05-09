// app/(modules)/produits/page.tsx
"use client";

import Link from "next/link";
import { PlusCircle, Search, MoreHorizontal, Package } from "lucide-react";
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

const mockProduits = [
  {
    id: "prod_1",
    nom: "Ordinateur Portable XPS 15",
    description: "Ordinateur portable haute performance",
    prix: 1500.99,
    stock: 50,
    categorie: "Électronique",
  },
  {
    id: "prod_2",
    nom: "Cafetière Express",
    description: "Machine à café automatique",
    prix: 89.50,
    stock: 120,
    categorie: "Appareils Ménagers",
  },
];

export default function ProduitsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Package className="h-6 w-6" /> Produits
        </h1>
        <Link href="/produits/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Ajouter Produit
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits</CardTitle>
          <CardDescription>
            Gérez votre catalogue de produits.
          </CardDescription>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher produit..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProduits.map((produit) => (
                <TableRow key={produit.id}>
                  <TableCell className="font-medium">{produit.nom}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{produit.categorie}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{`$${produit.prix.toFixed(2)}`}</TableCell>
                  <TableCell className="text-right">{produit.stock}</TableCell>
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
                        <Link href={`/produits/${produit.id}`}>
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
            Affichage de <strong>1-{mockProduits.length}</strong> sur <strong>{mockProduits.length}</strong> produits
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
