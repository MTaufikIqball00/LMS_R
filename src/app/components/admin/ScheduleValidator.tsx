// components/admin/ScheduleValidator.tsx
"use client";

import { useState, useEffect } from "react";
import { validateScheduleSync } from "../utils/scheduleSync";

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

export default function ScheduleValidator() {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: false,
    issues: [],
    suggestions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runValidation = async () => {
      setIsLoading(true);
      try {
        const result = validateScheduleSync();
        setValidation(result);
      } catch (error) {
        console.error("Validation error:", error);
        setValidation({
          isValid: false,
          issues: ["Error during validation"],
          suggestions: ["Check console for details"],
        });
      } finally {
        setIsLoading(false);
      }
    };

    runValidation();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">
            Validating schedule synchronization...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-4 h-4 rounded-full ${
            validation.isValid ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <h3 className="font-bold text-lg">Schedule Synchronization Status</h3>
      </div>

      {validation.isValid ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-800 font-medium">
              All systems synchronized
            </span>
          </div>
          <p className="text-green-700 text-sm">
            Dashboard mata pelajaran dan jadwal pelajaran sudah tersinkronisasi
            dengan sempurna. Semua mata pelajaran di dashboard memiliki jadwal
            yang sesuai.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Issues */}
          {validation.issues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-800 font-medium">
                  Issues Found ({validation.issues.length})
                </span>
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {validation.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {validation.suggestions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-yellow-800 font-medium">
                  Suggestions ({validation.suggestions.length})
                </span>
              </div>
              <ul className="text-yellow-700 text-sm space-y-1">
                {validation.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500">→</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          Re-validate
        </button>
        <button
          onClick={() => {
            const report = {
              timestamp: new Date().toISOString(),
              isValid: validation.isValid,
              issues: validation.issues,
              suggestions: validation.suggestions,
            };
            console.log("Validation Report:", report);
            alert("Validation report logged to console");
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}
