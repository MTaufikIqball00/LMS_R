// hooks/useQRScanner.ts
import { useState, useEffect, useRef } from "react";
import QrScanner from "qr-scanner";
import { QRScanResult } from "../types/attendance";

export const useQRScanner = () => {
  const [result, setResult] = useState<QRScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      setError(null);

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          setResult({
            data: result.data,
            timestamp: Date.now(),
            isValid: validateQRCode(result.data),
          });
        },
        {
          onDecodeError: (error) => {
            console.log("Decode error:", error);
          },
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
    } catch (err) {
      setError("Failed to start camera: " + (err as Error).message);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const validateQRCode = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      return parsed.type === "attendance" && parsed.classId && parsed.timestamp;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return {
    result,
    error,
    isScanning,
    videoRef,
    startScanning,
    stopScanning,
  };
};
