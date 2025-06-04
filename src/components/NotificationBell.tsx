import React, { useEffect, useState } from "react";
import { getNotifications, markAsRead, getUnreadCount } from "../api/notification";
import { Notification as AppNotification } from "../types";
import "./NotificationBell.css";

const NotificationBell: React.FC<{ userId: number }> = ({ userId }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread count
    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const count = await getUnreadCount(userId);
                setUnreadCount(count);
            } catch (error) {
                setUnreadCount(0);
            }
        };
        fetchUnread();
        // Optionally poll every 30s:
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, [userId]);

    // Fetch notifications when dropdown opens
    const fetchNotifications = async () => {
        try {
            const result = await getNotifications(userId);
            setNotifications(result);
            setUnreadCount(result.filter(n => !n.read).length);
        } catch (error) {
            setNotifications([]);
        }
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        if (!isOpen) fetchNotifications();
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            // handle error
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
                            {notifications
                                .filter((n) => !n.read)
                                .map((n) => (
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