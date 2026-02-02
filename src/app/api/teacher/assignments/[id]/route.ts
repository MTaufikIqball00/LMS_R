import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth/session";
import { assignments } from "../../../tugas/store";

// ✅ FIXED: Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{
    id: string; // assignmentId
  }>;
}

// GET a specific assignment by its ID
// ✅ FIXED: Updated parameter structure and added await for params
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  // ✅ FIXED: Await the params Promise
  const { id: assignmentId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const assignment = assignments.get(assignmentId);

  if (!assignment) {
    return NextResponse.json(
      { success: false, message: "Assignment not found" },
      { status: 404 }
    );
  }

  // Security check: Ensure the teacher owns the assignment
  if (assignment.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json(assignment);
}

import { z } from "zod";

const updateAssignmentSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  subject: z.string().optional(),
  className: z.string().optional(),
  dueDate: z.string().optional(),
});

// ✅ FIXED: If you have other HTTP methods, update them too
export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: assignmentId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const existingAssignment = assignments.get(assignmentId);
  if (!existingAssignment || existingAssignment.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Assignment not found or access denied" },
      { status: 404 }
    );
  }

  try {
    const json = await request.json();
    const parseResult = updateAssignmentSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedAssignment = { ...existingAssignment, ...parseResult.data };
    assignments.set(assignmentId, updatedAssignment);

    return NextResponse.json({ success: true, message: "Assignment updated", assignment: updatedAssignment });

  } catch (error) {
    return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: assignmentId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const assignment = assignments.get(assignmentId);

  if (!assignment) {
    return NextResponse.json(
      { success: false, message: "Assignment not found" },
      { status: 404 }
    );
  }

  if (assignment.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  if (assignments.delete(assignmentId)) {
    return NextResponse.json({ success: true, message: "Assignment deleted" });
  } else {
    return NextResponse.json(
      { success: false, message: "Failed to delete assignment" },
      { status: 500 }
    );
  }
}
