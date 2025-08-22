const { pool } = require('../config/database');

// Submit or update rating
const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    // Check if rating already exists
    const [existingRatings] = await pool.execute(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );

    if (existingRatings.length > 0) {
      // Update existing rating
      await pool.execute(
        'UPDATE ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [rating, existingRatings[0].id]
      );
      
      return res.json({ message: 'Rating updated successfully' });
    } else {
      // Create new rating
      await pool.execute(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [user_id, store_id, rating]
      );
      
      return res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error submitting rating' });
  }
};

// Get ratings for a store
const getStoreRatings = async (req, res) => {
  try {
    const { store_id } = req.params;
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    
    let query = `
      SELECT r.rating, r.created_at, u.name as user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `;
    
    let countQuery = 'SELECT COUNT(*) as total FROM ratings WHERE store_id = ?';
    let queryParams = [store_id];
    
    // Get total count
    const [countResult] = await pool.execute(countQuery, queryParams);
    const total = countResult[0].total;
    
    // Apply sorting and pagination
    const validSortColumns = ['rating', 'created_at', 'user_name'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), (page - 1) * limit);
    
    // Execute query
    const [ratings] = await pool.execute(query, queryParams);
    
    res.json({
      ratings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ message: 'Server error fetching store ratings' });
  }
};

module.exports = { submitRating, getStoreRatings };