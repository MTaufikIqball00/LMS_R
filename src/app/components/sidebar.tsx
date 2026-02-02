"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { RESTRICTED_FEATURES_FOR_NON_JABAR } from "../../lib/constants/feature-restrictions";

// Define a type for the user data from localStorage
interface User {
  id: string;
  name: string;
  role: string;
  school?: {
    province: string;
  };
}

// Define menu item types
interface MenuItem {
  name: string;
  icon: string;
  href: string;
  badge?: string;
}

// Define menu structures for students
const studentMainMenu: MenuItem[] = [
  { name: "Dashboard", icon: "📊", href: "/dashboard" },
  { name: "Mata Pelajaran", icon: "📚", href: "/matapelajaran" },
  { name: "Tugas", icon: "📝", href: "/tugas" },
  { name: "Jadwal Pelajaran", icon: "📅", href: "/jadwal" },
  { name: "Nilai", icon: "📊", href: "/nilai" },
];

const studentSubMenu: MenuItem[] = [
  { name: "Absensi", icon: "🔔", href: "/attendance" },
  { name: "Forum Diskusi", icon: "💬", href: "/forum" },
  { name: "Try-Out", icon: "🎯", href: "/tryout" },
];

// Define menu structures for teachers
const teacherMainMenu: MenuItem[] = [
  { name: "Dashboard", icon: "👑", href: "/teacher/dashboard" },
  { name: "Manajemen Siswa", icon: "👥", href: "/teacher/students" },
  { name: "Manajemen Modul", icon: "📚", href: "/teacher/modules" },
  { name: "Manajemen Tugas", icon: "📝", href: "/teacher/assignment" },
  { name: "Manajemen Kuis", icon: "❓", href: "/teacher/quizzes" },
];

const teacherSubMenu: MenuItem[] = [
  { name: "Verifikasi Absensi", icon: "✅", href: "/teacher/attendance" },
  { name: "Diskusi Video", icon: "📹", href: "/teacher/discussion" },
];

// Define menu structures for school admin
const schoolAdminMainMenu: MenuItem[] = [
  { name: "Dashboard", icon: "🏢", href: "/admin/dashboard" },
  { name: "Manajemen Siswa", icon: "👥", href: "/admin/students" },
  { name: "Manajemen Guru", icon: "👨‍🏫", href: "/admin/teachers" },
  { name: "Status Langganan", icon: "💼", href: "/admin/subscription" },
  { name: "Laporan Sekolah", icon: "📈", href: "/admin/reports" },
];

const schoolAdminSubMenu: MenuItem[] = [
  { name: "Pengaturan Sekolah", icon: "⚙️", href: "/admin/settings" },
  { name: "Backup Data", icon: "💾", href: "/admin/backup" },
  { name: "Log Aktivitas", icon: "📑", href: "/admin/activity-logs" },
];

const superAdminMainMenu: MenuItem[] = [
  { name: "Dashboard Admin", icon: "🏠", href: "/admin/langganan" },
  {
    name: "Langganan Sekolah",
    icon: "💼",
    href: "/admin/langganan/subscriptions",
  },
  { name: "Manajemen Sekolah", icon: "🏫", href: "/admin/langganan/schools" },
  { name: "Pengguna & Admin", icon: "👥", href: "/admin/langganan/users" },
  { name: "Log Aktivitas", icon: "📑", href: "/admin/langganan/activity-logs" },
];

const headmasterMainMenu: MenuItem[] = [
  { name: "Dashboard Kepala", icon: "🧑‍🏫", href: "/kepala/dashboard" },
  { name: "Manajemen Guru", icon: "👨‍🏫", href: "/kepala/teachers" },
  { name: "Manajemen Murid", icon: "👥", href: "/kepala/students" },
  { name: "Leaderboard", icon: "🏆", href: "/kepala/leaderboard" },
];

const headmasterSubMenu: MenuItem[] = [
  { name: "Laporan Akademik", icon: "📊", href: "/kepala/academic-reports" },
];

const schoolAdminPanelMainMenu: MenuItem[] = [
  {
    name: "Dashboard Admin Sekolah",
    icon: "🏫",
    href: "/admin-sekolah/dashboard",
  },
  { name: "Manajemen Guru", icon: "👨‍🏫", href: "/admin-sekolah/teachers" },
  { name: "Manajemen Murid", icon: "👥", href: "/admin-sekolah/students" },
  {
    name: "Manajemen Kepala Sekolah",
    icon: "🧑‍💼",
    href: "/admin-sekolah/headmaster",
  },
];

const schoolAdminPanelSubMenu: MenuItem[] = [
  { name: "Pengaturan Sekolah", icon: "⚙️", href: "/admin-sekolah/settings" },
];

const superAdminSubMenu: MenuItem[] = [
  { name: "Paket & Harga", icon: "📦", href: "/admin/langganan/packages" },
  { name: "Pembayaran", icon: "💳", href: "/admin/langganan/payments" },
  { name: "Laporan Langganan", icon: "📊", href: "/admin/langganan/reports" },
];

const Sidebar = () => {
  const pathname = usePathname();

  // ✅ FIX: Initialize with null, load in useEffect
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  // ✅ FIX: Load user data only on client side
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as User);
      }
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    // Keep user in sync with localStorage if it changes elsewhere
    const handleStorage = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        else setUser(null);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const getMenuItems = () => {
    if (!user) {
      return { main: [], sub: [] };
    }

    const isNonJabar = user.school?.province !== "Jawa Barat";
    let mainMenus: MenuItem[] = [];
    let subMenus: MenuItem[] = [];

    switch (user.role) {
      case "teacher":
        mainMenus = [...teacherMainMenu];
        subMenus = [...teacherSubMenu];
        break;
      case "school_admin":
        mainMenus = [...schoolAdminMainMenu];
        subMenus = [...schoolAdminSubMenu];
        break;
      case "kepala_sekolah":
        mainMenus = [...headmasterMainMenu];
        subMenus = [...headmasterSubMenu];
        break;
      case "admin_sekolah":
        mainMenus = [...schoolAdminPanelMainMenu];
        subMenus = [...schoolAdminPanelSubMenu];
        break;
      case "admin_langganan":
        mainMenus = [...superAdminMainMenu];
        subMenus = [...superAdminSubMenu];
        break;
      default:
        mainMenus = [...studentMainMenu];
        subMenus = [...studentSubMenu];
        break;
    }

    if (isNonJabar && (user.role === "student" || user.role === "teacher")) {
      const restrictedHrefs =
        (RESTRICTED_FEATURES_FOR_NON_JABAR as Record<string, string[]>)[
        user.role
        ] || [];
      mainMenus = mainMenus.filter(
        (item) => !restrictedHrefs.includes(item.href)
      );
      subMenus = subMenus.filter(
        (item) => !restrictedHrefs.includes(item.href)
      );
    }

    return { main: mainMenus, sub: subMenus };
  };

  const { main: mainMenuItems, sub: subMenuItems } = getMenuItems();

  useEffect(() => {
    const { main, sub } = getMenuItems();
    const allItems = [...main, ...sub];
    const currentItem = allItems.find(
      (item) => item.href !== "#" && pathname.startsWith(item.href)
    );
    if (currentItem) {
      setActiveItem(currentItem.name);
    } else {
      setActiveItem("");
    }
  }, [pathname, user]);

  const handleMenuClick = (itemName: string) => {
    setActiveItem(itemName);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActive = activeItem === item.name;
    const isImplemented = item.href !== "#";

    const commonClasses = `w-full flex items-center px-4 py-2 mt-1 rounded-full transition-all duration-200 ease-in-out text-left focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-10`;
    const activeClasses = `bg-blue-800 text-white shadow-lg`;
    const inactiveClasses = `text-gray-200 hover:bg-white hover:text-black`;
    const disabledClasses = `text-gray-400 bg-gray-700/20 cursor-not-allowed`;

    if (!isImplemented) {
      return (
        <button disabled className={`${commonClasses} ${disabledClasses}`}>
          <span className="mr-3 flex-shrink-0 w-5 h-5 flex items-center justify-center text-lg">
            {item.icon}
          </span>
          <span className="whitespace-nowrap">{item.name}</span>
          <span className="ml-auto text-xs bg-gray-500/50 text-gray-300 rounded-full px-2 py-0.5">
            Soon
          </span>
        </button>
      );
    }

    return (
      <Link
        href={item.href}
        onClick={() => handleMenuClick(item.name)}
        className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses
          }`}
      >
        <span className="mr-3 flex-shrink-0 w-5 h-5 flex items-center justify-center text-lg">
          {item.icon}
        </span>
        <span className="whitespace-nowrap flex-1">{item.name}</span>
        {item.badge && (
          <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const renderMobileMenuItem = (item: MenuItem) => {
    const isActive = activeItem === item.name;
    const isImplemented = item.href !== "#";

    const commonClasses = `w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out text-left focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`;
    const activeClasses = `bg-blue-800 text-white shadow-lg`;
    const inactiveClasses = `text-gray-200 hover:bg-blue-800 hover:text-white`;
    const disabledClasses = `text-gray-400 bg-gray-700/20 cursor-not-allowed`;

    if (!isImplemented) {
      return (
        <button disabled className={`${commonClasses} ${disabledClasses}`}>
          <span className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center text-xl">
            {item.icon}
          </span>
          <span className="whitespace-nowrap">{item.name}</span>
          <span className="ml-auto text-xs bg-gray-500/50 text-gray-300 rounded-full px-2 py-0.5">
            Soon
          </span>
        </button>
      );
    }

    return (
      <Link
        href={item.href}
        onClick={() => handleMenuClick(item.name)}
        className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses
          }`}
      >
        <span className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center text-xl">
          {item.icon}
        </span>
        <span className="whitespace-nowrap flex-1">{item.name}</span>
        {item.badge && (
          <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const getBrandInfo = () => {
    switch (user?.role) {
      case "admin_langganan":
        return {
          logo: "/assets/logo.png",
          brandName: "Admin Langganan",
          welcomeText: "System Administrator",
        };
      case "school_admin":
        return {
          logo: "/assets/logo.png",
          brandName: "Admin Sekolah",
          welcomeText: "School Administrator",
        };
      case "teacher":
        return {
          logo: "/assets/logo.png",
          brandName: "Panel Guru",
          welcomeText: "Welcome Teacher",
        };
      default:
        return {
          logo: "/assets/logo.png",
          brandName: "Disdik Jabar",
          welcomeText: "Welcome back",
        };
    }
  };

  const brandInfo = getBrandInfo();

  // ✅ FIX: Show loading state during hydration
  if (!mounted) {
    return (
      <aside className="hidden lg:block w-64 bg-[#2366d1] text-white fixed h-full overflow-y-auto hide-scrollbar rounded-r-md z-30">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-white">Loading...</div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          type="button"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-[#2366d1] text-white fixed h-full overflow-y-auto hide-scrollbar rounded-r-md z-30">
        <div className="flex flex-col justify-between min-h-full">
          <div className="flex-1">
            <div className="p-6 flex items-start justify-baseline h-32 flex-shrink-0">
              <Image
                src={brandInfo.logo}
                alt="Logo Dinas Pendidikan"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>

            <nav className="mt-2 px-2">
              <div className="mb-4 px-2">
                <p className="text-xs text-gray-300 uppercase tracking-wide font-semibold">
                  Menu Utama
                </p>
              </div>

              <ul className="space-y-1">
                {mainMenuItems.map((item) => (
                  <li key={item.name}>{renderMenuItem(item)}</li>
                ))}
              </ul>

              <div className="border-t border-white/30 my-4 w-full"></div>

              <div className="mb-4 px-2">
                <p className="text-xs text-gray-300 uppercase tracking-wide font-semibold">
                  {user?.role === "admin_langganan"
                    ? "Manajemen Langganan"
                    : "Menu Tambahan"}
                </p>
              </div>

              <ul className="space-y-1">
                {subMenuItems.map((item) => (
                  <li key={item.name}>{renderMenuItem(item)}</li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex-shrink-0 px-6 py-4 bg-[#2366d1]">
            {user?.role === "admin_langganan" ? (
              <div className="w-full h-24 flex items-center justify-center mb-4">
                <div className="text-4xl">👨‍💼</div>
              </div>
            ) : (
              <div className="w-full h-24 flex items-center justify-center mb-4">
                <Image
                  src="/assets/ilustrasiUpdate.png"
                  alt="Upgrade illustration"
                  width={180}
                  height={100}
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            )}

            <div className="border-t border-white/30 my-4 w-full"></div>

            <div className="relative">
              {isProfileMenuOpen && (
                <div className="absolute bottom-full mb-2 w-full">
                  <LogoutButton />
                </div>
              )}
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center mt-4 h-16 w-full text-left"
              >
                <div className="flex-shrink-0">
                  <Image
                    src="/assets/Avatar.png"
                    alt="Avatar"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="ml-3 flex flex-col min-w-0 flex-1">
                  <p className="text-sm text-gray-300 whitespace-nowrap">
                    {brandInfo.welcomeText} 👋
                  </p>
                  <p className="text-lg font-bold text-white whitespace-nowrap truncate">
                    {user?.role === "admin_langganan"
                      ? "Administrator"
                      : user?.name ?? "User"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2366d1] text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col justify-between min-h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/20 h-16">
            <div className="flex items-center space-x-3">
              <Image
                src={brandInfo.logo}
                alt="Logo Dinas Pendidikan"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-lg font-bold text-white">
                {brandInfo.brandName}
              </h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-white hover:bg-white/20 transition-colors duration-200"
              type="button"
              aria-label="Close menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="mt-4 px-2">
              <div className="mb-3 px-2">
                <p className="text-xs text-gray-300 uppercase tracking-wide font-semibold">
                  Menu Utama
                </p>
              </div>

              <ul className="space-y-1">
                {mainMenuItems.map((item) => (
                  <li key={item.name}>{renderMobileMenuItem(item)}</li>
                ))}
              </ul>

              <div className="border-t border-white/30 my-4 w-full"></div>

              <div className="mb-3 px-2">
                <p className="text-xs text-gray-300 uppercase tracking-wide font-semibold">
                  {user?.role === "admin_langganan"
                    ? "Manajemen Langganan"
                    : "Menu Tambahan"}
                </p>
              </div>

              <ul className="space-y-1">
                {subMenuItems.map((item) => (
                  <li key={item.name}>{renderMobileMenuItem(item)}</li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-white/20">
            <LogoutButton />
            <div className="flex items-center h-12 mt-2">
              <div className="flex-shrink-0">
                <Image
                  src="/assets/Avatar.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="ml-3 flex flex-col min-w-0 flex-1">
                <p className="text-xs text-gray-300">
                  {brandInfo.welcomeText} 👋
                </p>
                <p className="text-sm font-bold text-white truncate">
                  {user?.role === "admin_langganan"
                    ? "Administrator"
                    : user?.name ?? "User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;