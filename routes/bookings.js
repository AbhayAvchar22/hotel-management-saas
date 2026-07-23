const express = require('express');
const { db } = require('../database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user bookings
router.get('/', verifyToken, (req, res) => {
  db.all(
    `SELECT b.*, p.name, p.image_url, p.location FROM bookings b
     JOIN properties p ON b.property_id = p.id
     WHERE b.user_id = ? ORDER BY b.created_at DESC`,
    [req.userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch bookings' });
      }
      res.json(rows || []);
    }
  );
});

// Create booking
router.post('/', verifyToken, (req, res) => {
  const { property_id, check_in, check_out, guests, special_requests } = req.body;

  if (!property_id || !check_in || !check_out || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Get property details
  db.get('SELECT * FROM properties WHERE id = ?', [property_id], (err, property) => {
    if (err || !property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (guests > property.max_guests) {
      return res.status(400).json({ error: `Max guests is ${property.max_guests}` });
    }

    // Calculate total price
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * property.price_per_night;

    db.run(
      `INSERT INTO bookings (user_id, property_id, check_in, check_out, guests, total_price, special_requests)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.userId, property_id, check_in, check_out, guests, totalPrice, special_requests],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create booking' });
        }
        res.status(201).json({
          id: this.lastID,
          message: 'Booking confirmed',
          totalPrice,
          nights
        });
      }
    );
  });
});

// Update booking
router.put('/:id', verifyToken, (req, res) => {
  const { check_in, check_out, guests, status } = req.body;

  db.run(
    `UPDATE bookings SET check_in=?, check_out=?, guests=?, status=? WHERE id=? AND user_id=?`,
    [check_in, check_out, guests, status, req.params.id, req.userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update booking' });
      }
      res.json({ message: 'Booking updated' });
    }
  );
});

// Cancel booking
router.delete('/:id', verifyToken, (req, res) => {
  db.run(
    'DELETE FROM bookings WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to cancel booking' });
      }
      res.json({ message: 'Booking cancelled' });
    }
  );
});

module.exports = router;
