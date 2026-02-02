"use client";

import React, { useState } from "react";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

export default function ScreenShareButton() {
  const call = useCall();
  const { useHasOngoingScreenShare } = useCallStateHooks();
  const hasOngoingScreenShare = useHasOngoingScreenShare();
  const [isLoading, setIsLoading] = useState(false);

  const handleScreenShare = async () => {
    if (!call) return;

    setIsLoading(true);
    try {
      // ✅ GetStream.io correct API
      await call.screenShare.toggle();
    } catch (error) {
      console.error("Screen share error:", error);
      alert(
        "Gagal memulai screen sharing. Pastikan browser mendukung fitur ini."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Check if current user is sharing screen
  const isMyScreenSharing = call?.screenShare?.state?.status === "enabled";
  const isSomeoneElseSharing = hasOngoingScreenShare && !isMyScreenSharing;

  return (
    <button
      onClick={handleScreenShare}
      disabled={isLoading || isSomeoneElseSharing}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200
        ${
          isMyScreenSharing
            ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
            : isSomeoneElseSharing
            ? "bg-gray-400 cursor-not-allowed text-gray-200"
            : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
        }
        ${isLoading ? "opacity-50 cursor-wait" : ""}
      `}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Loading...</span>
        </>
      ) : isMyScreenSharing ? (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Stop Sharing</span>
        </>
      ) : isSomeoneElseSharing ? (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Someone is Sharing</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>Share Screen</span>
        </>
      )}
    </button>
  );
}
