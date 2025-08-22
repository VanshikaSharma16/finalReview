const express = require('express');
const { getUsers, getUserById, createUser, updatePassword } = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validation');

const router = express.Router();

router.get('/', auth, adminAuth, getUsers);
router.get('/:id', auth, adminAuth, getUserById);
router.post('/', auth, adminAuth, validateRegistration, createUser);
router.put('/password', auth, updatePassword);

module.exports = router;