# Event Management System

Sistem manajemen event yang lengkap dengan backend API dan frontend React.

## 🚀 Quick Start

### Cara Termudah (Windows)
1. **Double click** `start-server.bat` untuk menjalankan backend
2. **Double click** `start-frontend.bat` untuk menjalankan frontend

### Cara Manual
```bash
# Backend
cd server
npm install
npm run dev

# Frontend (di terminal baru)
cd frontend
npm install
npm run dev
```

## 🚀 Fitur

### Backend API
- ✅ Authentication dengan JWT
- ✅ CRUD Events
- ✅ CRUD Categories  
- ✅ Event Registration
- ✅ User Management
- ✅ Role-based Authorization
- ✅ Input Validation
- ✅ Error Handling
- ✅ Database Migration
- ✅ Security Middleware

### Frontend React
- ✅ React 19 + Vite
- ✅ Tailwind CSS v4
- ✅ Responsive Design
- ✅ Modern UI Components
- ✅ Custom Animations

## 📁 Struktur Project

```
ujikom-web-event/
├── start-server.bat          # Script untuk menjalankan server
├── start-frontend.bat        # Script untuk menjalankan frontend
├── start-server.ps1          # PowerShell script untuk server
├── start-frontend.ps1        # PowerShell script untuk frontend
├── CARA_MENJALANKAN.md       # Dokumentasi cara menjalankan
├── frontend/                 # React Frontend
│   ├── src/
│   ├── public/
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── server/                   # Node.js Backend
│   ├── routes/              # API Routes
│   ├── middleware/          # Middleware
│   ├── migrations/          # Database Migrations
│   ├── utils/               # Utilities
│   ├── uploads/             # File Uploads
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - CSS framework
- **PostCSS** - CSS processor

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- npm atau yarn

### 1. Setup Database
```bash
cd server
npm run setup
```

### 2. Jalankan Backend
```bash
# Cara 1: Double click start-server.bat
# Cara 2: Manual
cd server
npm run dev
```

### 3. Jalankan Frontend
```bash
# Cara 1: Double click start-frontend.bat
# Cara 2: Manual
cd frontend
npm run dev
```

## 📊 Database Setup

### 1. Buat Database
```bash
cd server
npm run create-db
```

### 2. Jalankan Migrations
```bash
npm run migrate
```

### 3. Default Admin User
Setelah migration, tersedia user admin default:
- **Email**: admin@eventapp.com
- **Password**: admin123
- **Role**: admin

## 🔧 Configuration

### Backend Environment
Buat file `server/config.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=event_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get profile
- `PUT /auth/profile` - Update profile
- `PUT /auth/change-password` - Change password

#### Events
- `GET /events` - Get all events
- `GET /events/featured` - Get featured events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create event (organizer/admin)
- `PUT /events/:id` - Update event (organizer/admin)
- `DELETE /events/:id` - Delete event (organizer/admin)

#### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (admin)
- `PUT /categories/:id` - Update category (admin)
- `DELETE /categories/:id` - Delete category (admin)

#### Registrations
- `POST /registrations` - Register for event
- `GET /registrations/my-registrations` - Get my registrations
- `GET /registrations/event/:id` - Get event registrations (organizer/admin)
- `PUT /registrations/:id/status` - Update registration status (organizer/admin)
- `PUT /registrations/:id/cancel` - Cancel registration

### Authentication
Semua endpoint yang memerlukan authentication menggunakan JWT Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

## 🎨 Frontend Features

### Tailwind CSS Components
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outline button
- `.card` - Card component
- `.input-field` - Input field
- `.form-label` - Form label
- `.badge` - Badge component

### Custom Colors
- `primary-{50-950}` - Primary color palette
- `secondary-{50-950}` - Secondary color palette

### Custom Animations
- `animate-fade-in` - Fade in animation
- `animate-slide-up` - Slide up animation
- `animate-bounce-gentle` - Gentle bounce animation

## 🔒 Security Features

- JWT Authentication
- Password hashing dengan bcryptjs
- Input validation dengan express-validator
- Security headers dengan helmet
- Rate limiting
- CORS protection
- SQL injection protection

## 📝 Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run create-db    # Create database
npm run migrate      # Run migrations
npm run setup        # Setup database and migrations
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🧪 Testing API

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123",
    "full_name": "Test User",
    "phone": "081234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

## 🐛 Troubleshooting

### Database Connection Error
- Pastikan MySQL server berjalan
- Periksa konfigurasi database di `config.env`
- Jalankan `npm run create-db` untuk membuat database

### Port Already in Use
- Ubah port di `config.env`
- Atau kill process yang menggunakan port tersebut

### Module Not Found
- Jalankan `npm install` di folder server dan frontend
- Pastikan semua dependencies terinstal

### Server tidak berjalan
1. Pastikan MySQL server berjalan
2. Jalankan `npm run setup` di folder server
3. Pastikan port 3000 tidak digunakan aplikasi lain

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

## ✅ Status Project

- ✅ Backend API: Berjalan di port 3000
- ✅ Frontend: Berjalan di port 5173
- ✅ Database: MySQL dengan 6 tabel
- ✅ Authentication: JWT dengan bcryptjs
- ✅ Security: Helmet, CORS, rate limiting
- ✅ Documentation: Lengkap

**Status: READY FOR DEVELOPMENT** 🚀

3. Pastikan port 3000 tidak digunakan aplikasi lain

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

## ✅ Status Project

- ✅ Backend API: Berjalan di port 3000
- ✅ Frontend: Berjalan di port 5173
- ✅ Database: MySQL dengan 6 tabel
- ✅ Authentication: JWT dengan bcryptjs
- ✅ Security: Helmet, CORS, rate limiting
- ✅ Documentation: Lengkap

**Status: READY FOR DEVELOPMENT** 🚀

3. Pastikan port 3000 tidak digunakan aplikasi lain

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

## ✅ Status Project

- ✅ Backend API: Berjalan di port 3000
- ✅ Frontend: Berjalan di port 5173
- ✅ Database: MySQL dengan 6 tabel
- ✅ Authentication: JWT dengan bcryptjs
- ✅ Security: Helmet, CORS, rate limiting
- ✅ Documentation: Lengkap

**Status: READY FOR DEVELOPMENT** 🚀

3. Pastikan port 3000 tidak digunakan aplikasi lain

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

## ✅ Status Project

- ✅ Backend API: Berjalan di port 3000
- ✅ Frontend: Berjalan di port 5173
- ✅ Database: MySQL dengan 6 tabel
- ✅ Authentication: JWT dengan bcryptjs
- ✅ Security: Helmet, CORS, rate limiting
- ✅ Documentation: Lengkap

**Status: READY FOR DEVELOPMENT** 🚀
