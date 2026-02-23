# AmaShop

A full-stack e-commerce application with Vue 3 frontend and Express/Supabase backend.

## Tech Stack

### Frontend
- Vue 3
- Vue Router
- Axios
- Vite

### Backend
- Express.js
- Supabase (PostgreSQL)
- JWT Authentication
- bcryptjs

## Project Structure

```
AmaShop/
├── client/                 # Vue 3 frontend
│   ├── src/
│   │   ├── api/           # API calls
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   │   └── admin/     # Admin dashboard pages
│   │   ├── router/        # Vue Router config
│   │   └── stores/        # State management
│   └── package.json
│
└── api-supabase/          # Express backend
    ├── routes/            # API route handlers
    │   ├── auth.js
    │   ├── cart.js
    │   ├── categories.js
    │   ├── orders.js
    │   ├── products.js
    │   └── admin.js
    ├── supabase-schema.sql
    └── package.json
```

## Features

### Customer Features
- Browse products by category
- Search products
- Product detail view with images
- Shopping cart (add/remove items)
- User authentication (register/login)
- Checkout

### Admin Features
- Dashboard with order overview
- Product management (CRUD)
- Category management
- Order management

## Getting Started

### Prerequisites
- Node.js
- Supabase account

### Backend Setup

1. Navigate to the API directory:
   ```bash
   cd api-supabase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Run the server:
   ```bash
   npm run dev
   ```

5. Set up the database using `supabase-schema.sql`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API base URL in `src/api/index.js`

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Products
- `GET /api/products` - List products (supports pagination, filtering)
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured` - Get featured products

### Categories
- `GET /api/categories` - List all categories

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/products` - List all products (including inactive)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/:id` - Update order status

## License

ISC
