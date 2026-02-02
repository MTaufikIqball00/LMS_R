"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { generateStreamToken } from "../utils/stream";
import ScreenShareButton from "./ScreenShareButton";
import ScreenShareView from "./ScreenShareView";
import VideoChatPanel from "./VideoChatPanel";
import HandRaisePanel from "./HandRaisePanel";
import HandRaiseButton from "./HandRaiseButton";
import CallRecordingButton from "./CallRecordingButton";
import RecordingIndicator from "./RecordingIndicator";
import RecordingHistoryPanel from "./RecordingHistoryPanel";

interface StreamVideoModalProps {
  open: boolean;
  onClose: () => void;
  callId: string;
  roomName?: string;
  userId: string;
  userName: string;
}

const VideoCallUI = ({
  onClose,
  roomName,
}: {
  onClose: () => void;
  roomName?: string;
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ✅ Fullscreen API Integration
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await document.exitFullscreen();
      } else {
        const element = document.querySelector(".forum-container");
        if (element) {
          await element.requestFullscreen();
        }
      }
    } catch (error) {
      console.error("Fullscreen toggle failed:", error);
    }
  };

  // Loading States - Same as before
  if (callingState === CallingState.JOINING) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-500/30 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500 mx-auto absolute top-2 left-1/2 transform -translate-x-1/2 animate-reverse-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Connecting to Meeting
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
      <div className="flex items-center justify-center h-full min-h-[600px] bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-3xl">
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
          <div className="text-6xl mb-6">👋</div>
          <h3 className="text-3xl font-bold text-white mb-4">Meeting Ended</h3>
          <p className="text-gray-300 text-lg mb-6">
            Thanks for joining {roomName || "the meeting"}!
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
      <div className="flex items-center justify-center h-full min-h-[600px] bg-gradient-to-br from-red-900 via-slate-800 to-red-900 rounded-3xl">
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
          <div className="text-6xl mb-6">⚠️</div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Connection Failed
          </h3>
          <p className="text-red-300 text-lg mb-6">
            Unable to join the meeting. Please try again.
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
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Return to Forum
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`forum-container h-full flex bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 ${
        isFullscreen ? "" : "rounded-3xl"
      } overflow-hidden relative`}
    >
      {/* Recording Indicator */}
      <RecordingIndicator />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      {/* Main Video Container */}
      <div
        className={`relative transition-all duration-500 ${
          showChat || showHandRaise || showRecordings ? "flex-1" : "w-full"
        }`}
      >
        {/* Top Status Bar - Enhanced */}
        <div className="absolute top-6 left-0 right-0 z-20 px-6">
          <div className="flex justify-between items-center">
            {/* Left Info */}
            <div className="flex items-center space-x-4">
              <div className="bg-black/40 backdrop-blur-xl text-white px-4 py-3 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="font-semibold">
                    🎥 {roomName || "Live Meeting"}
                  </span>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl text-white px-4 py-3 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="font-bold text-lg">{participantCount}</span>
                  <span className="text-sm opacity-80">participants</span>
                </div>
              </div>

              {/* Recording Status */}
              {isRecording && (
                <div className="bg-red-500/90 backdrop-blur-xl text-white px-4 py-3 rounded-2xl border border-red-400/20 animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                    <span className="font-bold">🎬 RECORDING</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Info */}
            <div className="flex items-center space-x-4">
              <div className="bg-black/40 backdrop-blur-xl text-white px-4 py-3 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {localParticipant?.name?.[0]?.toUpperCase() || "Y"}
                  </div>
                  <span className="font-semibold">
                    {localParticipant?.name || "You"}
                  </span>
                </div>
              </div>

              {/* ✅ Enhanced Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className={`bg-black/40 backdrop-blur-xl text-white p-3 rounded-2xl border border-white/10 hover:bg-black/60 transition-all duration-300 group ${
                  isFullscreen ? "bg-green-500/20 border-green-400/30" : ""
                }`}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isFullscreen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  )}
                </svg>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="bg-red-500/20 hover:bg-red-500/40 text-white p-3 rounded-2xl transition-all duration-300 group border border-red-500/30"
              >
                <svg
                  className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
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
        </div>

        {/* Video Content Area - Responsive Height */}
        <div
          className={`h-full pt-24 pb-32 px-6 ${
            isFullscreen ? "pt-20 pb-20" : ""
          }`}
        >
          <div className="h-full bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden relative">
            {hasOngoingScreenShare ? (
              <ScreenShareView />
            ) : (
              <SpeakerLayout participantsBarPosition="bottom" />
            )}

            {/* Screen Share Indicator */}
            {hasOngoingScreenShare && (
              <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>🖥️ Presentation Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Control Panel */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
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

              {/* Hand Raise Toggle */}
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
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 113 0v1m0 0V11m0-5.5a1.5 1.5 0 113 0v3"
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

      {/* Side Panels - Same as before */}
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

// Main Modal Component
export default function StreamVideoModal({
  open,
  onClose,
  callId,
  roomName,
  userId,
  userName,
}: StreamVideoModalProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeStream = useCallback(async () => {
    if (!open || client) return;

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
      console.error("Failed to initialize Stream:", error);
      setError("Failed to connect to video service. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [open, userId, userName, client, callId]);

  useEffect(() => {
    if (open) {
      initializeStream();
    }
  }, [open, initializeStream]);

  useEffect(() => {
    return () => {
      if (call) {
        call.leave();
        setCall(null);
      }
      if (client) {
        client.disconnectUser();
        setClient(null);
      }
    };
  }, [call, client]);

  const handleClose = useCallback(() => {
    if (call) {
      call.leave();
      setCall(null);
    }
    if (client) {
      client.disconnectUser();
      setClient(null);
    }
    setError(null);
    onClose();
  }, [call, client, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* ✅ Enhanced Modal - Now supports near-fullscreen */}
      <div className="w-full h-full max-w-[98vw] max-h-[98vh] bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Compact Header */}
        <div className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {roomName || `Meeting ${callId}`}
              </h2>
              <p className="text-blue-300 text-xs">
                ✨ Advanced Video Conferencing • Full Features
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-300 group"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
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

        {/* Content Area - Full Height */}
        <div className="flex-1 h-[calc(100%-72px)]">
          {loading && (
            <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-blue-500/30 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Initializing Video Call
                </h3>
                <p className="text-blue-300">
                  Setting up your premium experience...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="h-full bg-gradient-to-br from-red-900 via-slate-800 to-red-900 flex items-center justify-center">
              <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl">
                <div className="text-6xl mb-6">🚨</div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Connection Error
                </h3>
                <p className="text-red-300 mb-6 text-lg">{error}</p>
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={() => {
                      setError(null);
                      initializeStream();
                    }}
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
                <VideoCallUI onClose={handleClose} roomName={roomName} />
              </StreamCall>
            </StreamVideo>
          )}
        </div>
      </div>
    </div>
  );
}
