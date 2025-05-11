import type { Commande } from './commande';

export enum StatutPaiement {
  EN_ATTENTE = 'EN_ATTENTE',
  EFFECTUE = 'EFFECTUE',
  ECHEC = 'ECHEC',
  REMBOURSE = 'REMBOURSE',
}

export const statutPaiementOptions = Object.values(StatutPaiement);

export enum ModePaiement {
  CARTE_CREDIT = 'CARTE_CREDIT',
  VIREMENT = 'VIREMENT',
  PAYPAL = 'PAYPAL',
  ESPECES = 'ESPECES',
  CHEQUE = 'CHEQUE',
}

export const modePaiementOptions = Object.values(ModePaiement);

// Simplified Commande structure for nesting within Paiement
// Adjust based on what the backend actually serializes for Paiement.commande
export interface CommandeNestedInPaiement {
  id: number;
  // Example: Add other fields if they are present and needed
  // reference?: string; // If your Commande entity has a user-friendly reference
  montantTotal?: number; // Assuming Commande has montantTotal
  client?: { // Assuming Commande has a nested Client with at least an id and nom
    id: number;
    nom: string;
  };
  // Add other relevant fields from Commande that are typically returned
}

export interface Paiement {
  id: number;
  commande: CommandeNestedInPaiement; // Or the full Commande type if the backend sends it all
  date: string; // ISO DateTime string
  montantPaye: number; // Added this field for the actual paid amount
  statut: StatutPaiement;
  mode: ModePaiement;
}

// For creating a new paiement - data from the form
export interface PaiementFormData {
  commandeId: number | string; // string from form input, convert to number
  mode: ModePaiement;
  statut?: StatutPaiement; // Optional, as backend defaults it
  // date is set by backend
}

// Payload for POST /api/paiements
// Backend expects a Paiement-like object. `id` should be omitted or null.
// `date` is set by backend. `commande` needs to be an object with an id.
export interface PaiementCreatePayload {
  commande: { id: number };
  mode: ModePaiement;
  statut?: StatutPaiement; // Backend defaults to EN_ATTENTE
  // id: null; // Explicitly null or omitted
  // date: string; // Backend will set this
}

// For updating an existing paiement - data from the form
export interface PaiementUpdateFormData {
  mode?: ModePaiement;
  statut?: StatutPaiement;
  // commandeId is typically not updatable for a paiement
}

// Payload for PUT /api/paiements/{id}
// Backend expects a Paiement-like object. `id` from path is used.
export interface PaiementUpdatePayload {
  id?: number; // Will be set from path param by service/backend
  commande?: { id: number }; // Usually not changed, but if backend allows
  mode?: ModePaiement;
  statut?: StatutPaiement;
  montantPaye?: number; // Added this field
  date?: string; // Usually not changed
}

