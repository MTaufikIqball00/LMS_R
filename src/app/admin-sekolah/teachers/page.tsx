"use client";
import React, { useState, useEffect } from "react";
import Table from "../../components/admin/Table";
import Modal from "../../components/admin/Modal";
import PageHeader from "../../components/admin/PageHeader";
import { EditButton, DeleteButton } from "../../components/admin/ActionButton";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  teachingHours: number;
  status: "Active" | "Non-Active";
}

export default function ManajemenGuruAdminPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await fetch("/api/admin-sekolah/teachers");
        if (response.ok) {
          const data = await response.json();
          setTeachers(data.teachers || []);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  const handleOpenModal = (teacher: Teacher | null = null) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTeacher(null);
    setIsModalOpen(false);
  };

  const handleSaveTeacher = (formData: Omit<Teacher, "id" | "classes"> & { classes: string; status: "Active" | "Non-Active" }) => {
    const classArray = formData.classes.split(',').map(c => c.trim());
    if (selectedTeacher) {
      const updatedTeachers = teachers.map((t) =>
        t.id === selectedTeacher.id ? { ...t, ...formData, classes: classArray } : t
      );
      setTeachers(updatedTeachers);
    } else {
      const newTeacher: Teacher = {
        id: `T${String(teachers.length + 1).padStart(3, "0")}`,
        ...formData,
        classes: classArray,
      };
      setTeachers([...teachers, newTeacher]);
    }
    handleCloseModal();
  };

  const openDeleteModal = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTeacherToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteTeacher = () => {
    if (teacherToDelete) {
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete.id));
      closeDeleteModal();
    }
  };

  const columns = [
    {
      header: "Nama Guru",
      accessor: (row: Teacher) => (
        <div>
          <div className="font-semibold">{row.name}</div>
          <div className="text-sm text-gray-500">{row.id}</div>
        </div>
      ),
    },
    {
      header: "Mata Pelajaran",
      accessor: (row: Teacher) => row.subject,
    },
    {
      header: "Kelas",
      accessor: (row: Teacher) => row.classes?.join(", ") || "",
    },
    {
      header: "Jam/Minggu",
      accessor: (row: Teacher) => `${row.teachingHours} jam`,
    },
    {
      header: "Status",
      accessor: (row: Teacher) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: (row: Teacher) => (
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
        title="Manajemen Guru"
        subtitle="Kelola data guru di sekolah Anda"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Daftar Guru</h2>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tambah Guru
            </button>
          </div>
          <Table
            columns={columns}
            data={teachers}
            keyExtractor={(row) => row.id}
          />
        </div>
      </div>

      {isModalOpen && (
        <TeacherFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTeacher}
          teacher={selectedTeacher}
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
              Apakah Anda yakin ingin menghapus guru{" "}
              <strong>{teacherToDelete?.name}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteTeacher}
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

function TeacherFormModal({
  isOpen,
  onClose,
  onSave,
  teacher,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Omit<Teacher, "id" | "classes"> & { classes: string; status: "Active" | "Non-Active" }) => void;
  teacher: Teacher | null;
}) {
  const [formData, setFormData] = useState<{
    name: string;
    subject: string;
    classes: string;
    teachingHours: number;
    status: "Active" | "Non-Active";
  }>({
    name: teacher?.name || "",
    subject: teacher?.subject || "",
    classes: teacher?.classes?.join(", ") || "",
    teachingHours: teacher?.teachingHours || 0,
    status: (teacher?.status as "Active" | "Non-Active") || "Active",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Nama Guru tidak boleh kosong.";
    if (!formData.subject.trim()) newErrors.subject = "Mata Pelajaran tidak boleh kosong.";
    if (isNaN(formData.teachingHours) || formData.teachingHours < 0) {
      newErrors.teachingHours = "Jam mengajar harus angka positif.";
    }
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'teachingHours' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={teacher ? "Edit Guru" : "Tambah Guru"}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Guru
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mata Pelajaran
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kelas yang Diampu (pisahkan dengan koma)
            </label>
            <input
              type="text"
              name="classes"
              value={formData.classes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Jam Mengajar per Minggu
            </label>
            <input
              type="number"
              name="teachingHours"
              value={formData.teachingHours}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.teachingHours ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.teachingHours && <p className="text-xs text-red-600 mt-1">{errors.teachingHours}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Non-Active">Non-Active</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
}