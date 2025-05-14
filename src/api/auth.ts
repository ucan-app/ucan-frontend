import axios from "axios";
import { Badge, Post, User } from "../types";

const API_BASE_URL = "http://127.0.0.1:8080";

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based auths
  /*headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }*/
}); 

export const register = async (username: string, email: string, password: string): Promise<void> => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8080/api/auth/register",
      { username, email, password },
      { withCredentials: true }
    );
    console.log("Registration response:", response.data);
  } catch (error: any) {
    handleApiError(error, "Registration failed. Please check your input.");
  }
};

export const login = async (username: string, password: string): Promise<number | undefined> => {
  try {
    // Using application/x-www-form-urlencoded format as expected by Spring Security
    /*const response = await axios.post(
      "http://127.0.0.1:8080/api/auth/login",
      new URLSearchParams({ username, password }),
      { withCredentials: true }
    );*/
    const response = await axios.post(
      "http://127.0.0.1:8080/api/auth/login",
      { username, password }, // Send as JSON
      { withCredentials: true }
    );

    // Return user data if the response is successful
    console.log("Login response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Login failed. Please check your credentials.");
    return undefined; // Explicitly return undefined in case of an error
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post("http://127.0.0.1:8080/api/auth/logout", {}, { withCredentials: true });
  } catch (error: any) {
    handleApiError(error, "Logout failed. Please try again.");
  }
};

// Profile endpoints
export const getProfile = async (userId: number): Promise<User> => {
  try {
    const response = await axios.get(`http://127.0.0.1:8080/profile/${userId}`, {
      withCredentials: true,});
    console.log("Profile response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch profile");
    throw error;
  }
};

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const response = await api.post("/profile", profileData);
    console.log("Update profile response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to update profile");
    throw error;
  }
};

/*export const createPost = async (postData: { title: string; description: string; creatorId: number }): Promise<Post> => {
  try {
    const response = await axios.post("http://127.0.0.1:8080/api/posts", postData, {
      withCredentials: true,
    });
    console.log("Post response", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to create post");
    throw error;
  }
};*/
export const createPost = async (postData: { title: string; description: string; creatorId: number }): Promise<Post> => {
  try {
    // Create URLSearchParams to match the @RequestParam format expected by the backend
    const params = new URLSearchParams();
    params.append('title', postData.title);
    params.append('description', postData.description);
    params.append('creatorId', postData.creatorId.toString());

    const response = await axios.post(
      "http://127.0.0.1:8080/api/posts", 
      params, // Send as URL parameters instead of JSON body
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Required for @RequestParam
        },
      }
    );
    console.log("Post response", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to create post");
    throw error;
  }
};

// Post endpoints
/*export const getAllPosts = async (params?: { tag?: string; search?: string; badge?: string }): Promise<Post[]> => {
  try {
    const response = await api.get("/api/posts", { params });
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch posts");
    return [];
  }
};*/

export const getAllPosts = async (
  page: number = 0, 
  size: number = 10
): Promise<Post[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}`,
      { 
        params: { page, size },
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
};

export const getPost = async (postId: string): Promise<{ post: Post; comments: Comment[] }> => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch post");
    throw error;
  }
};

export const requestBadgeVerification = async (badgeId: string): Promise<void> => {
  try {
    await api.post(`/badge/${badgeId}`);
  } catch (error: any) {
    handleApiError(error, "Failed to request badge verification");
  }
};

export const verifyBadge = async (badgeId: string, verificationCode: string): Promise<Badge> => {
  try {
    const response = await api.post(`/badge/verify/${badgeId}`, { code: verificationCode });
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Badge verification failed");
    throw error;
  }
};

export const addComment = async (postId: string, body: string, parent_comment_id?: string): Promise<Comment> => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { body, parent_comment_id });
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to add comment");
    throw error;
  }
};

export const votePost = async (postId: string, value: number): Promise<void> => {
  try {
    await api.post(`/posts/${postId}/vote`, { value });
  } catch (error: any) {
    handleApiError(error, "Failed to vote on post");
  }
};



// Helper function to handle API errors consistently
const handleApiError = (error: any, defaultMessage: string): never => {
  if (error.response) {
    // Extract error message from the backend response
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
    // No response received from the server
    throw new Error("No response from server. Please check your connection and try again.");
  } else {
    // Other errors (e.g., network issues)
    throw new Error(error.message || defaultMessage);
  }
};