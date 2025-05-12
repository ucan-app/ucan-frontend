import axios from "axios";
import { Badge, Post, User } from "../types";

const API_BASE_URL = "http://127.0.0.1:8080/api/auth";

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based auth
  /*headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }*/
});

export const login = async (username: string, password: string): Promise<User> => {
  try {
    // Using application/x-www-form-urlencoded format as expected by Spring Security
    const response = await axios.post(
      "http://127.0.0.1:8080/login", 
      new URLSearchParams({ username, password }), 
      { 
        withCredentials: true,
      }
    );
    
    // Check if the response contains user data
    if (response.data && response.status === 200) {
      return response.data;
    } else {
      throw new Error("Login failed. Please check your credentials.");
    }
  } catch (error: any) {
     if (error.response?.status === 401) {
      throw new Error("Invalid username or password");
    } else if (error.response) {
      throw new Error(error.response.data?.error || "Login failed");
    } else if (error.request) {
      throw new Error("Server not responding. Please try again later");
    } else {
      throw new Error("Login failed. Please try again");
    }
  }
};

export const logout = async (): Promise<void> => {
  await axios.post("http://127.0.0.1:8080/logout", {}, { withCredentials: true });
};

export const register = async (username: string, email: string, password: string): Promise<void> => {
  try{
    await axios.post("http://127.0.0.1:8080/api/auth/register", { username, email, password }, { withCredentials: true });
  } catch (error: any) {
        handleApiError(error, "Registration failed");
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

// Post endpoints
export const getPosts = async (params?: { tag?: string; search?: string; badge?: string }): Promise<Post[]> => {
  try {
    const response = await api.get("/posts", { params });
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch posts");
    return [];
  }
};

export const createPost = async (postData: { title: string; body: string; tag?: string }): Promise<Post> => {
  try {
    const response = await api.post("/posts", postData);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to create post");
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

// Profile endpoints
export const getProfile = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch profile");
    throw error;
  }
};

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put("/profile/me", profileData);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to update profile");
    throw error;
  }
};

// Helper function to handle API errors consistently
const handleApiError = (error: any, defaultMessage: string): never => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorMessage = error.response.data?.error || error.response.data?.message || defaultMessage;
    
    // Handle different status codes
    switch (error.response.status) {
      case 401:
        throw new Error("You must be logged in to perform this action.");
      case 403:
        throw new Error("You don't have permission to perform this action.");
      case 404:
        throw new Error("The requested resource was not found.");
      case 422:
        throw new Error(errorMessage || "Validation error. Please check your input.");
      default:
        throw new Error(errorMessage);
    }
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error("No response from server. Please check your connection and try again.");
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(error.message || defaultMessage);
  }
};