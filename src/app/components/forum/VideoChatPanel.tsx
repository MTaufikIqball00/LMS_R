"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCallStateHooks, useCall } from "@stream-io/video-react-sdk";

interface ChatMessage {
  id: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  message: string;
  timestamp: Date;
}

export default function VideoChatPanel() {
  const call = useCall();
  const { useLocalParticipant, useParticipants } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const participants = useParticipants();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for custom events (chat messages)
  useEffect(() => {
    if (!call) return;

    const handleChatMessage = (event: any) => {
      const chatData = JSON.parse(event.data);

      // Prevent duplicate messages from the local user
      if (
        chatData.type === "chat_message" &&
        chatData.payload.user.id !== localParticipant?.userId
      ) {
        setMessages((prev) => [...prev, chatData.payload]);
      }
    };

    // Listen to custom events
    call.on("custom", handleChatMessage);

    return () => {
      call.off("custom", handleChatMessage);
    };
  }, [call]);

  const sendMessage = async () => {
    if (!call || !newMessage.trim() || !localParticipant) return;

    const messageData: ChatMessage = {
      id: Date.now().toString(),
      user: {
        id: localParticipant.userId,
        name: localParticipant.name || "Unknown User",
        image: localParticipant.image,
      },
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    try {
      // Send custom event to all participants
      await call.sendCustomEvent({
        type: "chat_message",
        payload: messageData,
      });

      // Add to local state
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send chat message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
        isMinimized ? "w-12" : "w-80"
      }`}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isMinimized && (
          <>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
              💬 Chat ({participants.length})
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-60">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="text-3xl mb-2">💭</div>
                <p className="text-sm">Belum ada pesan chat</p>
                <p className="text-xs">Mulai percakapan!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex space-x-2 ${
                    msg.user.id === localParticipant?.userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {msg.user.id !== localParticipant?.userId && (
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.user.name.charAt(0)}
                    </div>
                  )}

                  <div
                    className={`max-w-xs ${
                      msg.user.id === localParticipant?.userId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    } rounded-lg px-3 py-2`}
                  >
                    {msg.user.id !== localParticipant?.userId && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {msg.user.name}
                      </p>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.user.id === localParticipant?.userId
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
                disabled={!call}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !call}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors flex-shrink-0"
              >
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </>
      )}
    </div>
  );
}
