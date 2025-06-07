const request = require('supertest');
const app = require('../server');

describe('API endpoints', () => {
  test('GET /api/soldats', async () => {
    const res = await request(app).get('/api/soldats');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/missions', async () => {
    const res = await request(app).get('/api/missions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/formations', async () => {
    const res = await request(app).get('/api/formations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/unites', async () => {
    const res = await request(app).get('/api/unites');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/alerts', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('alerts');
  });
});
