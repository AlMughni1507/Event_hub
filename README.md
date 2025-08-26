# Event Management System

Sistem manajemen event dengan fitur autentikasi, OTP email, dan dashboard admin terpisah.

## Fitur Utama

### 🔐 Autentikasi & Keamanan
- **Login Multi-Role**: Admin dan User/Visitor
- **Registrasi dengan OTP**: Verifikasi email wajib untuk visitor
- **JWT Authentication**: Token-based security
- **Role-based Access**: Pembatasan akses berdasarkan role

### 👥 User Management
- **Admin**: `admin@gmail.com` / `admin123` (username dan email sama)
- **Visitor**: Wajib register dengan OTP email
- **User Activation**: Akun visitor harus diverifikasi via OTP

### 🎯 Admin Dashboard (AdminLTE)
- **Dashboard Stats**: Total users, events, categories, registrations
- **User Management**: CRUD users, aktivasi/deaktivasi
- **Event Management**: CRUD events dan categories
- **Registration Management**: Lihat semua registrasi
- **Reports**: Laporan events dan users

### 🌐 Frontend
- **Tampilan Utama**: Design modern untuk visitor
- **Admin Panel**: AdminLTE design terpisah
- **Responsive**: Mobile-friendly

## Struktur Folder

```
ujikom-web-event/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── admin/       # AdminLTE Components
│   │   ├── pages/
│   │   │   ├── main/        # Tampilan Utama
│   │   │   ├── events/      # Halaman Events
│   │   │   ├── auth/        # Login & Register
│   │   │   └── admin/       # Admin Dashboard
│   │   └── styles/
│   │       └── admin.css    # AdminLTE Styles
├── server/                  # Node.js Backend
│   ├── routes/
│   │   ├── auth.js         # Authentication
│   │   ├── events.js       # Events API
│   │   └── admin.js        # Admin API
│   ├── middleware/         # Auth & Validation
│   ├── utils/              # Email & Utilities
│   └── migrations/         # Database Migrations
```

## Setup & Instalasi

### 1. Database Setup
```sql
-- Jalankan semua file di folder server/migrations/
-- Urutan: 001, 002, 003, dst.
```

### 2. Environment Variables
Buat file `server/config.env`:
```env
# Database
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Email (untuk OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_EMAIL=no-reply@example.com

# Admin Seed
ADMIN_SEED_KEY=change-this-seed-key
```

### 3. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd frontend
npm install
```

### 4. Seed Admin
```bash
# Di folder server
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:3000/api/auth/seed-admin" `
  -ContentType "application/json" `
  -Body (@{
    key = "change-this-seed-key"
    username = "admin@gmail.com"
    email = "admin@gmail.com"
    password = "admin123"
    full_name = "System Administrator"
  } | ConvertTo-Json)
```

### 5. Run Application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register visitor
- `POST /api/auth/request-email-otp` - Request OTP
- `POST /api/auth/verify-email` - Verify OTP
- `POST /api/auth/login/user` - Login visitor
- `POST /api/auth/login/admin` - Login admin
- `POST /api/auth/seed-admin` - Create admin (one-time)

### Admin (Protected)
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/events` - Get all events
- `GET /api/admin/categories` - Get all categories
- `GET /api/admin/registrations` - Get all registrations
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user

### Events (Public)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event detail
- `GET /api/events/featured` - Get featured events

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
