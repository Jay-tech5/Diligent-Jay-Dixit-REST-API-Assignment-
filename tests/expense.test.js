const request = require('supertest');
const app = require('../src/app');
const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, '../src/data/expenses.json');

describe('Expense API Endpoints', () => {
  beforeEach(async () => {
    // Reset test data
    await fs.writeFile(dataFilePath, JSON.stringify([], null, 2), 'utf8');
  });

  afterAll(async () => {
    // Cleanup test data
    await fs.writeFile(dataFilePath, JSON.stringify([], null, 2), 'utf8');
  });

  it('POST /expenses should create a new expense', async () => {
    const payload = {
      title: 'Groceries',
      amount: 45.5,
      category: 'Food',
      date: '2026-07-31'
    };

    const res = await request(app).post('/expenses').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Groceries');
    expect(res.body.amount).toBe(45.5);
    expect(res.body.category).toBe('Food');
  });

  it('POST /expenses should fail on invalid payload', async () => {
    const invalidPayload = {
      title: '',
      amount: -10,
      category: ''
    };

    const res = await request(app).post('/expenses').send(invalidPayload);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('details');
  });

  it('GET /expenses should return list of expenses', async () => {
    const res = await request(app).get('/expenses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /expenses/total should return total sum', async () => {
    await request(app).post('/expenses').send({
      title: 'Lunch',
      amount: 15,
      category: 'Food',
      date: '2026-07-31'
    });

    await request(app).post('/expenses').send({
      title: 'Taxi',
      amount: 25,
      category: 'Transport',
      date: '2026-07-31'
    });

    const res = await request(app).get('/expenses/total');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ total: 40 });
  });

  it('GET /expenses/total/category should return category totals', async () => {
    const res = await request(app).get('/expenses/total/category');
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('object');
  });

  it('DELETE /expenses/:id should remove expense', async () => {
    const created = await request(app).post('/expenses').send({
      title: 'Movie Ticket',
      amount: 12,
      category: 'Entertainment',
      date: '2026-07-31'
    });

    const expenseId = created.body.id;
    const deleteRes = await request(app).delete(`/expenses/${expenseId}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toBe('Expense deleted successfully');
  });

  it('DELETE /expenses/:id should return 404 for non-existent ID', async () => {
    const res = await request(app).delete('/expenses/non-existent-id');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });
});
