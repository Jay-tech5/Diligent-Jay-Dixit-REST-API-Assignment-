const express = require('express');
const path = require('path');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Serve static assets for the web dashboard preview
app.use(express.static(path.join(__dirname, '../public')));

// Register API routes
app.use('/expenses', expenseRoutes);

// Unknown route handler (404 Not Found)
app.use((req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// Centralized error handling middleware
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