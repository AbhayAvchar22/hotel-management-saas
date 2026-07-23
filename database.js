const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'hotel_booking.db'));

const initializeDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Properties table
    db.run(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        location TEXT NOT NULL,
        city TEXT NOT NULL,
        price_per_night REAL NOT NULL,
        max_guests INTEGER NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        amenities TEXT,
        image_url TEXT,
        rating REAL DEFAULT 0,
        available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bookings table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guests INTEGER NOT NULL,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'confirmed',
        payment_status TEXT DEFAULT 'completed',
        special_requests TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(property_id) REFERENCES properties(id)
      )
    `);

    // Insert sample data
    db.run("SELECT COUNT(*) as count FROM properties", (err, row) => {
      if (row.count === 0) {
        insertSampleData();
      }
    });
  });
};

const insertSampleData = () => {
  const properties = [
    {
      name: 'Luxury Beach Resort',
      type: 'Resort',
      description: 'Beautiful beachfront resort with world-class amenities',
      location: 'Malibu Beach',
      city: 'Los Angeles',
      price_per_night: 450,
      max_guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: 'WiFi, Pool, Beach Access, Restaurant, Spa',
      image_url: 'https://images.unsplash.com/photo-1571896349842-f58519ba7e6b?w=500',
      rating: 4.8
    },
    {
      name: 'Mountain Villa Retreat',
      type: 'Villa',
      description: 'Cozy mountain villa perfect for families',
      location: 'Rocky Mountains',
      city: 'Denver',
      price_per_night: 320,
      max_guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: 'WiFi, Fireplace, Kitchen, Hiking Trail, Hot Tub',
      image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500',
      rating: 4.7
    },
    {
      name: 'Urban Boutique Hotel',
      type: 'Hotel',
      description: 'Modern hotel in the heart of the city',
      location: 'Downtown',
      city: 'New York',
      price_per_night: 280,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: 'WiFi, Gym, Restaurant, Room Service, Concierge',
      image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1d4e31?w=500',
      rating: 4.6
    },
    {
      name: 'Tropical Paradise Villa',
      type: 'Villa',
      description: 'Exotic villa in tropical paradise',
      location: 'Maui',
      city: 'Hawaii',
      price_per_night: 500,
      max_guests: 10,
      bedrooms: 5,
      bathrooms: 4,
      amenities: 'WiFi, Pool, Ocean View, Private Beach, Chef Kitchen',
      image_url: 'https://images.unsplash.com/photo-1506541633412-ff056601a38d?w=500',
      rating: 4.9
    },
    {
      name: 'Budget-Friendly Inn',
      type: 'Hotel',
      description: 'Comfortable and affordable accommodation',
      location: 'Main Street',
      city: 'Austin',
      price_per_night: 120,
      max_guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: 'WiFi, TV, Parking, Continental Breakfast',
      image_url: 'https://images.unsplash.com/photo-1519167758993-c5254f3b3c3e?w=500',
      rating: 4.2
    }
  ];

  properties.forEach(prop => {
    db.run(
      `INSERT INTO properties (name, type, description, location, city, price_per_night, max_guests, bedrooms, bathrooms, amenities, image_url, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [prop.name, prop.type, prop.description, prop.location, prop.city, prop.price_per_night, prop.max_guests, prop.bedrooms, prop.bathrooms, prop.amenities, prop.image_url, prop.rating]
    );
  });
};

module.exports = { db, initializeDatabase };
