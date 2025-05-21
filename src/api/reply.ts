import { api, handleApiError } from "./index";
import { UserReply } from "../types";

// Reply endpoints
export const createReply = async (reply: Partial<UserReply>): Promise<UserReply> => {
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