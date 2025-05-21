import { api, handleApiError } from "./index";
import { PostComment } from "../types";

// Comment endpoints
export const createComment = async (commentData: Partial<PostComment>): Promise<PostComment> => {
  try {
    const response = await api.post(`/posts/${commentData.postId}/comments`, commentData);

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