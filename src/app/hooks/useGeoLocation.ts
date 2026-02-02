// hooks/useGeoLocation.ts
import { useState, useEffect } from "react";
import { GeolocationData } from "../types/attendance";

export const useGeoLocation = (options?: PositionOptions) => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
      setLoading(false);
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
      ...options,
    });
  }, []);

  const refreshLocation = () => {
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
  };

  return { location, error, loading, refreshLocation };
};
