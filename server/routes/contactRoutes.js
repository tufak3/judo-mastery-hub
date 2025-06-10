const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');

// Публичные маршруты
router.get('/', contactController.getContacts);

// Защищенные маршруты (только для админов)
router.put('/', authenticateToken, contactController.updateContacts);
router.put('/:field', authenticateToken, contactController.updateContactField);

module.exports = router; 