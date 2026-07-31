const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

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

// Expense REST routes
app.use('/expenses', expenseRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle invalid JSON payload syntax errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload format in request body';
  }

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
