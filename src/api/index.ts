import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8080";

// Configure axios defaults
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // for cookie auths
}); 

// Helper function to handle API errors consistently
export const handleApiError = (error: any, defaultMessage: string): never => {
  if (error.response) {
    const errorMessage = error.response.data?.error || error.response.data?.message || defaultMessage;

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 401:
        throw new Error("Invalid credentials. Please try again.");
      case 403:
        throw new Error("Access denied. You do not have permission to perform this action.");
      case 422:
        throw new Error(errorMessage || "Validation error. Please check your input.");
      default:
        throw new Error(errorMessage || "An unexpected error occurred.");
    }
  } else if (error.request) {
    throw new Error("No response from server. Please check your connection and try again.");
  } else {
    throw new Error(error.message || defaultMessage);
  }
};

// Re-export all API modules
export * from './auth';
export * from './profile';
export * from './post';
export * from './comment';
export * from './reply';