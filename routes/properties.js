const express = require('express');
const { db } = require('../database');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all properties
router.get('/', (req, res) => {
  const { city, type, minPrice, maxPrice } = req.query;
  let query = 'SELECT * FROM properties WHERE available = 1';
  const params = [];

  if (city) {
    query += ' AND city LIKE ?';
    params.push(`%${city}%`);
  }

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  if (minPrice) {
    query += ' AND price_per_night >= ?';
    params.push(minPrice);
  }

  if (maxPrice) {
    query += ' AND price_per_night <= ?';
    params.push(maxPrice);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
    res.json(rows);
  });
});

// Get property by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM properties WHERE id = ?', [req.params.id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(row);
  });
});

// Create property (Admin only)
router.post('/', verifyToken, isAdmin, (req, res) => {
  const { name, type, description, location, city, price_per_night, max_guests, bedrooms, bathrooms, amenities, image_url } = req.body;

  db.run(
    `INSERT INTO properties (name, type, description, location, city, price_per_night, max_guests, bedrooms, bathrooms, amenities, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, type, description, location, city, price_per_night, max_guests, bedrooms, bathrooms, amenities, image_url],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create property' });
      }
      res.status(201).json({ id: this.lastID, message: 'Property created' });
    }
  );
});

// Update property (Admin only)
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  const { name, type, description, location, city, price_per_night, max_guests, bedrooms, bathrooms, amenities, available } = req.body;

  db.run(
    `UPDATE properties SET name=?, type=?, description=?, location=?, city=?, price_per_night=?, max_guests=?, bedrooms=?, bathrooms=?, amenities=?, available=? WHERE id=?`,
    [name, type, description, location, city, price_per_night, max_guests, bedrooms, bathrooms, amenities, available, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update property' });
      }
      res.json({ message: 'Property updated' });
    }
  );
});

// Delete property (Admin only)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  db.run('DELETE FROM properties WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete property' });
    }
    res.json({ message: 'Property deleted' });
  });
});

module.exports = router;
