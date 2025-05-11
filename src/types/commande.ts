// filepath: d:/Ed/GL1/JEE/Projet/gestion-commandes-livraisons-frontend-react/src/types/commande.ts
import { Produit } from './produit';
import { Client } from './client'; // Assuming client.ts exists and exports Client

export enum StatutCommande {
  EN_ATTENTE = "EN_ATTENTE",
  VALIDEE = "VALIDEE",
  EN_PREPARATION = "EN_PREPARATION",
  EXPEDIEE = "EXPEDIEE",
  LIVREE = "LIVREE",
  ANNULEE = "ANNULEE",
}

export interface LigneCommande {
  id?: number; // Optional if creating new ones not yet saved
  produit: Produit; // Or number if sending produitId
  quantite: number;
  prixUnitaire: number; // Should match backend (BigDecimal usually string or number)
  // No need for 'commande' reference here for frontend DTOs usually
}

export interface Commande {
  id: number;
  client: Client; // Or number if sending clientId
  date: string; // Assuming ISO date string (LocalDateTime from backend)
  statut: StatutCommande;
  montantTotal: number; // Should match backend (BigDecimal usually string or number)
  lignesCommande: LigneCommande[];
  // livraison?: any; // Add if Livraison type is defined and needed
  // paiement?: any; // Add if Paiement type is defined and needed
}

export interface NewLigneCommande {
  produit: { id: number }; // Changed from produitId: number
  quantite: number;
  prixUnitaire: number;
}

export interface NewCommande {
  client: { id: number }; // Changed from clientId: number
  lignesCommande: NewLigneCommande[];
  statut?: StatutCommande; // Optional, backend might set default
  notes?: string; // Added notes field
  // date and montantTotal are usually set by the backend
}

export type UpdateCommandeData = Partial<Omit<NewCommande, 'client' | 'lignesCommande'> & { lignesCommande?: NewLigneCommande[] }>; // Updated to use 'client'