const { promisePool } = require('./db');
const fs = require('fs');
const path = require('path');

async function importSQL() {
  try {
    console.log('📂 Reading SQL file...');
    const sqlFile = path.join(__dirname, 'event_db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('🔄 Importing database...');
    console.log('⚠️  This may take a few minutes...\n');
    
    // Split by semicolon and execute statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => {
        // Filter out empty statements, comments, and SQL dump metadata
        if (s.length === 0) return false;
        if (s.startsWith('--')) return false;
        if (s.startsWith('/*')) return false;
        if (s.includes('phpMyAdmin')) return false;
        return true;
      });
    
    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // Show progress
        if (i % 10 === 0) {
          console.log(`Processing ${i}/${statements.length}...`);
        }
        
        await promisePool.query(statement);
        successCount++;
        
        // Log important operations
        if (statement.includes('CREATE TABLE')) {
          const match = statement.match(/CREATE TABLE (?:IF NOT EXISTS )?`?(\w+)`?/i);
          if (match) console.log(`✅ Created table: ${match[1]}`);
        } else if (statement.includes('INSERT INTO')) {
          const match = statement.match(/INSERT INTO `?(\w+)`?/i);
          if (match && i % 5 === 0) console.log(`📝 Inserting data into: ${match[1]}`);
        }
        
      } catch (err) {
        // Only show critical errors
        if (!err.message.includes('already exists') && 
            !err.message.includes('Duplicate entry') &&
            !err.message.includes('Duplicate column')) {
          console.error(`❌ Error at statement ${i}:`, err.message.substring(0, 100));
          errorCount++;
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Import completed!');
    console.log(`   Success: ${successCount} statements`);
    console.log(`   Errors: ${errorCount} statements`);
    console.log('='.repeat(50) + '\n');
    
    // Verify import
    const [tables] = await promisePool.query('SHOW TABLES');
    console.log(`📊 Database now has ${tables.length} tables:`);
    tables.forEach(t => console.log(`   - ${Object.values(t)[0]}`));
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

importSQL();
