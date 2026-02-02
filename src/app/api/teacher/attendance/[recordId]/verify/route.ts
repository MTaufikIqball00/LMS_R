import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";
import { attendanceRecords } from "../../../../attendance/store";

// ✅ FIXED: Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{
    recordId: string;
  }>;
}

// ✅ FIXED: Updated parameter structure and added await for params
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  // ✅ FIXED: Await the params Promise
  const { recordId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const record = attendanceRecords.get(recordId);

  if (!record) {
    return NextResponse.json(
      { success: false, message: "Attendance record not found" },
      { status: 404 }
    );
  }

  // Security check: Ensure the teacher owns the record
  if (record.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  if (record.validatedBy) {
    return NextResponse.json(
      { success: false, message: "Record already validated" },
      { status: 400 }
    );
  }

  // Update the record to mark it as validated
  record.validatedBy = session.userId;
  record.validatedAt = new Date().toISOString();
  record.updatedAt = new Date().toISOString();

  attendanceRecords.set(recordId, record);

  return NextResponse.json({
    success: true,
    message: "Attendance verified successfully",
    record,
  });
}

// ✅ ADDED: If you need other HTTP methods, add them with the same pattern
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { recordId } = await context.params;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const record = attendanceRecords.get(recordId);

  if (!record) {
    return NextResponse.json(
      { success: false, message: "Attendance record not found" },
      { status: 404 }
    );
  }

  // Check access permissions based on role
  if (session.role === "teacher" && record.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  if (session.role === "student" && record.studentId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    record,
  });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { recordId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const record = attendanceRecords.get(recordId);

  if (!record) {
    return NextResponse.json(
      { success: false, message: "Attendance record not found" },
      { status: 404 }
    );
  }

  // Security check: Ensure the teacher owns the record
  if (record.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();

  // Update the record with new data
  const updatedRecord = {
    ...record,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  attendanceRecords.set(recordId, updatedRecord);

  return NextResponse.json({
    success: true,
    message: "Attendance record updated successfully",
    record: updatedRecord,
  });
}
