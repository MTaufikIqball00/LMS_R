// components/attendance/QRCodeScanner.tsx
"use client";
import React, { useState } from "react";
import { useQRScanner } from "../../hooks/useQRScanner";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import { useAttendanceActions } from "../../context/AttendanceContext";
import { validateLocation } from "../utils/locationUtils";

interface QRCodeScannerProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function QRCodeScanner({
  onSuccess,
  onError,
}: QRCodeScannerProps) {
  const {
    result,
    error: scanError,
    isScanning,
    videoRef,
    startScanning,
    stopScanning,
  } = useQRScanner();
  const {
    location,
    error: locationError,
    loading: locationLoading,
    refreshLocation,
  } = useGeoLocation();
  const { checkIn } = useAttendanceActions();
  const [processing, setProcessing] = useState(false);

  React.useEffect(() => {
    const performCheckIn = async () => {
      if (!result || !location) return;

      try {
        setProcessing(true);

        // Parse QR code data
        const qrData = JSON.parse(result.data);

        // Validate location
        const isValidLocation = await validateLocation(
          location,
          qrData.allowedLocation,
          qrData.radiusMeters || 100
        );

        if (!isValidLocation) {
          onError?.("Anda tidak berada di lokasi yang tepat untuk absen");
          setProcessing(false);
          return;
        }

        // Check time window
        const now = new Date();
        const classStart = new Date(qrData.startTime);
        const classEnd = new Date(qrData.endTime);

        if (now < classStart || now > classEnd) {
          onError?.("Waktu absen sudah berakhir atau belum dimulai");
          setProcessing(false);
          return;
        }

        // Submit attendance
        await checkIn({
          subject: qrData.subject,
          teacher: qrData.teacher,
          date: new Date().toISOString().split("T")[0],
          checkInTime: new Date().toISOString(),
          status: now > classStart ? "late" : "present",
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          qrCodeData: result.data,
        });

        onSuccess?.();
        stopScanning();
      } catch (error) {
        onError?.("Gagal melakukan check-in: " + (error as Error).message);
      } finally {
        setProcessing(false);
      }
    };

    if (result && result.isValid && location && !processing) {
      performCheckIn();
    }
  }, [result, location, processing, checkIn, onSuccess, onError, stopScanning]);

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          QR Code Scanner
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Scan QR code untuk melakukan check-in
        </p>
      </div>

      {/* Location Status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Status Lokasi:
          </span>
          {locationLoading ? (
            <span className="text-yellow-600">Mengambil lokasi...</span>
          ) : locationError ? (
            <span className="text-red-600">Error: {locationError}</span>
          ) : location ? (
            <span className="text-green-600">Lokasi ditemukan</span>
          ) : (
            <span className="text-gray-600">Tidak ada lokasi</span>
          )}
        </div>
        {location && (
          <div className="text-xs text-gray-500 mt-1">
            Lat: {location.latitude.toFixed(6)}, Long:{" "}
            {location.longitude.toFixed(6)}
          </div>
        )}
      </div>

      {/* Scanner Area */}
      <div className="relative mb-4">
        {isScanning ? (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover rounded-lg"
              playsInline
            />
            <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-blue-500 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-gray-600 dark:text-gray-400">
                Klik tombol untuk memulai scan
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {scanError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{scanError}</p>
        </div>
      )}

      {/* Scan Result */}
      {result && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            {result.isValid
              ? "QR Code valid terdeteksi!"
              : "QR Code tidak valid"}
          </p>
          {processing && (
            <p className="text-blue-600 text-sm mt-1">Memproses check-in...</p>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3">
        {!isScanning ? (
          <button
            onClick={startScanning}
            disabled={locationLoading || !location}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Mulai Scan
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
          >
            Stop Scan
          </button>
        )}

        <button
          onClick={refreshLocation}
          disabled={locationLoading}
          className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          📍 Refresh Lokasi
        </button>
      </div>
    </div>
  );
}
