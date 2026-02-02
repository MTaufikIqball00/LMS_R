"use client";

import React, { useState, useEffect } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

export default function RecordingIndicator() {
  const { useIsCallRecordingInProgress } = useCallStateHooks();
  const isRecording = useIsCallRecordingInProgress();
  const [recordingTime, setRecordingTime] = useState(0);

  // Timer untuk recording duration
  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0);
      return;
    }

    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!isRecording) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
        <span className="font-semibold">🎬 RECORDING</span>
        <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
      </div>
    </div>
  );
}
