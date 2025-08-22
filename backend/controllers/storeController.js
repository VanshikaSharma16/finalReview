const { pool } = require('../config/database');

// Get all stores with filters and search
const getStores = async (req, res) => {
  try {
    const { name, address, page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const userId = req.user?.id;
    
    let query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id, u.name as owner_name,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as rating_count
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    
    let countQuery = 'SELECT COUNT(*) as total FROM stores WHERE 1=1';
    let queryParams = [];
    
    // Apply filters
    if (name) {
      query += ' AND s.name LIKE ?';
      countQuery += ' AND name LIKE ?';
      queryParams.push(`%${name}%`);
    }
    
    if (address) {
      query += ' AND s.address LIKE ?';
      countQuery += ' AND address LIKE ?';
      queryParams.push(`%${address}%`);
    }
    
    // Get total count
    const [countResult] = await pool.execute(countQuery, queryParams);
    const total = countResult[0].total;
    
    // Apply sorting and pagination
    const validSortColumns = ['name', 'email', 'address', 'average_rating'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
    query += ` GROUP BY s.id ORDER BY ${sortColumn} ${order}`;
    
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Execute query
    const [stores] = await pool.execute(query, queryParams);
    
    // If user is logged in, get their ratings for these stores
    if (userId) {
      for (let store of stores) {
        const [userRatings] = await pool.execute(
          'SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?',
          [userId, store.id]
        );
        
        store.user_rating = userRatings.length > 0 ? userRatings[0].rating : null;
      }
    }
    
    res.json({
      stores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error fetching stores' });
  }
};

// Get store by ID
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [stores] = await pool.execute(
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, u.name as owner_name,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(r.id) as rating_count
       FROM stores s
       LEFT JOIN users u ON s.owner_id = u.id
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.id = ?
       GROUP BY s.id`,
      [id]
    );
    
    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({ store: stores[0] });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ message: 'Server error fetching store' });
  }
};

// Create store (admin only)
const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    // Check if store already exists
    const [existingStores] = await pool.execute(
      'SELECT id FROM stores WHERE email = ? OR name = ?',
      [email, name]
    );

    if (existingStores.length > 0) {
      return res.status(400).json({ message: 'Store with this email or name already exists' });
    }

    // Insert new store
    const [result] = await pool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: { id: result.insertId, name, email, address, owner_id }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Server error creating store' });
  }
};

// Get dashboard stats (admin only)
const getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [storeCount] = await pool.execute('SELECT COUNT(*) as count FROM stores');
    const [ratingCount] = await pool.execute('SELECT COUNT(*) as count FROM ratings');
    
    res.json({
      userCount: userCount[0].count,
      storeCount: storeCount[0].count,
      ratingCount: ratingCount[0].count
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

// Get store owner dashboard
const getStoreOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get stores owned by this user
    const [stores] = await pool.execute(
      `SELECT s.id, s.name, s.email, s.address,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(r.id) as rating_count
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [userId]
    );
    
    // Get ratings for the first store (or all if needed)
    let ratings = [];
    if (stores.length > 0) {
      const [storeRatings] = await pool.execute(
        `SELECT r.rating, r.created_at, u.name as user_name
         FROM ratings r
         JOIN users u ON r.user_id = u.id
         WHERE r.store_id = ?
         ORDER BY r.created_at DESC
         LIMIT 10`,
        [stores[0].id]
      );
      ratings = storeRatings;
    }
    
    res.json({
      stores,
      recentRatings: ratings
    });
  } catch (error) {
    console.error('Get store owner dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching store owner dashboard' });
  }
};

module.exports = { getStores, getStoreById, createStore, getDashboardStats, getStoreOwnerDashboard };