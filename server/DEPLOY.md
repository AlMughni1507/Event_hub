# Deployment Guide untuk Backend

## Opsi 1: Railway (Recommended - Paling Mudah)

1. **Daftar di Railway**: https://railway.app
2. **Create New Project** → **Deploy from GitHub repo**
3. **Pilih repository** dan **Root Directory**: `server`
4. **Set Environment Variables** di Railway:
   - `DB_HOST` - Host database (jika pakai Railway MySQL, otomatis)
   - `DB_USER` - Username database
   - `DB_PASSWORD` - Password database
   - `DB_NAME` - Nama database
   - `DB_PORT` - Port database (biasanya 3306)
   - `JWT_SECRET` - Secret key untuk JWT (buat yang kuat!)
   - `FRONTEND_URL` - URL frontend Vercel (contoh: `https://eventyukk.vercel.app`)
   - `NODE_ENV` - Set ke `production`
   - Dan semua variable lain dari `.env.example`

5. **Add MySQL Database** (jika belum ada):
   - Klik **+ New** → **Database** → **MySQL**
   - Railway akan otomatis set `DATABASE_URL` atau variable database lainnya

6. **Deploy** - Railway akan otomatis deploy setelah push ke GitHub

## Opsi 2: Render

1. **Daftar di Render**: https://render.com
2. **New** → **Web Service**
3. **Connect GitHub** dan pilih repository
4. **Settings**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

5. **Set Environment Variables** (sama seperti Railway)

6. **Add MySQL Database**:
   - **New** → **PostgreSQL** atau gunakan **MySQL** dari provider lain
   - Copy connection string ke environment variables

7. **Deploy**

## Opsi 3: Vercel (Serverless - Lebih Kompleks)

1. **Create New Project** di Vercel
2. **Root Directory**: `server`
3. **Framework Preset**: Other
4. **Build Command**: (kosongkan)
5. **Output Directory**: (kosongkan)
6. **Install Command**: `npm install`
7. **Set Environment Variables**

**Note**: Vercel menggunakan serverless functions, jadi beberapa fitur seperti cron jobs mungkin tidak bekerja dengan baik.

## Set Environment Variables

Set semua variable dari `.env.example` di platform deployment Anda.

**Penting**: 
- Jangan commit file `.env` atau `config.env` ke GitHub
- Gunakan environment variables di platform deployment
- Set `NODE_ENV=production` untuk production
- Set `FRONTEND_URL` ke URL frontend Vercel Anda

## Setelah Deploy

1. **Dapatkan URL backend** (contoh: `https://your-backend.railway.app`)
2. **Update frontend environment variable**:
   - Di Vercel frontend project → Settings → Environment Variables
   - Set `VITE_API_URL` = `https://your-backend.railway.app/api`
3. **Redeploy frontend**

## Database Setup

Jika menggunakan database baru:
1. Jalankan migrations: `npm run migrate` (atau setup otomatis di Railway)
2. Atau jalankan manual di database provider Anda

## Troubleshooting

- **CORS Error**: Pastikan `FRONTEND_URL` di-set dengan benar
- **Database Connection Error**: Check database credentials di environment variables
- **Port Error**: Pastikan `PORT` di-set (Railway/Render otomatis set ini)




