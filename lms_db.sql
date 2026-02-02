-- Database Schema for Coba App
-- Generated based on dummy-data.ts structure

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','teacher','admin_langganan','admin_sekolah', 'kepala_sekolah', 'parent') NOT NULL,
  `name` varchar(100) NOT NULL,
  `grade` int DEFAULT NULL,
  `school_name` varchar(100) DEFAULT NULL,
  `school_province` varchar(100) DEFAULT NULL,
  `school_subscription_status` varchar(50) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `name`, `grade`, `school_name`, `school_province`, `school_subscription_status`) VALUES
('1', 'murid.jabar@sekolah.id', 'password123', 'student', 'Siswa Jabar (Kelas 12)', 12, 'SMA Negeri 1 Bandung', 'Jawa Barat', 'active'),
('2', 'guru.jabar@sekolah.id', 'password123', 'teacher', 'Guru Jabar', NULL, 'SMA Negeri 1 Bandung', 'Jawa Barat', 'active'),
('3', 'admin@langganan.id', 'password123', 'admin_langganan', 'Admin Langganan', NULL, NULL, NULL, NULL),
('4', 'murid.luar@sekolah.id', 'password123', 'student', 'Siswa Luar Jabar (Kelas 11)', 11, 'SMA Negeri 1 Medan', 'Sumatera Utara', 'limited'),
('5', 'murid.kelas10@sekolah.id', 'password123', 'student', 'Siswa Kelas 10', 10, 'SMA Negeri 2 Jakarta', 'DKI Jakarta', 'expired'),
('6', 'guru.luar@sekolah.id', 'password123', 'teacher', 'Guru Luar Jabar', NULL, 'SMA Negeri 1 Medan', 'Sumatera Utara', 'limited');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL, -- NIM
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `grade` int DEFAULT NULL,
  `school_name` varchar(100) DEFAULT NULL,
  `school_province` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `class_name` varchar(50) DEFAULT NULL,
  `major` varchar(100) DEFAULT NULL,
  `enrollment_date` datetime DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `gpa` decimal(4,2) DEFAULT NULL,
  `total_credits` int DEFAULT NULL,
  `completed_credits` int DEFAULT NULL,
  `address` text,
  `parent_name` varchar(100) DEFAULT NULL,
  `parent_phone` varchar(20) DEFAULT NULL,
  `attendance_rate` decimal(5,2) DEFAULT NULL,
  `assignment_completion` decimal(5,2) DEFAULT NULL,
  `quiz_average` decimal(5,2) DEFAULT NULL,
  `risk_status` varchar(50) DEFAULT NULL,
  `risk_score` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_id`, `name`, `email`, `avatar`, `semester`, `grade`, `school_name`, `school_province`, `phone`, `class_name`, `major`, `enrollment_date`, `status`, `gpa`, `total_credits`, `completed_credits`, `address`, `parent_name`, `parent_phone`, `attendance_rate`, `assignment_completion`, `quiz_average`, `created_at`, `updated_at`) VALUES
('s1', 'NIM001', 'Budi Pekerti', 'budi.pekerti@sekolah.id', '/assets/Avatar.png', 3, 11, 'SMA Negeri 1 Jakarta', 'DKI Jakarta', '081234567890', 'Kelas 11A', 'Ilmu Pengetahuan Alam', '2023-07-15 00:00:00', 'active', 3.85, 60, 45, 'Jl. Pendidikan No. 1, Jakarta', 'Ayah Budi', '081209876543', 95.50, 98.00, 88.20, NOW(), NOW()),
('s2', 'NIM002', 'Siti Aminah', 'siti.aminah@sekolah.id', '/assets/Avatar2.png', 5, 12, 'SMA Negeri 3 Bandung', 'Jawa Barat', '081234567891', 'Kelas 12B', 'Ilmu Pengetahuan Sosial', '2022-07-15 00:00:00', 'active', 3.92, 120, 100, 'Jl. Merdeka No. 45, Bandung', 'Ayah Siti', '081209876544', 96.00, 95.00, 91.50, NOW(), NOW()),
('s3', 'NIM003', 'Ahmad Fadil', 'ahmad.fadil@sekolah.id', '/assets/Avatar3.png', 1, 10, 'SMA Swasta Harapan', 'Jawa Tengah', '081234567892', 'Kelas 10C', 'Ilmu Pengetahuan Alam', '2024-07-15 00:00:00', 'active', 3.65, 24, 18, 'Jl. Pemuda No. 78, Semarang', 'Ayah Ahmad', '081209876545', 93.00, 89.00, 85.00, NOW(), NOW());

-- --------------------------------------------------------

--
-- Table structure for table `courses` (New)
--

CREATE TABLE `courses` (
  `id` varchar(50) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `teacher_id` varchar(50) NOT NULL,
  `semester` enum('ganjil', 'genap') NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `code`, `name`, `description`, `teacher_id`, `semester`, `academic_year`) VALUES
('c1', 'BIO101', 'Biologi Dasar', 'Pengenalan Biologi', '2', 'ganjil', '2023/2024'),
('c2', 'MAT201', 'Matematika Lanjut', 'Kalkulus dan Aljabar', '2', 'ganjil', '2023/2024');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments` (New)
--

CREATE TABLE `enrollments` (
  `id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `course_id` varchar(50) NOT NULL,
  `enrolled_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` varchar(50) NOT NULL,
  `course_id` varchar(50) DEFAULT NULL, -- Linked to course
  `teacher_id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `type` enum('video','pdf','quiz','document') NOT NULL,
  `content_url` text NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `modules_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `teacher_id`, `title`, `description`, `type`, `content_url`, `created_at`) VALUES
('mod-initial-1', '2', 'Pengenalan Aljabar', 'Bab pertama dalam kurikulum matematika semester ini.', 'pdf', 'http://example.com/aljabar.pdf', NOW());

-- --------------------------------------------------------

--
-- Table structure for table `assignments` (New)
--

CREATE TABLE `assignments` (
  `id` varchar(50) NOT NULL,
  `course_id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `due_date` datetime NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `submissions` (New)
--

CREATE TABLE `submissions` (
  `id` varchar(50) NOT NULL,
  `assignment_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `file_url` text,
  `submitted_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `grade` decimal(5,2) DEFAULT NULL,
  `feedback` text,
  PRIMARY KEY (`id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `quizzes` (New)
--

CREATE TABLE `quizzes` (
  `id` varchar(50) NOT NULL,
  `course_id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `duration_minutes` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions` (New)
--

CREATE TABLE `quiz_questions` (
  `id` varchar(50) NOT NULL,
  `quiz_id` varchar(50) NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('multiple_choice', 'essay', 'true_false') NOT NULL,
  `points` int DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `quiz_id` (`quiz_id`),
  CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts` (New)
--

CREATE TABLE `quiz_attempts` (
  `id` varchar(50) NOT NULL,
  `quiz_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `started_at` datetime NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_id` (`quiz_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `max_score` decimal(5,2) NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  `grade_letter` varchar(5) NOT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `graded_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`id`, `student_id`, `subject`, `type`, `title`, `score`, `max_score`, `percentage`, `grade_letter`, `submitted_at`, `graded_at`) VALUES
('g1', 's1', 'Fisika', 'Tugas', 'Hukum Newton', 90.00, 100.00, 90.00, 'A', '2024-05-10 08:00:00', '2024-05-12 14:00:00'),
('g2', 's1', 'Matematika', 'Kuis', 'Kalkulus Dasar', 85.00, 100.00, 85.00, 'A-', '2024-05-11 09:00:00', '2024-05-11 15:00:00'),
('g3', 's2', 'Kimia', 'Tugas', 'Struktur Atom', 88.00, 100.00, 88.00, 'A-', '2024-05-12 08:00:00', '2024-05-14 14:00:00'),
('g4', 's2', 'Biologi', 'Kuis', 'Sistem Sel', 92.00, 100.00, 92.00, 'A', '2024-05-13 09:00:00', '2024-05-13 15:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  `status` enum('present','absent','late','excused','permission','sick','early_leave') NOT NULL,
  `subject` varchar(100) NOT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `location_lat` decimal(10,8) DEFAULT NULL,
  `location_lng` decimal(11,8) DEFAULT NULL,
  `location_address` text,
  `notes` text,
  `method` enum('qr_code','manual','geolocation','face_recognition') DEFAULT 'manual',
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `student_id`, `date`, `status`, `subject`, `check_in_time`, `location_address`, `notes`) VALUES
('att1', 's1', '2024-05-20 00:00:00', 'present', 'Fisika', '08:05:12', 'Ruang Kelas 11A', 'Tepat waktu'),
('att2', 's1', '2024-05-19 00:00:00', 'late', 'Matematika', '09:15:30', 'Ruang Kelas 11A', 'Terlambat 15 menit'),
('att3', 's2', '2024-05-20 00:00:00', 'present', 'Kimia', '08:03:00', 'Ruang Kelas 11A', 'Tepat waktu'),
('att4', 's2', '2024-05-19 00:00:00', 'absent', 'Biologi', '08:00:00', 'Ruang Kelas 11A', 'Sakit');

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `timestamp` datetime NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `student_id`, `type`, `timestamp`, `title`, `description`) VALUES
('act1', 's1', 'assignment_submit', '2024-05-10 08:00:00', 'Tugas Fisika Dikumpulkan', 'Menyerahkan tugas tentang Hukum Newton.'),
('act2', 's1', 'quiz_complete', '2024-05-11 09:30:00', 'Kuis Matematika Selesai', 'Menyelesaikan kuis Kalkulus Dasar dengan skor 85.'),
('act3', 's1', 'login', '2024-05-20 07:55:00', 'Login ke Sistem', 'Login dari perangkat seluler.'),
('act4', 's2', 'assignment_submit', '2024-05-12 08:00:00', 'Tugas Kimia Dikumpulkan', 'Menyerahkan tugas tentang Struktur Atom.'),
('act5', 's2', 'quiz_complete', '2024-05-13 09:30:00', 'Kuis Biologi Selesai', 'Menyelesaikan kuis Sistem Sel dengan skor 92.'),
('act6', 's2', 'login', '2024-05-20 07:58:00', 'Login ke Sistem', 'Login dari perangkat desktop.');

-- --------------------------------------------------------

--
-- Table structure for table `forum_threads` (New)
--

CREATE TABLE `forum_threads` (
  `id` varchar(50) NOT NULL,
  `course_id` varchar(50) NOT NULL,
  `author_id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `forum_threads_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_threads_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `forum_posts` (New)
--

CREATE TABLE `forum_posts` (
  `id` varchar(50) NOT NULL,
  `thread_id` varchar(50) NOT NULL,
  `author_id` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `thread_id` (`thread_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `forum_posts_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_posts_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `notifications` (New)
--

CREATE TABLE `notifications` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `type` enum('success','error','warning','info') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` boolean DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
