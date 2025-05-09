"use client";

import Link from "next/link";
import { PlusCircle, Search, MoreHorizontal, FileText, Edit, Trash2, Truck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock data for transporteurs
const transporteurs = [
  {
    id: "TRN001",
    nom: "SpeedyTrans",
    contact: "contact@speedytrans.com",
    telephone: "0123456789",
    statut: "Actif",
  },
  {
    id: "TRN002",
    nom: "Reliable Carriers",
    contact: "info@reliablecarriers.co",
    telephone: "0987654321",
    statut: "Actif",
  },
  {
    id: "TRN003",
    nom: "Global Logistics",
    contact: "support@globallogistics.com",
    telephone: "0555123456",
    statut: "Inactif",
  },
];

export default function TransporteursPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Transporteurs</CardTitle>
          <CardDescription>
            Gérez vos transporteurs et visualisez leurs informations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un transporteur..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <Link href="/transporteurs/new">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Nouveau Transporteur
                </span>
              </Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transporteurs.map((transporteur) => (
                <TableRow key={transporteur.id}>
                  <TableCell className="font-medium">{transporteur.id}</TableCell>
                  <TableCell>{transporteur.nom}</TableCell>
                  <TableCell>{transporteur.contact}</TableCell>
                  <TableCell>{transporteur.telephone}</TableCell>
                  <TableCell>
                    <Badge variant={transporteur.statut === "Actif" ? "default" : "outline"}>
                      {transporteur.statut}
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
                        <Link href={`/transporteurs/${transporteur.id}`}>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Détails
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/transporteurs/${transporteur.id}/edit`}> {/* Assuming an edit page */}
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
