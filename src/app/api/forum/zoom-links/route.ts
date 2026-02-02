import { NextResponse } from "next/server";

// Simpan Zoom link per forumnya (key: threadId atau "general")
let zoomLinks: Record<string, string> = {
  "1": "https://zoom.us/j/1111111111",
  general: "https://zoom.us/j/generalforum",
};

// GET /api/forum/zoom-links?threadId=1
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get("threadId");
  return NextResponse.json({
    zoomLink: zoomLinks[threadId || "general"] || "",
  });
}

// POST /api/forum/zoom-links
export async function POST(req: Request) {
  const { threadId, zoomLink } = await req.json();
  zoomLinks[threadId || "general"] = zoomLink;
  return NextResponse.json({ success: true, zoomLink });
}
