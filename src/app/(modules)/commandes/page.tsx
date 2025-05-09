// app/(modules)/commandes/page.tsx
"use client";

import Link from "next/link";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  ShoppingCart,
  FileText,
} from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockCommandes = [
  {
    id: "cmd_1",
    client: "Jean Dupont",
    date: "2024-05-08",
    total: 250.75,
    statut: "En attente",
    items: 3,
  },
  {
    id: "cmd_2",
    client: "Sophie Martin",
    date: "2024-05-07",
    total: 120.0,
    statut: "Livrée",
    items: 2,
  },
  {
    id: "cmd_3",
    client: "TechDistri", // Example B2B
    date: "2024-05-09",
    total: 1850.0,
    statut: "En traitement",
    items: 15,
  },
];

export default function CommandesPage() {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "livrée":
        return "success";
      case "en attente":
        return "warning";
      case "annulée":
        return "destructive";
      case "en traitement":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" /> Commandes
        </h1>
        <Link href="/commandes/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Nouvelle Commande
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Commandes</CardTitle>
          <CardDescription>
            Suivez et gérez toutes les commandes clients.
          </CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Rechercher commande..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
            {/* Add filter dropdowns here if needed (e.g., by status, date range) */}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Articles</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCommandes.map((commande) => (
                <TableRow key={commande.id}>
                  <TableCell className="font-medium">
                    <Link href={`/commandes/${commande.id}`} className="hover:underline">
                        {commande.id}
                    </Link>
                  </TableCell>
                  <TableCell>{commande.client}</TableCell>
                  <TableCell>{commande.date}</TableCell>
                  <TableCell className="text-right">{`$${commande.total.toFixed(2)}`}</TableCell>
                  <TableCell className="text-center">{commande.items}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(commande.statut) as any}>
                      {commande.statut}
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
                        <Link href={`/commandes/${commande.id}`}>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <FileText className="h-4 w-4"/> Voir Détails
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Modifier Statut</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Annuler Commande</DropdownMenuItem>
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
            Affichage de <strong>1-{mockCommandes.length}</strong> sur <strong>{mockCommandes.length}</strong> commandes
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
