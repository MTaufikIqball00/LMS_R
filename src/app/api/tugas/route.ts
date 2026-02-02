import { NextResponse } from "next/server";
import { getSession } from "../../../lib/auth/session";
import { assignments, submissions } from "./store";

// API endpoint for students to get all available assignments
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      // Even for public data, we might want to ensure user is logged in
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allAssignments = Array.from(assignments.values());
    const allSubmissions = Array.from(submissions.values());

    // Map assignments and include submission status for the current user
    const assignmentsWithStatus = allAssignments.map((asm) => {
      const submission = allSubmissions.find(
        (sub) => sub.taskId === asm.id && sub.userId === session.userId
      );
      return {
        ...asm,
        status: submission
          ? submission.grade !== null
            ? "graded"
            : "submitted"
          : "pending",
        grade: submission?.grade || null,
      };
    });

    return NextResponse.json(assignmentsWithStatus);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
