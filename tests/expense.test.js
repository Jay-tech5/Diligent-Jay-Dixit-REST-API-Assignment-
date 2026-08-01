process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const expenseModel = require('../src/models/expenseModel');
const fs = require('fs').promises;

describe('Expense API Endpoints', () => {
  beforeEach(async () => {
    // Reset test data in test isolated JSON file
    await expenseModel.writeAll([]);
  });

  afterAll(async () => {
    // Cleanup test file after tests complete
    try {
      await fs.unlink(expenseModel.getDataFilePath());
    } catch (_) {}
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

  it('GET /expenses/:id should return single expense by ID', async () => {
    const created = await request(app).post('/expenses').send({
      title: 'Headphones',
      amount: 150,
      category: 'Electronics',
      date: '2026-08-01'
    });

    const res = await request(app).get(`/expenses/${created.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Headphones');
  });

  it('PATCH /expenses/:id should update selected fields of existing expense record', async () => {
    const created = await request(app).post('/expenses').send({
      title: 'Coffee',
      amount: 350,
      category: 'Food',
      date: '2026-08-01'
    });

    const patchRes = await request(app)
      .patch(`/expenses/${created.body.id}`)
      .send({ amount: 400, title: 'Espresso Coffee' });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.body.amount).toBe(400);
    expect(patchRes.body.title).toBe('Espresso Coffee');
    expect(patchRes.body.category).toBe('Food');
  });

  it('PUT /expenses/:id should perform full replacement of existing expense record', async () => {
    const created = await request(app).post('/expenses').send({
      title: 'Tea',
      amount: 50,
      category: 'Drinks',
      date: '2026-08-01'
    });

    const putRes = await request(app)
      .put(`/expenses/${created.body.id}`)
      .send({ title: 'Green Tea', amount: 80, category: 'Beverages', date: '2026-08-01' });

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.title).toBe('Green Tea');
    expect(putRes.body.amount).toBe(80);
    expect(putRes.body.category).toBe('Beverages');

    const invalidPut = await request(app)
      .put(`/expenses/${created.body.id}`)
      .send({ amount: 100 }); // missing title & category

    expect(invalidPut.statusCode).toBe(400);
    expect(invalidPut.body.status).toBe('fail');
  });

  it('POST /expenses should reject non-finite amounts like Infinity', async () => {
    const invalidPayload = {
      title: 'Expensive Item',
      amount: 'Infinity',
      category: 'Luxury'
    };

    const res = await request(app).post('/expenses').send(invalidPayload);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('PATCH /expenses/:id should reject empty body payload', async () => {
    const created = await request(app).post('/expenses').send({
      title: 'Lunch',
      amount: 20,
      category: 'Food'
    });

    const res = await request(app).patch(`/expenses/${created.body.id}`).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
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

  it('GET /expenses?category=Food&category=Transport should handle repeated query params safely without 500 crash', async () => {
    await request(app).post('/expenses').send({ title: 'Burger', amount: 10, category: 'Food' });
    await request(app).post('/expenses').send({ title: 'Bus', amount: 5, category: 'Transport' });
    await request(app).post('/expenses').send({ title: 'Book', amount: 15, category: 'Education' });

    const res = await request(app).get('/expenses?category=Food&category=Transport');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });
});
