"use client";

import { useState, useEffect } from "react";
import DiscussionRoomHeader from "../../../components/forum/DiscussionRoomHeader";
import DiscussionList from "../../../components/forum/DiscussionList";
import DiscussionForm from "../../../components/forum/DiscussionForm";
import type { DiscussionMessage } from "../../../types/discussion";

// Mock data for initial messages, including user roles
const initialMessages: DiscussionMessage[] = [
  {
    id: "1",
    text: "Selamat pagi semua! Hari ini kita akan membahas tentang integral. Silakan jika ada pertanyaan awal.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user: {
      id: "teacher-01",
      name: "Budi Setiawan",
      avatar: "/assets/Avatar.png", // Replace with actual teacher avatar
      role: "teacher",
    },
  },
  {
    id: "2",
    text: "Pagi, Pak. Saya masih bingung tentang perbedaan antara integral tentu dan tak tentu. Bisa dijelaskan lagi, Pak?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    user: {
      id: "student-01",
      name: "Citra Lestari",
      avatar: "/assets/Avatar.png", // Replace with actual student avatar
      role: "student",
    },
  },
];

// This is a Client Component
export default function ForumDiscussionPage({
  params,
}: {
  // Params is a Promise, so we handle it with useEffect
  params: Promise<{ subject: string; classId: string }>;
}) {
  const [messages, setMessages] =
    useState<DiscussionMessage[]>(initialMessages);
  const [resolvedParams, setResolvedParams] = useState<{
    subject: string;
    classId: string;
  } | null>(null);

  // Handle the params promise
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: DiscussionMessage = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      // This mock user should be replaced with actual logged-in user data
      user: {
        id: "student-02",
        name: "Johnathan", // Assuming this is the current user
        avatar: "/assets/Avatar.png",
        role: "student",
      },
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  // Show a loading state while params are resolving
  if (!resolvedParams) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-blue-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Loading Discussion...
        </p>
      </div>
    );
  }

  const { subject, classId } = resolvedParams;

  const room = {
    id: `${subject}-${classId}`,
    subject: subject,
    classId: classId,
    name: `Forum ${subject} - ${classId}`,
    callId: `${subject}-${classId}-call`,
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-blue-950">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 w-full flex-grow flex flex-col">
        <DiscussionRoomHeader room={room} />

        {/* The list will grow and push the form down */}
        <DiscussionList messages={messages} />

        {/* The form stays at the bottom */}
        <DiscussionForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
