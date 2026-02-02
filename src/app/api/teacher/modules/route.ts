import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import { modules, Module } from "./store";
import crypto from "crypto";

// GET all modules for the logged-in teacher
export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const allModules = Array.from(modules.values());
  const teacherModules = allModules.filter(
    (module) => module.teacherId === session.userId
  );

  teacherModules.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(teacherModules);
}

import { z } from "zod";

// Define the schema for creating a module
const createModuleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["video_link", "file"]),
  contentUrl: z.string().url("A valid URL for the content is required."),
  fileName: z.string().optional(),
  fileType: z.string().optional(),
  subject: z.string().optional(),
  grade: z.string().optional(),
  duration: z.number().optional(),
  fileSize: z.number().optional(),
});

// POST a new module
export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const json = await request.json();
    const parseResult = createModuleSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data.",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, description, type, contentUrl, fileName, fileType } =
      parseResult.data;

    const newModule: Module = {
      id: `mod-${crypto.randomBytes(4).toString("hex")}`,
      teacherId: session.userId,
      title,
      description,
      type,
      contentUrl,
      fileName,
      fileType,
      createdAt: new Date().toISOString(),
    };

    modules.set(newModule.id, newModule);

    return NextResponse.json(
      { success: true, message: "Module created", module: newModule },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating module:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
