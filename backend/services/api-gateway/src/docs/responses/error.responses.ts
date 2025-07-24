export const ErrorResponse = {
  summary: 'Standardized error response',
  description: 'All errors follow this unified structure.',
  value: {
    statusCode: 400,
    message: 'Clear error description',
    error: 'Bad Request',
    timestamp: '2024-01-01T12:00:00.000Z',
    path: '/endpoint/path',
    method: 'POST',
    requestId: 'optional-request-id',
  },
}; 