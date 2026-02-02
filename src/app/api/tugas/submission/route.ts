import { NextResponse } from "next/server";
import { submissions } from "../store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Submission ID is missing", code: "BAD_REQUEST" },
      },
      { status: 400 }
    );
  }

  const s = submissions.get(id);
  if (!s) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: `Submission with ID ${id} not found`,
          code: "NOT_FOUND",
        },
      },
      { status: 404 }
    );
  }

  // do not return raw binary data to client (for demo we omit it)
  const { data, ...meta } = s;
  return NextResponse.json({ success: true, data: { submission: meta } });
}
