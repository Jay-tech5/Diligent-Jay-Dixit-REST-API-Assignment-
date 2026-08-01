const expenseModel = require('../models/expenseModel');
const { validateExpensePayload, validateUpdatePayload } = require('../utils/validation');

async function createExpense(req, res, next) {
  try {
    const { isValid, errors } = validateExpensePayload(req.body);

    if (!isValid) {
      const err = new Error(`Validation failed: ${errors.join('; ')}`);
      err.statusCode = 400;
      err.errors = errors;
      return next(err);
    }

    const expense = await expenseModel.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
}

async function getExpenses(req, res, next) {
  try {
    const { category } = req.query;
    const expenses = await expenseModel.getAll(category);
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
}

async function getExpenseById(req, res, next) {
  try {
    const { id } = req.params;
    const expense = await expenseModel.getById(id);

    if (!expense) {
      const err = new Error(`Expense with id '${id}' not found`);
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
}

async function updateExpense(req, res, next) {
  try {
    const { id } = req.params;

    const { isValid, errors } = validateUpdatePayload(req.body);
    if (!isValid) {
      const err = new Error(`Validation failed: ${errors.join('; ')}`);
      err.statusCode = 400;
      err.errors = errors;
      return next(err);
    }

    const updatedExpense = await expenseModel.updateById(id, req.body);

    if (!updatedExpense) {
      const err = new Error(`Expense with id '${id}' not found`);
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    next(error);
  }
}

async function getTotalExpenses(req, res, next) {
  try {
    const total = await expenseModel.getTotal();
    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
}

async function getTotalByCategory(req, res, next) {
  try {
    const totals = await expenseModel.getTotalByCategory();
    res.status(200).json(totals);
  } catch (error) {
    next(error);
  }
}

async function removeExpense(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await expenseModel.deleteById(id);

    if (!deleted) {
      const err = new Error(`Expense with id '${id}' not found`);
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  getTotalExpenses,
  getTotalByCategory,
  removeExpense
};
