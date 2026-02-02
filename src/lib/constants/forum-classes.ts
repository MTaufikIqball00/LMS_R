// Forum class configuration data
export interface ForumClass {
    id: string;
    name: string;
    description: string;
    grade: 10 | 11 | 12;
}

export interface SubjectClasses {
    [subject: string]: ForumClass[];
}

export const FORUM_CLASSES: SubjectClasses = {
    kimia: [
        { id: "kimia-10-umum", name: "Kimia Umum Kelas 10", description: "Diskusi umum Kimia untuk semua kelas 10", grade: 10 },
        { id: "kimia-10a", name: "Kimia Kelas 10A", description: "Diskusi Kimia untuk kelas 10A", grade: 10 },
        { id: "kimia-10b", name: "Kimia Kelas 10B", description: "Diskusi Kimia untuk kelas 10B", grade: 10 },
        { id: "kimia-10c", name: "Kimia Kelas 10C", description: "Diskusi Kimia untuk kelas 10C", grade: 10 },
        { id: "kimia-11-umum", name: "Kimia Umum Kelas 11", description: "Diskusi umum Kimia untuk semua kelas 11", grade: 11 },
        { id: "kimia-11a", name: "Kimia Kelas 11A", description: "Diskusi Kimia untuk kelas 11A", grade: 11 },
        { id: "kimia-11b", name: "Kimia Kelas 11B", description: "Diskusi Kimia untuk kelas 11B", grade: 11 },
        { id: "kimia-12-umum", name: "Kimia Umum Kelas 12", description: "Diskusi umum Kimia untuk semua kelas 12", grade: 12 },
        { id: "kimia-12a", name: "Kimia Kelas 12A", description: "Diskusi Kimia untuk kelas 12A", grade: 12 },
        { id: "kimia-12b", name: "Kimia Kelas 12B", description: "Diskusi Kimia untuk kelas 12B", grade: 12 },
        { id: "kimia-12c", name: "Kimia Kelas 12C", description: "Diskusi Kimia untuk kelas 12C", grade: 12 },
    ],
    indonesia: [
        { id: "indo-10-umum", name: "B. Indonesia Umum Kelas 10", description: "Diskusi umum B. Indonesia untuk semua kelas 10", grade: 10 },
        { id: "indo-10a", name: "B. Indonesia Kelas 10A", description: "Diskusi Bahasa Indonesia untuk kelas 10A", grade: 10 },
        { id: "indo-10b", name: "B. Indonesia Kelas 10B", description: "Diskusi Bahasa Indonesia untuk kelas 10B", grade: 10 },
        { id: "indo-11-umum", name: "B. Indonesia Umum Kelas 11", description: "Diskusi umum B. Indonesia untuk semua kelas 11", grade: 11 },
        { id: "indo-11a", name: "B. Indonesia Kelas 11A", description: "Diskusi Bahasa Indonesia untuk kelas 11A", grade: 11 },
        { id: "indo-12-umum", name: "B. Indonesia Umum Kelas 12", description: "Diskusi umum B. Indonesia untuk semua kelas 12", grade: 12 },
        { id: "indo-12a", name: "B. Indonesia Kelas 12A", description: "Diskusi Bahasa Indonesia untuk kelas 12A", grade: 12 },
        { id: "indo-12b", name: "B. Indonesia Kelas 12B", description: "Diskusi Bahasa Indonesia untuk kelas 12B", grade: 12 },
    ],
    inggris: [
        { id: "ing-10-umum", name: "B. Inggris Umum Kelas 10", description: "Diskusi umum B. Inggris untuk semua kelas 10", grade: 10 },
        { id: "ing-10a", name: "B. Inggris Kelas 10A", description: "Diskusi Bahasa Inggris untuk kelas 10A", grade: 10 },
        { id: "ing-11-umum", name: "B. Inggris Umum Kelas 11", description: "Diskusi umum B. Inggris untuk semua kelas 11", grade: 11 },
        { id: "ing-11a", name: "B. Inggris Kelas 11A", description: "Diskusi Bahasa Inggris untuk kelas 11A", grade: 11 },
        { id: "ing-11b", name: "B. Inggris Kelas 11B", description: "Diskusi Bahasa Inggris untuk kelas 11B", grade: 11 },
        { id: "ing-12-umum", name: "B. Inggris Umum Kelas 12", description: "Diskusi umum B. Inggris untuk semua kelas 12", grade: 12 },
        { id: "ing-12a", name: "B. Inggris Kelas 12A", description: "Diskusi Bahasa Inggris untuk kelas 12A", grade: 12 },
    ],
    matematika: [
        { id: "mtk-10-umum", name: "Matematika Umum Kelas 10", description: "Diskusi umum Matematika untuk semua kelas 10", grade: 10 },
        { id: "mtk-10a", name: "Matematika Kelas 10A", description: "Diskusi Matematika untuk kelas 10A", grade: 10 },
        { id: "mtk-10b", name: "Matematika Kelas 10B", description: "Diskusi Matematika untuk kelas 10B", grade: 10 },
        { id: "mtk-11-umum", name: "Matematika Umum Kelas 11", description: "Diskusi umum Matematika untuk semua kelas 11", grade: 11 },
        { id: "mtk-11a", name: "Matematika Kelas 11A", description: "Diskusi Matematika untuk kelas 11A", grade: 11 },
        { id: "mtk-11b", name: "Matematika Kelas 11B", description: "Diskusi Matematika untuk kelas 11B", grade: 11 },
        { id: "mtk-12-umum", name: "Matematika Umum Kelas 12", description: "Diskusi umum Matematika untuk semua kelas 12", grade: 12 },
        { id: "mtk-12a", name: "Matematika Kelas 12A", description: "Diskusi Matematika untuk kelas 12A", grade: 12 },
        { id: "mtk-12b", name: "Matematika Kelas 12B", description: "Diskusi Matematika untuk kelas 12B", grade: 12 },
        { id: "mtk-12c", name: "Matematika Kelas 12C", description: "Diskusi Matematika untuk kelas 12C", grade: 12 },
        { id: "mtk-12d", name: "Matematika Kelas 12D", description: "Diskusi Matematika untuk kelas 12D", grade: 12 },
    ],
};
