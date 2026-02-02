"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
  Call,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { generateStreamToken } from "../../../../components/utils/stream";
import ScreenShareButton from "../../../../components/forum/ScreenShareButton";
import ScreenShareView from "../../../../components/forum/ScreenShareView";
import VideoChatPanel from "../../../../components/forum/VideoChatPanel";
import HandRaisePanel from "../../../../components/forum/HandRaisePanel";
import HandRaiseButton from "../../../../components/forum/HandRaiseButton";
import CallRecordingButton from "../../../../components/forum/CallRecordingButton";
import RecordingIndicator from "../../../../components/forum/RecordingIndicator";
import RecordingHistoryPanel from "../../../../components/forum/RecordingHistoryPanel";

const VideoCallUI = ({
  onClose,
  roomName,
  subject,
}: {
  onClose: () => void;
  roomName: string;
  subject: string;
}) => {
  const {
    useCallCallingState,
    useParticipantCount,
    useLocalParticipant,
    useHasOngoingScreenShare,
    useIsCallRecordingInProgress,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const localParticipant = useLocalParticipant();
  const hasOngoingScreenShare = useHasOngoingScreenShare();
  const isRecording = useIsCallRecordingInProgress();

  const [showChat, setShowChat] = useState(false);
  const [showHandRaise, setShowHandRaise] = useState(false);
  const [showRecordings, setShowRecordings] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "whiteboard" | "notes">(
    "video"
  );

  // Loading state
  if (callingState === CallingState.JOINING) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-500/30 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500 mx-auto absolute top-2 left-1/2 transform -translate-x-1/2 animate-reverse-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Connecting to {roomName}
          </h3>
          <p className="text-blue-300 text-lg">
            Preparing your video experience...
          </p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (callingState === CallingState.LEFT) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
          <div className="text-6xl mb-6">👋</div>
          <h3 className="text-3xl font-bold text-white mb-4">Meeting Ended</h3>
          <p className="text-gray-300 text-lg mb-6">
            Thanks for joining {roomName}!
          </p>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Return to Forum
          </button>
        </div>
      </div>
    );
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-900 via-slate-800 to-red-900">
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
          <div className="text-6xl mb-6">⚠️</div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Connection Failed
          </h3>
          <p className="text-red-300 text-lg mb-6">
            Unable to join {roomName}. Please check your connection.
          </p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300"
            >
              Return to Forum
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative">
      {/* Recording Indicator - Global */}
      <RecordingIndicator />

      {/* Background Pattern - Same as Forum */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      {/* Main Video Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ${
          showChat || showHandRaise || showRecordings ? "" : "w-full"
        }`}
      >
        {/* Premium Header - Same Style as Forum */}
        <div className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              {/* Premium Subject Icon */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center text-3xl shadow-2xl transform hover:scale-105 transition-transform">
                  🎥
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Meeting Info */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
                  <span>{roomName}</span>
                  {isRecording && (
                    <span className="px-4 py-1 bg-red-500/90 text-sm rounded-full animate-pulse">
                      🎬 RECORDING
                    </span>
                  )}
                </h1>
                <p className="text-blue-300 text-lg">
                  Live Video Conference • Advanced Features Enabled
                </p>

                {/* Premium Stats - Same as Forum */}
                <div className="flex items-center mt-3 space-x-6 text-sm">
                  <span className="flex items-center text-emerald-400 font-semibold">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                    👥 {participantCount} participants
                  </span>
                  <span className="text-blue-300">🎯 Interactive Session</span>
                  <span className="text-purple-300">
                    🚀 Full Features Active
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="bg-red-500/20 hover:bg-red-500/40 text-white p-4 rounded-2xl transition-all duration-300 group border border-red-500/30"
            >
              <svg
                className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation - Same Style as Forum */}
        <div className="flex items-center space-x-2 p-6 border-b border-white/10">
          {[
            {
              id: "video",
              label: "🎥 Video Call",
              icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
            },
            {
              id: "whiteboard",
              label: "📝 Whiteboard",
              icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
            },
            {
              id: "notes",
              label: "📋 Notes",
              icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/25"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={tab.icon}
                />
              </svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Video Content Area - Full Height */}
        <div className="flex-1 p-6">
          {activeTab === "video" && (
            <div className="h-full bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden relative">
              {hasOngoingScreenShare ? (
                <ScreenShareView />
              ) : (
                <SpeakerLayout participantsBarPosition="bottom" />
              )}

              {/* Screen Share Indicator */}
              {hasOngoingScreenShare && (
                <div className="absolute top-6 left-6 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>🖥️ Presentation Mode Active</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "whiteboard" && (
            <div className="h-full bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold mb-2">
                  Interactive Whiteboard
                </h3>
                <p className="text-gray-300">
                  Collaborative drawing and notes coming soon!
                </p>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="h-full bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold mb-2">Meeting Notes</h3>
                <p className="text-gray-300">
                  Shared note-taking feature coming soon!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls - Enhanced */}
        <div className="p-6">
          <div className="flex justify-center">
            <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-2">
                {/* Core Controls */}
                <div className="flex items-center bg-white/10 rounded-2xl p-2">
                  <CallControls onLeave={onClose} />
                </div>

                <div className="w-px h-8 bg-white/20"></div>

                {/* Enhanced Controls */}
                <ScreenShareButton />
                <CallRecordingButton />

                {/* Chat Toggle */}
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`p-3 rounded-2xl transition-all duration-300 group ${
                    showChat
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>

                {/* Hand Raise Queue */}
                <button
                  onClick={() => setShowHandRaise(!showHandRaise)}
                  className={`p-3 rounded-2xl transition-all duration-300 group ${
                    showHandRaise
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/25"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 113 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3"
                    />
                  </svg>
                </button>

                <HandRaiseButton />

                {/* Recording History */}
                <button
                  onClick={() => setShowRecordings(!showRecordings)}
                  className={`p-3 rounded-2xl transition-all duration-300 group ${
                    showRecordings
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panels - Same Style as Forum */}
      {showChat && (
        <div className="w-96 bg-black/20 backdrop-blur-xl border-l border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">💬 Live Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <VideoChatPanel />
        </div>
      )}

      {showHandRaise && (
        <div className="w-96 bg-black/20 backdrop-blur-xl border-l border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                🙋 Speaking Queue
              </h3>
              <button
                onClick={() => setShowHandRaise(false)}
                className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <HandRaisePanel />
        </div>
      )}

      {showRecordings && (
        <div className="w-96 bg-black/20 backdrop-blur-xl border-l border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">🎬 Recordings</h3>
              <button
                onClick={() => setShowRecordings(false)}
                className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <RecordingHistoryPanel />
        </div>
      )}
    </div>
  );
};

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const callId = params.callId as string;

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get stored room and user info
  const [roomName, setRoomName] = useState("");
  const [subject, setSubject] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRoomName =
        localStorage.getItem(`room-${callId}`) || `Meeting ${callId}`;
      setRoomName(storedRoomName);
      setSubject(storedRoomName.split(" ")[0] || "General");

      const userDataString = localStorage.getItem(`user-${callId}`);
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          setUserId(userData.userId || "default_user");
          setUserName(userData.userName || "User");
        } catch (e) {
          console.error("Failed to parse user data:", e);
          setUserId("default_user");
          setUserName("User");
        }
      } else {
        setUserId("default_user");
        setUserName("User");
      }
    }
  }, [callId]);

  const initializeCall = useCallback(async () => {
    if (!callId || !userId || !userName) return;

    setLoading(true);
    setError(null);

    try {
      const token = await generateStreamToken(userId);

      const user = {
        id: userId,
        name: userName,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userName
        )}&background=0ea5e9&color=fff`,
      };

      const streamClient = new StreamVideoClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
        user,
        token,
      });

      setClient(streamClient);

      const newCall = streamClient.call("default", callId);
      await newCall.join({ create: true });
      setCall(newCall);
    } catch (error) {
      console.error("Failed to initialize call:", error);
      setError("Failed to connect to video service. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [callId, userId, userName]);

  useEffect(() => {
    if (userId && userName) {
      initializeCall();
    }
  }, [userId, userName, initializeCall]);

  useEffect(() => {
    return () => {
      // ✅ Check calling state before leaving
      if (call && call.state.callingState !== CallingState.LEFT) {
        call.leave().catch((error) => {
          // Ignore "already left" errors
          if (!error.message?.includes("already been left")) {
            console.error("Failed to leave call:", error);
          }
        });
        setCall(null);
      }

      if (client) {
        client.disconnectUser().catch((error) => {
          console.error("Failed to disconnect client:", error);
        });
        setClient(null);
      }
    };
  }, [call, client]);

  const handleClose = () => {
    if (call) {
      call.leave();
      setCall(null);
    }
    if (client) {
      client.disconnectUser();
      setClient(null);
    }
    router.back(); // Return to forum
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950">
      {/* Premium Breadcrumb */}
      <nav className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/forum"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Forums
          </Link>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link
            href={`/forum/${subject}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {subject}
          </Link>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium">
            Video Call
          </span>
        </div>
      </nav>

      {/* Main Content - Full Height */}
      <div className="h-[calc(100vh-120px)]">
        {loading && (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-blue-500/30 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Initializing Video Call
              </h3>
              <p className="text-blue-300">
                Setting up your premium meeting room...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-900 via-slate-800 to-red-900">
            <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl">
              <div className="text-6xl mb-6">🚨</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Connection Error
              </h3>
              <p className="text-red-300 mb-6">{error}</p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={initializeCall}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl font-semibold transition-all duration-300"
                >
                  Return to Forum
                </button>
              </div>
            </div>
          </div>
        )}

        {client && call && !loading && !error && (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <VideoCallUI
                onClose={handleClose}
                roomName={roomName}
                subject={subject}
              />
            </StreamCall>
          </StreamVideo>
        )}
      </div>
    </div>
  );
}
