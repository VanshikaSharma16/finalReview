const express = require('express');
const { getStores, getStoreById, createStore, getDashboardStats, getStoreOwnerDashboard } = require('../controllers/storeController');
const { auth, adminAuth, storeOwnerAuth } = require('../middleware/auth');
const { validateStore } = require('../middleware/validation');

const router = express.Router();

router.get('/', auth, getStores);
router.get('/:id', auth, getStoreById);
router.post('/', auth, adminAuth, validateStore, createStore);
router.get('/stats/dashboard', auth, adminAuth, getDashboardStats);
router.get('/owner/dashboard', auth, storeOwnerAuth, getStoreOwnerDashboard);

module.exports = router;