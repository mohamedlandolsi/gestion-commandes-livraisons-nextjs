
// Define a custom error class for API errors
export class ApiError extends Error {
  status: number;
  data: any; // Can be used to store error response body

  constructor(message: string, status: number, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    // Set the prototype explicitly to allow instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Define the base URL for the API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Generic function to handle API responses
export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData = null;
    try {
      // Try to parse the error response body if it's JSON
      errorData = await response.json();
    } catch (e) {
      // If parsing fails, use the status text as a fallback message
      // Or handle non-JSON error responses as needed
    }
    // Throw a custom error with status and potentially error data from the response
    throw new ApiError(
      errorData?.error || errorData?.message || response.statusText || 'An API error occurred',
      response.status,
      errorData
    );
  }
  // If the response is OK, parse and return the JSON body
  // Handle cases where response might be empty (e.g., 204 No Content)
  if (response.status === 204) {
    return null as T; // Or an appropriate representation for no content
  }
  return response.json() as Promise<T>;
};
