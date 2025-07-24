import { registerAs } from '@nestjs/config';

export default registerAs('throttle', () => ({
  // Global configuration
  ttl: parseInt(process.env.THROTTLE_TTL || '60', 10), // 60 seconds
  limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10), // 10 requests per window

  // Specific configurations by endpoint
  auth: {
    login: {
      ttl: parseInt(process.env.THROTTLE_AUTH_LOGIN_TTL || '300', 10), // 5 minutes
      limit: parseInt(process.env.THROTTLE_AUTH_LOGIN_LIMIT || '5', 10), // 5 attempts
    },
    register: {
      ttl: parseInt(process.env.THROTTLE_AUTH_REGISTER_TTL || '3600', 10), // 1 hour
      limit: parseInt(process.env.THROTTLE_AUTH_REGISTER_LIMIT || '3', 10), // 3 registrations
    },
    refresh: {
      ttl: parseInt(process.env.THROTTLE_AUTH_REFRESH_TTL || '60', 10), // 1 minute
      limit: parseInt(process.env.THROTTLE_AUTH_REFRESH_LIMIT || '10', 10), // 10 refreshes
    },
    validate: {
      ttl: parseInt(process.env.THROTTLE_AUTH_VALIDATE_TTL || '60', 10), // 1 minute
      limit: parseInt(process.env.THROTTLE_AUTH_VALIDATE_LIMIT || '20', 10), // 20 validations
    },
  },

  // Configurations by user type
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

  // Custom headers
  headers: {
    remaining: 'X-RateLimit-Remaining',
    reset: 'X-RateLimit-Reset',
    limit: 'X-RateLimit-Limit',
  },

  // User agents to ignore
  ignoreUserAgents: [
    /health-check/i,
    /monitoring/i,
    /uptime/i,
  ],

  // IPs to ignore (for development)
  ignoreIPs: process.env.THROTTLE_IGNORE_IPS?.split(',') || [],
})); 