process.env.NODE_ENV = 'test';

const fs = require('fs').promises;
const path = require('path');
const expenseModel = require('../src/models/expenseModel');

describe('Expense Model Unit Tests', () => {
  const testFilePath = expenseModel.getDataFilePath();

  beforeEach(async () => {
    await expenseModel.writeAll([]);
  });

  afterAll(async () => {
    try {
      await fs.unlink(testFilePath);
    } catch (_) {}
  });

  it('should resolve test data path in test environment', () => {
    expect(testFilePath).toContain('expenses.test.json');
  });

  it('should create and persist expenses atomically', async () => {
    const created = await expenseModel.create({
      title: 'Coffee',
      amount: '4.50',
      category: 'Food',
      date: '2026-08-01'
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe('Coffee');
    expect(created.amount).toBe(4.5);

    const all = await expenseModel.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(created.id);
  });

  it('should recover gracefully if json file is corrupted or empty', async () => {
    // Write invalid JSON to test file
    await fs.writeFile(testFilePath, '{ invalid json content', 'utf8');

    const expenses = await expenseModel.readAll();
    expect(expenses).toEqual([]);
  });

  it('should calculate total and total by category accurately', async () => {
    await expenseModel.create({ title: 'Book', amount: 20, category: 'Education', date: '2026-08-01' });
    await expenseModel.create({ title: 'Pen', amount: 5, category: 'Education', date: '2026-08-01' });
    await expenseModel.create({ title: 'Snack', amount: 10, category: 'Food', date: '2026-08-01' });

    const totalRes = await expenseModel.getTotal();
    expect(totalRes).toEqual({ total: 35 });

    const categoryRes = await expenseModel.getTotalByCategory();
    expect(categoryRes).toEqual({
      Education: 25,
      Food: 10
    });
  });

  it('should delete expense by id', async () => {
    const item = await expenseModel.create({ title: 'Ticket', amount: 15, category: 'Events', date: '2026-08-01' });
    const deleteSuccess = await expenseModel.deleteById(item.id);
    expect(deleteSuccess).toBe(true);

    const all = await expenseModel.getAll();
    expect(all.find((exp) => exp.id === item.id)).toBeUndefined();
  });
});
