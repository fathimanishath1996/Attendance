const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, leaveController.getMyLeaves);
router.post('/', authenticate, leaveController.applyLeave);

module.exports = router;
