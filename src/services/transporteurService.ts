// src/services/transporteurService.ts
import { Transporteur, NewTransporteur, UpdateTransporteurData } from '@/types/transporteur';
import { API_BASE_URL, handleResponse } from './apiUtils';

export async function getAllTransporteurs(): Promise<Transporteur[]> {
  const response = await fetch(`${API_BASE_URL}/transporteurs`);
  return handleResponse<Transporteur[]>(response);
}

export async function getTransporteurById(id: number): Promise<Transporteur> {
  const response = await fetch(`${API_BASE_URL}/transporteurs/${id}`);
  return handleResponse<Transporteur>(response);
}

export async function createTransporteur(transporteurData: NewTransporteur): Promise<Transporteur> {
  const response = await fetch(`${API_BASE_URL}/transporteurs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transporteurData),
  });
  return handleResponse<Transporteur>(response);
}

export async function updateTransporteur(id: number, transporteurData: UpdateTransporteurData): Promise<Transporteur> {
  const response = await fetch(`${API_BASE_URL}/transporteurs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transporteurData),
  });
  return handleResponse<Transporteur>(response);
}

export async function deleteTransporteur(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/transporteurs/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    // You might want to customize error handling based on your app's needs
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to delete transporteur');
  }
  // For DELETE, a 204 No Content doesn't usually have a body to parse with handleResponse
  // So we handle the ok status directly.
}

export async function getTransporteursByNom(nom: string): Promise<Transporteur[]> {
  const response = await fetch(`${API_BASE_URL}/transporteurs/by-nom?nom=${encodeURIComponent(nom)}`);
  return handleResponse<Transporteur[]>(response);
}

export async function searchTransporteurs(query: string): Promise<Transporteur[]> {
  const response = await fetch(`${API_BASE_URL}/transporteurs/search?query=${encodeURIComponent(query)}`);
  return handleResponse<Transporteur[]>(response);
}
