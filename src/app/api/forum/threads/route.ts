import { NextResponse } from "next/server";

let threads: any[] = [
  {
    id: "1",
    name: "Diskusi Matematika Kelas 10 IPA 1",
    subject: "Matematika",
    classId: "10-IPA-1",
    author: "Guru Matematika",
    createdAt: "2025-09-11T08:00:00Z",
    zoomLink: "https://zoom.us/j/1111111111",
  },
  {
    id: "2",
    name: "Forum Umum Semua Mata Pelajaran",
    author: "Admin",
    createdAt: "2025-09-11T08:00:00Z",
    zoomLink: "https://zoom.us/j/generalforum",
  },
];

// GET /api/forum/threads
export async function GET() {
  return NextResponse.json(threads);
}

// POST /api/forum/threads
export async function POST(request: Request) {
  const data = await request.json();
  const newThread = {
    ...data,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };
  threads.unshift(newThread);
  return NextResponse.json(newThread, { status: 201 });
}
