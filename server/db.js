// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // ganti sesuai user DB kamu
  password: '',        // ganti kalau ada password
  database: 'event_db' // sesuai yang kamu buat
});

connection.connect(err => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err);
    return;
  }
  console.log('✅ Terhubung ke database event_db');
});

module.exports = connection;
