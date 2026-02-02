"use client";

import React, { useState, useEffect } from "react";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

export default function HandRaiseButton() {
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for hand raise events
  useEffect(() => {
    if (!call || !localParticipant) return;

    // Gunakan event yang benar untuk Stream Video SDK
    const handleCustomEvent = (event: any) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (
          data.type === "hand_raised" &&
          data.payload.userId === localParticipant.userId
        ) {
          setIsHandRaised(true);
        } else if (
          data.type === "lower_hand" &&
          data.payload.userId === localParticipant.userId
        ) {
          setIsHandRaised(false);
        }
      } catch (error) {
        console.error("Error parsing custom event:", error);
      }
    };

    // Hanya gunakan custom event untuk semua komunikasi hand raise
    call.on("custom", handleCustomEvent);

    return () => {
      call.off("custom", handleCustomEvent);
    };
  }, [call, localParticipant?.userId]);

  const toggleHandRaise = async () => {
    if (!call || !localParticipant) return;

    setIsLoading(true);

    try {
      if (isHandRaised) {
        // Lower hand
        await call.sendCustomEvent({
          type: "lower_hand",
          payload: {
            userId: localParticipant.userId,
            userName: localParticipant.name || "Unknown User",
          },
        });
      } else {
        // Raise hand - gunakan custom event instead of sendReaction
        await call.sendCustomEvent({
          type: "hand_raised",
          payload: {
            userId: localParticipant.userId,
            userName: localParticipant.name || "Unknown User",
            timestamp: Date.now(),
          },
        });
      }
    } catch (error) {
      console.error("Failed to toggle hand raise:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleHandRaise}
      disabled={isLoading || !call}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200
        ${
          isHandRaised
            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
            : "bg-gray-600 hover:bg-gray-700 text-white"
        }
        ${isLoading ? "opacity-50 cursor-wait" : ""}
      `}
    >
      {isLoading ? (
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3"
            />
          </svg>
          <span>{isHandRaised ? "Lower" : "Raise"}</span>
        </>
      )}
    </button>
  );
}
