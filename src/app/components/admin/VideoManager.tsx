// components/admin/VideoManager.tsx - Complete Enhanced Version with Redirect
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
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation"; // ✅ Added for redirect
import crypto from "crypto";
import {
  FiVideo,
  FiVideoOff,
  FiMic,
  FiMicOff,
  FiUsers,
  FiShare2,
  FiCopy,
  FiPlay,
  FiMonitor,
  FiSettings,
  FiActivity,
  FiAlertCircle,
  FiCheck,
  FiPhoneCall,
  FiSquare,
  FiRefreshCw,
  FiArrowLeft,
} from "react-icons/fi";

interface VideoManagerProps {
  user: {
    id: string;
    name: string;
    role: string;
  };
  apiKey: string;
  onLeave?: () => void; // ✅ Optional callback untuk custom redirect
  redirectTo?: string; // ✅ Optional redirect path
}

export default function VideoManager({
  user,
  apiKey,
  onLeave,
  redirectTo = "/teacher/discussion", // ✅ Default redirect for teachers
}: VideoManagerProps) {
  const router = useRouter(); // ✅ Initialize router

  // States
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [callId, setCallId] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLeavingCall, setIsLeavingCall] = useState(false);

  // Memoize user configuration
  const userConfig = useMemo(
    () => ({
      id: user.id,
      name: user.name,
      role: user.role,
    }),
    [user.id, user.name, user.role]
  );

  // Fetch token using GET method (matching your API)
  const fetchToken = useCallback(async () => {
    try {
      setError(null);
      console.log("Fetching token...");

      const response = await fetch("/api/stream/token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Token response received:", {
        userId: data.userId || "from-session",
        hasToken: !!data.token,
        apiKey: data.apiKey,
      });

      if (!data.token) {
        throw new Error("Token tidak ditemukan dalam response");
      }

      setToken(data.token);
      return data.token;
    } catch (err: any) {
      console.error("Error fetching token:", err);

      let errorMessage = "Gagal mendapatkan token";
      if (err.message.includes("401")) {
        errorMessage = "Session tidak valid. Silakan login ulang.";
      } else if (err.message.includes("405")) {
        errorMessage = "API method tidak didukung";
      } else if (err.message.includes("500")) {
        errorMessage = "Server error saat generate token";
      } else {
        errorMessage = `Gagal mendapatkan token: ${err.message}`;
      }

      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  // Initialize video client
  const initializeClient = useCallback(
    async (tokenValue: string) => {
      if (!tokenValue || !apiKey || !userConfig.id) {
        setError("Konfigurasi tidak lengkap");
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        const videoClient = new StreamVideoClient({
          apiKey,
          user: {
            id: userConfig.id,
            name: userConfig.name,
          },
          token: tokenValue,
        });

        setClient(videoClient);
        setIsInitialized(true);
      } catch (err: any) {
        console.error("Error initializing video client:", err);
        setError(`Gagal menginisialisasi klien video: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, userConfig.id, userConfig.name]
  );

  // Initialize app
  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      const tokenValue = await fetchToken();
      if (tokenValue && isMounted) {
        await initializeClient(tokenValue);
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [fetchToken, initializeClient]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (client) {
        client.disconnectUser().catch((error) => {
          console.error("Error disconnecting user:", error);
        });
      }
    };
  }, [client]);

  // Create call
  const createCall = useCallback(async () => {
    if (!client || !isInitialized) {
      setError("Klien video belum siap");
      return;
    }

    try {
      setError(null);
      const newCallId = crypto.randomBytes(8).toString("hex");

      const newCall = client.call("default", newCallId);
      await newCall.join({ create: true });

      setCall(newCall);
      setCallId(newCallId);
      setIsLeavingCall(false);
    } catch (err: any) {
      console.error("Error creating call:", err);
      setError(`Gagal membuat call: ${err.message}`);
    }
  }, [client, isInitialized]);

  // Copy call ID
  const copyCallId = useCallback(async () => {
    if (!callId) return;

    try {
      await navigator.clipboard.writeText(callId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy call ID:", err);

      try {
        const textArea = document.createElement("textarea");
        textArea.value = callId;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        setError("Gagal menyalin ID call");
      }
    }
  }, [callId]);

  // ✅ Enhanced leave call with redirect
  // Di VideoManager.tsx - Update leaveCall function saja
  const leaveCall = useCallback(async () => {
    if (!call || isLeavingCall) {
      console.log("Call already left or in process of leaving");
      return;
    }

    // ✅ Confirm before leaving
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin keluar dari sesi video?"
    );
    if (!confirmed) return;

    try {
      setIsLeavingCall(true);
      console.log("Attempting to leave call...");

      // ✅ Check if call is still active before leaving
      const callState = call.state?.callingState;
      console.log("Call state before leave:", callState);

      if (callState === "joined" || callState === "joining") {
        await call.leave();
        console.log("✅ Successfully left the call");
      } else {
        console.log("Call is not in active state, skipping leave");
      }
    } catch (err: any) {
      console.error("Error leaving call:", err);

      // ✅ Only show error if it's not the expected "already left" error
      if (!err.message?.includes("already been left")) {
        setError(`Error saat keluar dari call: ${err.message}`);
      }
    } finally {
      // ✅ Always cleanup state
      setCall(null);
      setCallId("");
      setIsLeavingCall(false);
      console.log("Call state cleaned up");

      // ✅ Redirect after cleanup
      setTimeout(() => {
        if (onLeave) {
          onLeave();
        } else {
          console.log("Redirecting to:", redirectTo);
          router.push(redirectTo);
        }
      }, 100); // Small delay to ensure cleanup is complete
    }
  }, [call, isLeavingCall, onLeave, redirectTo, router]);

  // ✅ Manual back to forum function
  const backToForum = useCallback(() => {
    router.push(redirectTo);
  }, [router, redirectTo]);

  // Enhanced cleanup on unmount
  useEffect(() => {
    return () => {
      if (call && !isLeavingCall) {
        call.leave().catch((error: any) => {
          console.log("Cleanup: Call leave error (expected):", error.message);
        });
      }
    };
  }, [call, isLeavingCall]);

  // Retry initialization
  const retryInitialization = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setIsInitialized(false);
    setClient(null);
    setToken(null);
    setCall(null);
    setCallId("");
    setIsLeavingCall(false);

    fetchToken().then((tokenValue) => {
      if (tokenValue) {
        initializeClient(tokenValue);
      }
    });
  }, [fetchToken, initializeClient]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl p-12 shadow-2xl text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-4">
              Menyiapkan Video Conference
            </h2>
            <p className="text-slate-600">
              Sedang menginisialisasi sistem video call...
            </p>
            <div className="mt-6">
              <div className="text-sm text-slate-500">
                User: {userConfig.name} ({userConfig.role})
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl p-12 shadow-2xl text-center max-w-lg">
            <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              System Error
            </h2>
            <p className="text-red-600 font-medium mb-6 break-words">{error}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={retryInitialization}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors duration-200 flex items-center gap-2 justify-center"
              >
                <FiRefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                {isLoading ? "Mencoba lagi..." : "Coba Lagi"}
              </button>

              <button
                onClick={backToForum}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors duration-200 flex items-center gap-2"
              >
                <FiArrowLeft className="h-4 w-4" />
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Client not ready
  if (!client || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl p-12 shadow-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSettings className="h-10 w-10 text-orange-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Initializing
            </h2>
            <p className="text-slate-600 mb-4">
              Klien video sedang disiapkan...
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={retryInitialization}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
              >
                Coba Lagi
              </button>

              <button
                onClick={backToForum}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors duration-200 flex items-center gap-2"
              >
                <FiArrowLeft className="h-4 w-4" />
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Interface
  return (
    <StreamVideo client={client}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]"></div>
        </div>

        <div className="relative z-10 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-12">
            <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* ✅ Back button */}
                  <button
                    onClick={backToForum}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                    title="Kembali"
                  >
                    <FiArrowLeft className="h-6 w-6 text-slate-700" />
                  </button>

                  <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                    <FiVideo className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                      Video Conference
                    </h1>
                    <p className="text-lg text-slate-600 font-medium">
                      Ruang diskusi interaktif untuk pembelajaran virtual
                    </p>
                  </div>
                </div>

                {/* Enhanced leave button */}
                {call && (
                  <button
                    onClick={leaveCall}
                    disabled={isLeavingCall}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-xl transition-colors duration-200 flex items-center gap-2"
                  >
                    {isLeavingCall ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Keluar...
                      </>
                    ) : (
                      <>
                        <FiSquare className="h-4 w-4" />
                        Keluar & Kembali
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-4 mt-6 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userConfig.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {userConfig.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiUsers className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700 capitalize">
                    {userConfig.role}
                  </span>
                </div>
                {call && !isLeavingCall && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 backdrop-blur-sm rounded-xl border border-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-700">
                      Live
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {call ? (
            <StreamCall call={call}>
              {/* Call ID Display */}
              <div className="mb-8">
                <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl p-6 shadow-xl">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
                      <FiShare2 className="h-6 w-6 text-blue-600" />
                      ID Ruang Diskusi
                    </h3>
                    <div className="relative inline-block">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-mono text-2xl font-bold tracking-widest shadow-xl">
                        {callId.toUpperCase()}
                      </div>
                      <button
                        onClick={copyCallId}
                        className="absolute -top-3 -right-3 p-3 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                        title="Copy Call ID"
                      >
                        {copied ? (
                          <FiCheck className="h-5 w-5 text-green-600" />
                        ) : (
                          <FiCopy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-slate-600 mt-4">
                      Bagikan ID ini kepada siswa untuk bergabung dalam sesi
                    </p>
                    {copied && (
                      <p className="text-green-600 font-semibold mt-2 animate-pulse">
                        ✓ ID berhasil disalin!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Call Interface */}
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl overflow-hidden shadow-2xl">
                <StreamTheme className="modern-video-theme">
                  <div className="relative min-h-[500px]">
                    <SpeakerLayout />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="backdrop-blur-xl bg-white/80 border border-white/30 rounded-2xl p-4 shadow-xl">
                        <CallControls onLeave={leaveCall} />
                      </div>
                    </div>
                  </div>
                </StreamTheme>
              </div>

              {/* Call Info Panel */}
              <div className="mt-8">
                <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-6 shadow-xl">
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FiActivity className="h-5 w-5 text-blue-600" />
                    Status Sesi
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl border border-green-200/50">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-xs text-green-600 font-medium">
                          Status
                        </p>
                        <p className="text-sm font-bold text-green-800">
                          {isLeavingCall ? "Leaving..." : "Live"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl border border-blue-200/50">
                      <FiUsers className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-blue-600 font-medium">
                          Participants
                        </p>
                        <p className="text-sm font-bold text-blue-800">
                          {call?.state?.participantCount || 1} Online
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl border border-purple-200/50">
                      <FiMonitor className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-purple-600 font-medium">
                          Quality
                        </p>
                        <p className="text-sm font-bold text-purple-800">HD</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </StreamCall>
          ) : (
            /* Start Call Interface */
            <div className="max-w-2xl mx-auto">
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl p-12 shadow-2xl text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <FiPhoneCall className="h-16 w-16 text-blue-600" />
                </div>

                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-4">
                  Mulai Sesi Video Baru
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-12 max-w-md mx-auto">
                  Buat ruang diskusi virtual baru dan undang siswa untuk
                  bergabung dalam pembelajaran interaktif
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-gradient-to-r from-white/60 to-blue-50/60 rounded-2xl border border-white/40">
                    <FiVideo className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
                    <h4 className="font-bold text-slate-800 mb-2">HD Video</h4>
                    <p className="text-sm text-slate-600">
                      Kualitas video tinggi untuk pengalaman terbaik
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-white/60 to-emerald-50/60 rounded-2xl border border-white/40">
                    <FiUsers className="h-8 w-8 text-emerald-600 mb-4 mx-auto" />
                    <h4 className="font-bold text-slate-800 mb-2">
                      Multi-User
                    </h4>
                    <p className="text-sm text-slate-600">
                      Dukung banyak peserta dalam satu sesi
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-white/60 to-purple-50/60 rounded-2xl border border-white/40">
                    <FiMonitor className="h-8 w-8 text-purple-600 mb-4 mx-auto" />
                    <h4 className="font-bold text-slate-800 mb-2">
                      Screen Share
                    </h4>
                    <p className="text-sm text-slate-600">
                      Berbagi layar untuk presentasi yang efektif
                    </p>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={createCall}
                  disabled={isLoading || !isInitialized}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center gap-3">
                    <FiPlay className="h-6 w-6 transition-transform group-hover:scale-110 duration-300" />
                    <span className="text-xl">
                      {isLoading ? "Menyiapkan..." : "Mulai Ruang Diskusi"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Custom CSS */}
        <style jsx global>{`
          .modern-video-theme {
            --str-video__primary-color: #3b82f6;
            --str-video__secondary-color: #6366f1;
            --str-video__accent-color: #06b6d4;
            --str-video__surface-color: rgba(255, 255, 255, 0.9);
            --str-video__on-surface-color: #1e293b;
            --str-video__border-radius-lg: 1.5rem;
            --str-video__border-radius-md: 1rem;
          }

          .modern-video-theme .str-video__call-controls {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px);
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 1rem;
          }

          .modern-video-theme .str-video__participant-view {
            border-radius: 1.5rem;
            overflow: hidden;
          }

          .modern-video-theme .str-video__speaker-layout {
            gap: 1rem;
          }

          .modern-video-theme .str-video__call-controls button {
            border-radius: 0.75rem;
            transition: all 0.2s ease;
          }

          .modern-video-theme .str-video__call-controls button:hover {
            transform: scale(1.05);
          }
        `}</style>
      </div>
    </StreamVideo>
  );
}
