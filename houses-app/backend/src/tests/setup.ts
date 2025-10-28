import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

// Mock Redis for unit tests
jest.mock('../services/redis', () => ({
  initializeRedis: jest.fn().mockResolvedValue(undefined),
  getRedisClient: jest.fn().mockReturnValue({
    get: jest.fn(),
    set: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
  }),
  getCached: jest.fn(),
  setCached: jest.fn(),
  deleteCached: jest.fn(),
}));

// Mock database for unit tests
jest.mock('../services/database', () => ({
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
  getPool: jest.fn(),
  query: jest.fn(),
  transaction: jest.fn(),
}));

// Silence console during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};