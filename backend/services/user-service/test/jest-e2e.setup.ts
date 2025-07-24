// Jest E2E Setup
import 'reflect-metadata';

// Global test timeout
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3002';
process.env.DATABASE_URL = 'postgresql://kanban_user:kanban_password@localhost:5432/kanban';

// Global test utilities
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
}); 