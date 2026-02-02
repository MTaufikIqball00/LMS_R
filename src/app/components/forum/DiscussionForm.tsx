"use client";

import React, { useState } from "react";

interface DiscussionFormProps {
  onSendMessage: (text: string) => void;
}

export default function DiscussionForm({ onSendMessage }: DiscussionFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText(""); // Clear the input after sending
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 py-4 bg-transparent"
    >
      <div className="relative bg-white dark:bg-gray-700 rounded-full shadow-lg border border-transparent focus-within:border-blue-500 transition-all duration-300">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik pesan Anda..."
          className="w-full h-14 pl-6 pr-20 bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md flex items-center justify-center"
          aria-label="Send Message"
        >
          <svg
            className="w-6 h-6 transform rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </button>
      </div>
    </form>
  );
}
