import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from 'typeorm';

export class CreateInitialTables1704067200000 implements MigrationInterface {
  name = 'CreateInitialTables1704067200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'username',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'is_verified',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create refresh tokens table
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'is_revoked',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_USERS_USERNAME" ON "users" ("username")`);
    await queryRunner.query(`CREATE INDEX "IDX_REFRESH_TOKENS_USER_ID" ON "refresh_tokens" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_REFRESH_TOKENS_TOKEN" ON "refresh_tokens" ("token")`);
    await queryRunner.query(`CREATE INDEX "IDX_REFRESH_TOKENS_EXPIRES_AT" ON "refresh_tokens" ("expires_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('refresh_tokens', 'IDX_REFRESH_TOKENS_EXPIRES_AT');
    await queryRunner.dropIndex('refresh_tokens', 'IDX_REFRESH_TOKENS_TOKEN');
    await queryRunner.dropIndex('refresh_tokens', 'IDX_REFRESH_TOKENS_USER_ID');
    await queryRunner.dropIndex('users', 'IDX_USERS_USERNAME');
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');

    // Drop foreign key
    const table = await queryRunner.getTable('refresh_tokens');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
      if (foreignKey) {
        await queryRunner.dropForeignKey('refresh_tokens', foreignKey);
      }
    }

    // Drop tables
    await queryRunner.dropTable('refresh_tokens');
    await queryRunner.dropTable('users');
  }
} 