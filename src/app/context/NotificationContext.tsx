"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { UserRole, type AttendanceNotification } from "../types/attendance";

interface NotificationContextType {
  notifications: AttendanceNotification[];
  addNotification: (
    notification: Omit<
      AttendanceNotification,
      "id" | "timestamp" | "isRead" | "recipientId" | "recipientRole"
    >
  ) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<AttendanceNotification[]>(
    []
  );
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const addNotification = useCallback(
    (
      notification: Omit<
        AttendanceNotification,
        "id" | "timestamp" | "isRead" | "recipientId" | "recipientRole"
      >
    ) => {
      if (!isMounted.current) return;

      const newNotification: AttendanceNotification = {
        ...notification,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        isRead: false,
        recipientId: "current_user", // Default value
        recipientRole: "student", // Default value
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 10));

      // Auto-remove non-error notifications after a delay
      if (notification.type === "success" || notification.type === "info") {
        setTimeout(() => {
          if (isMounted.current) {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== newNotification.id)
            );
          }
        }, 5000);
      }
    },
    []
  );

  const clearNotifications = useCallback(() => {
    if (isMounted.current) setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({ notifications, addNotification, clearNotifications }),
    [notifications, addNotification, clearNotifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
