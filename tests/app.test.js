const request = require('supertest');
const app = require('../src/app');

describe('Application General Tests', () => {
  it('GET / non-existent route should return 404 error JSON', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual('fail');
    expect(res.body.error).toContain('Cannot find / on this server!');
  });

  it('GET /non-existent-route should return 404 error JSON', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual('fail');
    expect(res.body.error).toContain('Cannot find');
  });
});
