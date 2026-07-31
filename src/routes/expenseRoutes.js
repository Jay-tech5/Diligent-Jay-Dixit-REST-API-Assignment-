const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/',expenseController.createExpense);
router.get('/',expenseController.getExpenses);
router.get('/total',expenseController.getTotalExpenses);
router.get('/total/category',expenseController.getTotalByCategory);
router.delete('/:id',expenseController,expenseController.removeExpense);
module.exports=router;

