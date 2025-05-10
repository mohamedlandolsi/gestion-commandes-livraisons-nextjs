// filepath: d:\Ed\GL1\JEE\Projet\gestion-commandes-livraisons-frontend-react\src\services\produitService.ts
import { Produit, NewProduit, UpdateProduitData } from '@/types/produit';

const API_BASE_URL = 'http://localhost:8080/api'; // Assuming your backend is on port 8080

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text(); // Get error text first
    // Attempt to parse as JSON if it looks like JSON, otherwise use the text
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
  // For 204 No Content, there might not be a JSON body
  if (response.status === 204) {
    return null as T; // Or handle as appropriate for your application
  }
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Invalid JSON response from server");
  }
}

export async function getProduits(): Promise<Produit[]> {
  const response = await fetch(`${API_BASE_URL}/produits`);
  return handleResponse<Produit[]>(response);
}

export async function getProduitById(produitId: number): Promise<Produit> {
  const response = await fetch(`${API_BASE_URL}/produits/${produitId}`);
  return handleResponse<Produit>(response);
}

export async function createProduit(produitData: NewProduit): Promise<Produit> {
  const response = await fetch(`${API_BASE_URL}/produits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produitData),
  });
  return handleResponse<Produit>(response);
}

export async function updateProduit(produitId: number, produitData: UpdateProduitData): Promise<Produit> {
  const response = await fetch(`${API_BASE_URL}/produits/${produitId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produitData),
  });
  return handleResponse<Produit>(response);
}

export async function deleteProduit(produitId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/produits/${produitId}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response); // Expects 204 No Content or similar
}

export async function searchProduitsByNom(nom: string): Promise<Produit[]> {
  const response = await fetch(`${API_BASE_URL}/produits/search?nom=${encodeURIComponent(nom)}`);
  return handleResponse<Produit[]>(response);
}