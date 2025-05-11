// filepath: d:/Ed/GL1/JEE/Projet/gestion-commandes-livraisons-frontend-react/src/services/commandeService.ts
import { Commande, NewCommande, UpdateCommandeData, StatutCommande } from '@/types/commande';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  if (response.status === 204) { // No Content
    return undefined as T;
  }
  // Try to parse as JSON, but if it's empty or not JSON, handle gracefully
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    // If text is empty and response was OK, it might be an intentional empty response
    if (!text.trim()) {
      return undefined as T;
    }
    // If parsing failed for non-empty text, then it's an issue
    console.error("Failed to parse API response as JSON:", text);
    throw new Error("Invalid JSON response from server.");
  }
}

export async function getAllCommandes(): Promise<Commande[]> {
  const response = await fetch(`${API_BASE_URL}/commandes`);
  return handleResponse<Commande[]>(response);
}

export async function getCommandeById(id: number): Promise<Commande> {
  const response = await fetch(`${API_BASE_URL}/commandes/${id}`);
  return handleResponse<Commande>(response);
}

export async function createCommande(commandeData: NewCommande): Promise<Commande> {
  const response = await fetch(`${API_BASE_URL}/commandes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commandeData),
  });
  return handleResponse<Commande>(response);
}

export async function updateCommande(id: number, commandeData: UpdateCommandeData): Promise<Commande> {
  const response = await fetch(`${API_BASE_URL}/commandes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commandeData),
  });
  return handleResponse<Commande>(response);
}

export async function deleteCommande(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/commandes/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response);
}

export async function updateCommandeStatut(id: number, statut: StatutCommande): Promise<Commande> {
  const response = await fetch(`${API_BASE_URL}/commandes/${id}/statut?statut=${statut}`, {
    method: 'PATCH',
  });
  return handleResponse<Commande>(response);
}

export async function getCommandesByClientId(clientId: number): Promise<Commande[]> {
  const response = await fetch(`${API_BASE_URL}/commandes/by-client/${clientId}`);
  return handleResponse<Commande[]>(response);
}

export async function getCommandesByStatus(status: StatutCommande): Promise<Commande[]> {
  const response = await fetch(`${API_BASE_URL}/commandes/by-status?status=${status}`);
  return handleResponse<Commande[]>(response);
}

export async function getCommandesByDateRange(start: string, end: string): Promise<Commande[]> {
  const response = await fetch(`${API_BASE_URL}/commandes/by-date-range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
  return handleResponse<Commande[]>(response);
}

export async function getRecentCommandes(since?: string): Promise<Commande[]> {
  let url = `${API_BASE_URL}/commandes/recent`;
  if (since) {
    url += `?since=${encodeURIComponent(since)}`;
  }
  const response = await fetch(url);
  return handleResponse<Commande[]>(response);
}
