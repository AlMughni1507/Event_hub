// Quick script to run SQL migration
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'event_db',
    multipleStatements: true
  });

  try {
    const sqlFile = fs.readFileSync(
      path.join(__dirname, 'migrations', '028_insert_sample_reviews.sql'),
      'utf8'
    );

    console.log('Running migration: 028_insert_sample_reviews.sql');
    await connection.query(sqlFile);
    console.log('✅ Migration completed successfully!');
    console.log('✅ 12 sample reviews inserted into database');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

runMigration();
