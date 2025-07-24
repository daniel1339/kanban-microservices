import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFields1704153600000 implements MigrationInterface {
  name = 'AddUserFields1704153600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add additional fields to users table
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "first_name" varchar(100)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "last_name" varchar(100)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "phone" varchar(20)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "avatar_url" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "login_attempts" integer DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "locked_until" timestamp`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "email_verified_at" timestamp`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "password_changed_at" timestamp DEFAULT CURRENT_TIMESTAMP`);

    // Create indexes for new fields
    await queryRunner.query(`CREATE INDEX "IDX_USERS_LAST_LOGIN_AT" ON "users" ("last_login_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_USERS_LOGIN_ATTEMPTS" ON "users" ("login_attempts")`);
    await queryRunner.query(`CREATE INDEX "IDX_USERS_LOCKED_UNTIL" ON "users" ("locked_until")`);
    await queryRunner.query(`CREATE INDEX "IDX_USERS_EMAIL_VERIFIED_AT" ON "users" ("email_verified_at")`);

    // Add constraints
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_LOGIN_ATTEMPTS" CHECK ("login_attempts" >= 0)`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_PHONE_FORMAT" CHECK ("phone" ~ '^[+]?[0-9]{10,15}$')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove constraints
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "CHK_PHONE_FORMAT"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "CHK_LOGIN_ATTEMPTS"`);

    // Remove indexes
    await queryRunner.query(`DROP INDEX "IDX_USERS_EMAIL_VERIFIED_AT"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_LOCKED_UNTIL"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_LOGIN_ATTEMPTS"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_LAST_LOGIN_AT"`);

    // Remove columns
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_changed_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_verified_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "locked_until"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "login_attempts"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_url"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
  }
} 