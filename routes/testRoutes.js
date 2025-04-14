const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authentication');
const authorizeRoles = require('../middleware/authorization');

router.get('/test-protected', authMiddleware, (req, res) => {
  res.json({ message: `✅ Hello ${req.user.role}, you are authenticated!` });
});

router.get('/test-admin', authMiddleware, authorizeRoles('admin'), (req, res) => {
  res.json({ message: `✅ Hello Admin ${req.user.id}` });
});

module.exports = router;
