const express = require('express');
const router = express.Router();
const { registerSeller, registerAdmin, registerBuyer, login, getAnimals } = require('../controllers/userController');
const { validateBody } = require('../middlewares/userMiddleware');

router.get('/animals', getAnimals);

router.post('/registerSeller', validateBody(['full_name', 'username', 'email', 'password', 'animal_ids', 'birth', 'phone_number', 'address']), registerSeller);
router.post('/registerAdmin', validateBody(['full_name', 'email', 'password']), registerAdmin);
router.post('/registerBuyer', validateBody(['full_name', 'email', 'password']), registerBuyer);
router.post('/login', validateBody(['email', 'password']), login);

module.exports = router;