// utils/stream.ts
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const getStreamClient = (user: User, token: string) => {
  return new StreamVideoClient({
    apiKey,
    user,
    token,
  });
};

export const generateCallId = (roomType: string, roomId?: string) => {
  const timestamp = Date.now();
  return roomId
    ? `${roomType}-${roomId}-${timestamp}`
    : `${roomType}-${timestamp}`;
};

// Function untuk mendapatkan token dari API
export const generateStreamToken = async (userId: string): Promise<string> => {
  try {
    console.log("🔑 Generating token for user:", userId);

    const response = await fetch("/api/stream/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    console.log("📡 Token API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Token API error response:", errorText);
      throw new Error(
        `Failed to generate token: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ Token generated successfully");
    return data.token;
  } catch (error) {
    console.error("❌ Error generating token:", error);
    throw error;
  }
};
