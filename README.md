# ReadNow - Modern Book Shop

A full-stack e-commerce application for selling books, built with React, Node.js, Express, and MongoDB.

## Features

### Frontend Features
- **Homepage**: Featured books, categories, search functionality
- **Book Listing**: Filtering, sorting, pagination, grid/list view
- **Book Details**: Reviews, ratings, add to cart
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Register, login, profile management
- **Checkout**: Shipping information, payment methods
- **Responsive Design**: Mobile, tablet, and desktop support

### Backend Features
- **RESTful API**: Books, users, orders, reviews
- **Authentication**: JWT-based with role-based access control
- **Admin Dashboard**: Manage books, users, orders
- **Security**: Input validation, rate limiting, password hashing
- **Database**: MongoDB with Mongoose ODM

### Admin Features
- **Dashboard**: Statistics and recent orders overview
- **Books Management**: CRUD operations for books
- **Users Management**: View users, change roles
- **Orders Management**: View and update order status

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting, bcryptjs
- **Validation**: Joi
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd readnow-bookshop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret key
   - Other optional configurations

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Seed the database (optional)**
   ```bash
   node server/seedData.js
   ```
   This creates sample books and admin/user accounts.

6. **Start the development server**
   ```bash
   npm run dev
   ```
   This starts both the frontend (port 3000) and backend (port 5000) concurrently.

## Default Accounts (after seeding)

- **Admin**: admin@readnow.com / admin123
- **User**: user@readnow.com / user123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Books
- `GET /api/books` - Get all books (with filtering)
- `GET /api/books/:id` - Get single book
- `GET /api/books/:id/reviews` - Get book reviews
- `POST /api/books/:id/reviews` - Add book review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/books` - Get all books (admin)
- `POST /api/admin/books` - Create new book
- `PUT /api/admin/books/:id` - Update book
- `DELETE /api/admin/books/:id` - Delete book
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## Project Structure

```
readnow-bookshop/
├── src/                    # Frontend React application
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts (Auth, Cart)
│   ├── pages/             # Page components
│   └── pages/admin/       # Admin dashboard pages
├── server/                # Backend Node.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── seedData.js        # Database seeding script
├── public/                # Static files
└── package.json           # Dependencies and scripts
```

## Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Backend (Render/Heroku)
1. Set environment variables on your hosting platform
2. Deploy the server code
3. Ensure MongoDB is accessible from your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@readnow.com or create an issue in the repository.