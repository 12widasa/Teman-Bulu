const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const sellerMiddleware = require('../middlewares/sellerMiddleware');
const userMiddleware =  require('../middlewares/userMiddleware');

router.get('/services', userMiddleware.verifyToken, sellerMiddleware.validateSeller, sellerController.getServices);
router.get('/sellerOrders', userMiddleware.verifyToken, sellerMiddleware.validateSeller, sellerController.getSellerOrders);

router.post('/service', userMiddleware.verifyToken, sellerMiddleware.validateSeller, userMiddleware.validateBody(["skill_id", "animal_id", "price"]), sellerController.addService);

router.put('/updateProfileSeller', userMiddleware.verifyToken, sellerMiddleware.validateSeller, userMiddleware.validateBody(['full_name', 'email', 'password', 'animal_ids', 'birth', 'phone_number', 'address', 'description', 'profile', 'cv', 'certificate']), sellerController.updateProfileSeller);
router.put('/updateStatus', userMiddleware.verifyToken, sellerMiddleware.validateSeller, userMiddleware.validateBody(["order_id"]), sellerController.updateStatus);
router.put('/changeStatus', userMiddleware.verifyToken, sellerMiddleware.validateSeller, userMiddleware.validateBody(['status']), sellerController.changeStatus);

module.exports = router;