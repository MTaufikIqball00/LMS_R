import "server-only"; // Ensures this code only runs on the server

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export interface UserSession {
  userId: string;
  role: "student" | "teacher" | "admin_langganan" | "kepala_sekolah" | "admin_sekolah";
  name: string;
  iat: number;
  exp: number;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    console.error("JWT_SECRET_KEY is not set in environment variables.");
    // In a real app, you'd want to handle this more gracefully
    // For now, we'll prevent login/session validation from working.
    return null;
  }

  try {
    const { payload } = await jwtVerify<UserSession>(
      token,
      new TextEncoder().encode(secret),
      {
        algorithms: ["HS256"],
      }
    );

    // The payload is the user session
    return payload;
  } catch (error) {
    // This can happen if the token is invalid, expired, etc.
    console.error("JWT Verification failed:", error);
    return null;
  }
}

export async function getJwtToken(): Promise<string | undefined> {
  return (await cookies()).get("auth_token")?.value;
}
