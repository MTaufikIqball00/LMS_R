"use client";
import React, { useState, useEffect } from "react";
import Modal from "../../components/admin/Modal";

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
  status: string;
  averageScore: number;
  activityLevel: number;
  profile: StudentProfile;
}

function StudentDetailModal({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Profil Murid">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{student.name}</h3>
          <p className="text-sm text-gray-500">NISN: {student.profile?.nisn || "N/A"}</p>
        </div>
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Kelas:</strong> {student.class}</p>
          <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{student.status === "active" ? "Aktif" : "Tidak Aktif"}</span></p>
          <p><strong>Jenis Kelamin:</strong> {student.profile?.gender || "N/A"}</p>
          <p><strong>Tanggal Lahir:</strong> {student.profile?.dateOfBirth ? new Date(student.profile.dateOfBirth).toLocaleDateString() : "N/A"}</p>
          <p className="md:col-span-2"><strong>Alamat:</strong> {student.profile?.address || "N/A"}</p>
          <p><strong>Rata-rata Nilai:</strong> {student.averageScore || 0}</p>
          <p><strong>Tingkat Keaktifan:</strong> {student.activityLevel || 0}%</p>
        </div>
      </div>
      <div className="mt-6 text-right">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Tutup
        </button>
      </div>
    </Modal>
  );
}


export default function DaftarMuridPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("/api/kepala/students");
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
          setStats(data.stats || { total: 0, active: 0, inactive: 0 });
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const filteredStudents = students
    .filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (student) => statusFilter === "all" || student.status === statusFilter
    );

  const statusStyles: { [key: string]: string } = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
  };

  const handleOpenModal = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Daftar Murid</h1>
          <p className="mt-1 text-md text-gray-600">
            Lihat data murid di sekolah Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-500">Total Murid</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-500">Murid Aktif</p>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-red-500">
            <p className="text-sm font-medium text-gray-500">Murid Tidak Aktif</p>
            <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <input
                type="text"
                placeholder="Cari nama murid..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:max-w-md pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profil Murid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-11 w-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            NISN: {student.profile?.nisn || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {student.class}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${statusStyles[student.status] || statusStyles.inactive
                          }`}
                      >
                        {student.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(student)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Lihat Profil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredStudents.length} dari {students.length} murid
            </p>
          </div>
        </div>
      </div>
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}