// Quick fix for admin login
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'event_db'
});

async function fixAdmin() {
  try {
    console.log('🔧 Fixing admin login...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Update admin user
    db.query(
      'UPDATE users SET password = ?, role = ?, is_active = ? WHERE email = ?',
      [hashedPassword, 'admin', 1, 'abdul.mughni845@gmail.com'],
      (err, result) => {
        if (err) {
          console.error('❌ Error:', err);
        } else {
          console.log('✅ Admin fixed!');
          console.log('📧 Email: abdul.mughni845@gmail.com');
          console.log('🔑 Password: admin123');
          console.log('👤 Role: admin');
          console.log('✅ Status: active');
        }
        db.end();
      }
    );
  } catch (error) {
    console.error('❌ Error:', error);
    db.end();
  }
}

fixAdmin();
