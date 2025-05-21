import axios from "axios";
import { Page, Post, PostComment, User, UserReply } from "../types";

const API_BASE_URL = "http://127.0.0.1:8080";

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // for cookie auths
}); 

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


// Post endpoints

// Create URLSearchParams to match the @RequestParam format expected by the backend
// Sends URL parameter instead of JSON body
export const createPost = async (postData: { title: string; description: string; creatorId: number }): Promise<Post> => {
  try {
    const params = new URLSearchParams();
    params.append('title', postData.title);
    params.append('description', postData.description);
    params.append('creatorId', postData.creatorId.toString());

    const response = await api.post(
      `/api/posts`, 
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Required for @RequestParam
        },
      }
    );

    console.log("Creat post response", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to create post");
    throw error;
  }
};

export const getAllPosts = async (
  page: number = 0, 
  size: number = 10
): Promise<Page<Post>> => {
  try {
    const response = await api.get(
      `/api/posts`,
      { 
        params: { page, size }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch all posts:", error);
    throw error;
  }
};

export const getPost = async (postId: number): Promise<Post> => {
  try {
    const response = await api.get(`/api/posts/${postId}`);

    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch post");
    throw error;
  }
};

export const getPostByCreator = async (creatorId: number): Promise<Post[]> => {
  try {
    const response = await api.get(`/api/posts/creator/${creatorId}`);

    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch post by creator");
    throw error;
  }
};

export const deletePost = async (postId: number): Promise<void> => {
  try {
    await api.delete(`/api/posts/${postId}`);
  } catch (error: any) {
    handleApiError(error, "Failed to delete post");
    throw error;
  }
};

export const updatePost = async (postId: number, title: string, description: string): Promise<Post> => {
  try {
    const params = new URLSearchParams();
    params.append('title', title);
    params.append('description', description);
    
    const response = await api.put(
      `/api/posts/${postId}`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log("Update post response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to update post");
    throw error;
  }
};

// Comment endpoints
export const createComment = async (commentData: Partial<PostComment>): Promise<void> => {
  try {
    const response = await api.post(`/posts/${commentData.postId}/comments`, {commentData});

    console.log("Create comment response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to create comment");
    throw error;
  }
};

export const getComments = async (postId: number): Promise<PostComment[]> => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);

    console.log("Get comments response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to get comments");
    throw error;
  }
};

// Reply endpoints
export const createReply = async (reply: Partial<UserReply>): Promise<void> => {
  try {
    const response = await api.post(`/comments/${reply.commentId}/replies`, reply);

    console.log("Create reply response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to create reply");
    throw error;
  }
};

export const getReplies = async (commentId: number): Promise<UserReply[]> => {
  try {
    const response = await api.get(`/comments/${commentId}/replies`);

    console.log("Get replies response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to get replies");
    throw error;
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