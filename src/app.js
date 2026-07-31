const express = require('express');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());


// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Expense REST API',
    endpoints: {
      getExpenses: 'GET /expenses',
      filterExpenses: 'GET /expenses?category=Food',
      createExpense: 'POST /expenses',
      getTotalExpenses: 'GET /expenses/total',
      getTotalByCategory: 'GET /expenses/total/category',
      deleteExpense: 'DELETE /expenses/:id'
    }
  });
});

app.use('/expenses', expenseRoutes);

app.use((req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const responsePayload = {
    status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
    error: message
  };

  if (err.errors && Array.isArray(err.errors)) {
    responsePayload.details = err.errors;
  }

  res.status(statusCode).json(responsePayload);
});

module.exports = app;
