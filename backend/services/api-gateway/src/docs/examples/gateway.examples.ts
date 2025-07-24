export const GatewayHealthExample = {
  summary: 'Gateway health check',
  description: 'Example response for /health endpoint',
  value: {
    status: 'ok',
    timestamp: '2024-01-01T12:00:00.000Z',
    services: [
      { name: 'auth', status: 'healthy' },
      { name: 'user', status: 'healthy' },
    ],
  },
};

export const GatewayErrorExample = {
  summary: 'Error response',
  description: 'Standardized error response',
  value: {
    statusCode: 401,
    message: 'Invalid or missing JWT',
    error: 'Unauthorized',
    timestamp: '2024-01-01T12:00:00.000Z',
    path: '/api/protected',
    method: 'GET',
    requestId: 'req-456',
  },
}; 