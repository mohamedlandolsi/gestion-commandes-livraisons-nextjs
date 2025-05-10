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
import { useEffect, useState, useCallback } from "react";
import { Fournisseur } from "@/types/fournisseur"; // Assuming this path is correct
import { getAllFournisseurs, deleteFournisseur, searchFournisseursByNom } from "@/services/fournisseurService"; // Assuming this path

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  const fetchFournisseurs = useCallback(async (term?: string) => {
    try {
      setLoading(true);
      let data;
      if (term && term.trim() !== "") {
        data = await searchFournisseursByNom(term);
      } else {
        data = await getAllFournisseurs();
      }
      setFournisseurs(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch fournisseurs";
      setError(errorMessage);
      console.error(err);
      setFournisseurs([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFournisseurs(debouncedSearchTerm);
  }, [fetchFournisseurs, debouncedSearchTerm]);

  const handleDeleteFournisseur = async (fournisseurId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      try {
        await deleteFournisseur(fournisseurId);
        setFournisseurs((prevFournisseurs) =>
          prevFournisseurs.filter((fournisseur) => fournisseur.id !== fournisseurId)
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete fournisseur";
        setError(errorMessage);
        console.error(err);
      }
    }
  };

  if (loading && fournisseurs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement des fournisseurs...</p>
      </div>
    );
  }

  // Show error message if loading fails and no data is present
  if (error && fournisseurs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <p>Erreur: {error}</p>
        <Button onClick={() => fetchFournisseurs(debouncedSearchTerm)} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
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
          <div className="relative mt-4 flex items-center">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher fournisseur par nom..."
              className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading && searchTerm === debouncedSearchTerm && (
              <div className="ml-2 text-sm text-muted-foreground">Recherche...</div>
            )}
          </div>
          {/* Display error inline if some data is already shown but an update fails */}
          {error && fournisseurs.length > 0 && (
            <p className="text-sm text-red-600 mt-2">Erreur lors de la mise à jour: {error}. Les données affichées peuvent être obsolètes.</p>
          )}
        </CardHeader>
        <CardContent>
          {/* Show message if no fournisseurs are found after loading and search */}
          {!loading && fournisseurs.length === 0 ? (
             <p className="text-center text-muted-foreground py-8">
              {debouncedSearchTerm ? `Aucun fournisseur trouvé pour "${debouncedSearchTerm}".` : "Aucun fournisseur disponible."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du Fournisseur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead className="text-right">Note</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fournisseurs.map((fournisseur) => (
                  <TableRow key={fournisseur.id}>
                    <TableCell className="font-medium">{fournisseur.nom}</TableCell>
                    <TableCell>{fournisseur.email || "N/A"}</TableCell>
                    <TableCell>{fournisseur.telephone || "N/A"}</TableCell>
                    <TableCell>{fournisseur.adresse || "N/A"}</TableCell>
                    <TableCell className="text-right">{fournisseur.note !== undefined && fournisseur.note !== null ? fournisseur.note.toFixed(1) : "N/A"}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleDeleteFournisseur(fournisseur.id)} className="text-red-600 hover:!text-red-700">
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Affichage de <strong>{fournisseurs.length}</strong> fournisseurs.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
