import { NextRequest, NextResponse } from "next/server";
import { getCourse } from "../store";

// ✅ FIXED: Updated for Next.js 15 - params is now Promise
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  // ✅ FIXED: Await the params Promise
  const { slug } = await context.params;
  const course = getCourse(slug);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}
