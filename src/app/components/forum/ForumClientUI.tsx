"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StreamVideoButton from "./StreamVideoButton";

type Room = {
  id: string;
  name: string;
  subject?: string;
  classId?: string;
  grade?: 10 | 11 | 12;
  callId: string;
  participants?: number;
  isActive?: boolean;
};

import { UserSession } from "../../types/attendance";

export default function ForumClientUI({ initialRooms, session }: { initialRooms: Room[]; session: UserSession | null }) {
  const [filter, setFilter] = useState<string>("all");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredRooms =
    filter === "all"
      ? initialRooms
      : filter === "general"
      ? initialRooms.filter((r) => !r.subject && !r.classId)
      : initialRooms.filter((r) => r.subject === filter);

  return (
    <div>
      {/* Filter Section */}
      <div className="flex justify-center mb-12">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-2">
          <select
            className="bg-transparent border-none outline-none px-6 py-3 text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">🌍 Semua Ruang</option>
            <option value="general">💭 Forum Umum</option>
            {/* Dynamically create options from available subjects */}
            {[...new Set(initialRooms.map(r => r.subject).filter(Boolean))].map(subject => (
                <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/50 p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="absolute top-6 right-6">
              <div
                className={`w-3 h-3 rounded-full ${
                  room.isActive ? "bg-green-400 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
            </div>
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg">
                {room.subject ? "📚" : "🌐"}
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                {room.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {room.subject && (
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    <span className="font-medium">Mata Pelajaran:</span>
                    <span className="ml-1 text-blue-600 dark:text-blue-400 font-semibold">
                      {room.subject}
                    </span>
                  </div>
                )}
                {room.grade && (
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      <span className="font-medium">Kelas:</span>
                      <span className="ml-1 text-purple-600 dark:text-purple-400 font-semibold">
                        {room.grade}
                      </span>
                    </div>
                )}
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  <span className="font-medium">Peserta Aktif:</span>
                  <span
                    className="ml-1 text-orange-600 dark:text-orange-400 font-semibold"
                    suppressHydrationWarning
                  >
                    {isClient
                      ? room.participants?.toLocaleString()
                      : room.participants}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                href={`/forum/${room.subject ?? "general"}${
                  room.classId ? "/" + room.classId : ""
                }`.toLowerCase()}
                className="block w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl text-center transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                💬 Masuk Diskusi
              </Link>
              <StreamVideoButton
                callId={room.callId}
                roomName={room.name}
                userId={session?.userId || "guest_user"}
                userName={session?.name || "Guest"}
                className="block w-full rounded-2xl py-4"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}