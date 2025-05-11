// src/services/transporteurService.ts
import { Transporteur, NewTransporteur, UpdateTransporteurData, TypeVehicule } from '@/types/transporteur';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Mock data - replace with actual API calls when backend is ready
const MOCK_TRANSPORTEURS: Transporteur[] = [
  { id: 1, nom: 'DHL Express', contact: 'contact@dhl.com', typeVehicule: TypeVehicule.CAMION, capaciteKg: 1000, disponible: true },
  { id: 2, nom: 'FedEx', contact: 'support@fedex.com', typeVehicule: TypeVehicule.FOURGONNETTE, capaciteKg: 500, disponible: true },
  { id: 3, nom: 'Chronopost', contact: 'service.client@chronopost.fr', typeVehicule: TypeVehicule.VOITURE, capaciteKg: 150, disponible: false },
  { id: 4, nom: 'Stuart Delivery', contact: 'help@stuart.com', typeVehicule: TypeVehicule.MOTO, capaciteKg: 20, disponible: true },
];
let nextId = MOCK_TRANSPORTEURS.length > 0 ? Math.max(...MOCK_TRANSPORTEURS.map(t => t.id)) + 1 : 1;

export async function getAllTransporteurs(): Promise<Transporteur[]> {
  console.warn('getAllTransporteurs: Using mock data. Implement backend endpoint if available.');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return JSON.parse(JSON.stringify(MOCK_TRANSPORTEURS.filter(t => t.disponible))); // Return a copy of available transporteurs
  /* Replace with actual API call:
  const response = await fetch(`${API_URL}/transporteurs?disponible=true`); // Assuming backend can filter
  if (!response.ok) {
    throw new Error('Failed to fetch transporteurs');
  }
  return response.json();
  */
}

export async function getTransporteurById(id: number): Promise<Transporteur | undefined> {
  console.warn(`getTransporteurById ${id}: Using mock data.`);
  await new Promise(resolve => setTimeout(resolve, 300));
  const transporteur = MOCK_TRANSPORTEURS.find(t => t.id === id);
  return transporteur ? JSON.parse(JSON.stringify(transporteur)) : undefined;
  /* Replace with actual API call:
  const response = await fetch(`${API_URL}/transporteurs/${id}`);
  if (!response.ok) {
    if (response.status === 404) return undefined;
    throw new Error('Failed to fetch transporteur');
  }
  return response.json();
  */
}

export async function createTransporteur(newTransporteur: NewTransporteur): Promise<Transporteur> {
  console.warn('createTransporteur: Using mock data.');
  await new Promise(resolve => setTimeout(resolve, 500));
  const transporteur: Transporteur = {
    id: nextId++,
    ...newTransporteur,
    disponible: newTransporteur.disponible === undefined ? true : newTransporteur.disponible,
  };
  MOCK_TRANSPORTEURS.push(transporteur);
  return JSON.parse(JSON.stringify(transporteur));
  /* Replace with actual API call:
  const response = await fetch(`${API_URL}/transporteurs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTransporteur),
  });
  if (!response.ok) {
    throw new Error('Failed to create transporteur');
  }
  return response.json();
  */
}

export async function updateTransporteur(id: number, updates: UpdateTransporteurData): Promise<Transporteur | undefined> {
  console.warn(`updateTransporteur ${id}: Using mock data.`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_TRANSPORTEURS.findIndex(t => t.id === id);
  if (index === -1) {
    return undefined;
  }
  MOCK_TRANSPORTEURS[index] = { ...MOCK_TRANSPORTEURS[index], ...updates };
  return JSON.parse(JSON.stringify(MOCK_TRANSPORTEURS[index]));
  /* Replace with actual API call:
  const response = await fetch(`${API_URL}/transporteurs/${id}`, {
    method: 'PUT', // or PATCH
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    if (response.status === 404) return undefined;
    throw new Error('Failed to update transporteur');
  }
  return response.json();
  */
}

export async function deleteTransporteur(id: number): Promise<void> {
  console.warn(`deleteTransporteur ${id}: Using mock data.`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_TRANSPORTEURS.findIndex(t => t.id === id);
  if (index !== -1) {
    MOCK_TRANSPORTEURS.splice(index, 1);
  }
  // In a real API, you might check response.ok or if it was a 404
  /* Replace with actual API call:
  const response = await fetch(`${API_URL}/transporteurs/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok && response.status !== 404) { // Allow 404 if already deleted
    throw new Error('Failed to delete transporteur');
  }
  */
}
