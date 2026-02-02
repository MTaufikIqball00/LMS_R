// utils/locationUtils.ts
import { GeolocationData } from "../../types/attendance";

export const calculateDistance = (
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const validateLocation = async (
  currentLocation: GeolocationData,
  allowedLocation: { latitude: number; longitude: number },
  radiusMeters: number = 100
): Promise<boolean> => {
  const distance = calculateDistance(currentLocation, allowedLocation);
  return distance <= radiusMeters;
};

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
    );
    const data = await response.json();
    return data.results[0]?.formatted || "Unknown location";
  } catch (error) {
    console.error("Failed to get address:", error);
    return "Unknown location";
  }
};
