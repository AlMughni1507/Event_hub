// Quick script to add has_certificate column
// Run once: node add-certificate-column.js

const { query } = require('./db');

async function addCertificateColumn() {
  try {
    console.log('🔧 Adding has_certificate column to events table...');
    
    // Add column
    await query(`
      ALTER TABLE events 
      ADD COLUMN has_certificate BOOLEAN DEFAULT FALSE AFTER is_free
    `);
    
    console.log('✅ Column added successfully!');
    
    // Verify
    const [result] = await query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'events' 
      AND COLUMN_NAME = 'has_certificate'
    `);
    
    if (result.length > 0) {
      console.log('✅ Verification successful:');
      console.log(result[0]);
    }
    
    console.log('\n🎉 Done! You can now restart the server and create events with certificate option.');
    process.exit(0);
    
  } catch (error) {
    if (error.message.includes('Duplicate column')) {
      console.log('ℹ️  Column already exists - no action needed!');
      process.exit(0);
    } else {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }
}

addCertificateColumn();
