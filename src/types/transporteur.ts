// src/types/transporteur.ts

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
  contact?: string | null;
  typeVehicule?: TypeVehicule | null;
  capaciteKg?: number | null;
  disponible: boolean;
  // Add any other fields that your backend Transporteur model might have
}

export interface NewTransporteur {
  nom: string;
  contact?: string | null;
  typeVehicule?: TypeVehicule | null;
  capaciteKg?: number | null;
  disponible?: boolean; // Defaults to true or as per backend logic
}

export interface UpdateTransporteurData {
  nom?: string;
  contact?: string | null;
  typeVehicule?: TypeVehicule | null;
  capaciteKg?: number | null;
  disponible?: boolean;
}
