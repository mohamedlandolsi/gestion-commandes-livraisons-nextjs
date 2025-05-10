// filepath: d:\Ed\GL1\JEE\Projet\gestion-commandes-livraisons-frontend-react\src\types\produit.ts
export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number; // Consider using a library for BigDecimal if precision is critical
  stock: number;
  fournisseur?: any; // Added fournisseur, type can be refined later if Fournisseur type exists
}

export type NewProduit = Omit<Produit, "id" | "fournisseur">; // Fournisseur might be set differently or not at all on creation via this DTO
export type UpdateProduitData = Partial<NewProduit>;