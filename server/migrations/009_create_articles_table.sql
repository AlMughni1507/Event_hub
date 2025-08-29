-- Create articles table for blog/news functionality
CREATE TABLE IF NOT EXISTS articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    category ENUM('news', 'tips', 'event-update', 'general') DEFAULT 'general',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    author_id INT,
    views INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags JSON,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_articles_status (status),
    INDEX idx_articles_category (category),
    INDEX idx_articles_published (published_at),
    INDEX idx_articles_featured (is_featured),
    INDEX idx_articles_slug (slug)
);

-- Insert sample articles
INSERT INTO articles (title, slug, excerpt, content, category, status, author_id, is_featured, published_at, tags) VALUES
('Tips Memilih Event yang Tepat untuk Karir Anda', 'tips-memilih-event-karir', 'Panduan lengkap untuk memilih event yang dapat mendukung pengembangan karir profesional Anda.', 
'<h2>Mengapa Memilih Event yang Tepat Penting?</h2>
<p>Dalam era digital ini, menghadiri event yang tepat dapat menjadi kunci sukses dalam pengembangan karir. Event tidak hanya memberikan pengetahuan baru, tetapi juga kesempatan networking yang berharga.</p>

<h2>1. Tentukan Tujuan Anda</h2>
<p>Sebelum memilih event, tentukan terlebih dahulu apa yang ingin Anda capai:</p>
<ul>
<li>Meningkatkan skill teknis</li>
<li>Memperluas jaringan profesional</li>
<li>Mencari peluang karir baru</li>
<li>Update tren industri terkini</li>
</ul>

<h2>2. Riset Speaker dan Materi</h2>
<p>Pastikan speaker memiliki kredibilitas dan pengalaman yang relevan dengan bidang Anda. Materi yang disampaikan harus up-to-date dan applicable.</p>

<h2>3. Pertimbangkan Format Event</h2>
<p>Pilih format yang sesuai dengan gaya belajar Anda:</p>
<ul>
<li>Workshop interaktif</li>
<li>Seminar presentasi</li>
<li>Conference multi-track</li>
<li>Networking session</li>
</ul>

<h2>4. Evaluasi ROI (Return on Investment)</h2>
<p>Hitung investasi waktu dan biaya dengan manfaat yang akan diperoleh. Event yang baik akan memberikan value yang sebanding dengan investasi Anda.</p>', 
'tips', 'published', 1, TRUE, NOW(), '["karir", "tips", "profesional", "networking"]'),

('Cara Daftar Seminar Kampus dengan Mudah', 'cara-daftar-seminar-kampus', 'Langkah-langkah praktis untuk mendaftar seminar kampus dan mendapatkan sertifikat yang berharga.', 
'<h2>Persiapan Sebelum Mendaftar</h2>
<p>Sebelum mendaftar seminar kampus, ada beberapa hal yang perlu dipersiapkan untuk memastikan proses pendaftaran berjalan lancar.</p>

<h2>1. Pilih Seminar yang Relevan</h2>
<p>Pastikan topik seminar sesuai dengan minat dan kebutuhan akademik atau karir Anda. Baca deskripsi lengkap dan profil pembicara.</p>

<h2>2. Siapkan Dokumen yang Diperlukan</h2>
<ul>
<li>KTM (Kartu Tanda Mahasiswa) atau identitas lainnya</li>
<li>CV terbaru (jika diperlukan)</li>
<li>Surat keterangan dari kampus (untuk beberapa seminar)</li>
<li>Foto formal ukuran 3x4</li>
</ul>

<h2>3. Proses Pendaftaran Online</h2>
<p>Kebanyakan seminar kampus menggunakan sistem pendaftaran online:</p>
<ol>
<li>Kunjungi website resmi penyelenggara</li>
<li>Buat akun atau login jika sudah punya</li>
<li>Isi formulir pendaftaran dengan lengkap</li>
<li>Upload dokumen yang diperlukan</li>
<li>Lakukan pembayaran (jika berbayar)</li>
<li>Simpan bukti pendaftaran</li>
</ol>

<h2>4. Tips Sukses Mengikuti Seminar</h2>
<ul>
<li>Datang tepat waktu</li>
<li>Bawa alat tulis dan notebook</li>
<li>Aktif bertanya dan berdiskusi</li>
<li>Networking dengan peserta lain</li>
<li>Minta kontak pembicara jika memungkinkan</li>
</ul>', 
'tips', 'published', 1, FALSE, NOW(), '["seminar", "kampus", "mahasiswa", "pendaftaran"]'),

('Event Tech Terbesar 2024 Segera Hadir!', 'event-tech-terbesar-2024', 'Jangan lewatkan kesempatan menghadiri event teknologi terbesar tahun ini dengan speaker internasional.', 
'<h2>Tech Summit 2024: Innovation for Future</h2>
<p>Event teknologi paling dinanti tahun ini akan segera hadir! Tech Summit 2024 menghadirkan inovasi terdepan dan speaker kelas dunia.</p>

<h2>Highlight Event</h2>
<ul>
<li><strong>Tanggal:</strong> 15-17 Maret 2024</li>
<li><strong>Lokasi:</strong> Jakarta Convention Center</li>
<li><strong>Peserta:</strong> 5000+ profesional tech</li>
<li><strong>Speaker:</strong> 50+ expert internasional</li>
</ul>

<h2>Topik Utama</h2>
<ul>
<li>Artificial Intelligence & Machine Learning</li>
<li>Blockchain & Cryptocurrency</li>
<li>Cloud Computing & DevOps</li>
<li>Cybersecurity</li>
<li>IoT & Smart Cities</li>
<li>Mobile App Development</li>
</ul>

<h2>Speaker Unggulan</h2>
<p>Event ini menghadirkan para ahli teknologi terkemuka dari berbagai perusahaan global seperti Google, Microsoft, Amazon, dan startup unicorn terdepan.</p>

<h2>Early Bird Promo</h2>
<p>Dapatkan diskon hingga 40% untuk pendaftaran sebelum 1 Februari 2024. Jangan sampai terlewat!</p>

<p><strong>Daftar sekarang dan jadilah bagian dari revolusi teknologi!</strong></p>', 
'event-update', 'published', 1, TRUE, NOW(), '["tech", "summit", "2024", "teknologi", "AI"]'),

('Networking: Kunci Sukses di Dunia Profesional', 'networking-kunci-sukses-profesional', 'Pelajari strategi networking yang efektif untuk membangun relasi profesional yang kuat dan berkelanjutan.', 
'<h2>Mengapa Networking Penting?</h2>
<p>Dalam dunia profesional modern, kemampuan networking menjadi salah satu soft skill yang paling berharga. Lebih dari 70% peluang karir diperoleh melalui networking.</p>

<h2>Strategi Networking yang Efektif</h2>

<h3>1. Mulai dari Lingkaran Terdekat</h3>
<p>Networking tidak selalu harus dengan orang baru. Mulai dari:</p>
<ul>
<li>Teman kuliah dan alumni</li>
<li>Rekan kerja dan mantan kolega</li>
<li>Keluarga dan teman dekat</li>
<li>Mentor dan dosen</li>
</ul>

<h3>2. Manfaatkan Platform Digital</h3>
<ul>
<li>LinkedIn untuk networking profesional</li>
<li>Twitter untuk mengikuti thought leaders</li>
<li>Discord/Slack untuk komunitas industri</li>
<li>Clubhouse untuk diskusi audio</li>
</ul>

<h3>3. Hadiri Event dan Komunitas</h3>
<p>Aktif menghadiri berbagai event seperti:</p>
<ul>
<li>Conference dan seminar industri</li>
<li>Meetup lokal</li>
<li>Workshop dan training</li>
<li>Alumni gathering</li>
</ul>

<h2>Tips Networking yang Autentik</h2>
<ol>
<li><strong>Be Genuine:</strong> Tunjukkan ketertarikan yang tulus</li>
<li><strong>Listen More:</strong> Dengarkan lebih banyak daripada berbicara</li>
<li><strong>Give First:</strong> Tawarkan bantuan sebelum meminta</li>
<li><strong>Follow Up:</strong> Jaga komunikasi setelah bertemu</li>
<li><strong>Add Value:</strong> Selalu cari cara untuk memberikan nilai</li>
</ol>

<h2>Kesalahan Networking yang Harus Dihindari</h2>
<ul>
<li>Hanya menghubungi saat butuh bantuan</li>
<li>Terlalu fokus pada diri sendiri</li>
<li>Tidak mengikuti komitmen yang dibuat</li>
<li>Networking hanya untuk kepentingan pribadi</li>
</ul>', 
'tips', 'published', 1, FALSE, NOW(), '["networking", "karir", "profesional", "relasi"]');
