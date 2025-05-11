import { API_BASE_URL, handleResponse, ApiError } from '@/services/apiUtils';
import type {
  Paiement,
  PaiementCreatePayload,
  PaiementUpdatePayload,
  StatutPaiement,
  ModePaiement
} from '@/types/paiement';

const PAIEMENT_API_URL = `${API_BASE_URL}/paiements`;

// Get all paiements
export const getAllPaiements = async (): Promise<Paiement[]> => {
  const response = await fetch(PAIEMENT_API_URL);
  return handleResponse<Paiement[]>(response);
};

// Get paiement by ID
export const getPaiementById = async (id: number): Promise<Paiement> => {
  const response = await fetch(`${PAIEMENT_API_URL}/${id}`);
  return handleResponse<Paiement>(response);
};

// Create a new paiement
export const createPaiement = async (paiementData: PaiementCreatePayload): Promise<Paiement> => {
  const response = await fetch(PAIEMENT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paiementData),
  });
  return handleResponse<Paiement>(response);
};

// Update an existing paiement
export const updatePaiement = async (id: number, paiementData: PaiementUpdatePayload): Promise<Paiement> => {
  const response = await fetch(`${PAIEMENT_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paiementData),
  });
  return handleResponse<Paiement>(response);
};

// Delete a paiement
export const deletePaiement = async (id: number): Promise<void> => {
  const response = await fetch(`${PAIEMENT_API_URL}/${id}`, {
    method: 'DELETE',
  });
  // For DELETE, 204 No Content is a success
  if (!response.ok && response.status !== 204) {
    await handleResponse<void>(response); // This will throw ApiError for other errors
  }
  // No explicit return for success (void)
};

// Update paiement status
export const updatePaiementStatut = async (id: number, statut: StatutPaiement): Promise<Paiement> => {
  const response = await fetch(`${PAIEMENT_API_URL}/${id}/statut?statut=${statut}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
      },
  });
  return handleResponse<Paiement>(response);
};

// Process a paiement
export const processPaiement = async (id: number): Promise<Paiement> => {
  const response = await fetch(`${PAIEMENT_API_URL}/${id}/process`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
      },
  });
  return handleResponse<Paiement>(response);
};

// Get paiements by commande ID
export const getPaiementsByCommandeId = async (commandeId: number): Promise<Paiement[]> => {
  const response = await fetch(`${PAIEMENT_API_URL}/by-commande/${commandeId}`);
  return handleResponse<Paiement[]>(response);
};

// Get paiements by mode
export const getPaiementsByMode = async (mode: ModePaiement): Promise<Paiement[]> => {
  const response = await fetch(`${PAIEMENT_API_URL}/by-mode?mode=${mode}`);
  return handleResponse<Paiement[]>(response);
};

// Get paiements by statut
export const getPaiementsByStatut = async (statut: StatutPaiement): Promise<Paiement[]> => {
  const response = await fetch(`${PAIEMENT_API_URL}/by-statut?statut=${statut}`);
  return handleResponse<Paiement[]>(response);
};

// Get paiements by date range
export const getPaiementsByDateRange = async (start: string, end: string): Promise<Paiement[]> => {
  // Ensure dates are ISO strings if not already
  const formattedStart = new Date(start).toISOString();
  const formattedEnd = new Date(end).toISOString();
  const response = await fetch(`${PAIEMENT_API_URL}/by-date-range?start=${formattedStart}&end=${formattedEnd}`);
  return handleResponse<Paiement[]>(response);
};

// Get recent paiements
export const getRecentPaiements = async (since?: string): Promise<Paiement[]> => {
  let query = '';
  if (since) {
    const formattedSince = new Date(since).toISOString();
    query = `?since=${formattedSince}`;
  }
  const response = await fetch(`${PAIEMENT_API_URL}/recent${query}`);
  return handleResponse<Paiement[]>(response);
};
