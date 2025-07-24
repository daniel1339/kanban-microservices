import { ROLES_KEY, Roles } from './roles.decorator';
import 'reflect-metadata';

describe('Roles Decorator', () => {
  it('should assign roles as metadata', () => {
    class Test {}
    Roles('admin', 'user')(Test);
    const metadata = Reflect.getMetadata(ROLES_KEY, Test);
    expect(metadata).toEqual(['admin', 'user']);
  });
}); 