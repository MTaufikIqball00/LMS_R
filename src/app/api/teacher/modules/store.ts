// This file acts as a mock in-memory database for development.
// In a real application, this would be replaced by a proper database like PostgreSQL, MongoDB, etc.

export type ModuleType = "video_link" | "file";

export interface Module {
  id: string;
  teacherId: string;
  title: string;
  description?: string;
  type: ModuleType;
  contentUrl: string;
  fileName?: string;
  fileType?: string;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
  viewCount?: number;
  tags?: string[];
  subject?: string;
  grade?: string;
  duration?: number; // in minutes for videos
  fileSize?: number; // in bytes for files
}

// Map to store modules created by teachers
// Key: moduleId (string), Value: Module (object)
export const modules = new Map<string, Module>();

// --- Seed with some initial data for development ---

// Sample video modules
const seedVideoModuleId1 = "mod-vid-001";
modules.set(seedVideoModuleId1, {
  id: seedVideoModuleId1,
  teacherId: "2", // Corresponds to 'guru@sekolah.id'
  title: "Pengenalan Sistem Pernapasan Manusia",
  description:
    "Video pembelajaran tentang anatomi dan fisiologi sistem pernapasan manusia, termasuk organ-organ yang terlibat dan proses pertukaran gas.",
  type: "video_link",
  contentUrl: "https://www.youtube.com/watch?v=mykrnEFsVLs",
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
  viewCount: 142,
  tags: ["biologi", "sistem-pernapasan", "anatomi"],
  subject: "Biologi",
  grade: "XI",
  duration: 25,
});

const seedVideoModuleId2 = "mod-vid-002";
modules.set(seedVideoModuleId2, {
  id: seedVideoModuleId2,
  teacherId: "2",
  title: "Fungsi Kuadrat dan Grafik Parabola",
  description:
    "Pembelajaran tentang fungsi kuadrat, cara menggambar grafik parabola, dan aplikasinya dalam kehidupan sehari-hari.",
  type: "video_link",
  contentUrl: "https://www.youtube.com/watch?v=YQutdTKRAeM",
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
  viewCount: 89,
  tags: ["matematika", "fungsi-kuadrat", "aljabar"],
  subject: "Matematika",
  grade: "X",
  duration: 32,
});

const seedVideoModuleId3 = "mod-vid-003";
modules.set(seedVideoModuleId3, {
  id: seedVideoModuleId3,
  teacherId: "2",
  title: "Hukum Newton dan Aplikasinya",
  description:
    "Pemahaman mendalam tentang tiga hukum Newton beserta contoh penerapannya dalam kehidupan sehari-hari dan soal-soal fisika.",
  type: "video_link",
  contentUrl: "https://www.youtube.com/watch?v=kKKM8Y-u7ds",
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
  viewCount: 201,
  tags: ["fisika", "hukum-newton", "mekanika"],
  subject: "Fisika",
  grade: "X",
  duration: 28,
});

// Sample file modules
const seedFileModuleId1 = "mod-file-001";
modules.set(seedFileModuleId1, {
  id: seedFileModuleId1,
  teacherId: "2",
  title: "Materi Lengkap Sistem Pencernaan",
  description:
    "Dokumen PDF berisi materi lengkap tentang sistem pencernaan manusia, dilengkapi dengan diagram dan penjelasan detail.",
  type: "file",
  contentUrl: "/mock-files/sistem-pencernaan-lengkap.pdf",
  fileName: "sistem-pencernaan-lengkap.pdf",
  fileType: "application/pdf",
  createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
  viewCount: 67,
  tags: ["biologi", "sistem-pencernaan", "materi-pdf"],
  subject: "Biologi",
  grade: "XI",
  fileSize: 2456789, // ~2.4 MB
});

const seedFileModuleId2 = "mod-file-002";
modules.set(seedFileModuleId2, {
  id: seedFileModuleId2,
  teacherId: "2",
  title: "Presentasi: Revolusi Kemerdekaan Indonesia",
  description:
    "Slide presentasi PowerPoint tentang perjuangan kemerdekaan Indonesia, mulai dari masa penjajahan hingga proklamasi.",
  type: "file",
  contentUrl: "/mock-files/revolusi-kemerdekaan-indonesia.pptx",
  fileName: "revolusi-kemerdekaan-indonesia.pptx",
  fileType:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
  viewCount: 134,
  tags: ["sejarah", "kemerdekaan", "indonesia", "presentasi"],
  subject: "Sejarah",
  grade: "XI",
  fileSize: 5234567, // ~5.2 MB
});

const seedFileModuleId3 = "mod-file-003";
modules.set(seedFileModuleId3, {
  id: seedFileModuleId3,
  teacherId: "2",
  title: "Soal Latihan Trigonometri",
  description:
    "Kumpulan soal latihan trigonometri dengan berbagai tingkat kesulitan, dilengkapi dengan pembahasan lengkap.",
  type: "file",
  contentUrl: "/mock-files/soal-latihan-trigonometri.pdf",
  fileName: "soal-latihan-trigonometri.pdf",
  fileType: "application/pdf",
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
  viewCount: 156,
  tags: ["matematika", "trigonometri", "soal-latihan"],
  subject: "Matematika",
  grade: "X",
  fileSize: 1789234, // ~1.8 MB
});

const seedFileModuleId4 = "mod-file-004";
modules.set(seedFileModuleId4, {
  id: seedFileModuleId4,
  teacherId: "2",
  title: "Panduan Praktikum Kimia Dasar",
  description:
    "Dokumen panduan lengkap untuk praktikum kimia dasar, termasuk prosedur keselamatan dan langkah-langkah eksperimen.",
  type: "file",
  contentUrl: "/mock-files/panduan-praktikum-kimia.docx",
  fileName: "panduan-praktikum-kimia.docx",
  fileType:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
  viewCount: 78,
  tags: ["kimia", "praktikum", "panduan", "keselamatan"],
  subject: "Kimia",
  grade: "X",
  fileSize: 3456789, // ~3.5 MB
});

// Helper functions for module management
export const getModulesByTeacherId = (teacherId: string): Module[] => {
  return Array.from(modules.values())
    .filter(
      (module) => module.teacherId === teacherId && module.isActive !== false
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getModuleById = (moduleId: string): Module | undefined => {
  return modules.get(moduleId);
};

export const createModule = (
  moduleData: Omit<Module, "id" | "createdAt" | "updatedAt">
): Module => {
  const moduleId = `mod-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
  const now = new Date().toISOString();

  const newModule: Module = {
    id: moduleId,
    ...moduleData,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    viewCount: 0,
  };

  modules.set(moduleId, newModule);
  return newModule;
};

export const updateModule = (
  moduleId: string,
  updates: Partial<Module>
): Module | null => {
  const existingModule = modules.get(moduleId);
  if (!existingModule) return null;

  const updatedModule: Module = {
    ...existingModule,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  modules.set(moduleId, updatedModule);
  return updatedModule;
};

export const deleteModule = (moduleId: string): boolean => {
  const existingModule = modules.get(moduleId);
  if (!existingModule) return false;

  // Soft delete - just mark as inactive
  const deletedModule: Module = {
    ...existingModule,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  modules.set(moduleId, deletedModule);
  return true;
};

export const incrementViewCount = (moduleId: string): Module | null => {
  const module = modules.get(moduleId);
  if (!module) return null;

  const updatedModule: Module = {
    ...module,
    viewCount: (module.viewCount || 0) + 1,
    updatedAt: new Date().toISOString(),
  };

  modules.set(moduleId, updatedModule);
  return updatedModule;
};

export const getModulesBySubject = (subject: string): Module[] => {
  return Array.from(modules.values())
    .filter((module) => module.subject === subject && module.isActive !== false)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getModulesByGrade = (grade: string): Module[] => {
  return Array.from(modules.values())
    .filter((module) => module.grade === grade && module.isActive !== false)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const searchModules = (query: string): Module[] => {
  const lowercaseQuery = query.toLowerCase();
  return Array.from(modules.values())
    .filter(
      (module) =>
        module.isActive !== false &&
        (module.title.toLowerCase().includes(lowercaseQuery) ||
          module.description?.toLowerCase().includes(lowercaseQuery) ||
          module.tags?.some((tag) =>
            tag.toLowerCase().includes(lowercaseQuery)
          ) ||
          module.subject?.toLowerCase().includes(lowercaseQuery))
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// Statistics helper
export const getModuleStats = (teacherId?: string) => {
  const moduleList = teacherId
    ? getModulesByTeacherId(teacherId)
    : Array.from(modules.values()).filter((m) => m.isActive !== false);

  const totalModules = moduleList.length;
  const videoModules = moduleList.filter((m) => m.type === "video_link").length;
  const fileModules = moduleList.filter((m) => m.type === "file").length;
  const totalViews = moduleList.reduce((sum, m) => sum + (m.viewCount || 0), 0);

  const subjectDistribution = moduleList.reduce((acc, module) => {
    if (module.subject) {
      acc[module.subject] = (acc[module.subject] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    totalModules,
    videoModules,
    fileModules,
    totalViews,
    subjectDistribution,
    averageViewsPerModule:
      totalModules > 0 ? Math.round(totalViews / totalModules) : 0,
  };
};

export default modules;
