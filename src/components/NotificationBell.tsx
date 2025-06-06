import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead, getUnreadCount, handleAuthenticationError } from "../api";
import { Notification as AppNotification } from "../types";
import { useNotifications } from "../contexts/NotificationContext";
import "./NotificationBell.css";

const NotificationBell: React.FC<{ userId: number }> = ({ userId }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { refreshTrigger } = useNotifications();

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Fetch unread count (no automatic polling)
    useEffect(() => {
        const fetchUnread = async () => {
            try {
                setIsRefreshing(true);
                const count = await getUnreadCount(userId);
                setUnreadCount(count);
            } catch (error: any) {
                if (!handleAuthenticationError(error)) {
                    console.error("Error fetching unread count:", error);
                    setUnreadCount(0);
                }
            } finally {
                setIsRefreshing(false);
            }
        };

        // Clear any stale state when userId changes
        setNotifications([]);
        
        // Initial fetch when component mounts or when context triggers refresh
        fetchUnread();
    }, [userId, refreshTrigger]);

    // Fetch notifications when dropdown opens
    const fetchNotifications = async () => {
        try {
            const result = await getNotifications(userId);
            setNotifications(result);
        } catch (error: any) {
            if (!handleAuthenticationError(error)) {
                console.error("Error fetching notifications:", error);
                setNotifications([]);
            }
        }
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        if (!isOpen) fetchNotifications();
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await markAsRead(id);
            // Update the notifications list
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            // Update the unread count
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error: any) {
            if (!handleAuthenticationError(error)) {
                console.error("Error marking notification as read:", error);
            }
        }
    };


    const handleNotificationClick = async (notification: AppNotification) => {
        // Mark as read first
        if (!notification.read) {
            await handleMarkAsRead(notification.id);
        }

        // Close the dropdown
        setIsOpen(false);

        // Navigate to the post - both comment and reply notifications should have postId now
        if (notification.postId) {
            navigate(`/post/${notification.postId}`);
        } else {
            // Fallback for older notifications without navigation data
            // Try to extract post ID from the notification message if possible
            const postIdMatch = notification.message.match(/post.*?(\d+)/);
            if (postIdMatch) {
                const extractedPostId = postIdMatch[1];
                navigate(`/post/${extractedPostId}`);
            } else {
                // If no navigation target, just go to home page
                navigate('/');
            }
        }
    };

    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button className="bell-icon" onClick={toggleDropdown}>
                <img 
                    src="/bell_icon.png" 
                    alt="Notifications" 
                    className={`bell-icon-image ${isRefreshing ? 'refreshing' : ''}`} 
                />
                {unreadCount > 0 && (
                    <span className="notification-count">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    {notifications.length === 0 ? (
                        <div className="no-notifications">
                            <div className="no-notifications-icon">🔔</div>
                            <p>You don't have any notifications</p>
                            <small>We'll let you know when something happens!</small>
                        </div>
                    ) : (
                        <div className="notification-list-container">
                            <ul className="notification-list">
                                {notifications.map((n) => (
                                    <li
                                        key={n.id}
                                        className={`notification-item ${n.read ? 'read' : 'unread'}`}
                                        onClick={() => handleNotificationClick(n)}
                                    >
                                        <div className="notification-content">
                                            <div className="notification-type-icon">
                                                {n.read ? '📩' : '📬'}
                                            </div>
                                            <div className="notification-text">
                                                <div className="notification-message">
                                                    {n.message}
                                                </div>
                                                <div className="notification-time">
                                                    {new Date(n.createdAt || Date.now()).toLocaleString()}
                                                </div>
                                            </div>
                                            {!n.read && (
                                                <div className="notification-indicator">
                                                    <span className="unread-dot"></span>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;