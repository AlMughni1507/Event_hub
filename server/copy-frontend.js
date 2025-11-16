const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDir(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('\n========================================');
  console.log('📦 COPY FRONTEND BUILD SCRIPT');
  console.log('========================================');
  console.log('Current directory:', __dirname);
  console.log('Process cwd:', process.cwd());

  const frontendDist = path.join(__dirname, '../frontend/dist');
  const serverDist = path.join(__dirname, 'dist');

  console.log('\nSource:', frontendDist);
  console.log('Destination:', serverDist);

  // Check if frontend dist exists
  if (fs.existsSync(frontendDist)) {
    console.log('\n✅ Frontend dist folder found!');
    
    // List files in frontend dist
    const files = fs.readdirSync(frontendDist);
    console.log(`   Found ${files.length} files/folders:`);
    files.forEach(file => console.log(`   - ${file}`));

    // Copy files
    console.log('\n📦 Copying files...');
    copyDir(frontendDist, serverDist);
    
    // Verify copy
    const copiedFiles = fs.readdirSync(serverDist);
    console.log(`\n✅ Successfully copied ${copiedFiles.length} files/folders to server/dist`);
    copiedFiles.forEach(file => console.log(`   ✓ ${file}`));
    
    console.log('\n========================================');
    console.log('✅ FRONTEND BUILD COPY COMPLETED');
    console.log('========================================\n');
  } else {
    console.warn('\n⚠️  WARNING: Frontend dist folder not found at:', frontendDist);
    console.warn('   This might be okay if frontend is built separately.');
    console.warn('   Expected location:', frontendDist);
    
    // Try to list parent directory to debug
    try {
      const parentDir = path.join(__dirname, '..');
      console.log('\n   Listing parent directory:', parentDir);
      const parentContents = fs.readdirSync(parentDir);
      console.log('   Contents:', parentContents.join(', '));
    } catch (e) {
      console.log('   Could not list parent directory');
    }
    
    console.log('\n   Skipping copy.\n');
    process.exit(0); // Don't fail the build
  }
} catch (error) {
  console.error('\n❌ ERROR copying frontend build:', error.message);
  console.error('   Stack:', error.stack);
  console.log('\n   Continuing anyway...\n');
  process.exit(0); // Don't fail the build
}
