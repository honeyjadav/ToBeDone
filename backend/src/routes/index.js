const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

router.use('/auth', authRoutes);

module.exports = router;