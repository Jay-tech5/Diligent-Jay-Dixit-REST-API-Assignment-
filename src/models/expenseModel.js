const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function getDataFilePath() {
  if (process.env.STORAGE_FILE) {
    return process.env.STORAGE_FILE;
  }
  if (process.env.NODE_ENV === 'test') {
    return path.join(__dirname, '../data/expenses.test.json');
  }
  return path.join(__dirname, '../data/expenses.json');
}

async function ensureDirectoryExists(filePath = getDataFilePath()) {
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {}
}

let writeQueue = Promise.resolve();

function enqueueOperation(taskFn) {
  writeQueue = writeQueue.then(taskFn, taskFn);
  return writeQueue;
}

async function readAll() {
  const filePath = getDataFilePath();
  await ensureDirectoryExists(filePath);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    if (!data.trim()) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
      await writeAll([]);
      return [];
    }
    throw error;
  }
}

async function writeAll(expenses) {
  const filePath = getDataFilePath();
  await ensureDirectoryExists(filePath);
  const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`;
  try {
    await fs.writeFile(tempPath, JSON.stringify(expenses, null, 2), 'utf8');
    await fs.rename(tempPath, filePath);
  } catch (err) {
    try {
      await fs.unlink(tempPath);
    } catch (_) {}
    throw err;
  }
}

async function getAll(category) {
  const expenses = await readAll();
  if (category) {
    if (typeof category === 'string') {
      const targetCategory = category.trim().toLowerCase();
      if (!targetCategory) return expenses;
      return expenses.filter(
        (exp) => exp.category && exp.category.trim().toLowerCase() === targetCategory
      );
    }
    if (Array.isArray(category)) {
      const targetCategories = category
        .filter((c) => typeof c === 'string')
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean);
      if (targetCategories.length === 0) return expenses;
      return expenses.filter(
        (exp) => exp.category && targetCategories.includes(exp.category.trim().toLowerCase())
      );
    }
  }
  return expenses;
}

async function create({ title, amount, category, date }) {
  return enqueueOperation(async () => {
    const expenses = await readAll();

    const newExpense = {
      id: uuidv4(),
      title: title.trim(),
      amount: Math.round(Number(amount) * 100) / 100,
      category: category.trim(),
      date: (date && typeof date === 'string' && date.trim()) ? date.trim() : new Date().toISOString().split('T')[0]
    };

    expenses.push(newExpense);
    await writeAll(expenses);
    return newExpense;
  });
}

async function getTotal() {
  const expenses = await readAll();
  const totalRaw = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const total = Math.round(totalRaw * 100) / 100;
  return { total };
}

async function getTotalByCategory() {
  const expenses = await readAll();
  const totals = {};

  expenses.forEach((exp) => {
    const cat = exp.category ? exp.category.trim() : null;
    if (cat) {
      const current = totals[cat] || 0;
      totals[cat] = Math.round((current + Number(exp.amount || 0)) * 100) / 100;
    }
  });

  return totals;
}

async function deleteById(id) {
  return enqueueOperation(async () => {
    const expenses = await readAll();
    const index = expenses.findIndex((exp) => exp.id === id);

    if (index === -1) {
      return false;
    }

    expenses.splice(index, 1);
    await writeAll(expenses);
    return true;
  });
}

async function getById(id) {
  const expenses = await readAll();
  const found = expenses.find((exp) => exp.id === id);
  return found || null;
}

async function updateById(id, updatePayload) {
  return enqueueOperation(async () => {
    const expenses = await readAll();
    const index = expenses.findIndex((exp) => exp.id === id);

    if (index === -1) {
      return null;
    }

    const current = expenses[index];
    const updated = {
      ...current,
      title: (updatePayload.title !== undefined && typeof updatePayload.title === 'string') ? updatePayload.title.trim() : current.title,
      amount: updatePayload.amount !== undefined ? Math.round(Number(updatePayload.amount) * 100) / 100 : current.amount,
      category: (updatePayload.category !== undefined && typeof updatePayload.category === 'string') ? updatePayload.category.trim() : current.category,
      date: (updatePayload.date !== undefined && updatePayload.date !== null && typeof updatePayload.date === 'string' && updatePayload.date.trim() !== '') 
        ? updatePayload.date.trim() 
        : current.date
    };

    expenses[index] = updated;
    await writeAll(expenses);
    return updated;
  });
}

module.exports = {
  getDataFilePath,
  readAll,
  writeAll,
  getAll,
  getById,
  create,
  updateById,
  getTotal,
  getTotalByCategory,
  deleteById
};

