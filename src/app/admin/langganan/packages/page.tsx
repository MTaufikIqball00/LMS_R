"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import Modal from "../../../components/admin/Modal";
import { EditButton, DeleteButton } from "../../../components/admin/ActionButton";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: 3 | 6 | 12;
  features: string[];
  type: "basic" | "premium" | "enterprise";
  isAvailable: boolean;
}

const generateNewId = () => `pkg-${Date.now()}`;

const typeStyles: Record<string, string> = {
  basic: "bg-blue-50 text-blue-700",
  premium: "bg-purple-50 text-purple-700",
  enterprise: "bg-gray-50 text-gray-700",
};

const PaketHargaPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch("/api/admin/packages");
        if (response.ok) {
          const data = await response.json();
          setPackages(data.packages || []);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const handleOpenModal = (pkg: Package | null = null) => {
    setCurrentPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPackage(null);
  };

  const handleSave = (packageData: Omit<Package, "id">) => {
    if (currentPackage) {
      setPackages(
        packages.map((p) =>
          p.id === currentPackage.id ? { ...p, ...packageData } : p
        )
      );
    } else {
      const newPackage: Package = {
        ...packageData,
        id: generateNewId(),
      };
      setPackages([...packages, newPackage]);
    }
    handleCloseModal();
  };

  const handleDelete = (packageId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      setPackages(packages.filter((p) => p.id !== packageId));
    }
  };

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
        title="Paket & Harga"
        subtitle="Kelola paket langganan yang ditawarkan kepada sekolah."
      />

      <main className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Paket
          </button>
        </div>

        {packages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-12 text-center text-gray-500">
            Belum ada paket yang tersedia
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-md border border-sky-100 flex flex-col overflow-hidden transition-transform hover:scale-105 duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-800">{pkg.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${typeStyles[pkg.type]}`}>
                      {pkg.type}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-2 text-sm h-10">{pkg.description}</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {pkg.price > 0 ? `Rp${(pkg.price / 1000000).toFixed(1)}jt` : "Kustom"}
                    </span>
                    <span className="text-slate-500"> / {pkg.durationMonths} bulan</span>
                  </div>
                  <ul className="space-y-3 text-slate-600 text-sm">
                    {pkg.features?.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto bg-slate-50 p-4 flex justify-end items-center gap-2 border-t">
                  <span className={`text-xs font-semibold ${pkg.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {pkg.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                  </span>
                  <div className="flex-grow"></div>
                  <EditButton onClick={() => handleOpenModal(pkg)} />
                  <DeleteButton onClick={() => handleDelete(pkg.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="h-12"></div>
      </main>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={currentPackage ? "Edit Paket" : "Tambah Paket Baru"}
        >
          <PackageForm
            pkg={currentPackage}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

const PackageForm: React.FC<{
  pkg: Package | null;
  onSave: (data: Omit<Package, "id">) => void;
  onCancel: () => void;
}> = ({ pkg, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: pkg?.name || "",
    description: pkg?.description || "",
    price: pkg?.price || 0,
    durationMonths: pkg?.durationMonths || 3 as 3 | 6 | 12,
    features: pkg?.features?.join(", ") || "",
    type: pkg?.type || "basic" as "basic" | "premium" | "enterprise",
    isAvailable: pkg?.isAvailable ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      price: Number(formData.price),
      durationMonths: Number(formData.durationMonths) as 3 | 6 | 12,
      features: formData.features.split(",").map(f => f.trim()),
      type: formData.type as "basic" | "premium" | "enterprise",
    };
    onSave(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Nama Paket" className="p-2 border rounded w-full" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Deskripsi" className="p-2 border rounded w-full" required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Harga" className="p-2 border rounded w-full" required />
        <select name="durationMonths" value={formData.durationMonths} onChange={handleChange} className="p-2 border rounded w-full bg-white">
          <option value={3}>3 Bulan</option>
          <option value={6}>6 Bulan</option>
          <option value={12}>12 Bulan</option>
        </select>
      </div>
      <textarea name="features" value={formData.features} onChange={handleChange} placeholder="Fitur (pisahkan dengan koma)" className="p-2 border rounded w-full" required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select name="type" value={formData.type} onChange={handleChange} className="p-2 border rounded w-full bg-white">
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
          <label htmlFor="isAvailable" className="text-sm text-gray-700">Tersedia untuk dipilih</label>
        </div>
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

export default PaketHargaPage;