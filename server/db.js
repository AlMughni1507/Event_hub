// db.js
const mysql = require('mysql2');
require('dotenv').config({ path: './config.env' });

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'event_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise wrapper
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err);
    return;
  }
  console.log('✅ Terhubung ke database', process.env.DB_NAME || 'event_db');
  connection.release();
});

module.exports = {
  pool,
  promisePool,
  query: (sql, params) => {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
};
