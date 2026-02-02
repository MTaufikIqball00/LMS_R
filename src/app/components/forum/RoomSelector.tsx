"use client";

import { useState } from "react";
import Link from "next/link";

type Room = {
  id: string;
  name: string;
  subject?: string;
  classId?: string;
  callId?: string;
  participants?: number;
  isActive?: boolean;
};

const rooms: Room[] = [
  {
    id: "general",
    name: "Forum Umum",
    callId: "general-meeting",
    participants: 127,
    isActive: true,
  },
  {
    id: "matematika",
    subject: "Matematika",
    name: "Matematika Semua Kelas",
    callId: "matematika-all-classes",
    participants: 45,
    isActive: true,
  },
  {
    id: "informatika", // ✅ Perbaiki id
    subject: "Informatika", // ✅ Perbaiki subject
    name: "Informatika Kelas 10 IPA-1", // ✅ Perbaiki name
    callId: "informatika-10-ipa-1", // ✅ Gunakan callId
    participants: 28,
    isActive: false,
  },
  {
    id: "fisika",
    subject: "Fisika",
    name: "Fisika Semua Kelas",
    callId: "fisika-all-classes",
    participants: 32,
    isActive: true,
  },
];

export default function RoomSelector() {
  const [filter, setFilter] = useState<string>("all");

  const filteredRooms =
    filter === "all"
      ? rooms
      : rooms.filter(
          (r) => r.subject === filter || (filter === "general" && !r.subject)
        );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">Pilih Ruang Diskusi / Zoom</h2>

      <div className="flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="all">Semua</option>
          <option value="general">Umum</option>
          <option value="Matematika">Matematika</option>
          <option value="Fisika">Fisika</option>
          {/* Tambah opsi lainnya */}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="p-4 border rounded bg-white dark:bg-gray-800 shadow group hover:shadow-lg transition"
          >
            <h3 className="font-semibold mb-2">{room.name}</h3>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              {room.subject && `Mata Pelajaran: ${room.subject} `}
              {room.classId && `(Kelas: ${room.classId})`}
              {!room.subject && !room.classId && "Diskusi dan Zoom umum"}
            </p>

            <div className="flex gap-3">
              <Link
                href={`/forum/${room.subject || "general"}/${
                  room.classId || ""
                }`.replace(/\/$/, "")}
                className="flex-1 text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Masuk Diskusi
              </Link>
              {room.callId && (
                <a
                  href={room.callId}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Join Zoom
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
