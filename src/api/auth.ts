import { api, handleApiError } from "./index";

// Auth endpoints
export const register = async (username: string, email: string, password: string): Promise<void> => {
  try {
    const response = await api.post(`/api/auth/register`, { username, email, password });
    console.log("Registration response:", response.data);
  } catch (error: any) {
    handleApiError(error, "Registration failed. Please check your input.");
  }
};

export const login = async (username: string, password: string): Promise<number | undefined> => {
  try {
    const response = await api.post(
      `/api/auth/login`,
      { username, password }, // Send as JSON
    );

    console.log("Login response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Login failed. Please check your credentials.");
    return undefined;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(`/api/auth/logout`, {});
  } catch (error: any) {
    handleApiError(error, "Logout failed. Please try again.");
  }
};

export const addBadge = async (organizationName: string): Promise<void> => {
  try {
    await api.post(`/api/auth/badge`, { organizationName });
    console.log("Badge added successfully");
  } catch (error: any) {
    handleApiError(error, "Failed to add badge");
  }
};

export const removeBadge = async (organizationName: string): Promise<void> => {
  try {
    // For DELETE requests with a body, we need to use the 'data' property
    await api.delete(`/api/auth/badge`, { 
      data: { organizationName } 
    });
    console.log("Badge removed successfully");
  } catch (error: any) {
    handleApiError(error, "Failed to remove badge");
    throw error;
  }
};