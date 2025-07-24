import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserProfileAndActivityTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_profiles',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isNullable: false, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'userId', type: 'uuid', isUnique: true, isNullable: false },
          { name: 'displayName', type: 'varchar', length: '100', isNullable: false },
          { name: 'bio', type: 'text', isNullable: true },
          { name: 'avatarUrl', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', isNullable: false },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_activities',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isNullable: false, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'userId', type: 'uuid', isNullable: false },
          { name: 'action', type: 'varchar', length: '255', isNullable: false },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_activities');
    await queryRunner.dropTable('user_profiles');
  }
} 