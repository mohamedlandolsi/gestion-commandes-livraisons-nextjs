// src/types/transporteur.ts

// The TypeVehicule enum can be kept if used for UI filtering/display,
// but it's not part of the backend Transporteur model.
export enum TypeVehicule {
  CAMION = "CAMION",
  FOURGONNETTE = "FOURGONNETTE",
  MOTO = "MOTO",
  VOITURE = "VOITURE",
  VELO = "VELO",
  AUTRE = "AUTRE",
}

export interface Transporteur {
  id: number;
  nom: string;
  telephone?: string | null; // Changed from contact, matches backend
  note?: number | null;      // Added, matches backend
  // Removed typeVehicule, capaciteKg, disponible as they are not in the backend model
}

export interface NewTransporteur {
  nom: string; // Backend has @NotBlank for nom
  telephone?: string | null;
  note?: number | null;
  // Removed typeVehicule, capaciteKg, disponible
}

export interface UpdateTransporteurData {
  nom?: string;
  telephone?: string | null;
  note?: number | null;
  // Removed typeVehicule, capaciteKg, disponible
}
