"use client";
import React, { useState, useEffect } from "react";
import Table from "../../components/admin/Table";
import Modal from "../../components/admin/Modal";
import PageHeader from "../../components/admin/PageHeader";
import { EditButton, DeleteButton } from "../../components/admin/ActionButton";

interface StudentProfile {
  nisn: string;
  gender: string;
  dateOfBirth: string;
  address: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
  status: "active" | "inactive";
  averageScore: number;
  activityLevel: number;
  profile: StudentProfile;
}

export default function ManajemenMuridAdminPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("/api/admin-sekolah/students");
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const handleOpenModal = (student: Student | null = null) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const handleSaveStudent = async (formData: Omit<Student, "id">) => {
    if (selectedStudent) {
      // Edit - update local state
      const updatedStudents = students.map((s) =>
        s.id === selectedStudent.id ? { ...s, ...formData } : s
      );
      setStudents(updatedStudents);
    } else {
      // Add - create new with temporary ID
      const newStudent: Student = {
        id: `S${String(students.length + 1).padStart(3, "0")}`,
        ...formData,
      };
      setStudents([...students, newStudent]);
    }
    handleCloseModal();
  };

  const openDeleteModal = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setStudentToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteStudent = () => {
    if (studentToDelete) {
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      closeDeleteModal();
    }
  };

  const columns = [
    {
      header: "Nama Murid",
      accessor: (row: Student) => (
        <div>
          <div className="font-semibold">{row.name}</div>
          <div className="text-sm text-gray-500">NISN: {row.profile?.nisn || "N/A"}</div>
        </div>
      ),
    },
    {
      header: "Kelas",
      accessor: (row: Student) => row.class,
    },
    {
      header: "Status",
      accessor: (row: Student) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {row.status === "active" ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: (row: Student) => (
        <div className="flex gap-2">
          <EditButton onClick={() => handleOpenModal(row)} />
          <DeleteButton onClick={() => openDeleteModal(row)} />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Manajemen Murid"
        subtitle="Kelola data murid di sekolah Anda"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Daftar Murid</h2>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tambah Murid
            </button>
          </div>
          <Table
            columns={columns}
            data={students}
            keyExtractor={(row) => row.id}
          />
        </div>
      </div>

      {isModalOpen && (
        <StudentFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveStudent}
          student={selectedStudent}
        />
      )}

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          title="Konfirmasi Hapus"
        >
          <div>
            <p>
              Apakah Anda yakin ingin menghapus murid{" "}
              <strong>{studentToDelete?.name}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StudentFormModal({
  isOpen,
  onClose,
  onSave,
  student,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Omit<Student, "id">) => void;
  student: Student | null;
}) {
  const [formData, setFormData] = useState({
    name: student?.name || "",
    class: student?.class || "",
    status: student?.status || "active" as "active" | "inactive",
    averageScore: student?.averageScore || 0,
    activityLevel: student?.activityLevel || 0,
    profile: {
      nisn: student?.profile?.nisn || "",
      gender: student?.profile?.gender || "Laki-laki",
      dateOfBirth: student?.profile?.dateOfBirth || "",
      address: student?.profile?.address || "",
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Nama Murid tidak boleh kosong.";
    if (!formData.profile.nisn.trim()) newErrors.nisn = "NISN tidak boleh kosong.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in formData.profile) {
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSave(formData as Omit<Student, "id">);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? "Edit Murid" : "Tambah Murid"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Lengkap" required className={`w-full border p-2 rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input type="text" name="nisn" value={formData.profile.nisn} onChange={handleChange} placeholder="NISN" required className={`w-full border p-2 rounded-md ${errors.nisn ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.nisn && <p className="text-xs text-red-600 mt-1">{errors.nisn}</p>}
        </div>
        <input type="text" name="class" value={formData.class} onChange={handleChange} placeholder="Kelas" className="w-full border p-2 rounded-md" />
        <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded-md">
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
        <input type="date" name="dateOfBirth" value={formData.profile.dateOfBirth} onChange={handleChange} className="w-full border p-2 rounded-md" />
        <select name="gender" value={formData.profile.gender} onChange={handleChange} className="w-full border p-2 rounded-md">
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
        <input type="text" name="address" value={formData.profile.address} onChange={handleChange} placeholder="Alamat" className="w-full border p-2 rounded-md" />
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Simpan</button>
        </div>
      </form>
    </Modal>
  );
}