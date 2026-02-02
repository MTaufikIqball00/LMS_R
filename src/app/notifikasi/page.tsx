import Link from "next/link";

const NotifikasiPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Fitur Dibatasi
        </h1>
        <p className="text-gray-600 mb-6">
          Fitur ini hanya tersedia untuk pengguna di Jawa Barat atau pengguna
          berlangganan.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotifikasiPage;