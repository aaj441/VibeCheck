import request from 'supertest';
import express from 'express';
import { query } from '../services/database';
import authRoutes from '../routes/auth';
import { errorHandler } from '../middleware/error';

// Mock the database query function
jest.mock('../services/database');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockQuery = query as jest.MockedFunction<typeof query>;
      
      // Mock checking for existing user (returns empty array)
      mockQuery.mockResolvedValueOnce([]);
      
      // Mock inserting new user
      mockQuery.mockResolvedValueOnce([{
        id: 'test-user-id',
        email: 'test@example.com',
        username: 'testuser',
        house_type: 'logic',
      }]);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'securepassword123',
          houseType: 'logic',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 409 if user already exists', async () => {
      const mockQuery = query as jest.MockedFunction<typeof query>;
      
      // Mock finding existing user
      mockQuery.mockResolvedValueOnce([{ id: 'existing-user-id' }]);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          username: 'existinguser',
          password: 'securepassword123',
          houseType: 'logic',
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('already exists');
    });

    it('should validate input fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          username: 'ab', // too short
          password: 'short', // too short
          houseType: 'invalid-house',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockQuery = query as jest.MockedFunction<typeof query>;
      
      // Mock finding user
      mockQuery.mockResolvedValueOnce([{
        id: 'test-user-id',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: '$2b$10$YourHashedPasswordHere', // This would be a real bcrypt hash
        house_type: 'logic',
      }]);
      
      // Mock updating last active
      mockQuery.mockResolvedValueOnce([]);

      // Note: In a real test, you'd need to mock bcrypt.compare or use a known hash
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'securepassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return 401 for invalid credentials', async () => {
      const mockQuery = query as jest.MockedFunction<typeof query>;
      
      // Mock finding no user
      mockQuery.mockResolvedValueOnce([]);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});