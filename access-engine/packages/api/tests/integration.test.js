const { describe, test, expect } = require('@jest/globals');

describe('Access Engine API Integration', () => {
  const API_URL = 'http://localhost:3000';

  test('health check returns healthy', async () => {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
  });

  test('login returns token', async () => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test-user', password: 'password' })
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.token).toBeDefined();
  });

  test('entry without token returns 401', async () => {
    const response = await fetch(`${API_URL}/api/entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: 'TEST-QR-123' })
    });
    expect(response.status).toBe(401);
  });

  test('entry with valid token returns 200', async () => {
    // Login first
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test-user', password: 'password' })
    });
    const loginData = await loginResponse.json();
    const token = loginData.token;

    const response = await fetch(`${API_URL}/api/entry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        credential: 'TEST-QR-123',
        accessPointId: 'gate-a',
        organizationId: 'test-org'
      })
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.decision).toBe('allow');
  });
});
