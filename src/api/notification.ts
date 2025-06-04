import { api, handleApiError } from "./index";
import { Notification } from "../types";

export const getNotifications = async (userId: number): Promise<Notification[]> => {
    try {
        const response = await api.get(`/api/notifications`, {
            params: { userId },
        });
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Failed to fetch notifications");
        throw error;
    }
};

// Mark a specific notification as read
export const markAsRead = async (notificationId: number): Promise<void> => {
    try {
        await api.post(`/api/notifications/${notificationId}/read`);
    } catch (error: any) {
        handleApiError(error, "Failed to mark notification as read");
        throw error;
    }
};
