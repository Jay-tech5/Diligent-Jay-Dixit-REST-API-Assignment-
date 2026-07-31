const express = require('express');
const router = express.Router();
const itemRoutes = require('./itemRoutes');

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.use('/items', itemRoutes);

module.exports = router;
