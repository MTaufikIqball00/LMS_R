// components/attendance/GeolocationChecker.tsx
import React, { useState, useEffect } from "react";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import {
  calculateDistance,
  getAddressFromCoordinates,
} from "../utils/locationUtils";

interface GeolocationCheckerProps {
  allowedLocation?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  radius?: number; // meters
  showMap?: boolean;
}

export default function GeolocationChecker({
  allowedLocation,
  radius = 100,
  showMap = false,
}: GeolocationCheckerProps) {
  const { location, error, loading, refreshLocation } = useGeoLocation();
  const [address, setAddress] = useState<string>("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Get address from coordinates
  useEffect(() => {
    if (location && !addressLoading) {
      setAddressLoading(true);
      getAddressFromCoordinates(location.latitude, location.longitude)
        .then(setAddress)
        .catch(() => setAddress("Alamat tidak tersedia"))
        .finally(() => setAddressLoading(false));
    }
  }, [location]);

  // Check if within allowed range
  useEffect(() => {
    if (location && allowedLocation) {
      const dist = calculateDistance(location, allowedLocation);
      setDistance(dist);
      setIsWithinRange(dist <= radius);
    }
  }, [location, allowedLocation, radius]);

  const getLocationStatus = () => {
    if (loading)
      return {
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-700",
        icon: "⏳",
        text: "Mengambil lokasi...",
      };

    if (error)
      return {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-700",
        icon: "❌",
        text: `Error: ${error}`,
      };

    if (!location)
      return {
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-50 dark:bg-gray-900/20",
        border: "border-gray-200 dark:border-gray-700",
        icon: "📍",
        text: "Lokasi tidak tersedia",
      };

    if (allowedLocation && isWithinRange !== null) {
      return isWithinRange
        ? {
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20",
            border: "border-green-200 dark:border-green-700",
            icon: "✅",
            text: "Lokasi valid",
          }
        : {
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-900/20",
            border: "border-red-200 dark:border-red-700",
            icon: "⚠️",
            text: "Di luar jangkauan",
          };
    }

    return {
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-700",
      icon: "📍",
      text: "Lokasi ditemukan",
    };
  };

  const status = getLocationStatus();

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Status Lokasi
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Verifikasi lokasi untuk absensi
        </p>
      </div>

      {/* Location Status Card */}
      <div
        className={`p-4 rounded-lg border ${status.bg} ${status.border} mb-6`}
      >
        <div className="flex items-center justify-center mb-3">
          <span className="text-4xl mr-3">{status.icon}</span>
          <div className="text-center">
            <p className={`font-semibold ${status.color}`}>{status.text}</p>
            {location && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Akurasi: ±{location.accuracy.toFixed(0)}m
              </div>
            )}
          </div>
        </div>

        {/* Location Details */}
        {location && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Latitude:
                </span>
                <span className="font-mono ml-2 text-gray-900 dark:text-white">
                  {location.latitude.toFixed(6)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Longitude:
                </span>
                <span className="font-mono ml-2 text-gray-900 dark:text-white">
                  {location.longitude.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Address */}
            {address && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-start">
                  <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">
                    📍
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {addressLoading ? "Mencari alamat..." : address}
                  </span>
                </div>
              </div>
            )}

            {/* Distance Check */}
            {allowedLocation && distance !== null && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Jarak ke {allowedLocation.name || "lokasi yang diizinkan"}:
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      distance <= radius
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {distance.toFixed(0)}m
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Radius yang diizinkan: {radius}m
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={refreshLocation}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Mengambil Lokasi...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Lokasi
            </>
          )}
        </button>

        {showMap && location && (
          <button
            onClick={() => {
              const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
              window.open(url, "_blank");
            }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            Lihat Map
          </button>
        )}
      </div>

      {/* Permission Help */}
      {error && error.includes("denied") && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
            💡 Cara Mengaktifkan Lokasi:
          </h4>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Klik ikon gembok/lokasi di address bar</li>
            <li>• Pilih "Allow" untuk akses lokasi</li>
            <li>• Refresh halaman dan coba lagi</li>
          </ul>
        </div>
      )}
    </div>
  );
}
