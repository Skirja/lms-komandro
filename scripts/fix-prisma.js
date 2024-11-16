const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the Prisma client directory
const prismaClientDir = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');

try {
  // Remove the existing Prisma client
  if (fs.existsSync(prismaClientDir)) {
    fs.rmSync(prismaClientDir, { recursive: true, force: true });
  }

  // Run Prisma generate
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('Successfully regenerated Prisma client');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
