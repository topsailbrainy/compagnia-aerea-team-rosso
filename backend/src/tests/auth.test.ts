import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '@/app';
import { pool } from '@/services/db.services';

vi.mock('@/services/db.services', () => ({
  pool: {
    query: vi.fn(),
    on: vi.fn(),
  },
}));

describe('Auth API', () => {
  it('should signup a new user', async () => {
    (pool.query as any).mockResolvedValueOnce({
      rows: [{ id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario@example.com', ruolo: 'user' }],
    });

    const res = await request(app)
      .post('/auth/signup')
      .send({
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('mario@example.com');
  });
});
