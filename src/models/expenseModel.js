const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataFilePath = path.join(__dirname, '../data/expenses.json');

/**
 * Reads expenses from src/data/expenses.json
 * @returns {Promise<Array>} 
 */
async function readAll() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeAll([]);
      return [];
    }
    throw error;
  }
}

/**
 * Writes expenses array to src/data/expenses.json
 * @param {Array} expenses 
 * @returns {Promise<void>}
 */
async function writeAll(expenses) {
  await fs.writeFile(dataFilePath, JSON.stringify(expenses, null, 2), 'utf8');
}

/**
 * Fetch all expenses, optionally filtered by category
 * @param {string} [category] 
 * @returns {Promise<Array>}
 */
async function getAll(category) {
  const expenses = await readAll();
  if (category) {
    return expenses.filter(
      (exp) => exp.category.toLowerCase() === category.toLowerCase()
    );
  }
  return expenses;
}

/**
 * Create and persist a new expense
 * @param {Object} expensePayload 
 * @returns {Promise<Object>}
 */
async function create({ title, amount, category, date }) {
  const expenses = await readAll();

  const newExpense = {
    id: uuidv4(),
    title: title.trim(),
    amount: Number(amount),
    category: category.trim(),
    date: date.trim()
  };

  expenses.push(newExpense);
  await writeAll(expenses);
  return newExpense;
}

/**
 * Calculate total expenses amount
 * @returns {Promise<Object>} Object containing total sum
 */
async function getTotal() {
  const expenses = await readAll();
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  return { total };
}

/**
 * Group expense totals by category
 * @returns {Promise<Object>}
 */
async function getTotalByCategory() {
  const expenses = await readAll();
  const totals = {};

  expenses.forEach((exp) => {
    const cat = exp.category;
    totals[cat] = (totals[cat] || 0) + exp.amount;
  });

  return totals;
}

/**
 * Delete expense by ID
 * @param {string} id 
 * @returns {Promise<boolean>} 
 */
async function deleteById(id) {
  const expenses = await readAll();
  const index = expenses.findIndex((exp) => exp.id === id);

  if (index === -1) {
    return false;
  }

  expenses.splice(index, 1);
  await writeAll(expenses);
  return true;
}

module.exports = {
  readAll,
  writeAll,
  getAll,
  create,
  getTotal,
  getTotalByCategory,
  deleteById
};
