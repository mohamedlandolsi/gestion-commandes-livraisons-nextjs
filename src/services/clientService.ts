import { Client, NewClient, UpdateClientData } from '@/types/client';

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

export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${API_BASE_URL}/clients`);
  return handleResponse<Client[]>(response);
}

export async function getClientById(clientId: number): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`);
  return handleResponse<Client>(response);
}

export async function createClient(clientData: NewClient): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  return handleResponse<Client>(response);
}

export async function updateClient(clientId: number, clientData: UpdateClientData): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: 'PUT', // Or 'PATCH' if your API supports partial updates
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  return handleResponse<Client>(response);
}

export async function deleteClient(clientId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response); // Expects 204 No Content or similar
}
