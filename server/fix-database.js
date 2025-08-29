const { query } = require('./db');

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database issues...');
    
    // Check if is_active column exists
    const [columns] = await query("SHOW COLUMNS FROM events LIKE 'is_active'");
    
    if (columns.length === 0) {
      console.log('➕ Adding is_active column to events table...');
      await query('ALTER TABLE events ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
      
      // Update existing records
      await query("UPDATE events SET is_active = TRUE WHERE status = 'published'");
      await query("UPDATE events SET is_active = FALSE WHERE status IN ('draft', 'cancelled', 'completed')");
      
      console.log('✅ is_active column added and populated');
    } else {
      console.log('✅ is_active column already exists');
    }
    
    // Test the query that was failing
    const [testResult] = await query('SELECT COUNT(*) as total FROM events e WHERE e.is_active = 1');
    console.log('✅ Test query successful. Active events count:', testResult[0].total);
    
    console.log('🎉 Database fixes completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
    process.exit(1);
  }
}

fixDatabase();
