import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600 mb-6">
          Maaf, Halaman Yang Diminta Masih Dalam Tahap Pengembangan.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
