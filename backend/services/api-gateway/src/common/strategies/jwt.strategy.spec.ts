import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should validate and return user payload', async () => {
    const payload = { sub: 'user-id', email: 'user@example.com' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ userId: 'user-id', email: 'user@example.com' });
  });
}); 