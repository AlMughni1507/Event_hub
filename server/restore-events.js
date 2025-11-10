const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function restoreEvents() {
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'event_db',
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Read and execute SQL file
    const sqlFile = fs.readFileSync(path.join(__dirname, 'restore-events.sql'), 'utf8');
    
    const [results] = await connection.query(sqlFile);
    
    console.log('\n🔧 Events Restored Successfully!');
    console.log('=====================================');
    
    // Show restored events (results from second SELECT query)
    if (results && results.length > 0) {
      const events = Array.isArray(results[1]) ? results[1] : results;
      
      if (events && events.length > 0) {
        console.log(`\n📅 Found ${events.length} active events:\n`);
        events.forEach(event => {
          console.log(`ID: ${event.id}`);
          console.log(`Title: ${event.title}`);
          console.log(`Status: ${event.status}`);
          console.log(`Active: ${event.is_active ? 'Yes' : 'No'}`);
          console.log(`Date: ${event.event_date}`);
          console.log('---');
        });
      } else {
        console.log('\n⚠️ No upcoming events found in database');
      }
    }

    console.log('\n✅ Restoration complete!');
    console.log('📝 You can now refresh the admin page to see your events.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the restore function
restoreEvents()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to restore events:', err);
    process.exit(1);
  });
