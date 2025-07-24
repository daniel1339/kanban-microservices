import { SetMetadata } from '@nestjs/common';

export const THROTTLE_KEY = 'throttle';

export interface ThrottleOptions {
  ttl?: number;
  limit?: number;
  name?: string;
  skipIf?: (req: any) => boolean;
}

export const Throttle = (options: ThrottleOptions) => SetMetadata(THROTTLE_KEY, options);

// Predefined decorators for common cases
export const ThrottleLogin = () => Throttle({
  ttl: 300, // 5 minutes
  limit: 5, // 5 attempts
  name: 'login',
});

export const ThrottleRegister = () => Throttle({
  ttl: 3600, // 1 hour
  limit: 3, // 3 registrations
  name: 'register',
});

export const ThrottleRefresh = () => Throttle({
  ttl: 60, // 1 minute
  limit: 10, // 10 refreshes
  name: 'refresh',
});

export const ThrottleValidate = () => Throttle({
  ttl: 60, // 1 minute
  limit: 20, // 20 validations
  name: 'validate',
});

export const ThrottleStrict = () => Throttle({
  ttl: 60, // 1 minute
  limit: 3, // 3 requests
  name: 'strict',
});

export const ThrottleLoose = () => Throttle({
  ttl: 60, // 1 minute
  limit: 100, // 100 requests
  name: 'loose',
});

// Decorator to skip rate limiting
export const SkipThrottle = () => SetMetadata('skipThrottle', true); 