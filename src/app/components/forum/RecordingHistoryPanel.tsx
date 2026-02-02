"use client";

import React, { useState, useEffect } from "react";
import { useCall } from "@stream-io/video-react-sdk";

interface Recording {
  filename: string;
  url: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
}

interface CallRecording {
  filename: string;
  url: string;
  start_time: string;
  end_time: string;
}

export default function RecordingHistoryPanel() {
  const call = useCall();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const calculateDuration = (startTime: string, endTime: string): number => {
    try {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      return Math.max(0, Math.floor((end - start) / 1000)); // dalam detik
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 0;
    }
  };

  const mapCallRecordings = (apiRecordings: CallRecording[]): Recording[] => {
    return apiRecordings.map((recording) => ({
      ...recording,
      duration_seconds: calculateDuration(
        recording.start_time,
        recording.end_time
      ),
    }));
  };

  const fetchRecordings = async () => {
    if (!call) return;

    setLoading(true);
    try {
      const response = await call.queryRecordings();
      const apiRecordings = response.recordings || [];

      // ✅ Map response untuk menambah duration_seconds
      const processedRecordings = mapCallRecordings(apiRecordings);
      setRecordings(processedRecordings); // ✅ No error sekarang!
    } catch (error) {
      console.error("Failed to fetch recordings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, [call]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadRecording = (recording: Recording) => {
    const link = document.createElement("a");
    link.href = recording.url;
    link.download = recording.filename;
    link.click();
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
        isMinimized ? "w-12" : "w-80"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isMinimized && (
          <>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
              🎬 Recordings ({recordings.length})
            </h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
          </>
        )}

        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors mx-auto"
          >
            <div className="relative">
              <svg
                className="w-5 h-5 text-gray-500"
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
              {recordings.length > 0 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {recordings.length}
                </div>
              )}
            </div>
          </button>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Refresh Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={fetchRecordings}
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "🔄 Refresh Recordings"}
            </button>
          </div>

          {/* Recordings List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-40">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading recordings...
                </p>
              </div>
            ) : recordings.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="text-3xl mb-2">🎬</div>
                <p className="text-sm">No recordings yet</p>
                <p className="text-xs">Start recording to see files here</p>
              </div>
            ) : (
              recordings.map((recording, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      Recording #{index + 1}
                    </h4>
                    <button
                      onClick={() => downloadRecording(recording)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Download Recording"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <p>📅 {formatDate(recording.start_time)}</p>
                    <p>
                      ⏱️ Duration: {formatDuration(recording.duration_seconds)}
                    </p>
                    <p className="truncate">📄 {recording.filename}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {recordings.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Total: {recordings.length} recording
                {recordings.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
