const mysql = require('mysql2');
require('dotenv').config({ path: './config.env' });

// Create connection without specifying database
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306
});

async function createDatabase() {
  try {
    console.log('🔧 Creating database...');
    
    // Create database
    await connection.promise().query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'event_db'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'event_db'}' created successfully!`);
    
    // Use the database
    await connection.promise().query(`USE ${process.env.DB_NAME || 'event_db'}`);
    console.log(`✅ Using database '${process.env.DB_NAME || 'event_db'}'`);
    
    connection.end();
    console.log('🎉 Database setup completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating database:', error);
    connection.end();
    process.exit(1);
  }
}

createDatabase();
