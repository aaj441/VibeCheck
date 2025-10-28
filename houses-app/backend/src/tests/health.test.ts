import request from 'supertest';
import express from 'express';

const app = express();

// Simple health endpoint for testing
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'test',
    version: '0.0.1',
  });
});

describe('Health Check', () => {
  it('should return 200 OK with health status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment', 'test');
    expect(response.body).toHaveProperty('version');
  });
  
  it('should return valid timestamp', async () => {
    const response = await request(app).get('/health');
    const timestamp = new Date(response.body.timestamp);
    
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
  });
});