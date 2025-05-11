// app/(modules)/commandes/new/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, ShoppingCart, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Client } from "@/types/client";
import { Produit } from "@/types/produit";
import { NewCommande } from "@/types/commande";
import { createCommande } from "@/services/commandeService";
import { getClients } from "@/services/clientService";
import { getProduits } from "@/services/produitService";

interface LigneCommande {
  produitId: number;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export default function NewCommandePage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [errorClients, setErrorClients] = useState<string | null>(null);

  const [produits, setProduits] = useState<Produit[]>([]);
  const [loadingProduits, setLoadingProduits] = useState(true);
  const [errorProduits, setErrorProduits] = useState<string | null>(null);

  const [selectedClientId, setSelectedClientId] = useState<number | undefined>();
  const [dateCommande, setDateCommande] = useState<string>(new Date().toISOString().substring(0, 10));
  const [notes, setNotes] = useState<string>("");

  const [lignesCommande, setLignesCommande] = useState<LigneCommande[]>([]);
  const [selectedProduitId, setSelectedProduitId] = useState<number | undefined>();
  const [quantiteProduit, setQuantiteProduit] = useState<number>(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const data = await getClients();
        setClients(data || []);
        setErrorClients(null);
      } catch (err) {
        setErrorClients(err instanceof Error ? err.message : "Erreur lors du chargement des clients.");
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoadingProduits(true);
        const data = await getProduits();
        setProduits(data || []);
        setErrorProduits(null);
      } catch (err) {
        setErrorProduits(err instanceof Error ? err.message : "Erreur lors du chargement des produits.");
        setProduits([]);
      } finally {
        setLoadingProduits(false);
      }
    };
    fetchProduits();
  }, []);

  useEffect(() => {
    setQuantiteProduit(1);
  }, [selectedProduitId]);

  const handleAddProduit = () => {
    if (!selectedProduitId || quantiteProduit <= 0) return;
    const produit = produits.find(p => p.id === selectedProduitId);
    if (!produit) return;

    const existingLigne = lignesCommande.find(l => l.produitId === selectedProduitId);
    const currentQuantityInCart = existingLigne ? existingLigne.quantite : 0;

    if ((currentQuantityInCart + quantiteProduit) > produit.stock) {
      alert(`Stock insuffisant pour ${produit.nom}. Quantité demandée (panier inclus): ${currentQuantityInCart + quantiteProduit}, Stock disponible: ${produit.stock}`);
      return;
    }

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

  const handleRemoveProduit = (produitId: number) => {
    setLignesCommande(lignesCommande.filter(l => l.produitId !== produitId));
  };

  const totalCommande = lignesCommande.reduce((acc, curr) => acc + curr.total, 0);

  const selectedProduitDetails = produits.find(p => p.id === selectedProduitId);

  const handleSubmit = async () => {
    if (!selectedClientId || lignesCommande.length === 0) {
      setSubmitError("Veuillez sélectionner un client et ajouter au moins un produit.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    const newCommandeData: NewCommande = {
      client: { id: selectedClientId },
      lignesCommande: lignesCommande.map(l => ({
        produit: { id: l.produitId },
        quantite: l.quantite,
        prixUnitaire: l.prixUnitaire,
      })),
      notes: notes || undefined,
    };

    try {
      await createCommande(newCommandeData);
      router.push('/commandes?success=true');
    } catch (error) {
      setSubmitError( (error as Error).message || "Erreur lors de la création de la commande." );
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    {errorProduits && <p className="text-red-500">{errorProduits}</p>}
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Label htmlFor="produit">Produit</Label>
                            <Select 
                                onValueChange={(value) => setSelectedProduitId(Number(value))} 
                                value={selectedProduitId?.toString()}
                                disabled={loadingProduits}
                            >
                                <SelectTrigger id="produit">
                                <SelectValue placeholder={loadingProduits ? "Chargement..." : "Sélectionner un produit"} />
                                </SelectTrigger>
                                <SelectContent>
                                {produits.map(p => (
                                    <SelectItem key={p.id} value={p.id.toString()} disabled={p.stock === 0}>
                                        {p.nom} (Stock: {p.stock}) {p.stock === 0 ? "- Épuisé" : ""}
                                    </SelectItem>
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
                                max={selectedProduitDetails?.stock ?? undefined}
                                disabled={!selectedProduitId || loadingProduits || (selectedProduitDetails?.stock ?? 0) === 0}
                            />
                        </div>
                        <Button 
                            onClick={handleAddProduit} 
                            disabled={
                                !selectedProduitId || 
                                loadingProduits || 
                                quantiteProduit <= 0 ||
                                (selectedProduitDetails && selectedProduitDetails.stock < quantiteProduit)
                            }
                        >
                            {loadingProduits ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <PlusCircle className="h-4 w-4 mr-2" />} 
                            Ajouter
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
                            <TableCell className="text-right">{`€${ligne.prixUnitaire.toFixed(2)}`}</TableCell> 
                            <TableCell className="text-right">{`€${ligne.total.toFixed(2)}`}</TableCell>
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
                    Total Commande: €{totalCommande.toFixed(2)}
                </CardFooter>
            </Card>
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Client et Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {errorClients && <p className="text-red-500">{errorClients}</p>}
                    <div>
                        <Label htmlFor="client">Client</Label>
                        <Select 
                            onValueChange={(value) => setSelectedClientId(Number(value))} 
                            value={selectedClientId?.toString()}
                            disabled={loadingClients}
                        >
                            <SelectTrigger id="client">
                            <SelectValue placeholder={loadingClients ? "Chargement..." : "Sélectionner un client"} />
                            </SelectTrigger>
                            <SelectContent>
                            {clients.map(c => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.nom}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="dateCommande">Date de Commande</Label>
                        <Input 
                            id="dateCommande" 
                            type="date" 
                            value={dateCommande} 
                            onChange={(e) => setDateCommande(e.target.value)} 
                            disabled
                        />
                    </div>
                    <div>
                        <Label htmlFor="notes">Notes (Optionnel)</Label>
                        <Input 
                            id="notes" 
                            placeholder="Instructions spéciales, etc." 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>
            {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
            <Button 
                onClick={handleSubmit} 
                size="lg" 
                className="w-full" 
                disabled={
                    !selectedClientId || 
                    lignesCommande.length === 0 || 
                    isSubmitting || 
                    loadingClients || 
                    loadingProduits
                }
            >
                {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : null}
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
