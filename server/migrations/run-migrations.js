const fs = require('fs');
const path = require('path');
const { pool } = require('../db');

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Read all migration files
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure order
    
    console.log(`📁 Found ${migrationFiles.length} migration files`);
    
    for (const file of migrationFiles) {
      console.log(`\n📄 Running migration: ${file}`);
      
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split SQL by semicolon to handle multiple statements
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await pool.promise().query(statement);
        }
      }
      
      console.log(`✅ Completed: ${file}`);
    }
    
    console.log('\n🎉 All migrations completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
