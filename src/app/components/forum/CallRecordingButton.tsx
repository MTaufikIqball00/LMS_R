"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

export default function CallRecordingButton() {
  const call = useCall();
  const { useIsCallRecordingInProgress } = useCallStateHooks();
  const isCallRecordingInProgress = useIsCallRecordingInProgress();
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  // Listen for recording events
  useEffect(() => {
    if (!call) return;

    const eventHandlers = [
      call.on("call.recording_started", () => {
        setIsAwaitingResponse(false);
        console.log("🎬 Recording started");
      }),
      call.on("call.recording_stopped", () => {
        setIsAwaitingResponse(false);
        console.log("⏹️ Recording stopped");
      }),
    ];

    return () => {
      eventHandlers.forEach((unsubscribe) => unsubscribe());
    };
  }, [call]);

  const toggleRecording = useCallback(async () => {
    if (!call) return;

    try {
      setIsAwaitingResponse(true);

      if (isCallRecordingInProgress) {
        await call.stopRecording();
      } else {
        await call.startRecording();
      }
    } catch (error) {
      console.error("Failed to toggle recording:", error);
      setIsAwaitingResponse(false);
      alert(
        "Gagal mengubah status recording. Pastikan Anda memiliki permissions."
      );
    }
  }, [call, isCallRecordingInProgress]);

  return (
    <button
      onClick={toggleRecording}
      disabled={isAwaitingResponse || !call}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200
        ${
          isCallRecordingInProgress
            ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
            : "bg-gray-600 hover:bg-gray-700 text-white"
        }
        ${isAwaitingResponse ? "opacity-50 cursor-wait" : ""}
      `}
    >
      {isAwaitingResponse ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>...</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCallRecordingInProgress ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            )}
          </svg>
          <span>{isCallRecordingInProgress ? "Stop" : "Record"}</span>
        </>
      )}
    </button>
  );
}
