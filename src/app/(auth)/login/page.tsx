"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (response.ok && responseData.success && responseData.user) {
        localStorage.setItem("user", JSON.stringify(responseData.user));

        // Role-based redirection
        const user = responseData.user;
        if (user.role === "student") {
          router.push("/verifikasi-login");
        } else if (user.role === "teacher") {
          router.push("/teacher/dashboard");
        } else if (user.role === "admin_langganan") {
          router.push("/admin/langganan");
        } else if (user.role === "kepala_sekolah") {
          router.push("/kepala/dashboard");
        } else if (user.role === "admin_sekolah") {
          router.push("/admin-sekolah/dashboard");
        } else {
          router.push("/dashboard"); // Fallback
        }
      } else {
        setServerError(
          responseData.message ||
            "Login gagal. Periksa kembali email dan password Anda."
        );
      }
    } catch (error) {
      setServerError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 relative">
      {/* Background pattern ala disdik */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* SVG blob atau pattern sederhana */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1600 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
        >
          <ellipse
            cx="200"
            cy="700"
            rx="350"
            ry="250"
            fill="#4274F1"
            fillOpacity="0.2"
          />
          <ellipse
            cx="1300"
            cy="200"
            rx="300"
            ry="170"
            fill="#90B3F8"
            fillOpacity="0.2"
          />
        </svg>
      </div>

      {/* Form card yang lebih modern */}
      <div className="relative z-10 w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-xl flex flex-col items-center space-y-6">
        {/* Logo, bisa pakai Image jika ada */}
        <div className="mb-4 flex flex-col items-center">
          <Image
            src="/assets/logo.png"
            alt="Logo Disdik Jabar"
            width={60}
            height={60}
          />
          <span className="mt-2 text-2xl font-extrabold text-blue-700">
            disdik <span className="text-blue-400">jabar</span>
          </span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col space-y-4"
        >
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="Email"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email ? "border-red-400" : "border-gray-300"
            } bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <input
            {...register("password")}
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.password ? "border-red-400" : "border-gray-300"
            } bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
            disabled={isSubmitting}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          {serverError && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded-md text-center text-sm">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "LOGIN"}
          </button>
        </form>

        <Link
          href="/forgot-password"
          className="text-blue-500 hover:underline text-sm mt-2"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
