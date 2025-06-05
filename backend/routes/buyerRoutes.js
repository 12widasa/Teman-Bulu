const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const userMiddleware = require('../middlewares/userMiddleware');
const buyerMiddleware = require('../middlewares/buyerMiddleware');

router.get('/seller/:id', userMiddleware.verifyToken, buyerMiddleware.validateBuyer, buyerController.getSeller);
router.get('/buyerOrders', userMiddleware.verifyToken, buyerMiddleware.validateBuyer, buyerController.buyerOrders);

router.post('/updateProfileBuyer', userMiddleware.verifyToken, buyerMiddleware.validateBuyer, userMiddleware.validateBody(['full_name', 'email', 'password', 'phone_number', 'address']), buyerController.updateProfileBuyer);
router.post('/order', userMiddleware.verifyToken, buyerMiddleware.validateBuyer, userMiddleware.validateBody(['service_id', 'start_dt', 'total_price']), buyerController.order);

router.put('/payOrder', userMiddleware.verifyToken, buyerMiddleware.validateBuyer, userMiddleware.validateBody(['order_id']), buyerController.payOrder);
router.put('/rateOrder', userMiddleware.verifyToken, buyerMiddleware.validateBuyer, userMiddleware.validateBody(['order_id', 'rating']), buyerController.rateOrder)

module.exports = router;