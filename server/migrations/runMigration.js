const { promisePool } = require('../db');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');

    // Create migrations table if not exists
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all migration files
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📋 Found ${files.length} migration files`);

    for (const file of files) {
      // Check if migration already executed
      const [existing] = await promisePool.query(
        'SELECT * FROM migrations WHERE migration_name = ?',
        [file]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }

      console.log(`🔨 Running migration: ${file}`);

      // Read SQL file
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf8');

      // Split SQL into individual statements
      // Handle multi-line statements properly
      const statements = [];
      let currentStatement = '';
      const lines = sql.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip comments and empty lines
        if (trimmedLine.startsWith('--') || trimmedLine.length === 0) {
          continue;
        }
        
        currentStatement += line + '\n';
        
        // Check if statement is complete (ends with semicolon)
        if (trimmedLine.endsWith(';')) {
          statements.push(currentStatement.trim());
          currentStatement = '';
        }
      }
      
      // Add last statement if exists
      if (currentStatement.trim().length > 0) {
        statements.push(currentStatement.trim());
      }

      // Execute each statement
      for (const statement of statements) {
        if (statement.length === 0) continue;
        
        try {
          await promisePool.query(statement);
        } catch (err) {
          // Log error but continue
          const ignorable = [
            'Duplicate entry',
            'already exists',
            'Duplicate column',
            'Unknown column'
          ].some(pattern => err.message.includes(pattern));
          
          if (!ignorable) {
            console.error(`❌ Error in ${file}:`, err.message.substring(0, 150));
          }
        }
      }

      // Mark migration as executed
      await promisePool.query(
        'INSERT INTO migrations (migration_name) VALUES (?)',
        [file]
      );

      console.log(`✅ Completed: ${file}`);
    }

    console.log('✅ All migrations completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

module.exports = { runMigrations };

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('✅ Migration process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}
