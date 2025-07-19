import { registerAs } from '@nestjs/config';

export default registerAs('throttle', () => ({
  // Configuración global
  ttl: parseInt(process.env.THROTTLE_TTL || '60', 10), // 60 segundos
  limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10), // 10 requests por ventana

  // Configuraciones específicas por endpoint
  auth: {
    login: {
      ttl: parseInt(process.env.THROTTLE_AUTH_LOGIN_TTL || '300', 10), // 5 minutos
      limit: parseInt(process.env.THROTTLE_AUTH_LOGIN_LIMIT || '5', 10), // 5 intentos
    },
    register: {
      ttl: parseInt(process.env.THROTTLE_AUTH_REGISTER_TTL || '3600', 10), // 1 hora
      limit: parseInt(process.env.THROTTLE_AUTH_REGISTER_LIMIT || '3', 10), // 3 registros
    },
    refresh: {
      ttl: parseInt(process.env.THROTTLE_AUTH_REFRESH_TTL || '60', 10), // 1 minuto
      limit: parseInt(process.env.THROTTLE_AUTH_REFRESH_LIMIT || '10', 10), // 10 refreshes
    },
    validate: {
      ttl: parseInt(process.env.THROTTLE_AUTH_VALIDATE_TTL || '60', 10), // 1 minuto
      limit: parseInt(process.env.THROTTLE_AUTH_VALIDATE_LIMIT || '20', 10), // 20 validaciones
    },
  },

  // Configuraciones por tipo de usuario
  userTypes: {
    anonymous: {
      ttl: 60,
      limit: 5,
    },
    authenticated: {
      ttl: 60,
      limit: 50,
    },
    admin: {
      ttl: 60,
      limit: 200,
    },
  },

  // Headers personalizados
  headers: {
    remaining: 'X-RateLimit-Remaining',
    reset: 'X-RateLimit-Reset',
    limit: 'X-RateLimit-Limit',
  },

  // User agents a ignorar
  ignoreUserAgents: [
    /health-check/i,
    /monitoring/i,
    /uptime/i,
  ],

  // IPs a ignorar (para desarrollo)
  ignoreIPs: process.env.THROTTLE_IGNORE_IPS?.split(',') || [],
})); 