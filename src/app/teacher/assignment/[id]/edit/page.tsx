'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FiSave, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { Assignment } from '../../../../api/tugas/store';

export default function EditAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`/api/teacher/assignments/${id}`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data tugas.');
        }
        const data = await response.json();
        setAssignment(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (assignment) {
        setAssignment({ ...assignment, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/teacher/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui tugas.');
      }

      router.push('/teacher/assignment');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><FiLoader className='animate-spin h-8 w-8' /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  if (!assignment) {
    return <div className="text-center p-8">Tugas tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Link href="/teacher/assignment" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <FiArrowLeft />
                Kembali ke Manajemen Tugas
            </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6">Edit Tugas</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Tugas</label>
            <input
              type="text"
              name="title"
              id="title"
              value={assignment.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              name="description"
              id="description"
              value={assignment.description}
              onChange={handleChange}
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Mata Pelajaran</label>
                <input
                type="text"
                name="subject"
                id="subject"
                value={assignment.subject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                />
            </div>
            <div>
                <label htmlFor="className" className="block text-sm font-medium text-gray-700">Kelas</label>
                <input
                type="text"
                name="className"
                id="className"
                value={assignment.className}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                />
            </div>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Tanggal Deadline</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={assignment.dueDate ? assignment.dueDate.split('T')[0] : ''} // Format to YYYY-MM-DD
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <Link href="/teacher/assignment">
                <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Batal
                </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? <FiLoader className='animate-spin h-5 w-5 mr-3' /> : <FiSave className="h-5 w-5 mr-2" />} 
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
