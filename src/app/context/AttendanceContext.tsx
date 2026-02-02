// contexts/AttendanceContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  AttendanceRecord,
  AttendanceStats,
  GeolocationData,
  AttendanceNotification,
  AttendanceStatus,
} from "../types/attendance";
import {
  attendanceService,
  BulkCheckInData,
} from "../services/attendanceservice";

interface AttendanceContextType {
  // Existing properties
  records: AttendanceRecord[];
  stats: AttendanceStats | null;
  loading: boolean;
  isTracking: boolean;

  // Enhanced properties
  currentLocation: GeolocationData | null;
  isLocationEnabled: boolean;
  notifications: AttendanceNotification[];
  isRealTimeEnabled: boolean;
  offlineQueue: Array<{ action: string; data: any; timestamp: number }>;

  // Existing methods
  checkIn: (data: Partial<AttendanceRecord>) => Promise<void>;
  checkOut: (recordId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  getTodaySchedule: () => AttendanceRecord[];
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  startAttendanceTracking: () => void;
  stopAttendanceTracking: () => void;

  // Enhanced methods
  checkInWithLocation: (data: Partial<AttendanceRecord>) => Promise<void>;
  checkOutWithLocation: (recordId: string) => Promise<void>;
  enableLocationTracking: () => Promise<boolean>;
  disableLocationTracking: () => void;
  validateLocation: (targetLocation: GeolocationData) => boolean;
  exportAttendance: (startDate: string, endDate: string) => Promise<string>;
  bulkCheckIn: (records: Partial<AttendanceRecord>[]) => Promise<void>;
  bulkCheckOut: (recordIds: string[]) => Promise<void>;
  syncOfflineData: () => Promise<void>;
  markAsPresent: (userId: string, sessionData?: any) => Promise<void>;
  markAsAbsent: (userId: string, reason?: string) => Promise<void>;
  getAttendanceReport: (filters?: AttendanceFilters) => AttendanceRecord[];
  clearNotifications: () => void;
  addNotification: (
    notification: Omit<AttendanceNotification, "id" | "timestamp">
  ) => void;
  enableRealTimeSync: () => void;
  disableRealTimeSync: () => void;
}

interface AttendanceFilters {
  dateRange?: { start: string; end: string };
  status?: AttendanceStatus[];
  userId?: string;
  location?: string;
}

const AttendanceContext = createContext<AttendanceContextType | null>(null);

export const useAttendanceActions = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error(
      "useAttendanceActions must be used within AttendanceProvider"
    );
  }
  return context;
};

// TEMPORARY FIX: Disable Stream Video integration completely
export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Basic state only
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to prevent initial loading
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<GeolocationData | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [notifications, setNotifications] = useState<AttendanceNotification[]>(
    []
  );
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<
    Array<{ action: string; data: any; timestamp: number }>
  >([]);

  // Refs for cleanup
  const isMounted = useRef<boolean>(true);
  const locationWatchId = useRef<number | null>(null);

  // DISABLED: All Stream Video SDK integration
  // const call = useCall();
  // const { useParticipants } = useCallStateHooks();
  // const participants = useParticipants();

  // Simple addNotification
  const addNotification = useCallback(
    (notification: Omit<AttendanceNotification, "id" | "timestamp">) => {
      if (!isMounted.current) return;

      const newNotification: AttendanceNotification = {
        ...notification,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        recipientId: "current_user",
        recipientRole: "student" as any,
        isRead: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 10));

      // Auto remove success/info notifications
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

  // Simple refresh
  const refreshData = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      const [recordsData, statsData] = await Promise.all([
        attendanceService.getRecords(),
        attendanceService.getStats(),
      ]);

      if (isMounted.current) {
        setRecords(recordsData);
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      if (isMounted.current) {
        addNotification({
          type: "error",
          title: "Sync Failed",
          message: "Failed to fetch latest attendance data",
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [addNotification]);

  // Simple tracking methods
  const startAttendanceTracking = useCallback(() => {
    if (!isMounted.current) return;
    setIsTracking(true);
    addNotification({
      type: "success",
      title: "Tracking Started",
      message: "Attendance tracking is now active",
    });
  }, [addNotification]);

  const stopAttendanceTracking = useCallback(() => {
    if (!isMounted.current) return;
    setIsTracking(false);
    addNotification({
      type: "info",
      title: "Tracking Stopped",
      message: "Attendance tracking has been stopped",
    });
  }, [addNotification]);

  // Basic CRUD operations
  const checkIn = useCallback(
    async (data: Partial<AttendanceRecord>) => {
      if (!isMounted.current) return;

      try {
        const newRecord = await attendanceService.checkIn(data);
        if (isMounted.current) {
          setRecords((prev) => [newRecord, ...prev]);
          addNotification({
            type: "success",
            title: "Check-in Successful",
            message: `Checked in at ${new Date(
              newRecord.checkInTime
            ).toLocaleTimeString()}`,
          });
        }
      } catch (error) {
        console.error("Check-in error:", error);
        if (isMounted.current) {
          addNotification({
            type: "error",
            title: "Check-in Failed",
            message: "Failed to record check-in",
          });
        }
        throw error;
      }
    },
    [addNotification]
  );

  const checkOut = useCallback(
    async (recordId: string) => {
      if (!isMounted.current) return;

      try {
        const updatedRecord = await attendanceService.checkOut(recordId);
        if (isMounted.current) {
          setRecords((prev) =>
            prev.map((record) =>
              record.id === recordId ? updatedRecord : record
            )
          );
          addNotification({
            type: "success",
            title: "Check-out Successful",
            message: `Checked out at ${new Date(
              updatedRecord.checkOutTime!
            ).toLocaleTimeString()}`,
          });
        }
      } catch (error) {
        console.error("Check-out error:", error);
        if (isMounted.current) {
          addNotification({
            type: "error",
            title: "Check-out Failed",
            message: "Failed to record check-out",
          });
        }
        throw error;
      }
    },
    [addNotification]
  );

  // Location methods (simplified)
  const enableLocationTracking = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation || !isMounted.current) return false;

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      if (!isMounted.current) return false;

      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now(),
      });
      setIsLocationEnabled(true);

      addNotification({
        type: "success",
        title: "Location Enabled",
        message: "Location tracking is now active",
      });
      return true;
    } catch (error) {
      console.error("Location error:", error);
      if (isMounted.current) {
        addNotification({
          type: "error",
          title: "Location Access Denied",
          message: "Unable to access location services",
        });
      }
      return false;
    }
  }, [addNotification]);

  const disableLocationTracking = useCallback(() => {
    if (locationWatchId.current) {
      navigator.geolocation.clearWatch(locationWatchId.current);
      locationWatchId.current = null;
    }
    if (isMounted.current) {
      setIsLocationEnabled(false);
      setCurrentLocation(null);
      addNotification({
        type: "info",
        title: "Location Disabled",
        message: "Location tracking has been disabled",
      });
    }
  }, [addNotification]);

  // Stub implementations for required methods
  const validateLocation = useCallback(() => true, []);
  const checkInWithLocation = useCallback(checkIn, [checkIn]);
  const checkOutWithLocation = useCallback(checkOut, [checkOut]);

  const exportAttendance = useCallback(
    async (startDate: string, endDate: string): Promise<string> => {
      const filteredRecords = records.filter(
        (record) => record.date >= startDate && record.date <= endDate
      );

      const csvHeader =
        "Date,User ID,User Name,Student ID,Student Name,Subject,Teacher,Check In,Check Out,Duration,Status,Location\n";
      const csvData = filteredRecords
        .map((record) => {
          const duration = record.checkOutTime
            ? Math.round(
                (new Date(record.checkOutTime).getTime() -
                  new Date(record.checkInTime).getTime()) /
                  (1000 * 60)
              )
            : 0;
          const location = record.location
            ? `"${record.location.latitude},${record.location.longitude}"`
            : "";

          return `${record.date},${record.userId || ""},${
            record.userName || ""
          },${record.studentId},${record.studentName},${record.subject},${
            record.teacher
          },${record.checkInTime},${record.checkOutTime || ""},${duration},${
            record.status
          },${location}`;
        })
        .join("\n");

      return csvHeader + csvData;
    },
    [records]
  );

  const bulkCheckIn = useCallback(
    async (recordsData: Partial<AttendanceRecord>[]) => {
      try {
        const bulkData: BulkCheckInData = {
          records: recordsData,
          validateLocation: false,
          allowDuplicates: false,
        };
        const results = await attendanceService.bulkCheckIn(bulkData);
        if (isMounted.current) {
          setRecords((prev) => [...results, ...prev]);
          addNotification({
            type: "success",
            title: "Bulk Check-in",
            message: `Successfully checked in ${results.length} attendees`,
          });
        }
      } catch (error) {
        console.error("Bulk check-in error:", error);
        if (isMounted.current) {
          addNotification({
            type: "error",
            title: "Bulk Check-in Failed",
            message: "Failed to process bulk check-in",
          });
        }
        throw error;
      }
    },
    [addNotification]
  );

  const bulkCheckOut = useCallback(
    async (recordIds: string[]) => {
      try {
        const results = await attendanceService.bulkCheckOut(recordIds);
        if (isMounted.current) {
          setRecords((prev) =>
            prev.map((record) => {
              const updated = results.find((r) => r.id === record.id);
              return updated || record;
            })
          );
          addNotification({
            type: "success",
            title: "Bulk Check-out",
            message: `Successfully checked out ${results.length} attendees`,
          });
        }
      } catch (error) {
        console.error("Bulk check-out error:", error);
        if (isMounted.current) {
          addNotification({
            type: "error",
            title: "Bulk Check-out Failed",
            message: "Failed to process bulk check-out",
          });
        }
        throw error;
      }
    },
    [addNotification]
  );

  const syncOfflineData = useCallback(async () => {
    // Simplified offline sync
    if (offlineQueue.length === 0) return;

    try {
      for (const item of offlineQueue) {
        if (item.action === "checkIn") {
          await attendanceService.checkIn(item.data);
        } else if (item.action === "checkOut") {
          await attendanceService.checkOut(item.data.recordId);
        }
      }

      if (isMounted.current) {
        setOfflineQueue([]);
        await refreshData();
        addNotification({
          type: "success",
          title: "Sync Complete",
          message: "All offline data synchronized",
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      if (isMounted.current) {
        addNotification({
          type: "error",
          title: "Sync Failed",
          message: "Failed to sync offline data",
        });
      }
    }
  }, [offlineQueue, refreshData, addNotification]);

  // DISABLED: Stream Video integration that was causing issues
  const markAsPresent = useCallback(
    async (userId: string, sessionData?: any) => {
      // Simplified implementation without Stream Video
      console.log("markAsPresent called for:", userId, sessionData);
    },
    []
  );

  const markAsAbsent = useCallback(
    async (userId: string, reason?: string) => {
      try {
        const today = new Date().toISOString().split("T")[0];
        await attendanceService.markAbsent(userId, today, reason);
        await refreshData();
      } catch (error) {
        console.error("Mark absent error:", error);
        if (isMounted.current) {
          addNotification({
            type: "error",
            title: "Mark Absent Failed",
            message: "Failed to mark user as absent",
          });
        }
      }
    },
    [refreshData, addNotification]
  );

  // Helper methods
  const getAttendanceReport = useCallback(
    (filters?: AttendanceFilters): AttendanceRecord[] => {
      let filteredRecords = [...records];

      if (filters?.dateRange) {
        filteredRecords = filteredRecords.filter(
          (record) =>
            record.date >= filters.dateRange!.start &&
            record.date <= filters.dateRange!.end
        );
      }

      if (filters?.status?.length) {
        filteredRecords = filteredRecords.filter((record) =>
          filters.status!.includes(record.status)
        );
      }

      if (filters?.userId) {
        filteredRecords = filteredRecords.filter(
          (record) => record.userId === filters.userId
        );
      }

      return filteredRecords;
    },
    [records]
  );

  const getTodaySchedule = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return records.filter((record) => record.date === today);
  }, [records]);

  const getAttendanceByDate = useCallback(
    (date: string) => records.filter((record) => record.date === date),
    [records]
  );

  const clearNotifications = useCallback(() => {
    if (isMounted.current) setNotifications([]);
  }, []);

  const enableRealTimeSync = useCallback(() => {
    if (isMounted.current) setIsRealTimeEnabled(true);
  }, []);

  const disableRealTimeSync = useCallback(() => {
    if (isMounted.current) setIsRealTimeEnabled(false);
  }, []);

  // Simple initialization - NO Stream Video SDK calls
  useEffect(() => {
    isMounted.current = true;

    // Simple initialization
    const init = async () => {
      if (isMounted.current) {
        // Only load initial data, no Stream SDK
        await refreshData();
      }
    };

    init();

    return () => {
      isMounted.current = false;
      if (locationWatchId.current) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, []); // Empty dependency array - one time only

  // Context value
  const value = useMemo<AttendanceContextType>(
    () => ({
      // Properties
      records,
      stats,
      loading,
      isTracking,
      currentLocation,
      isLocationEnabled,
      notifications,
      isRealTimeEnabled,
      offlineQueue,

      // Methods
      checkIn,
      checkOut,
      refreshData,
      getTodaySchedule,
      getAttendanceByDate,
      startAttendanceTracking,
      stopAttendanceTracking,
      checkInWithLocation,
      checkOutWithLocation,
      enableLocationTracking,
      disableLocationTracking,
      validateLocation,
      exportAttendance,
      bulkCheckIn,
      bulkCheckOut,
      syncOfflineData,
      markAsPresent,
      markAsAbsent,
      getAttendanceReport,
      clearNotifications,
      addNotification,
      enableRealTimeSync,
      disableRealTimeSync,
    }),
    [
      records,
      stats,
      loading,
      isTracking,
      currentLocation,
      isLocationEnabled,
      notifications,
      isRealTimeEnabled,
      offlineQueue,
      checkIn,
      checkOut,
      refreshData,
      getTodaySchedule,
      getAttendanceByDate,
      startAttendanceTracking,
      stopAttendanceTracking,
      checkInWithLocation,
      checkOutWithLocation,
      enableLocationTracking,
      disableLocationTracking,
      validateLocation,
      exportAttendance,
      bulkCheckIn,
      bulkCheckOut,
      syncOfflineData,
      markAsPresent,
      markAsAbsent,
      getAttendanceReport,
      clearNotifications,
      addNotification,
      enableRealTimeSync,
      disableRealTimeSync,
    ]
  );

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
