// src/services/transporteurService.ts
import { Transporteur, NewTransporteur, UpdateTransporteurData } from '@/types/transporteur';

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
      errorData = { message: `API request failed with status ${response.status}. The server's response was not valid JSON.` };
    }
    throw new ApiError(
      errorData?.message || errorData?.error || `API request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }
  if (response.status === 204) { // No Content
    return undefined as T;
  }
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    if (!text.trim()) {
      return undefined as T; 
    }
    console.error("Failed to parse successful API response as JSON:", text);
    throw new Error("Invalid JSON response from server for a successful request."); 
  }
}

export async function getAllTransporteurs(): Promise<Transporteur[]> {
  const response = await fetch(`${API_BASE_URL}/transporteurs`);
  return handleResponse<Transporteur[]>(response);
}

export async function getTransporteurById(id: number): Promise<Transporteur | undefined> {
  const response = await fetch(`${API_BASE_URL}/transporteurs/${id}`);
  if (response.status === 404) {
    return undefined;
  }
  return handleResponse<Transporteur>(response);
}

export async function createTransporteur(newTransporteur: NewTransporteur): Promise<Transporteur> {
  const response = await fetch(`${API_BASE_URL}/transporteurs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTransporteur),
  });
  return handleResponse<Transporteur>(response);
}

export async function updateTransporteur(id: number, updates: UpdateTransporteurData): Promise<Transporteur> {
  const response = await fetch(`${API_BASE_URL}/transporteurs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<Transporteur>(response);
}

export async function deleteTransporteur(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/transporteurs/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response);
}

// Example of a search function if your backend supports it (e.g., /api/transporteurs/search?query=...)
// export async function searchTransporteurs(query: string): Promise<Transporteur[]> {
//   const response = await fetch(`${API_BASE_URL}/transporteurs/search?query=${encodeURIComponent(query)}`);
//   return handleResponse<Transporteur[]>(response);
// }
