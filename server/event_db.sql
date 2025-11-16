-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 16, 2025 at 11:11 AM
-- Server version: 11.4.5-MariaDB-log
-- PHP Version: 8.3.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `event_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `analytics`
--

CREATE TABLE `analytics` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action_type` enum('view','register','cancel','complete') NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `analytics_summary`
-- (See below for the actual view)
--
CREATE TABLE `analytics_summary` (
`date` date
,`total_actions` bigint(21)
,`unique_users` bigint(21)
,`views` bigint(21)
,`registrations` bigint(21)
,`cancellations` bigint(21)
,`completions` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `featured_image` varchar(500) DEFAULT NULL,
  `category` enum('news','tips','event-update','general') DEFAULT 'general',
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `author_id` int(11) DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_records`
--

CREATE TABLE `attendance_records` (
  `id` int(11) NOT NULL,
  `token_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `attendance_time` timestamp NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_tokens`
--

CREATE TABLE `attendance_tokens` (
  `id` int(11) NOT NULL,
  `registration_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `token` varchar(10) NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(7) DEFAULT '#007bff',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `icon`, `color`, `is_active`, `created_at`, `updated_at`) VALUES
(71, 'Technology', 'Tech events, programming, IT conferences', 'fas fa-laptop-code', '#007bff', 1, '2025-10-07 00:57:08', '2025-10-07 00:57:08'),
(72, 'Business', 'Business conferences, networking, entrepreneurship', 'fas fa-briefcase', '#28a745', 1, '2025-10-07 00:57:08', '2025-10-07 00:57:08'),
(73, 'Education', 'Workshops, seminars, training, learning events', 'fas fa-graduation-cap', '#ffc107', 1, '2025-10-07 00:57:08', '2025-10-07 00:57:08'),
(74, 'Entertainment', 'Music, concerts, festivals, entertainment', 'fas fa-music', '#dc3545', 1, '2025-10-07 00:57:08', '2025-10-07 00:57:08'),
(75, 'Sports', 'Sports events, competitions, fitness activities', 'fas fa-running', '#fd7e14', 1, '2025-10-07 00:57:08', '2025-10-07 00:57:08'),
(76, 'Community', 'Community events, charity, social gatherings', 'fas fa-users', '#6f42c1', 1, '2025-10-07 00:57:08', '2025-11-12 06:06:15'),
(82, 'Health & Wellness', 'Health seminars, wellness workshops, and medical events', 'fas fa-heartbeat', '#e83e8c', 1, '2025-11-07 08:27:52', '2025-11-07 08:27:52'),
(84, 'Food & Culinary', 'Food festivals, cooking classes, and culinary events', 'fas fa-utensils', '#fd7e14', 1, '2025-11-07 08:27:52', '2025-11-07 08:27:52');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `attendance_record_id` int(11) NOT NULL,
  `certificate_number` varchar(50) NOT NULL,
  `certificate_type` enum('participation','achievement','completion') DEFAULT 'participation',
  `status` enum('pending','generated','issued') DEFAULT 'pending',
  `generated_at` timestamp NULL DEFAULT NULL,
  `issued_at` timestamp NULL DEFAULT NULL,
  `certificate_url` varchar(500) DEFAULT NULL,
  `template_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`template_data`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificate_templates`
--

CREATE TABLE `certificate_templates` (
  `id` int(11) NOT NULL,
  `template_name` varchar(100) NOT NULL,
  `template_type` enum('participation','achievement','completion') DEFAULT 'participation',
  `title` varchar(200) NOT NULL,
  `subtitle` varchar(200) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `footer_text` varchar(200) DEFAULT NULL,
  `background_color` varchar(7) DEFAULT '#ffffff',
  `primary_color` varchar(7) DEFAULT '#1e3a8a',
  `accent_color` varchar(7) DEFAULT '#fb923c',
  `text_color` varchar(7) DEFAULT '#374151',
  `logo_position` enum('top-left','top-center','top-right') DEFAULT 'top-center',
  `signature_text` varchar(100) DEFAULT 'Event Organizer',
  `is_default` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `certificate_templates`
--

INSERT INTO `certificate_templates` (`id`, `template_name`, `template_type`, `title`, `subtitle`, `content`, `footer_text`, `background_color`, `primary_color`, `accent_color`, `text_color`, `logo_position`, `signature_text`, `is_default`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Default Participation Certificate', 'participation', 'CERTIFICATE OF PARTICIPATION', 'This is to certify that', 'has successfully participated in the event and demonstrated active engagement throughout the program.', 'Awarded on this day', '#ffffff', '#1e3a8a', '#fb923c', '#374151', 'top-center', 'Event Organizer', 1, 1, '2025-10-07 02:25:13', '2025-10-07 02:25:13');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','closed') DEFAULT 'new',
  `replied_at` timestamp NULL DEFAULT NULL,
  `replied_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `replied_at`, `replied_by`, `created_at`, `updated_at`) VALUES
(1, 'Abdul Al Mughni', 'abdul.mughni845@gmail.com', '081288295138', 'bug', 'dawindawndaiwdnawd', 'read', NULL, NULL, '2025-11-14 03:18:00', '2025-11-14 03:18:49'),
(2, 'Abdul Al Mughni', 'abdul.mughni845@gmail.com', '081288295138', 'bugging', 'kata mamah suru sekolah', 'new', NULL, NULL, '2025-11-15 16:26:44', '2025-11-15 16:26:44');

-- --------------------------------------------------------

--
-- Table structure for table `email_otps`
--

CREATE TABLE `email_otps` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_otps`
--

INSERT INTO `email_otps` (`id`, `user_id`, `email`, `otp_code`, `expires_at`, `is_used`, `created_at`) VALUES
(9, 53, 'almughni845@gmail.com', '708384', '2025-11-10 09:31:47', 1, '2025-11-10 02:16:47'),
(13, 56, 'abdulmughni845@gmail.com', '744127', '2025-11-15 23:46:46', 1, '2025-11-15 16:31:46');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `organizer_id` int(11) NOT NULL,
  `event_date` date NOT NULL,
  `event_time` time NOT NULL,
  `end_date` date DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `current_participants` int(11) DEFAULT 0,
  `price` decimal(10,2) DEFAULT 0.00,
  `currency` varchar(3) DEFAULT 'IDR',
  `image` varchar(255) DEFAULT NULL,
  `image_aspect_ratio` varchar(10) DEFAULT '16:9',
  `banner` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','cancelled','completed') DEFAULT 'draft',
  `is_featured` tinyint(1) DEFAULT 0,
  `is_highlighted` tinyint(1) DEFAULT 0,
  `is_free` tinyint(1) DEFAULT 1,
  `has_certificate` tinyint(1) DEFAULT 0,
  `registration_deadline` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `short_description`, `category_id`, `organizer_id`, `event_date`, `event_time`, `end_date`, `end_time`, `location`, `address`, `city`, `province`, `postal_code`, `latitude`, `longitude`, `max_participants`, `current_participants`, `price`, `currency`, `image`, `image_aspect_ratio`, `banner`, `status`, `is_featured`, `is_highlighted`, `is_free`, `has_certificate`, `registration_deadline`, `created_at`, `updated_at`, `is_active`) VALUES
(18, 'reality club', 'ujikom lieur\r\n', 'reality club consert', 74, 39, '2025-11-20', '08:44:00', '2025-11-20', '12:46:00', 'bogor', 'Jl. Raya Tajur, Kp. Buntar RT.02/RW.08, Kel. Muara sari', 'Kota Bogor', 'Jawa Barat', NULL, NULL, NULL, 0, 0, 0.00, 'IDR', '/uploads/events/event-1762739150227-378357060.jpeg', '16:9', NULL, 'published', 0, 1, 1, 0, NULL, '2025-11-10 01:45:50', '2025-11-16 04:43:51', 1),
(55, 'Indonesia Tech Summit 2025', 'Konferensi teknologi terbesar di Indonesia yang menghadirkan pembicara dari perusahaan teknologi global dan lokal. Topik meliputi Artificial Intelligence, Machine Learning, Cloud Computing, Cybersecurity, dan Blockchain. Acara ini cocok untuk developer, tech entrepreneur, dan profesional IT yang ingin update dengan tren teknologi terkini. Termasuk networking session, workshop hands-on, dan startup pitch competition.', 'Konferensi teknologi terbesar dengan pembicara dari perusahaan teknologi global dan lokal. Topik: AI, ML, Cloud, Cybersecurity.', 71, 39, '2025-02-15', '08:00:00', '2025-02-15', '18:00:00', 'Jakarta Convention Center', 'Jl. Gatot Subroto No. 1, Senayan, Jakarta Pusat', 'Jakarta', 'DKI Jakarta', NULL, NULL, NULL, 1000, 0, 750000.00, 'IDR', '/uploads/events/tech-summit-2025.jpg', '16:9', '/uploads/events/tech-summit-2025-banner.jpg', 'published', 1, 1, 0, 1, '2025-02-10', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(56, 'Digital Marketing Masterclass 2025', 'Workshop intensif selama 2 hari yang mengajarkan strategi digital marketing terbaru. Materi meliputi Social Media Marketing (Instagram, TikTok, Facebook), Search Engine Optimization (SEO), Google Ads, Content Marketing, Email Marketing, dan Analytics. Dibawakan oleh praktisi digital marketing dengan pengalaman lebih dari 10 tahun. Cocok untuk business owner, marketing manager, dan content creator.', 'Workshop intensif 2 hari tentang strategi digital marketing: SEO, Social Media, Google Ads, dan Content Marketing.', 72, 39, '2025-11-25', '09:00:00', '2025-02-28', '17:00:00', 'Bandung Creative Hub', 'Jl. Layang-Layang No. 8, Bandung', 'Bandung', 'Jawa Barat', NULL, NULL, NULL, 150, 0, 450000.00, 'IDR', '/uploads/events/digital-marketing-workshop.jpg', '16:9', '/uploads/events/digital-marketing-workshop-banner.jpg', 'published', 1, 0, 0, 1, '2025-02-15', '2025-11-15 07:19:30', '2025-11-15 08:30:34', 1),
(57, 'Full Stack Web Development Bootcamp', 'Bootcamp intensif 5 hari untuk belajar full stack web development dari dasar hingga advanced. Teknologi yang dipelajari: HTML5, CSS3, JavaScript (ES6+), React.js, Node.js, Express.js, MongoDB, dan deployment. Setiap peserta akan membuat 3 project portfolio yang bisa digunakan untuk melamar kerja. Mentor berpengalaman dari perusahaan teknologi terkemuka. Cocok untuk fresh graduate, career switcher, dan developer yang ingin upgrade skill.', 'Bootcamp intensif 5 hari full stack web development: React, Node.js, MongoDB. Termasuk 3 project portfolio.', 71, 39, '2025-03-01', '09:00:00', '2025-03-05', '17:00:00', 'Surabaya Tech Park', 'Jl. Raya ITS, Keputih, Surabaya', 'Surabaya', 'Jawa Timur', NULL, NULL, NULL, 50, 0, 2500000.00, 'IDR', '/uploads/events/web-dev-bootcamp.jpg', '16:9', '/uploads/events/web-dev-bootcamp-banner.jpg', 'published', 1, 1, 0, 1, '2025-02-25', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(58, 'Jakarta Food Festival 2025', 'Festival kuliner terbesar di Jakarta yang menampilkan lebih dari 100 vendor makanan dan minuman dari seluruh Indonesia. Nikmati berbagai hidangan tradisional, modern fusion, street food, dan dessert. Ada juga cooking demo dari chef terkenal, food competition, dan live music. Cocok untuk foodie, keluarga, dan pecinta kuliner. Tiket termasuk welcome drink dan food voucher senilai Rp 50.000.', 'Festival kuliner terbesar dengan 100+ vendor makanan dari seluruh Indonesia. Termasuk cooking demo dan live music.', 84, 39, '2025-03-10', '10:00:00', '2025-03-10', '22:00:00', 'Lapangan Monas', 'Jl. Medan Merdeka, Jakarta Pusat', 'Jakarta', 'DKI Jakarta', NULL, NULL, NULL, 5000, 0, 75000.00, 'IDR', '/uploads/events/jakarta-food-festival.jpg', '16:9', '/uploads/events/jakarta-food-festival-banner.jpg', 'published', 1, 0, 0, 0, '2025-03-05', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(59, 'Contemporary Art Exhibition: \"Modern Indonesia\"', 'Pameran seni kontemporer yang menampilkan karya-karya seniman Indonesia terkemuka. Koleksi meliputi lukisan, patung, instalasi seni, digital art, dan fotografi. Tema pameran mengangkat identitas Indonesia modern dalam konteks global. Opening ceremony akan dihadiri oleh seniman dan kurator. Cocok untuk pecinta seni, kolektor, dan mahasiswa seni. Gratis untuk umum.', 'Pameran seni kontemporer karya seniman Indonesia terkemuka. Koleksi: lukisan, patung, instalasi, digital art.', 74, 39, '2025-03-15', '10:00:00', '2025-03-30', '20:00:00', 'National Gallery of Indonesia', 'Jl. Medan Merdeka Timur No. 14, Jakarta Pusat', 'Jakarta', 'DKI Jakarta', NULL, NULL, NULL, 2000, 0, 0.00, 'IDR', '/uploads/events/art-exhibition.jpg', '16:9', '/uploads/events/art-exhibition-banner.jpg', 'published', 0, 0, 1, 0, '2025-03-14', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(60, 'Health & Wellness Summit 2025', 'Seminar kesehatan dan wellness dengan pembicara dokter spesialis, nutritionist, dan wellness coach. Topik meliputi: Preventive Healthcare, Mental Health Awareness, Nutrition & Diet, Fitness & Exercise, Stress Management, dan Healthy Lifestyle. Termasuk free health screening (blood pressure, blood sugar, BMI), konsultasi kesehatan gratis, dan goodie bag. Cocok untuk semua usia yang peduli dengan kesehatan.', 'Seminar kesehatan dengan dokter spesialis dan wellness coach. Termasuk free health screening dan konsultasi.', 82, 39, '2025-03-20', '08:00:00', '2025-03-20', '16:00:00', 'Hotel Grand Indonesia', 'Jl. M.H. Thamrin No. 1, Jakarta Pusat', 'Jakarta', 'DKI Jakarta', NULL, NULL, NULL, 300, 0, 200000.00, 'IDR', '/uploads/events/health-wellness-summit.jpg', '16:9', '/uploads/events/health-wellness-summit-banner.jpg', 'published', 0, 0, 0, 1, '2025-03-15', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(61, 'Indonesia Startup Expo 2025', 'Expo startup terbesar di Indonesia yang menampilkan lebih dari 200 startup dari berbagai sektor: Fintech, EdTech, HealthTech, E-commerce, dan Agritech. Acara meliputi: startup showcase, investor pitch session, networking dengan founder dan investor, workshop entrepreneurship, dan startup competition. Cocok untuk entrepreneur, investor, developer, dan mahasiswa yang tertarik dengan startup ecosystem.', 'Expo startup dengan 200+ startup dari berbagai sektor. Termasuk investor pitch, networking, dan workshop.', 72, 39, '2025-03-25', '09:00:00', '2025-03-26', '18:00:00', 'ICE BSD City', 'Jl. BSD Grand Boulevard, Tangerang', 'Tangerang', 'Banten', NULL, NULL, NULL, 2000, 0, 150000.00, 'IDR', '/uploads/events/startup-expo.jpg', '16:9', '/uploads/events/startup-expo-banner.jpg', 'published', 1, 1, 0, 0, '2025-03-20', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(62, 'Professional Photography Workshop', 'Workshop fotografi profesional selama 1 hari yang mengajarkan teknik fotografi dari basic hingga advanced. Materi meliputi: Camera Settings & Exposure, Composition Techniques, Portrait Photography, Landscape Photography, Post-Processing dengan Lightroom & Photoshop, dan Business Photography. Dibawakan oleh fotografer profesional dengan portfolio internasional. Termasuk hands-on practice dan review hasil foto peserta.', 'Workshop fotografi profesional: teknik dasar hingga advanced, portrait, landscape, dan post-processing.', 73, 39, '2025-04-05', '09:00:00', '2025-04-05', '17:00:00', 'Yogyakarta Creative Space', 'Jl. Malioboro No. 123, Yogyakarta', 'Yogyakarta', 'DI Yogyakarta', NULL, NULL, NULL, 30, 0, 350000.00, 'IDR', '/uploads/events/photography-workshop.jpg', '16:9', '/uploads/events/photography-workshop-banner.jpg', 'published', 0, 0, 0, 1, '2025-04-01', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(63, 'Java Music Festival 2025', 'Festival musik 2 hari yang menampilkan artis lokal dan internasional dari berbagai genre: Pop, Rock, Jazz, Electronic, dan Traditional. Lineup termasuk band terkenal, solo artist, dan DJ. Fasilitas: multiple stages, food court, merchandise booth, dan camping area. Cocok untuk pecinta musik, remaja, dan keluarga. Early bird discount tersedia.', 'Festival musik 2 hari dengan artis lokal dan internasional. Multiple stages, food court, dan camping area.', 74, 39, '2025-04-12', '14:00:00', '2025-04-13', '23:00:00', 'Jogja Expo Center', 'Jl. Wonosari KM 10, Yogyakarta', 'Yogyakarta', 'DI Yogyakarta', NULL, NULL, NULL, 5000, 0, 250000.00, 'IDR', '/uploads/events/music-festival.jpg', '16:9', '/uploads/events/music-festival-banner.jpg', 'published', 1, 0, 0, 0, '2025-04-05', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(64, 'Data Science & Machine Learning Course', 'Kursus intensif 4 hari untuk belajar Data Science dan Machine Learning dari dasar. Materi meliputi: Python Programming, Data Analysis dengan Pandas & NumPy, Data Visualization, Machine Learning Algorithms, Deep Learning Basics, dan Real-World Projects. Dibawakan oleh data scientist dari perusahaan teknologi besar. Termasuk dataset untuk latihan dan certificate. Cocok untuk programmer, analyst, dan profesional yang ingin masuk ke bidang data science.', 'Kursus intensif 4 hari Data Science & ML: Python, Pandas, ML Algorithms, Deep Learning. Termasuk certificate.', 71, 39, '2025-04-20', '09:00:00', '2025-04-23', '17:00:00', 'Jakarta Tech Academy', 'Jl. Sudirman No. 52, Jakarta Pusat', 'Jakarta', 'DKI Jakarta', NULL, NULL, NULL, 40, 0, 3500000.00, 'IDR', '/uploads/events/data-science-course.jpg', '16:9', '/uploads/events/data-science-course-banner.jpg', 'published', 1, 1, 0, 1, '2025-04-15', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(65, 'Business Networking & Investment Forum', 'Forum networking bisnis dan investasi yang menghadirkan investor, entrepreneur sukses, dan business leader. Acara meliputi: keynote speeches, panel discussion, networking session, pitch session untuk startup, dan one-on-one meeting dengan investor. Cocok untuk entrepreneur, startup founder, investor, dan business professional yang ingin expand network dan mencari peluang investasi.', 'Forum networking bisnis dan investasi dengan investor dan entrepreneur sukses. Termasuk pitch session.', 72, 39, '2025-05-01', '13:00:00', '2025-05-01', '20:00:00', 'The Ritz-Carlton Jakarta', 'Jl. Lingkar Mega Kuningan, Jakarta Selatan', 'Jakarta', 'DKI Jakarta', NULL, NULL, NULL, 200, 0, 300000.00, 'IDR', '/uploads/events/business-networking.jpg', '16:9', '/uploads/events/business-networking-banner.jpg', 'published', 0, 0, 0, 0, '2025-04-25', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1),
(66, 'Yoga & Meditation Retreat Bali', 'Retreat yoga dan meditasi selama 3 hari di lokasi yang tenang di Bali. Program meliputi: morning yoga sessions, meditation classes, healthy meals, spa sessions, nature walks, dan wellness workshops. Dibimbing oleh certified yoga instructor dan meditation teacher. Cocok untuk yang ingin recharge, reduce stress, dan improve mental health. Termasuk akomodasi dan semua meals.', 'Retreat yoga & meditasi 3 hari di Bali. Termasuk yoga sessions, meditation, healthy meals, dan spa.', 82, 39, '2025-05-10', '08:00:00', '2025-05-12', '18:00:00', 'Ubud Yoga Retreat Center', 'Jl. Raya Ubud, Gianyar, Bali', 'Gianyar', 'Bali', NULL, NULL, NULL, 25, 0, 2500000.00, 'IDR', '/uploads/events/yoga-retreat.jpg', '16:9', '/uploads/events/yoga-retreat-banner.jpg', 'published', 1, 0, 0, 0, '2025-05-05', '2025-11-15 07:19:30', '2025-11-15 07:19:30', 1);

-- --------------------------------------------------------

--
-- Table structure for table `event_registrations`
--

CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `payment_method` enum('cash','midtrans','bank_transfer') DEFAULT 'cash',
  `payment_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','approved','cancelled','attended') DEFAULT 'pending',
  `registration_fee` decimal(10,2) DEFAULT 0.00,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_date` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_registrations`
--

INSERT INTO `event_registrations` (`id`, `user_id`, `event_id`, `payment_method`, `payment_amount`, `status`, `registration_fee`, `payment_status`, `payment_date`, `notes`, `created_at`, `updated_at`) VALUES
(2, 53, 18, 'cash', 0.00, 'approved', 0.00, 'paid', NULL, NULL, '2025-11-16 07:24:28', '2025-11-16 07:24:28'),
(3, 39, 18, 'cash', 0.00, 'approved', 0.00, 'paid', NULL, NULL, '2025-11-16 07:25:09', '2025-11-16 07:25:09');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `migration_name` varchar(255) NOT NULL,
  `executed_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration_name`, `executed_at`) VALUES
(1, '001_create_users_table.sql', '2025-10-24 00:37:08'),
(2, '002_create_categories_table.sql', '2025-10-24 00:37:08'),
(3, '003_create_events_table.sql', '2025-10-24 00:37:08'),
(4, '004_create_registrations_table.sql', '2025-10-24 00:37:08'),
(5, '005_create_reviews_table.sql', '2025-10-24 00:37:08'),
(6, '006_insert_default_data.sql', '2025-10-24 00:37:08'),
(7, '007_create_email_otps_table.sql', '2025-10-24 00:37:08'),
(8, '008_create_analytics_table.sql', '2025-10-24 00:37:08'),
(9, '008_create_password_resets_table.sql', '2025-10-24 00:37:08'),
(10, '009_create_articles_table.sql', '2025-10-24 00:37:08'),
(11, '010_create_contacts_table.sql', '2025-10-24 00:37:08'),
(12, '010_create_payments_table.sql', '2025-10-24 00:37:08'),
(13, '011_insert_sample_events.sql', '2025-10-24 00:37:08'),
(14, '014_add_is_active_to_events.sql', '2025-10-24 00:37:08'),
(15, '015_recreate_categories_table.sql', '2025-10-24 00:37:08'),
(16, '016_create_attendance_tokens.sql', '2025-10-24 00:37:08'),
(17, '017_create_certificates_table.sql', '2025-10-24 00:37:08'),
(18, '018_create_certificate_templates_table.sql', '2025-10-24 00:37:08'),
(19, '019_insert_default_certificate_template.sql', '2025-10-24 00:37:08'),
(20, '020_create_event_registrations_table.sql', '2025-10-24 00:37:08'),
(21, '021_fix_attendance_tokens_table.sql', '2025-10-24 00:37:08'),
(22, '022_create_attendance_tables.sql', '2025-10-24 00:37:08'),
(23, '023_add_is_highlighted_to_events.sql', '2025-10-24 00:37:08'),
(24, '024_add_has_certificate_to_events.sql', '2025-10-24 00:37:08'),
(25, '025_create_performers_table.sql', '2025-11-06 14:57:31'),
(26, '026_add_image_aspect_ratio_to_events.sql', '2025-11-07 07:53:59'),
(27, '027_update_reviews_for_platform.sql', '2025-11-07 08:10:02'),
(28, '028_cleanup_duplicate_categories.sql', '2025-11-07 09:03:07'),
(29, '028_insert_sample_reviews.sql', '2025-11-10 01:58:58'),
(30, '029_set_first_event_highlighted.sql', '2025-11-11 11:17:53'),
(31, '030_add_user_profile_fields.sql', '2025-11-11 11:45:31'),
(32, '031_add_registrant_data_fields.sql', '2025-11-12 06:10:41'),
(33, '032_add_registrant_fields_to_registrations.sql', '2025-11-12 06:17:59'),
(34, '033_add_participant_fields_to_event_registrations.sql', '2025-11-13 10:40:18'),
(35, '033_add_reply_message_to_contacts.sql', '2025-11-14 03:16:10'),
(36, '033_add_customization_to_certificates.sql', '2025-11-14 11:06:56'),
(37, '034_add_attendance_requirement.sql', '2025-11-14 11:12:27'),
(38, '035_add_attendance_to_event_registrations.sql', '2025-11-14 11:15:58'),
(39, '036_insert_realistic_events.sql', '2025-11-15 07:15:07');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `reset_token` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `registration_id` int(11) NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'midtrans',
  `status` enum('pending','success','failed','challenge') NOT NULL DEFAULT 'pending',
  `midtrans_token` varchar(255) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `performers`
--

CREATE TABLE `performers` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `registration_date` timestamp NULL DEFAULT current_timestamp(),
  `status` enum('pending','confirmed','cancelled','attended') DEFAULT 'pending',
  `attendance_required` tinyint(1) DEFAULT 1,
  `attendance_status` enum('pending','attended','absent','failed') DEFAULT 'pending',
  `attendance_deadline` datetime DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_amount` decimal(10,2) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `id_number` varchar(50) DEFAULT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `emergency_phone` varchar(20) DEFAULT NULL,
  `institution` varchar(255) DEFAULT NULL COMMENT 'Sekolah/Universitas/Organisasi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `is_approved` tinyint(1) DEFAULT 0,
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `full_name`, `rating`, `comment`, `is_verified`, `is_approved`, `admin_notes`, `created_at`, `updated_at`) VALUES
(13, 53, 'Abdul Al Mughni', 5, 'KIRA KIRA BAGUSS GA YAA', 0, 0, NULL, '2025-11-10 02:23:18', '2025-11-14 10:18:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL COMMENT 'Alamat tempat tinggal pengguna',
  `education` varchar(100) DEFAULT NULL COMMENT 'Pendidikan terakhir (SD/SMP/SMA/D3/S1/S2/S3)',
  `role` enum('admin','organizer','user') DEFAULT 'user',
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `phone`, `address`, `education`, `role`, `avatar`, `is_active`, `created_at`, `updated_at`) VALUES
(39, 'admin', 'abdul.mughni845@gmail.com', '$2a$12$W3oHboouQpA8c5XGesNBk.Cb1/EXnmxYzjHEWmlJirrAajTCNYJTu', 'admin', '', NULL, NULL, 'admin', NULL, 1, '2025-08-29 03:34:07', '2025-11-11 10:58:39'),
(53, 'dudul', 'almughni845@gmail.com', '$2a$12$Knd3lndpQTRMDzVrP/MOI.bEq/wQ16xXOQTJMjGHNINoRyKQ939Xu', 'Abdul Al Mughni', '081288295138', NULL, NULL, 'user', NULL, 1, '2025-11-10 02:16:47', '2025-11-10 02:17:29'),
(56, 'dapin123', 'abdulmughni845@gmail.com', '$2a$12$qHq2.EaR9ifYsFVDgvz8ledGwMcWIWTMOlk3Fy6mlu8pAbooLbFLe', 'Davin Dwi', '081288295138', 'Jl. Raya Tajur, Kp. Buntar RT.02/RW.08, Kel. Muara sari', NULL, 'user', NULL, 1, '2025-11-15 16:31:46', '2025-11-16 04:57:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analytics`
--
ALTER TABLE `analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_id` (`event_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_action_type` (`action_type`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `idx_articles_status` (`status`),
  ADD KEY `idx_articles_category` (`category`),
  ADD KEY `idx_articles_published` (`published_at`),
  ADD KEY `idx_articles_featured` (`is_featured`),
  ADD KEY `idx_articles_slug` (`slug`);

--
-- Indexes for table `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `token_id` (`token_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `attendance_tokens`
--
ALTER TABLE `attendance_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_registration_id` (`registration_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_event_id` (`event_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificate_number` (`certificate_number`),
  ADD KEY `attendance_record_id` (`attendance_record_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_event_id` (`event_id`),
  ADD KEY `idx_certificate_number` (`certificate_number`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `certificate_templates`
--
ALTER TABLE `certificate_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_template_type` (`template_type`),
  ADD KEY `idx_is_default` (`is_default`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `replied_by` (`replied_by`),
  ADD KEY `idx_contacts_status` (`status`),
  ADD KEY `idx_contacts_email` (`email`),
  ADD KEY `idx_contacts_created` (`created_at`);

--
-- Indexes for table `email_otps`
--
ALTER TABLE `email_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_title` (`title`),
  ADD KEY `idx_event_date` (`event_date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_organizer_id` (`organizer_id`),
  ADD KEY `idx_category_id` (`category_id`),
  ADD KEY `idx_is_featured` (`is_featured`),
  ADD KEY `idx_location` (`city`,`province`),
  ADD KEY `idx_is_highlighted` (`is_highlighted`),
  ADD KEY `idx_events_has_certificate` (`has_certificate`);

--
-- Indexes for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_registration` (`event_id`,`user_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_event_id` (`event_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `migration_name` (`migration_name`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_token` (`reset_token`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_registration_id` (`registration_id`);

--
-- Indexes for table `performers`
--
ALTER TABLE `performers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_id` (`event_id`),
  ADD KEY `idx_display_order` (`display_order`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_registration` (`event_id`,`user_id`),
  ADD KEY `idx_event_id` (`event_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_registration_date` (`registration_date`),
  ADD KEY `idx_phone` (`phone`),
  ADD KEY `idx_id_number` (`id_number`),
  ADD KEY `idx_institution` (`institution`),
  ADD KEY `idx_registrations_attendance_status` (`attendance_status`),
  ADD KEY `idx_registrations_attendance_deadline` (`attendance_deadline`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_is_approved` (`is_approved`),
  ADD KEY `idx_rating_approved` (`rating`,`is_approved`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_education` (`education`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `analytics`
--
ALTER TABLE `analytics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `attendance_records`
--
ALTER TABLE `attendance_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance_tokens`
--
ALTER TABLE `attendance_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certificate_templates`
--
ALTER TABLE `certificate_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `email_otps`
--
ALTER TABLE `email_otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `performers`
--
ALTER TABLE `performers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

-- --------------------------------------------------------

--
-- Structure for view `analytics_summary`
--
DROP TABLE IF EXISTS `analytics_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `analytics_summary`  AS SELECT cast(`analytics`.`created_at` as date) AS `date`, count(0) AS `total_actions`, count(distinct `analytics`.`user_id`) AS `unique_users`, count(case when `analytics`.`action_type` = 'view' then 1 end) AS `views`, count(case when `analytics`.`action_type` = 'register' then 1 end) AS `registrations`, count(case when `analytics`.`action_type` = 'cancel' then 1 end) AS `cancellations`, count(case when `analytics`.`action_type` = 'complete' then 1 end) AS `completions` FROM `analytics` GROUP BY cast(`analytics`.`created_at` as date) ORDER BY cast(`analytics`.`created_at` as date) DESC ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `analytics`
--
ALTER TABLE `analytics`
  ADD CONSTRAINT `analytics_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `analytics_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD CONSTRAINT `attendance_records_ibfk_1` FOREIGN KEY (`token_id`) REFERENCES `attendance_tokens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_records_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_records_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendance_tokens`
--
ALTER TABLE `attendance_tokens`
  ADD CONSTRAINT `attendance_tokens_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_tokens_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_tokens_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `certificates_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `certificates_ibfk_3` FOREIGN KEY (`attendance_record_id`) REFERENCES `attendance_records` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`replied_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `email_otps`
--
ALTER TABLE `email_otps`
  ADD CONSTRAINT `fk_email_otps_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `fk_password_resets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `event_registrations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `performers`
--
ALTER TABLE `performers`
  ADD CONSTRAINT `performers_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `registrations`
--
ALTER TABLE `registrations`
  ADD CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
