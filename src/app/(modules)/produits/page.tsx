// app/(modules)/produits/page.tsx
"use client";

import Link from "next/link";
import { PlusCircle, Search, MoreHorizontal } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useCallback } from "react";
import { Produit } from "@/types/produit";
import { getProduits, deleteProduit, searchProduitsByNom } from "@/services/produitService";

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

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  const fetchProduits = useCallback(async (term?: string) => {
    try {
      setLoading(true);
      let data;
      if (term && term.trim() !== "") {
        data = await searchProduitsByNom(term);
      } else {
        data = await getProduits();
      }
      setProduits(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch produits");
      console.error(err);
      setProduits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduits(debouncedSearchTerm);
  }, [fetchProduits, debouncedSearchTerm]);

  const handleDeleteProduit = async (produitId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduit(produitId);
        setProduits((prevProduits) => prevProduits.filter((produit) => produit.id !== produitId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete produit");
        console.error(err);
      }
    }
  };

  if (loading && produits.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <p>Erreur: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Produits</h1>
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
            Gérez vos produits ici. Vous pouvez ajouter, modifier ou supprimer des produits.
          </CardDescription>
          <div className="relative mt-4 flex items-center">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher produit par nom..."
              className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading && searchTerm === debouncedSearchTerm && (
              <div className="ml-2 text-sm text-muted-foreground">Recherche...</div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!loading && produits.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {debouncedSearchTerm ? `Aucun produit trouvé pour "${debouncedSearchTerm}".` : "Aucun produit disponible."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produits.map((produit) => (
                  <TableRow key={produit.id}>
                    <TableCell className="font-medium">{produit.nom}</TableCell>
                    <TableCell>{produit.description || "N/A"}</TableCell>
                    <TableCell className="text-right">{produit.prix.toFixed(2)} €</TableCell>
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
                          <DropdownMenuItem onClick={() => handleDeleteProduit(produit.id)} className="text-red-600 hover:!text-red-700">
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
            Affichage de <strong>{produits.length}</strong> produits.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
