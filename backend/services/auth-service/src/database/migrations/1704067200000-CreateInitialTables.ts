import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from 'typeorm';

export class CreateInitialTables1704067200000 implements MigrationInterface {
  name = 'CreateInitialTables1704067200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de usuarios
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

    // Crear tabla de refresh tokens
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
      }),
      true,
    );

    // Crear índices para optimizar queries
    await queryRunner.query(`CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_USERS_USERNAME" ON "users" ("username")`);
    await queryRunner.query(`CREATE INDEX "IDX_USERS_CREATED_AT" ON "users" ("created_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_REFRESH_TOKENS_USER_ID" ON "refresh_tokens" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_REFRESH_TOKENS_TOKEN" ON "refresh_tokens" ("token")`);
    await queryRunner.query(`CREATE INDEX "IDX_REFRESH_TOKENS_EXPIRES_AT" ON "refresh_tokens" ("expires_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_REFRESH_TOKENS_IS_REVOKED" ON "refresh_tokens" ("is_revoked")`);

    // Crear foreign key
    await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_REFRESH_TOKENS_USER_ID" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);

    // Crear extensión uuid-ossp si no existe
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign key
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_REFRESH_TOKENS_USER_ID"`);

    // Eliminar índices
    await queryRunner.query(`DROP INDEX "IDX_REFRESH_TOKENS_IS_REVOKED"`);
    await queryRunner.query(`DROP INDEX "IDX_REFRESH_TOKENS_EXPIRES_AT"`);
    await queryRunner.query(`DROP INDEX "IDX_REFRESH_TOKENS_TOKEN"`);
    await queryRunner.query(`DROP INDEX "IDX_REFRESH_TOKENS_USER_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_CREATED_AT"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_USERNAME"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_EMAIL"`);

    // Eliminar tablas
    await queryRunner.dropTable('refresh_tokens');
    await queryRunner.dropTable('users');
  }
} 