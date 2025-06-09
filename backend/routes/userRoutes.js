const express = require('express');
const router = express.Router();
const { registerSeller, registerAdmin, registerBuyer, login, getAnimals, getSellerServices, getProfile } = require('../controllers/userController');
const { validateBody, verifyToken } = require('../middlewares/userMiddleware');

router.get('/animals', getAnimals);
router.get('/sellerServices', getSellerServices);
router.get('/getProfile', verifyToken, getProfile);

router.post('/registerSeller', validateBody(['full_name', 'username', 'email', 'password', 'animal_ids', 'birth', 'phone_number', 'address']), registerSeller);
router.post('/registerAdmin', validateBody(['full_name', 'email', 'password']), registerAdmin);
router.post('/registerBuyer', validateBody(['full_name', 'email', 'password']), registerBuyer);
router.post('/login', validateBody(['email', 'password']), login);

module.exports = router;