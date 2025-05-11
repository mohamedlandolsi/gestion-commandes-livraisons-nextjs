// src/types/livraison.ts
import { Commande } from "./commande";
import { Transporteur } from "@/types/transporteur";

export enum StatutLivraison {
  EN_ATTENTE = "EN_ATTENTE",
  EN_COURS = "EN_COURS",
  LIVREE = "LIVREE",
  RETARDEE = "RETARDEE",
  ANNULEE = "ANNULEE",
}

export interface Livraison {
  id: number;
  commande: Commande; // Or just commandeId: number, depending on what API returns for lists
  transporteur?: Transporteur | null; // Or just transporteurId: number | null
  dateLivraison: string; // ISO date string (LocalDateTime)
  adresseLivraison: string; // Added field
  cout?: number | null; // BigDecimal can be number
  statut: StatutLivraison;
  dateCreation: string; // Added field for creation timestamp
}

export interface NewLivraison {
  commandeId: number; // Changed from commande: { id: number }
  transporteurId?: number | null; // Changed from transporteur: { id: number } | null
  dateLivraison: string; // ISO date string
  adresseLivraison: string; // Added field
  cout?: number | null;
  statut?: StatutLivraison; // Optional, backend defaults to EN_ATTENTE
}

export interface UpdateLivraisonData {
  commandeId?: number; // Changed from commande?: { id: number }
  transporteurId?: number | null; // Changed from transporteur?: { id: number } | null
  dateLivraison?: string;
  adresseLivraison?: string; // Added field
  cout?: number | null;
  statut?: StatutLivraison;
}
