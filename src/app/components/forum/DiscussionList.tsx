"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import type { DiscussionMessage } from "../../types/discussion";

// Assume the current user's ID for alignment
const CURRENT_USER_ID = "student-02";

const MessageItem = ({ message }: { message: DiscussionMessage }) => {
  const isCurrentUser = message.user.id === CURRENT_USER_ID;

  const roleIcon = message.user.role === "teacher" ? "👨‍🏫" : "🎓";
  const roleColor =
    message.user.role === "teacher" ? "text-blue-400" : "text-green-400";

  return (
    <div
      className={`flex items-start gap-3 my-4 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar (order depends on user) */}
      {!isCurrentUser && (
        <Image
          src={message.user.avatar}
          alt={message.user.name}
          width={40}
          height={40}
          className="rounded-full object-cover border-2 border-white/20 shadow-md"
        />
      )}

      {/* Message Bubble */}
      <div
        className={`flex flex-col max-w-lg ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl p-4 shadow-md ${
            isCurrentUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
          }`}
        >
          <div className="flex items-center mb-2">
            <span className={`mr-2 text-lg`}>{roleIcon}</span>
            <span className="font-bold text-sm">{message.user.name}</span>
          </div>
          <p className="text-base">{message.text}</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Avatar (order depends on user) */}
      {isCurrentUser && (
        <Image
          src={message.user.avatar}
          alt={message.user.name}
          width={40}
          height={40}
          className="rounded-full object-cover border-2 border-blue-500/50 shadow-md"
        />
      )}
    </div>
  );
};

export default function DiscussionList({
  messages,
}: {
  messages: DiscussionMessage[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-grow overflow-y-auto p-4 bg-white/30 dark:bg-gray-800/30 rounded-2xl my-4 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm"
    >
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
}
