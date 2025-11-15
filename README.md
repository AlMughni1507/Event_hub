# Event Yukk Platform

Aplikasi manajemen event modern berbasis web yang dibangun dengan React, Node.js, dan MySQL. Platform ini menyediakan fitur lengkap untuk pengelolaan event, pendaftaran peserta, pembayaran, sertifikat, dan analitik.

## 🌟 Fitur Utama

- 🔐 Autentikasi & Keamanan
  - Login Multi-Role (Admin/User)
  - Registrasi dengan OTP Email
  - JWT Authentication
  - Role-based Access Control

- 👥 User Management
  - Authentikasi (Login/Register)
  - Role-based access (Admin/User)
  - Profil pengguna
  - Email OTP verification
  
- � Manajemen Event
  - Pembuatan dan pengelolaan event
  - Kategori event
  - Event highlight
  - Sertifikat peserta
  
- 💳 Pembayaran & Registrasi
  - Integrasi Midtrans Payment Gateway
  - Manajemen pendaftaran
  - Riwayat pembayaran
  
- 📊 Analytics & Reporting
  - Dashboard admin
  - Statistik event
  - Export data (XLSX, DOCX)
  
- � Fitur Tambahan
  - Blog/Artikel
  - Kontak form
  - Reviews & Rating
  - PWA support
  - Email notifications

## 🛠️ Tech Stack

### Frontend
- React + Vite
- TailwindCSS
- React Router DOM
- Axios
- Chart.js
- Framer Motion

### Backend
- Node.js + Express
- MySQL/MariaDB
- JWT Authentication
- Nodemailer
- Multer (file uploads)
- Express Validator
- Helmet & CORS

## 📁 Struktur Folder

```
ujikom-web-event/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── lib/            # Utilities
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin dashboard
│   │   │   ├── auth/       # Login/Register
│   │   │   ├── events/     # Event pages
│   │   │   └── main/       # Public pages
│   │   ├── services/       # API services
│   │   └── styles/         # CSS/styling
│   └── public/             # Static assets
├── server/                  # Node.js Backend
│   ├── middleware/         # Express middleware
│   ├── migrations/         # Database migrations
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── uploads/           # Uploaded files
│   └── utils/             # Utilities
```

## 📦 Prasyarat

- Node.js v18+
- MySQL/MariaDB
- SMTP Server (untuk email)
- Midtrans Account (opsional)

## 🚀 Setup & Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/AlMughni1507/ujikom-web-event.git
cd ujikom-web-event
```

### 2. Database Setup
1. Buat database MySQL baru
2. Import semua file migrasi di folder `server/migrations/` secara berurutan

### 3. Konfigurasi Environment

#### Backend (`server/config.env`)
```env
# Database
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_db
DB_PORT=3306

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=Event Yukk

# Midtrans (opsional)
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd frontend
npm install
```

### 5. Seed Admin User
```bash
curl -X POST http://localhost:3000/api/auth/seed-admin -H "Content-Type: application/json" -d '{
  "key": "change-this-seed-key",
  "username": "admin@gmail.com",
  "email": "admin@gmail.com",
  "password": "admin123",
  "full_name": "System Administrator"
}'
```

### 6. Jalankan Aplikasi

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend akan berjalan di http://localhost:5173
Backend akan berjalan di http://localhost:3000

## 📝 API Documentation

Base URL: `http://localhost:3000/api`

### Endpoints

- 🔐 Auth: `/auth/*`
- 📅 Events: `/events/*`
- 👥 Users: `/users/*`
- 📦 Categories: `/categories/*`
- 💳 Payments: `/payments/*`
- 📊 Analytics: `/analytics/*`
- 📝 Articles: `/articles/*`
- 📞 Contact: `/contact/*`

Detail dokumentasi API dapat dilihat di kode route masing-masing endpoint.

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Al Mughni - abdul.mughni845@gmail.com

Project Link: https://github.com/AlMughni1507/ujikom-web-event

## User Flow

### Visitor
1. **Register** → Isi form pendaftaran
2. **OTP Verification** → Cek email, masukkan OTP
3. **Login** → Akses tampilan utama
4. **Browse Events** → Lihat dan daftar event

### Admin
1. **Login** → `admin@gmail.com` / `admin123`
2. **Dashboard** → Akses admin panel
3. **Management** → Kelola users, events, categories
4. **Reports** → Lihat laporan dan statistik

## Teknologi

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- AdminLTE (untuk admin panel)
- Font Awesome

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- Nodemailer (OTP)
- bcryptjs

## Troubleshooting

### Email OTP tidak terkirim
1. Pastikan SMTP settings benar
2. Gunakan App Password untuk Gmail
3. Cek spam folder

### Database connection error
1. Pastikan MySQL running
2. Cek credentials di config.env
3. Pastikan database `event_db` sudah dibuat

### Admin login gagal
1. Pastikan admin sudah di-seed
2. Cek username/email: `admin@gmail.com`
3. Password: `admin123`

## License

MIT License
