import * as fs from 'fs';
import * as path from 'path';

console.log('🔍 Verifying Auth Service build...');

const distPath = path.join(__dirname, '..', 'dist');
const mainJsPath = path.join(distPath, 'src', 'main.js');
const mainJsMapPath = path.join(distPath, 'src', 'main.js.map');

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('❌ Error: dist directory not found');
  process.exit(1);
}

console.log('✅ dist directory found');

// Check if main.js exists
if (!fs.existsSync(mainJsPath)) {
  console.error('❌ Error: main.js not found in dist/src/');
  console.log('📁 Content of dist/:', fs.readdirSync(distPath));
  if (fs.existsSync(path.join(distPath, 'src'))) {
    console.log('📁 Content of dist/src/:', fs.readdirSync(path.join(distPath, 'src')));
  }
  process.exit(1);
}

console.log('✅ main.js found');

// Check if main.js.map exists
if (!fs.existsSync(mainJsMapPath)) {
  console.warn('⚠️  Warning: main.js.map not found (source maps)');
} else {
  console.log('✅ main.js.map found');
}

// Check if main.js file is not empty
const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
if (mainJsContent.trim().length === 0) {
  console.error('❌ Error: main.js is empty');
  process.exit(1);
}

console.log('✅ main.js has valid content');

// Check if it contains the bootstrap function
if (!mainJsContent.includes('bootstrap')) {
  console.error('❌ Error: main.js does not contain the bootstrap function');
  process.exit(1);
}

console.log('✅ main.js contains the bootstrap function');

// Check other important files
const importantFiles = [
  'src/app.module.js',
  'src/auth/auth.controller.js',
  'src/auth/auth.service.js'
];

for (const file of importantFiles) {
  const filePath = path.join(distPath, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Warning: ${file} not found`);
  } else {
    console.log(`✅ ${file} found`);
  }
}

console.log('🎉 Build verification completed successfully');
console.log('📁 Generated files in:', distPath); 