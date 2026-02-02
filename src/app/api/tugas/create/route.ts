import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import { assignments, AssignmentType, AssignmentPriority } from "../store";
import { z } from "zod";

const createAssignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  type: z.enum(["essay", "quiz", "project", "presentation"]),
  priority: z.enum(["high", "medium", "low"]),
  points: z.coerce.number().min(0, "Points must be a positive number"),
  dueDate: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "teacher") {
      return NextResponse.json(
        { error: "Forbidden: Only teachers can create assignments." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = createAssignmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { title, description, subject, type, priority, points, dueDate } =
      validation.data;
    const id = `task-${Date.now().toString(36)}`;

    const newAssignment = {
      id,
      teacherId: session.userId,
      title,
      description: description || "",
      subject,
      type,
      priority,
      points,
      createdAt: new Date().toISOString(),
      dueDate,
      className: "Unknown Class", // Default value
      status: "Aktif",
      submissions: 0,
      totalStudents: 0,
    };

    assignments.set(id, newAssignment);

    console.log(
      `✅ Assignment created by ${session.name} (ID: ${session.userId})`
    );

    return NextResponse.json(
      { success: true, assignment: newAssignment },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating assignment:", err);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
