import { api, handleApiError } from "./index";
import { User } from "../types";

// Profile endpoints
export const getProfile = async (userId: number): Promise<User> => {
  try {
    const response = await api.get(`/profile/${userId}`);

    console.log("Get profile response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to get profile");
    throw error;
  }
};

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const response = await api.post(`/profile`, profileData);

    console.log("Update profile response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to update profile");
    throw error;
  }
};