const express = require('express');
const path = require('path');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));


app.use('/expenses', expenseRoutes);

app.use((req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});