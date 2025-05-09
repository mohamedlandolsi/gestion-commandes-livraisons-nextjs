export interface Client {
  id: number; // Changed from string to number
  nom: string;
  email: string;
  adresse: string;
  commandes?: any[]; // Added commandes array, type can be refined later
  // telephone: string; // Removed as it's not in the API response
  // statut: "Actif" | "Inactif"; // Removed as it's not in the API response
}

export type NewClient = Omit<Client, "id" | "commandes">; // Exclude commandes as it's likely read-only
export type UpdateClientData = Partial<NewClient>;
