const express = require('express');
const router = express.Router();
const multer = require('multer');
const attendanceController = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/today', authenticate, attendanceController.getTodayStatus);
router.get('/summary', authenticate, attendanceController.getSummary);
router.post('/checkin', authenticate, upload.single('photo'), attendanceController.checkIn);
router.post('/checkout', authenticate, upload.single('photo'), attendanceController.checkOut);

module.exports = router;
