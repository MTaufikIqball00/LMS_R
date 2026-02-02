import { NextResponse } from "next/server";

let messages: any[] = [
  {
    id: "1001",
    threadId: "1",
    author: "Andi Siswa",
    content: "Bagaimana cara cepat menghitung determinan?",
    createdAt: "2025-09-11T08:05:00Z",
  },
];

// GET /api/forum/messages?threadId=1
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get("threadId");
  const filtered = messages.filter((m) => m.threadId === threadId);
  return NextResponse.json(filtered);
}

// POST /api/forum/messages
export async function POST(request: Request) {
  const data = await request.json();
  const newMessage = {
    ...data,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };
  messages.push(newMessage);
  return NextResponse.json(newMessage, { status: 201 });
}
