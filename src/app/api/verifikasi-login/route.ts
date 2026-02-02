import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, nohp } = await request.json();

  // In a real application, you would validate the email and phone number
  // against a database record. For this mock, we'll just check if they exist.
  if (email && nohp) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { success: false, message: "Email and No. HP are required." },
      { status: 400 }
    );
  }
}