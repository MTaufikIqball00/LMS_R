// components/forum/VideoJoiner.tsx - ORIGINAL VERSION
"use client";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useState, useEffect } from "react";

interface VideoJoinerProps {
  user: {
    id: string;
    name: string;
    role: string;
  };
  apiKey: string;
  callId: string;
}

export default function VideoJoiner({
  user,
  apiKey,
  callId,
}: VideoJoinerProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/stream/token");
        if (!response.ok) {
          throw new Error("Gagal mendapatkan token otentikasi video.");
        }
        const { token } = await response.json();
        setToken(token);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchToken();
  }, [user.id]);

  useEffect(() => {
    if (!token || !apiKey || !user) return;

    try {
      const videoClient = new StreamVideoClient({
        apiKey,
        user: {
          id: user.id,
          name: user.name,
        },
        token,
      });
      setClient(videoClient);

      const callToJoin = videoClient.call("default", callId);
      callToJoin.join();
      setCall(callToJoin);

      setIsLoading(false);
    } catch (err: any) {
      setError("Gagal menginisialisasi atau bergabung ke ruang diskusi.");
      setIsLoading(false);
    }

    return () => {
      client?.disconnectUser();
      setClient(null);
    };
  }, [token, apiKey, user, callId]);

  if (isLoading) {
    return (
      <div className="mt-8 text-center">Bergabung ke ruang diskusi...</div>
    );
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">{error}</div>;
  }

  if (!client || !call) {
    return (
      <div className="mt-8 text-center">
        Gagal terhubung ke ruang diskusi. Pastikan ID sudah benar.
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="mt-8">
          <StreamTheme className="my-theme">
            <SpeakerLayout />
            <CallControls />
          </StreamTheme>
        </div>
      </StreamCall>
    </StreamVideo>
  );
}
