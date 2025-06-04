import { api, handleApiError } from "./index";
import { Post } from "../types";

// Profile picture upload
export const uploadProfilePicture = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    console.log("Uploading profile picture:", file.name);
    console.log("File size:", file.size, "bytes");
    console.log("File type:", file.type);
    
    // DO NOT set Content-Type header - let browser set it automatically with boundary
    const response = await api.post('/api/profile/picture', formData);

    console.log("Profile picture upload response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Profile picture upload error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    handleApiError(error, "Failed to upload profile picture");
    throw error;
  }
};

// Get profile picture URL
export const getProfilePictureUrl = async (userId: string): Promise<string | null> => {
  try {
    console.log("Fetching profile picture URL for user:", userId);
    
    const response = await api.get(`/api/profile/picture/${userId}`);
    
    console.log("Profile picture URL response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log("No profile picture found for user:", userId);
      return null;
    }
    
    console.error("Failed to fetch profile picture URL:", error);
    handleApiError(error, "Failed to fetch profile picture");
    throw error;
  }
};

// Upload image to existing post
export const uploadPostImage = async (postId: number, file: File): Promise<Post> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    console.log("Uploading image for post:", postId, "File:", file.name);
    
    // DO NOT set Content-Type header - let browser set it automatically
    const response = await api.post(`/api/posts/${postId}/image`, formData);

    console.log("Post image upload response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Post image upload error:", error);
    handleApiError(error, "Failed to upload post image");
    throw error;
  }
};

// Validate image files
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB'
    };
  }

  return { isValid: true };
};