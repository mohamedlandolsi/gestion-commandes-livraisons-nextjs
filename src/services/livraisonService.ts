// src/services/livraisonService.ts
import { Livraison, NewLivraison, UpdateLivraisonData, StatutLivraison } from '@/types/livraison';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Custom Error class to include status and parsed error data
export class ApiError extends Error {
  data?: any;
  status: number;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    // Set the prototype explicitly to allow instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If response body is not JSON or empty, create a generic error data object
      errorData = { message: `API request failed with status ${response.status}. The server's response was not valid JSON.` };
    }
    // Throw our custom ApiError, including the parsed data and status
    throw new ApiError(
      errorData?.message || errorData?.error || `API request failed with status ${response.status}`,
      response.status,
      errorData // This will contain the structured error from the backend
    );
  }
  // Handle successful responses
  if (response.status === 204) { // No Content
    return undefined as T;
  }
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    // If successful response has empty body but is not 204 (should not happen with typical APIs)
    if (!text.trim()) {
      return undefined as T; 
    }
    console.error("Failed to parse successful API response as JSON:", text);
    // For successful responses, if parsing fails, it's a different kind of issue
    throw new Error("Invalid JSON response from server for a successful request."); 
  }
}

export async function getAllLivraisons(): Promise<Livraison[]> {
  const response = await fetch(`${API_BASE_URL}/livraisons`);
  return handleResponse<Livraison[]>(response);
}

export async function getLivraisonById(id: number): Promise<Livraison> {
  const response = await fetch(`${API_BASE_URL}/livraisons/${id}`);
  return handleResponse<Livraison>(response);
}

export async function createLivraison(livraisonData: NewLivraison): Promise<Livraison> {
  const response = await fetch(`${API_BASE_URL}/livraisons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(livraisonData),
  });
  return handleResponse<Livraison>(response);
}

export async function updateLivraison(id: number, livraisonData: UpdateLivraisonData): Promise<Livraison> {
  const response = await fetch(`${API_BASE_URL}/livraisons/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(livraisonData),
  });
  return handleResponse<Livraison>(response);
}

export async function deleteLivraison(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/livraisons/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response);
}

export async function updateLivraisonStatut(id: number, statut: StatutLivraison): Promise<Livraison> {
  const response = await fetch(`${API_BASE_URL}/livraisons/${id}/statut?statut=${statut}`, {
    method: 'PATCH',
  });
  return handleResponse<Livraison>(response);
}

export async function assignTransporteurToLivraison(id: number, transporteurId: number): Promise<Livraison> {
  const response = await fetch(`${API_BASE_URL}/livraisons/${id}/transporteur?transporteurId=${transporteurId}`, {
    method: 'PATCH',
  });
  return handleResponse<Livraison>(response);
}

export async function getLivraisonsByCommandeId(commandeId: number): Promise<Livraison[]> {
  const response = await fetch(`${API_BASE_URL}/livraisons/by-commande/${commandeId}`);
  return handleResponse<Livraison[]>(response);
}

export async function getLivraisonsByTransporteurId(transporteurId: number): Promise<Livraison[]> {
  const response = await fetch(`${API_BASE_URL}/livraisons/by-transporteur/${transporteurId}`);
  return handleResponse<Livraison[]>(response);
}

export async function getLivraisonsByStatut(statut: StatutLivraison): Promise<Livraison[]> {
  const response = await fetch(`${API_BASE_URL}/livraisons/by-statut?statut=${statut}`);
  return handleResponse<Livraison[]>(response);
}

export async function getLivraisonsByDateRange(start: string, end: string): Promise<Livraison[]> {
  const response = await fetch(`${API_BASE_URL}/livraisons/by-date-range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
  return handleResponse<Livraison[]>(response);
}

export async function getUpcomingLivraisons(from?: string): Promise<Livraison[]> {
  let url = `${API_BASE_URL}/livraisons/upcoming`;
  if (from) {
    url += `?from=${encodeURIComponent(from)}`;
  }
  const response = await fetch(url);
  return handleResponse<Livraison[]>(response);
}
