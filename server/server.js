const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

// Contoh: Ambil data dari tabel
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Jalankan server
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
