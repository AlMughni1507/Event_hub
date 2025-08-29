const { pool } = require('../db');

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const connection = await pool.promise().getConnection();
    console.log('✅ Database connected successfully!');
    
    // Check if email_otps table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'email_otps'");
    
    if (tables.length > 0) {
      console.log('✅ email_otps table exists');
      
      // Show table structure
      const [structure] = await connection.query("DESCRIBE email_otps");
      console.log('📋 Table structure:');
      structure.forEach(col => {
        console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } else {
      console.log('❌ email_otps table does not exist');
      console.log('🔧 Creating email_otps table...');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS email_otps (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          email VARCHAR(255) NOT NULL,
          otp_code VARCHAR(6) NOT NULL,
          expires_at DATETIME NOT NULL,
          is_used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_email_otp (email, otp_code),
          INDEX idx_expires (expires_at)
        )
      `;
      
      await connection.query(createTableSQL);
      console.log('✅ email_otps table created successfully!');
    }
    
    // Check users table
    const [userTables] = await connection.query("SHOW TABLES LIKE 'users'");
    if (userTables.length > 0) {
      console.log('✅ users table exists');
    } else {
      console.log('❌ users table does not exist - need to run migrations first');
    }
    
    connection.release();
    console.log('🎉 Database test completed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
  
  process.exit(0);
}

testDatabase();
