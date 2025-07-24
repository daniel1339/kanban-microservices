import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });
}); 