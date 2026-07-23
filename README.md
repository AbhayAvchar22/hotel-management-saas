# Hotel & Villa Booking Website

A simple, full-stack hotel and villa booking platform with user authentication, property listings, and booking management.

## Features

- User authentication (register, login, logout)
- Browse available hotels and villas
- View property details and images
- Make reservations
- Manage bookings
- Admin panel for property management
- Search and filter properties
- Responsive design

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js with Express.js
- **Database**: SQLite
- **Authentication**: JWT tokens

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open http://localhost:3000 in your browser

## Default Credentials

- Admin: admin@hotel.com / admin123
- Test User: user@hotel.com / user123

## Project Structure

```
hotel-booking/
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── properties.html
│   ├── property-detail.html
│   ├── booking.html
│   ├── my-bookings.html
│   ├── admin.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── server.js
├── database.js
├── routes/
│   ├── auth.js
│   ├── properties.js
│   └── bookings.js
├── middleware/
│   └── auth.js
└── package.json
```