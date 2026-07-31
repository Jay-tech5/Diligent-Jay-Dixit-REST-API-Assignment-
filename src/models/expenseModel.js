const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataFilePath = path.join(__dirname, '../data/expenses.json');

/**
 * Ensures data directory exists
 */
async function ensureDirectoryExists() {
  const dir = path.dirname(dataFilePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    // Ignore error if directory already exists
  }
}

/**
 * Reads expenses from src/data/expenses.json
 * @returns {Promise<Array>} 
 */
async function readAll() {
  await ensureDirectoryExists();
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
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
  await ensureDirectoryExists();
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
      (exp) => exp.category && exp.category.toLowerCase() === category.toLowerCase()
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
    amount: Math.round(Number(amount) * 100) / 100,
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
  const totalRaw = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const total = Math.round(totalRaw * 100) / 100;
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
    if (cat) {
      const current = totals[cat] || 0;
      totals[cat] = Math.round((current + Number(exp.amount || 0)) * 100) / 100;
    }
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
