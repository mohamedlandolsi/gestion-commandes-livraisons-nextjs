"use client";

import Link from "next/link";
import { PlusCircle, Search, MoreHorizontal, FileText, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Transporteur } from "@/types/transporteur";
import {
  getAllTransporteurs,
  deleteTransporteur,
  searchTransporteurs,
} from "@/services/transporteurService";
import { toast } from "sonner";
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

export default function TransporteursPage() {
  const [transporteurs, setTransporteurs] = useState<Transporteur[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransporteurs = async (query?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = query
        ? await searchTransporteurs(query)
        : await getAllTransporteurs();
      setTransporteurs(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de la récupération des transporteurs.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransporteurs();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchTransporteurs(searchTerm);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce transporteur ?")) {
      try {
        await deleteTransporteur(id);
        toast.success("Transporteur supprimé avec succès.");
        fetchTransporteurs(searchTerm); // Refresh the list
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression du transporteur.");
      }
    }
  };

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
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un transporteur..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
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
                <TableHead>Téléphone</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Chargement...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !error && transporteurs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Aucun transporteur trouvé.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !error && transporteurs.map((transporteur) => (
                <TableRow key={transporteur.id}>
                  <TableCell className="font-medium">{transporteur.id}</TableCell>
                  <TableCell>{transporteur.nom}</TableCell>
                  <TableCell>{transporteur.telephone || "N/A"}</TableCell>
                  <TableCell>{transporteur.note !== null && transporteur.note !== undefined ? transporteur.note : "N/A"}</TableCell>
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
                        <Link href={`/transporteurs/${transporteur.id}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(transporteur.id!)}>
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
