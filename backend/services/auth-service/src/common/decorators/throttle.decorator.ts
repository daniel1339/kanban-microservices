import { SetMetadata } from '@nestjs/common';

export const THROTTLE_KEY = 'throttle';

export interface ThrottleOptions {
  ttl?: number;
  limit?: number;
  name?: string;
  skipIf?: (req: any) => boolean;
}

export const Throttle = (options: ThrottleOptions) => SetMetadata(THROTTLE_KEY, options);

// Decoradores predefinidos para casos comunes
export const ThrottleLogin = () => Throttle({
  ttl: 300, // 5 minutos
  limit: 5, // 5 intentos
  name: 'login',
});

export const ThrottleRegister = () => Throttle({
  ttl: 3600, // 1 hora
  limit: 3, // 3 registros
  name: 'register',
});

export const ThrottleRefresh = () => Throttle({
  ttl: 60, // 1 minuto
  limit: 10, // 10 refreshes
  name: 'refresh',
});

export const ThrottleValidate = () => Throttle({
  ttl: 60, // 1 minuto
  limit: 20, // 20 validaciones
  name: 'validate',
});

export const ThrottleStrict = () => Throttle({
  ttl: 60, // 1 minuto
  limit: 3, // 3 requests
  name: 'strict',
});

export const ThrottleLoose = () => Throttle({
  ttl: 60, // 1 minuto
  limit: 100, // 100 requests
  name: 'loose',
});

// Decorador para saltar rate limiting
export const SkipThrottle = () => SetMetadata('skipThrottle', true); 