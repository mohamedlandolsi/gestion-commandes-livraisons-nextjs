import { Produit } from "./produit";

 

export interface Fournisseur {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  adresse?: string;
  note?: number;
  produits?: Produit[];
}

export interface NewFournisseur {
  nom: string;
  email: string;
  telephone: string;
  adresse?: string;
  note?: number;
}

export type UpdateFournisseurData = Partial<NewFournisseur>;
