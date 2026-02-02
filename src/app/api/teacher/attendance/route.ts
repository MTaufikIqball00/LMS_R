import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import { attendanceRecords } from "../../attendance/store";

// GET all unverified attendance records for the logged-in teacher
export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const allRecords = Array.from(attendanceRecords.values());

  // Filter for records belonging to the teacher that are not yet validated
  const unverifiedRecords = allRecords.filter(
    (record) =>
      record.teacherId === session.userId && record.validatedBy === undefined
  );

  // Sort by date, newest first
  unverifiedRecords.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return NextResponse.json(unverifiedRecords);
}
