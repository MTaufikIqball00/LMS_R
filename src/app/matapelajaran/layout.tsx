import Sidebar from "../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-60 flex flex-col">
        <header className="w-full bg-transparent my-1.5 px-6">
          <div className="w-full rounded-md shadow-md bg-gradient-to-r from-[#2366d1] to-[#57a6ff] px-8 py-5 flex items-center justify-between">
            <a
              href="/"
              className="font-bold text-white text-2xl tracking-wide drop-shadow-sm hover:text-blue-100 transition-colors duration-200"
            >
              Sistem Manajemen Pembelajaran
              <span className="ml-2 px-3 py-1 rounded-xl bg-white/20 text-sm font-semibold tracking-tight">
                "Jabar Istimewa"
              </span>
            </a>
          </div>
        </header>

        <main className="flex-grow px-6 ">{children}</main>
      </div>
    </div>
  );
}
