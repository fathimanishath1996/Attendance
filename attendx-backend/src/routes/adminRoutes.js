const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }
};

router.get('/users', authenticate, isAdmin, adminController.getAllUsers);
router.get('/attendance', authenticate, isAdmin, adminController.getAllAttendance);
router.get('/leaves', authenticate, isAdmin, adminController.getAllLeaves);
router.post('/leaves/manage', authenticate, isAdmin, adminController.manageLeave);
router.get('/leaves/pending-count', authenticate, isAdmin, adminController.getPendingLeavesCount);
router.post('/users/create', authenticate, isAdmin, adminController.createEmployee);

module.exports = router;
