import { DataSource } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    // Verificar si ya existen usuarios
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seeder...');
      return;
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    const users = [
      {
        email: 'admin@example.com',
        username: 'admin',
        password_hash: hashedPassword,
        is_verified: true,
        first_name: 'Admin',
        last_name: 'User',
        phone: '+1234567890',
        avatar_url: 'https://example.com/avatars/admin.jpg',
        last_login_at: new Date(),
        login_attempts: 0,
        email_verified_at: new Date(),
        password_changed_at: new Date(),
      },
      {
        email: 'user@example.com',
        username: 'user',
        password_hash: hashedPassword,
        is_verified: true,
        first_name: 'Regular',
        last_name: 'User',
        phone: '+1234567891',
        avatar_url: 'https://example.com/avatars/user.jpg',
        last_login_at: new Date(),
        login_attempts: 0,
        email_verified_at: new Date(),
        password_changed_at: new Date(),
      },
      {
        email: 'test@example.com',
        username: 'testuser',
        password_hash: hashedPassword,
        is_verified: false,
        first_name: 'Test',
        last_name: 'User',
        phone: '+1234567892',
        avatar_url: null,
        last_login_at: null,
        login_attempts: 0,
        email_verified_at: null,
        password_changed_at: new Date(),
      },
      {
        email: 'developer@example.com',
        username: 'developer',
        password_hash: hashedPassword,
        is_verified: true,
        first_name: 'Developer',
        last_name: 'User',
        phone: '+1234567893',
        avatar_url: 'https://example.com/avatars/dev.jpg',
        last_login_at: new Date(),
        login_attempts: 0,
        email_verified_at: new Date(),
        password_changed_at: new Date(),
      },
      {
        email: 'manager@example.com',
        username: 'manager',
        password_hash: hashedPassword,
        is_verified: true,
        first_name: 'Manager',
        last_name: 'User',
        phone: '+1234567894',
        avatar_url: 'https://example.com/avatars/manager.jpg',
        last_login_at: new Date(),
        login_attempts: 0,
        email_verified_at: new Date(),
        password_changed_at: new Date(),
      },
    ];

    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Created user: ${user.email}`);
    }

    console.log(`Seeder completed. Created ${users.length} users.`);
  }
} 