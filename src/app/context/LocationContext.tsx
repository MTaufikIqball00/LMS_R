"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import type { GeolocationData } from "../types/attendance";
import { useNotifications } from "./NotificationContext";

interface LocationContextType {
  currentLocation: GeolocationData | null;
  isLocationEnabled: boolean;
  enableLocationTracking: () => Promise<boolean>;
  disableLocationTracking: () => void;
  validateLocation: (targetLocation: GeolocationData) => boolean;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { addNotification } = useNotifications();
  const [currentLocation, setCurrentLocation] =
    useState<GeolocationData | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const isMounted = useRef(true);
  const locationWatchId = useRef<number | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (locationWatchId.current) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, []);

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

  // Mock validation - in a real app, this would compare against a target location
  const validateLocation = useCallback(
    (targetLocation: GeolocationData) => {
      if (!currentLocation) return false;
      // This is a simplified check. A real implementation would calculate distance.
      const distance = Math.sqrt(
        Math.pow(currentLocation.latitude - targetLocation.latitude, 2) +
          Math.pow(currentLocation.longitude - targetLocation.longitude, 2)
      );
      // Assuming a very small tolerance for this mock validation
      return distance < 0.01;
    },
    [currentLocation]
  );

  const value = useMemo(
    () => ({
      currentLocation,
      isLocationEnabled,
      enableLocationTracking,
      disableLocationTracking,
      validateLocation,
    }),
    [
      currentLocation,
      isLocationEnabled,
      enableLocationTracking,
      disableLocationTracking,
      validateLocation,
    ]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
