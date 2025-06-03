const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const userMiddleware = require('../middlewares/userMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/users', userMiddleware.verifyToken, adminMiddleware.validateAdmin, adminController.getUsers);

router.post('/verify', userMiddleware.verifyToken, adminMiddleware.validateAdmin, userMiddleware.validateBody(['seller_id']), adminController.verifySeller);
router.post('/decline', userMiddleware.verifyToken, adminMiddleware.validateAdmin, userMiddleware.validateBody(['seller_id']), adminController.rejectSeller);

module.exports = router;