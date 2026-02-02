"use client";

import { useRouter } from "next/navigation";
import type { SVGProps } from "react";

const ArrowRightOnRectangleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 17l5-5-5-5v10z"
    />
  </svg>
);

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (response.ok) {
      // Redirect to login page after successful logout and refresh the state
      router.push("/login");
      router.refresh();
    } else {
      // Handle logout error if needed
      console.error("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <ArrowRightOnRectangleIcon className="w-6" />
      <div className="hidden md:block">Sign Out</div>
    </button>
  );
}
