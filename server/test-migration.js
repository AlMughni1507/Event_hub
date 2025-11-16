const { query, promisePool } = require('./db');
const fs = require('fs');

async function testMigration() {
  try {
    console.log('🔍 Testing migration...');
    
    // Read SQL file
    const sql = fs.readFileSync('./migrations/001_create_users_table.sql', 'utf8');
    console.log('\n📄 SQL Content:');
    console.log(sql);
    
    // Execute
    console.log('\n🔨 Executing SQL...');
    await query(sql);
    
    console.log('\n✅ Migration executed successfully!');
    
    // Check if table exists
    const [tables] = await promisePool.query('SHOW TABLES');
    console.log('\n📊 Current tables:');
    tables.forEach(t => console.log('  -', Object.values(t)[0]));
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testMigration();
