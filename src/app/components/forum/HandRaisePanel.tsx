"use client";

import React, { useState, useEffect } from "react";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

interface HandRaiseData {
  userId: string;
  userName: string;
  timestamp: number;
  position: number;
}

export default function HandRaisePanel() {
  const call = useCall();
  const { useLocalParticipant, useParticipants } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const participants = useParticipants();

  const [handRaisedUsers, setHandRaisedUsers] = useState<HandRaiseData[]>([]);
  const [isLocalHandRaised, setIsLocalHandRaised] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Listen for hand raise reactions
  useEffect(() => {
    if (!call) return;

    const handleReaction = (event: any) => {
      // ✅ Check for reaction events with proper structure
      if (
        event.type === "call.reaction_new" &&
        event.reaction?.type === "raised-hand"
      ) {
        const userId = event.user?.id;
        const userName = event.user?.name || "Unknown User";

        if (!userId) return;

        setHandRaisedUsers((prev) => {
          const existing = prev.find((user) => user.userId === userId);
          if (existing) return prev; // Already in queue

          const newUser = {
            userId,
            userName,
            timestamp: Date.now(),
            position: prev.length + 1,
          };

          return [...prev, newUser].sort((a, b) => a.timestamp - b.timestamp);
        });

        // Update local state if it's the local user
        if (userId === localParticipant?.userId) {
          setIsLocalHandRaised(true);
        }
      }
    };

    const handleCustomEvent = (event: any) => {
      try {
        // ✅ Handle custom events for lowering hands
        if (event.type === "custom") {
          const eventData =
            typeof event.custom === "string"
              ? JSON.parse(event.custom)
              : event.custom;

          if (eventData?.type === "lower_hand") {
            const { userId } = eventData.payload || {};

            if (userId) {
              setHandRaisedUsers((prev) => {
                const filtered = prev.filter((user) => user.userId !== userId);
                // Update positions after removal
                return filtered.map((user, index) => ({
                  ...user,
                  position: index + 1,
                }));
              });

              if (userId === localParticipant?.userId) {
                setIsLocalHandRaised(false);
              }
            }
          }

          if (eventData?.type === "clear_hand_queue") {
            setHandRaisedUsers([]);
            setIsLocalHandRaised(false);
          }
        }
      } catch (error) {
        console.error("Failed to parse custom event:", error);
      }
    };

    // ✅ Use correct event types
    call.on("call.reaction_new", handleReaction);
    call.on("custom", handleCustomEvent);

    return () => {
      call.off("call.reaction_new", handleReaction);
      call.off("custom", handleCustomEvent);
    };
  }, [call, localParticipant?.userId]);

  const raiseHand = async () => {
    if (!call || !localParticipant) return;

    try {
      await call.sendReaction({
        type: "raised-hand",
        emoji_code: ":raised_hand:",
        custom: {
          userId: localParticipant.userId,
          userName: localParticipant.name || "Unknown User",
          clearAfterTimeout: false,
        },
      });
    } catch (error) {
      console.error("Failed to raise hand:", error);
    }
  };

  const lowerHand = async () => {
    if (!call || !localParticipant) return;

    try {
      await call.sendCustomEvent({
        type: "lower_hand",
        payload: {
          userId: localParticipant.userId,
        },
      });
    } catch (error) {
      console.error("Failed to lower hand:", error);
    }
  };

  const clearQueue = async () => {
    if (!call) return;

    try {
      await call.sendCustomEvent({
        type: "clear_hand_queue",
        payload: {},
      });
      setHandRaisedUsers([]);
      setIsLocalHandRaised(false);
    } catch (error) {
      console.error("Failed to clear queue:", error);
    }
  };

  const removeUserFromQueue = async (userId: string) => {
    if (!call) return;

    try {
      await call.sendCustomEvent({
        type: "lower_hand",
        payload: { userId },
      });
    } catch (error) {
      console.error("Failed to remove user from queue:", error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
        isMinimized ? "w-12" : "w-72"
      }`}
    >
      {/* Hand Raise Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isMinimized && (
          <>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
              🙋‍♂️ Hand Queue ({handRaisedUsers.length})
            </h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
          </>
        )}

        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors mx-auto"
          >
            <div className="relative">
              <svg
                className="w-5 h-5 text-gray-500"
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
              {handRaisedUsers.length > 0 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {handRaisedUsers.length}
                </div>
              )}
            </div>
          </button>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Hand Raise Control */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={isLocalHandRaised ? lowerHand : raiseHand}
              disabled={!call}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                isLocalHandRaised
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              {isLocalHandRaised ? (
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
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span>Lower Hand</span>
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
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3"
                    />
                  </svg>
                  <span>Raise Hand</span>
                </>
              )}
            </button>

            {/* Clear Queue Button (for teachers/moderators) */}
            {handRaisedUsers.length > 0 && (
              <button
                onClick={clearQueue}
                className="w-full mt-2 py-2 px-4 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Queue
              </button>
            )}
          </div>

          {/* Hand Raised Queue */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-40">
            {handRaisedUsers.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="text-3xl mb-2">✋</div>
                <p className="text-sm">Belum ada yang mengacungkan tangan</p>
                <p className="text-xs">Angkat tangan untuk berbicara!</p>
              </div>
            ) : (
              handRaisedUsers.map((user, index) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    {/* Position Badge */}
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {user.position}
                    </div>

                    {/* User Info */}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {user.userName}
                        {user.userId === localParticipant?.userId && (
                          <span className="ml-1 text-xs text-yellow-600 dark:text-yellow-400">
                            (You)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(user.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeUserFromQueue(user.userId)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-red-500"
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
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Queue Stats */}
          {handRaisedUsers.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Total dalam antrian: {handRaisedUsers.length}</span>
                {isLocalHandRaised && (
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">
                    Posisi Anda: #
                    {
                      handRaisedUsers.find(
                        (u) => u.userId === localParticipant?.userId
                      )?.position
                    }
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
