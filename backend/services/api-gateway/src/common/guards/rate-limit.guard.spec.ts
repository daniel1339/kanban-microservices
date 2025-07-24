import { RateLimitGuard } from './rate-limit.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('RateLimitGuard', () => {
  it('should extend ThrottlerGuard', () => {
    // Mocks for required arguments
    const options = {} as any;
    const storageService = {} as any;
    const reflector = {} as any;
    const guard = new RateLimitGuard(options, storageService, reflector);
    expect(guard).toBeInstanceOf(ThrottlerGuard);
  });
}); 