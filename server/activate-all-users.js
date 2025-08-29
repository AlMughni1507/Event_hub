const { query } = require('./db');

async function activateAllUsers() {
  try {
    console.log('🔧 Activating all registered users...');
    
    // Get all inactive users
    const [inactiveUsers] = await query(`
      SELECT id, username, email, is_active, is_verified 
      FROM users 
      WHERE role = 'user' AND (is_active = FALSE OR is_verified = FALSE)
    `);
    
    console.log(`📊 Found ${inactiveUsers.length} users to activate`);
    
    if (inactiveUsers.length > 0) {
      console.log('👥 Users to activate:');
      inactiveUsers.forEach(user => {
        console.log(`- ${user.email} (${user.username}) - Active: ${user.is_active}, Verified: ${user.is_verified}`);
      });
      
      // Activate all users
      const [result] = await query(`
        UPDATE users 
        SET is_active = TRUE, is_verified = TRUE 
        WHERE role = 'user' AND (is_active = FALSE OR is_verified = FALSE)
      `);
      
      console.log(`✅ Activated ${result.affectedRows} users`);
    } else {
      console.log('✅ All users are already active');
    }
    
    // Show final status
    const [allUsers] = await query(`
      SELECT id, username, email, is_active, is_verified, created_at 
      FROM users 
      WHERE role = 'user' 
      ORDER BY created_at DESC
    `);
    
    console.log('\n📋 All registered users:');
    allUsers.forEach(user => {
      const status = user.is_active && user.is_verified ? '✅ ACTIVE' : '❌ INACTIVE';
      console.log(`${status} ${user.email} (${user.username})`);
    });
    
    console.log('\n🎉 All users can now login with their credentials!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Activation failed:', error);
    process.exit(1);
  }
}

activateAllUsers();
