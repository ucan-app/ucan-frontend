import React, { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../api/notification";
import { Notification as AppNotification } from "../types"; // avoid conflict with browser Notification
import "./NotificationBell.css";

const NotificationBell: React.FC<{ userId: number }> = ({ userId }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const result = await getNotifications(userId);
                setNotifications(result);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };
        fetchNotifications();
    }, [userId]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleMarkAsRead = async (id: number) => {
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    return (
        <div className="notification-bell">
            <button className="bell-icon" onClick={toggleDropdown}>
                <img src="/bell_icon.png" alt="Notifications" className="bell-icon-image" />
                {unreadCount > 0 && (
                    <span className="notification-count">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    {notifications.length === 0 ? (
                        <p className="no-notifications">No notifications</p>
                    ) : (
                        <ul>
                            {notifications.map((n) => (
                                <li
                                    key={n.id}
                                    onClick={() => handleMarkAsRead(n.id)}
                                    style={{
                                        fontWeight: n.read ? "normal" : "bold",
                                        cursor: "pointer",
                                        padding: "4px 0",
                                    }}
                                >
                                    {n.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;