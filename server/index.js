// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ======================= USERS =======================
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/users', (req, res) => {
  const { email, no_handphone, password, alamat, pendidikan_terakhir, status_akun, otp } = req.body;
  db.query(
    `INSERT INTO users (email, no_handphone, password, alamat, pendidikan_terakhir, status_akun, otp) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [email, no_handphone, password, alamat, pendidikan_terakhir, status_akun, otp],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'User berhasil ditambahkan', id: result.insertId });
    }
  );
});

// ======================= KATEGORI KEGIATAN =======================
app.get('/api/kategori', (req, res) => {
  db.query('SELECT * FROM kategori_kegiatan', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/kategori', (req, res) => {
  const { nama_kategori, slug, kategori_logo } = req.body;
  db.query(
    `INSERT INTO kategori_kegiatan (nama_kategori, slug, kategori_logo) VALUES (?, ?, ?)`,
    [nama_kategori, slug, kategori_logo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Kategori berhasil ditambahkan', id: result.insertId });
    }
  );
});

// ======================= KEGIATAN =======================
app.get('/api/kegiatan', (req, res) => {
  db.query('SELECT * FROM kegiatan', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/kegiatan', (req, res) => {
  const { kategori_id, judul_kegiatan, slug, deskripsi_kegiatan, lokasi_kegiatan, flyer_kegiatan, sertifikat_kegiatan, waktu_mulai, waktu_berakhir } = req.body;
  db.query(
    `INSERT INTO kegiatan (kategori_id, judul_kegiatan, slug, deskripsi_kegiatan, lokasi_kegiatan, flyer_kegiatan, sertifikat_kegiatan, waktu_mulai, waktu_berakhir) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [kategori_id, judul_kegiatan, slug, deskripsi_kegiatan, lokasi_kegiatan, flyer_kegiatan, sertifikat_kegiatan, waktu_mulai, waktu_berakhir],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Kegiatan berhasil ditambahkan', id: result.insertId });
    }
  );
});

// ======================= DAFTAR HADIR =======================
app.get('/api/daftar-hadir', (req, res) => {
  db.query('SELECT * FROM daftar_hadir', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/daftar-hadir', (req, res) => {
  const { user_id, kegiatan_id, otp, status_absen, waktu_absen } = req.body;
  db.query(
    `INSERT INTO daftar_hadir (user_id, kegiatan_id, otp, status_absen, waktu_absen) VALUES (?, ?, ?, ?, ?)`,
    [user_id, kegiatan_id, otp, status_absen, waktu_absen],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Daftar hadir berhasil ditambahkan', id: result.insertId });
    }
  );
});

// Jalankan server
app.listen(5000, () => {
  console.log('🚀 Server berjalan di http://localhost:5000');
});
