"use client";
import React, { useState, useEffect } from "react";
import Modal from "../../components/admin/Modal";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  teachingHours: number;
}

function TeacherDetailModal({
  teacher,
  onClose,
}: {
  teacher: Teacher;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Detail Guru">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{teacher.name}</h3>
          <p className="text-sm text-gray-500">ID: {teacher.id}</p>
        </div>
        <div className="border-t pt-4">
          <p>
            <strong>Mata Pelajaran:</strong> {teacher.subject}
          </p>
          <p>
            <strong>Total Jam Mengajar:</strong> {teacher.teachingHours} jam /
            minggu
          </p>
          <p className="mt-2">
            <strong>Kelas yang Diampu:</strong>
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {teacher.classes?.map((c) => (
              <span
                key={c}
                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Tutup
        </button>
      </div>
    </Modal>
  );
}

export default function DaftarGuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await fetch("/api/kepala/teachers");
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

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleCloseModal = () => {
    setSelectedTeacher(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Daftar Guru</h1>
          <p className="mt-1 text-md text-gray-600">
            Lihat data guru di sekolah Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari guru atau mata pelajaran..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mata Pelajaran
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Kelas yang Diampu
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jam Mengajar / Minggu
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {teacher.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {teacher.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {teacher.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {teacher.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {teacher.classes?.map((c) => (
                          <span
                            key={c}
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.teachingHours} jam
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(teacher)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredTeachers.length} dari {teachers.length}{" "}
              guru
            </p>
          </div>
        </div>
      </div>
      {selectedTeacher && (
        <TeacherDetailModal
          teacher={selectedTeacher}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}