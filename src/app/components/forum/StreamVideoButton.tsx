"use client";

import React, { useState } from "react";
import StreamVideoModal from "./StreamVideoModal";
import { useRouter } from "next/navigation";

interface StreamVideoButtonProps {
  callId: string;
  roomName?: string;
  className?: string;
  userId?: string;
  userName?: string;
}

export default function StreamVideoButton({
  callId,
  roomName,
  className = "",
  userId = "default_user",
  userName = "User",
}: StreamVideoButtonProps) {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleJoinCall = async () => {
    setIsConnecting(true);

    try {
      // Store room and user info for video call page
      if (typeof window !== "undefined") {
        localStorage.setItem(`room-${callId}`, roomName || `Meeting ${callId}`);
        localStorage.setItem(
          `user-${callId}`,
          JSON.stringify({ userId, userName })
        );
      }

      // Navigate to full-page video call - NO MORE MODAL!
      router.push(`/forum/video/${callId}`);
    } catch (error) {
      console.error("Failed to join video call:", error);
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleJoinCall}
      disabled={isConnecting}
      className={`
        group relative overflow-hidden rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg
        ${
          isConnecting
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700"
        }
        ${className}
      `}
    >
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative px-4 py-2.5 text-white flex items-center space-x-2 text-sm">
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold">Join Meeting</span>
            <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse group-hover:animate-bounce"></div>
          </>
        )}
      </div>

      {/* Premium Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-pulse"></div>
    </button>
  );
}
