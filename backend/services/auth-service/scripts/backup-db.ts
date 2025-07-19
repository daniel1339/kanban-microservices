import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

interface BackupConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  backupDir: string;
  filename?: string;
}

async function backupDatabase(config: BackupConfig): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = config.filename || `backup-${config.database}-${timestamp}.sql`;
  const backupPath = path.join(config.backupDir, filename);

  // Crear directorio de backup si no existe
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
  }

  // Comando pg_dump
  const command = `PGPASSWORD="${config.password}" pg_dump -h ${config.host} -p ${config.port} -U ${config.username} -d ${config.database} -f "${backupPath}" --verbose --no-password`;

  try {
    console.log(`Starting backup of database: ${config.database}`);
    console.log(`Backup file: ${backupPath}`);

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.warn('Backup warnings:', stderr);
    }

    if (stdout) {
      console.log('Backup output:', stdout);
    }

    // Verificar que el archivo se creó
    if (fs.existsSync(backupPath)) {
      const stats = fs.statSync(backupPath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✅ Backup completed successfully!`);
      console.log(`📁 File: ${backupPath}`);
      console.log(`📊 Size: ${fileSizeInMB} MB`);
      console.log(`🕒 Created: ${stats.mtime.toISOString()}`);
    } else {
      throw new Error('Backup file was not created');
    }
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

async function restoreDatabase(config: BackupConfig, backupFile: string): Promise<void> {
  const backupPath = path.join(config.backupDir, backupFile);

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }

  // Comando psql para restaurar
  const command = `PGPASSWORD="${config.password}" psql -h ${config.host} -p ${config.port} -U ${config.username} -d ${config.database} -f "${backupPath}" --verbose --no-password`;

  try {
    console.log(`Starting restore of database: ${config.database}`);
    console.log(`Backup file: ${backupPath}`);

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.warn('Restore warnings:', stderr);
    }

    if (stdout) {
      console.log('Restore output:', stdout);
    }

    console.log('✅ Restore completed successfully!');
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  }
}

async function listBackups(backupDir: string): Promise<void> {
  if (!fs.existsSync(backupDir)) {
    console.log('No backup directory found');
    return;
  }

  const files = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      return {
        name: file,
        size: fileSizeInMB,
        created: stats.mtime.toISOString(),
      };
    })
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  console.log('📋 Available backups:');
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file.name}`);
    console.log(`   Size: ${file.size} MB`);
    console.log(`   Created: ${file.created}`);
    console.log('');
  });
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const config: BackupConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'auth_service',
    backupDir: process.env.BACKUP_DIR || './backups',
  };

  try {
    switch (command) {
      case 'backup':
        await backupDatabase(config);
        break;
      case 'restore':
        const backupFile = args[1];
        if (!backupFile) {
          console.error('❌ Please specify a backup file to restore');
          process.exit(1);
        }
        await restoreDatabase(config, backupFile);
        break;
      case 'list':
        await listBackups(config.backupDir);
        break;
      default:
        console.log('Usage:');
        console.log('  npm run db:backup     - Create a backup');
        console.log('  npm run db:restore <file> - Restore from backup');
        console.log('  npm run db:list      - List available backups');
        break;
    }
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 