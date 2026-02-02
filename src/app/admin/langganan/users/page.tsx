"use client";
import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import Table from "../../../components/admin/Table";
import Modal from "../../../components/admin/Modal";
import { EditButton, DeleteButton } from "../../../components/admin/ActionButton";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId: string | null;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  avatar: string;
}

interface School {
  id: string;
  name: string;
}

const generateNewId = () => `user-${Date.now()}`;

const roleDisplayNames: Record<string, string> = {
  admin_langganan: "Admin Langganan",
  school_admin: "Admin Sekolah",
  teacher: "Guru",
  student: "Siswa",
  kepala_sekolah: "Kepala Sekolah",
  admin_sekolah: "Admin Sekolah",
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-slate-50 text-slate-600",
  pending: "bg-amber-50 text-amber-700",
};

const ManajemenPenggunaPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, schoolsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/schools")
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users || []);
        }
        if (schoolsRes.ok) {
          const schoolsData = await schoolsRes.json();
          setSchools(schoolsData.schools || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const schoolMap = useMemo(() => new Map(schools.map(s => [s.id, s.name])), [schools]);

  const handleOpenModal = (user: User | null = null) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSave = (userData: Omit<User, "id" | "lastLogin" | "avatar">) => {
    if (currentUser) {
      setUsers(
        users.map((u) =>
          u.id === currentUser.id ? { ...u, ...userData } : u
        )
      );
    } else {
      const newUser: User = {
        ...userData,
        id: generateNewId(),
        lastLogin: new Date().toISOString(),
        avatar: "/assets/Avatar.png",
      };
      setUsers([...users, newUser]);
    }
    handleCloseModal();
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const columns = [
    {
      header: "Nama Pengguna",
      accessor: (row: User) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar || "/assets/Avatar.png"} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-sm text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Peran",
      accessor: (row: User) => roleDisplayNames[row.role] || row.role,
    },
    {
      header: "Sekolah",
      accessor: (row: User) => row.schoolId ? schoolMap.get(row.schoolId) || "N/A" : "N/A",
    },
    {
      header: "Status",
      accessor: (row: User) => (
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize ${statusStyles[row.status] || statusStyles.inactive
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: (row: User) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditButton onClick={() => handleOpenModal(row)} />
          <DeleteButton onClick={() => handleDelete(row.id)} />
        </div>
      ),
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <PageHeader
        title="Pengguna & Admin"
        subtitle="Kelola semua akun pengguna dan administrator sistem."
      />

      <main className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-sky-50">
            <div className="flex justify-end">
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Pengguna
              </button>
            </div>
          </div>
          <Table columns={columns} data={users} keyExtractor={(u) => u.id} />
        </div>
        <div className="h-12"></div>
      </main>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={currentUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        >
          <UserForm
            user={currentUser}
            schools={schools}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

const UserForm: React.FC<{
  user: User | null;
  schools: School[];
  onSave: (data: Omit<User, "id" | "lastLogin" | "avatar">) => void;
  onCancel: () => void;
}> = ({ user, schools, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "student",
    schoolId: user?.schoolId || null,
    status: user?.status || "pending" as "active" | "inactive" | "pending",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<User, "id" | "lastLogin" | "avatar">);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Nama Lengkap" className="p-2 border rounded w-full" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded w-full" required />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
        <select name="role" value={formData.role} onChange={handleChange} className="p-2 border rounded w-full bg-white">
          <option value="student">Siswa</option>
          <option value="teacher">Guru</option>
          <option value="school_admin">Admin Sekolah</option>
          <option value="admin_langganan">Admin Langganan</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sekolah</label>
        <select name="schoolId" value={formData.schoolId || ""} onChange={handleChange} className="p-2 border rounded w-full bg-white">
          <option value="">Tidak ada</option>
          {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded w-full bg-white">
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          Batal
        </button>
        <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
          Simpan
        </button>
      </div>
    </form>
  );
};

export default ManajemenPenggunaPage;