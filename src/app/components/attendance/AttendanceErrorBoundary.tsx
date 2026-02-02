// components/AttendanceErrorBoundary.tsx
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class AttendanceErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AttendanceProvider error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="mb-6">
              <svg
                className="w-24 h-24 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Attendance System Error
            </h2>

            <p className="text-red-600 mb-6 leading-relaxed">
              There was an issue loading the attendance system. This could be
              due to a network problem or system maintenance.
            </p>

            {/* ✅ Show error details in development */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-red-700 font-medium mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs bg-red-100 p-3 rounded border overflow-auto">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AttendanceErrorBoundary;
