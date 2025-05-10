import { Fournisseur, NewFournisseur, UpdateFournisseurData } from "@/types/fournisseur";
import { Commande } from "@/types/commande"; // Assuming Commande type is defined

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = errorText;
    }
    console.error("API Error Response:", errorData);
    throw new Error(
      typeof errorData === "string"
        ? errorData
        : errorData?.message || `API request failed with status ${response.status}`
    );
  }
  if (response.status === 204) { // No Content
    return null as T;
  }
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    // If parsing fails, and text is empty, it might be an intentional empty response for non-204 status
    if (text === '') {
        return null as T;
    }
    console.error("Failed to parse JSON:", text);
    throw new Error("Invalid JSON response from server");
  }
}

export async function getAllFournisseurs(): Promise<Fournisseur[]> {
  const response = await fetch(`${API_BASE_URL}/fournisseurs`);
  return handleResponse<Fournisseur[]>(response);
}

export async function getFournisseurById(id: number): Promise<Fournisseur> {
  const response = await fetch(`${API_BASE_URL}/fournisseurs/${id}`);
  return handleResponse<Fournisseur>(response);
}

export async function createFournisseur(fournisseurData: NewFournisseur): Promise<Fournisseur> {
  const response = await fetch(`${API_BASE_URL}/fournisseurs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fournisseurData),
  });
  return handleResponse<Fournisseur>(response);
}

export async function updateFournisseur(id: number, fournisseurData: UpdateFournisseurData): Promise<Fournisseur> {
  const response = await fetch(`${API_BASE_URL}/fournisseurs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fournisseurData),
  });
  return handleResponse<Fournisseur>(response);
}

export async function deleteFournisseur(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/fournisseurs/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response);
}

export async function searchFournisseursByNom(nom: string): Promise<Fournisseur[]> {
  const response = await fetch(`${API_BASE_URL}/fournisseurs/search?nom=${encodeURIComponent(nom)}`);
  return handleResponse<Fournisseur[]>(response);
}

export async function getOrderHistoryByFournisseur(id: number): Promise<Commande[]> {
  const response = await fetch(`${API_BASE_URL}/fournisseurs/${id}/commandes`);
  return handleResponse<Commande[]>(response);
}

export async function getOrderHistoryByDateRange(
  id: number,
  debut: string, // ISO DateTime string e.g., "2023-01-01T00:00:00"
  fin: string    // ISO DateTime string
): Promise<Commande[]> {
  const response = await fetch(`${API_BASE_URL}/fournisseurs/${id}/commandes/period?debut=${encodeURIComponent(debut)}&fin=${encodeURIComponent(fin)}`);
  return handleResponse<Commande[]>(response);
}

export async function updateFournisseurRating(id: number, note: number): Promise<Fournisseur> {
  const response = await fetch(`${API_BASE_URL}/fournisseurs/${id}/note?note=${note}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json', // Even if no body, some APIs expect this
    },
  });
  return handleResponse<Fournisseur>(response);
}
