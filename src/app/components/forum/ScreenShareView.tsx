"use client";

import React from "react";
import {
  useCallStateHooks,
  ParticipantView,
  hasScreenShare,
} from "@stream-io/video-react-sdk";

export default function ScreenShareView() {
  const { useParticipants, useHasOngoingScreenShare } = useCallStateHooks();
  const participants = useParticipants();
  const hasOngoingScreenShare = useHasOngoingScreenShare();

  if (!hasOngoingScreenShare) return null;

  // ✅ Gunakan helper function hasScreenShare dari SDK
  const screenShareParticipant = participants.find((participant) =>
    hasScreenShare(participant)
  );

  if (!screenShareParticipant) return null;

  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      {/* Screen Share Header */}
      <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span>
            📺 {screenShareParticipant.name || "Unknown"} is presenting
          </span>
        </div>
      </div>

      {/* Screen Share Content */}
      <div className="aspect-video bg-gray-900">
        <ParticipantView
          participant={screenShareParticipant}
          trackType="screenShareTrack" // ✅ Correct TrackType
          className="w-full h-full"
        />
      </div>

      {/* Normal Participants Grid */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {participants
          .filter((p) => !hasScreenShare(p)) // Exclude screen sharing participant
          .slice(0, 4)
          .map((participant) => (
            <div
              key={participant.sessionId}
              className="w-16 h-12 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20"
            >
              <ParticipantView
                participant={participant}
                trackType="videoTrack" // ✅ Correct TrackType
                className="w-full h-full object-cover"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
