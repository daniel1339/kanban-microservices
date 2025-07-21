import * as fs from 'fs';
import * as path from 'path';

console.log('🔍 Verificando build del Auth Service...');

const distPath = path.join(__dirname, '..', 'dist');
const mainJsPath = path.join(distPath, 'src', 'main.js');
const mainJsMapPath = path.join(distPath, 'src', 'main.js.map');

// Verificar que el directorio dist existe
if (!fs.existsSync(distPath)) {
  console.error('❌ Error: Directorio dist no encontrado');
  process.exit(1);
}

console.log('✅ Directorio dist encontrado');

// Verificar que main.js existe
if (!fs.existsSync(mainJsPath)) {
  console.error('❌ Error: main.js no encontrado en dist/src/');
  console.log('📁 Contenido de dist/:', fs.readdirSync(distPath));
  if (fs.existsSync(path.join(distPath, 'src'))) {
    console.log('📁 Contenido de dist/src/:', fs.readdirSync(path.join(distPath, 'src')));
  }
  process.exit(1);
}

console.log('✅ main.js encontrado');

// Verificar que main.js.map existe
if (!fs.existsSync(mainJsMapPath)) {
  console.warn('⚠️  Warning: main.js.map no encontrado (source maps)');
} else {
  console.log('✅ main.js.map encontrado');
}

// Verificar que el archivo main.js no está vacío
const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
if (mainJsContent.trim().length === 0) {
  console.error('❌ Error: main.js está vacío');
  process.exit(1);
}

console.log('✅ main.js tiene contenido válido');

// Verificar que contiene la función bootstrap
if (!mainJsContent.includes('bootstrap')) {
  console.error('❌ Error: main.js no contiene la función bootstrap');
  process.exit(1);
}

console.log('✅ main.js contiene la función bootstrap');

// Verificar otros archivos importantes
const importantFiles = [
  'src/app.module.js',
  'src/auth/auth.controller.js',
  'src/auth/auth.service.js'
];

for (const file of importantFiles) {
  const filePath = path.join(distPath, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Warning: ${file} no encontrado`);
  } else {
    console.log(`✅ ${file} encontrado`);
  }
}

console.log('🎉 Verificación de build completada exitosamente');
console.log('📁 Archivos generados en:', distPath); 