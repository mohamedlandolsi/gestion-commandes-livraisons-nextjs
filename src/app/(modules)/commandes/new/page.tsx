// app/(modules)/commandes/new/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ShoppingCart, PlusCircle, Trash2, Search } from "lucide-react";
import { useState } from "react";

// Mock data
const mockClients = [
  { id: "client_1", nom: "Jean Dupont" },
  { id: "client_2", nom: "Sophie Martin" },
];

const mockProduits = [
  { id: "prod_1", nom: "Ordinateur Portable XPS 15", prix: 1500.99, stock: 50 },
  { id: "prod_2", nom: "Cafetière Express", prix: 89.50, stock: 120 },
  { id: "prod_3", nom: "Clavier Mécanique RGB", prix: 120.00, stock: 30 },
];

interface LigneCommande {
  produitId: string;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export default function NewCommandePage() {
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [lignesCommande, setLignesCommande] = useState<LigneCommande[]>([]);
  const [selectedProduitId, setSelectedProduitId] = useState<string | undefined>();
  const [quantiteProduit, setQuantiteProduit] = useState<number>(1);

  const handleAddProduit = () => {
    if (!selectedProduitId || quantiteProduit <= 0) return;
    const produit = mockProduits.find(p => p.id === selectedProduitId);
    if (!produit) return;

    const existingLigne = lignesCommande.find(l => l.produitId === selectedProduitId);
    if (existingLigne) {
      setLignesCommande(lignesCommande.map(l => 
        l.produitId === selectedProduitId 
        ? { ...l, quantite: l.quantite + quantiteProduit, total: (l.quantite + quantiteProduit) * l.prixUnitaire }
        : l
      ));
    } else {
      setLignesCommande([
        ...lignesCommande,
        {
          produitId: produit.id,
          nom: produit.nom,
          quantite: quantiteProduit,
          prixUnitaire: produit.prix,
          total: quantiteProduit * produit.prix,
        },
      ]);
    }
    setSelectedProduitId(undefined);
    setQuantiteProduit(1);
  };

  const handleRemoveProduit = (produitId: string) => {
    setLignesCommande(lignesCommande.filter(l => l.produitId !== produitId));
  };

  const totalCommande = lignesCommande.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href="/commandes">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" /> Créer une Nouvelle Commande
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Détails des Produits</CardTitle>
                    <CardDescription>Ajoutez des produits à la commande.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Label htmlFor="produit">Produit</Label>
                            <Select onValueChange={setSelectedProduitId} value={selectedProduitId}>
                                <SelectTrigger id="produit">
                                <SelectValue placeholder="Sélectionner un produit" />
                                </SelectTrigger>
                                <SelectContent>
                                {mockProduits.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.nom} (Stock: {p.stock})</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-24">
                            <Label htmlFor="quantite">Quantité</Label>
                            <Input 
                                id="quantite" 
                                type="number" 
                                value={quantiteProduit} 
                                onChange={(e) => setQuantiteProduit(parseInt(e.target.value, 10) || 1)}
                                min="1"
                            />
                        </div>
                        <Button onClick={handleAddProduit} disabled={!selectedProduitId}>
                            <PlusCircle className="h-4 w-4 mr-2" /> Ajouter
                        </Button>
                    </div>

                    {lignesCommande.length > 0 && (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Produit</TableHead>
                            <TableHead className="text-center">Qté</TableHead>
                            <TableHead className="text-right">Prix Unit.</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {lignesCommande.map((ligne) => (
                            <TableRow key={ligne.produitId}>
                            <TableCell>{ligne.nom}</TableCell>
                            <TableCell className="text-center">{ligne.quantite}</TableCell>
                            <TableCell className="text-right">{`$${ligne.prixUnitaire.toFixed(2)}`}</TableCell>
                            <TableCell className="text-right">{`$${ligne.total.toFixed(2)}`}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveProduit(ligne.produitId)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    )}
                    {lignesCommande.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">Aucun produit ajouté à la commande.</p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end font-semibold text-lg">
                    Total Commande: ${totalCommande.toFixed(2)}
                </CardFooter>
            </Card>
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Client et Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="client">Client</Label>
                        <Select onValueChange={setSelectedClientId} value={selectedClientId}>
                            <SelectTrigger id="client">
                            <SelectValue placeholder="Sélectionner un client" />
                            </SelectTrigger>
                            <SelectContent>
                            {mockClients.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="dateCommande">Date de Commande</Label>
                        <Input id="dateCommande" type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
                    </div>
                    <div>
                        <Label htmlFor="notes">Notes (Optionnel)</Label>
                        <Input id="notes" placeholder="Instructions spéciales, etc."/>
                    </div>
                </CardContent>
            </Card>
            <Button type="submit" size="lg" className="w-full" disabled={!selectedClientId || lignesCommande.length === 0}>
                Enregistrer la Commande
            </Button>
            <Link href="/commandes" className="w-full">
                <Button variant="outline" className="w-full">Annuler</Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
