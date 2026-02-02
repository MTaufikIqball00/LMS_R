"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function VerifikasiLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nohp, setNohp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Data ini seharusnya datang dari server setelah login,
  // tapi untuk sekarang kita tetap gunakan hardcoded sebagai placeholder.
  const namaSekolah = "SMAN 1 Bandung Contoh";
  const nisn = "1234567890";

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/verifikasi-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, nohp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Verifikasi berhasil, arahkan ke dashboard yang sesuai
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const redirectUrl =
          user?.role === "teacher"
            ? "/teacher/dashboard"
            : user?.role === "kepala_sekolah"
            ? "/kepala/dashboard"
            : user?.role === "admin_sekolah"
            ? "/admin-sekolah/dashboard"
            : "/dashboard";
        router.push(redirectUrl);
      } else {
        // Tampilkan pesan error dari server
        setError(data.message || "Verifikasi gagal. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Verification fetch error:", err);
      setError("Terjadi kesalahan. Periksa koneksi Anda dan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-12 bg-blue-50">
          <Image
            src="/assets/ilustrasiUpdate.png"
            alt="Ilustrasi Verifikasi"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Satu Langkah Lagi
            </h1>
            <p className="text-gray-600 mb-8">
              Lengkapi data di bawah untuk memverifikasi akun Anda.
            </p>

            <form onSubmit={handleVerification} className="flex flex-col gap-4">
              {/* Read-only fields */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  value={namaSekolah}
                  readOnly
                  className="w-full mt-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  NISN
                </label>
                <input
                  type="text"
                  value={nisn}
                  readOnly
                  className="w-full mt-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>

              <hr className="my-2" />

              {/* Editable fields */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Alamat Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="nohp"
                  className="text-sm font-medium text-gray-700"
                >
                  Nomor HP
                </label>
                <input
                  id="nohp"
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={nohp}
                  onChange={(e) => setNohp(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memverifikasi..." : "Verifikasi & Lanjutkan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
