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
  const frontendDist = path.join(__dirname, '../frontend/dist');
  const serverDist = path.join(__dirname, 'dist');

  console.log('📦 Copying frontend build to server/dist...');
  console.log('   From:', frontendDist);
  console.log('   To:', serverDist);

  if (fs.existsSync(frontendDist)) {
    copyDir(frontendDist, serverDist);
    console.log('✅ Frontend build copied successfully!');
  } else {
    console.warn('⚠️  Frontend dist folder not found. Skipping copy.');
    process.exit(0); // Don't fail the build
  }
} catch (error) {
  console.error('❌ Error copying frontend build:', error.message);
  process.exit(0); // Don't fail the build
}
