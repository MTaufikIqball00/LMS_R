import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Proxy request ke backend Rust
    const backendResponse = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Email atau password salah"
        },
        { status: backendResponse.status }
      );
    }

    // Backend mengembalikan token, simpan di cookie
    const { token, id, name, role } = data;

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id,
        email,
        name,
        role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
