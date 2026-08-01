const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.get('/total/category', expenseController.getTotalByCategory);
router.get('/total', expenseController.getTotalExpenses);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseController.updateExpense);
router.patch('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.removeExpense);

module.exports = router;

