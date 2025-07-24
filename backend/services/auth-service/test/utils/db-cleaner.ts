import { DataSource } from 'typeorm';

export async function cleanDatabase(dataSource: DataSource) {
  // Delete all relevant tables (adjust according to your entities)
  await dataSource.query('DELETE FROM refresh_tokens');
  await dataSource.query('DELETE FROM users');
}
