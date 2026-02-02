import Sidebar from "../components/sidebar";

export default function AdminSekolahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-60 flex flex-col">
        <header className="w-full bg-transparent my-1.5 px-6">
          <div className="w-full rounded-md shadow-md bg-gradient-to-r from-[#2366d1] to-[#57a6ff] px-8 py-5 flex items-center justify-between">
            <a href="/" className="font-bold text-white text-2xl tracking-wide">
              Admin Sekolah Panel
            </a>
          </div>
        </header>

        <main className="flex-grow px-6">{children}</main>
      </div>
    </div>
  );
}
