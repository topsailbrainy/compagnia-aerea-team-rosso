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

describe('Aeroporti API', () => {
  it('should list all airports', async () => {
    (pool.query as any).mockResolvedValueOnce({
      rows: [
        { id: 1, nome: 'Fiumicino', citta: 'Roma' },
        { id: 2, nome: 'Malpensa', citta: 'Milano' }
      ],
    });

    const res = await request(app).get('/aeroporti');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].nome).toBe('Fiumicino');
  });
});
