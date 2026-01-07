# Lalitha Mega Mall Backend API

A complete backend API for the Lalitha Mega Mall e-commerce application built with Node.js, Express, Supabase, and Twilio OTP verification.

## 🚀 Features

- **OTP-based Authentication** using Twilio SMS
- **JWT Token Management** for secure sessions
- **Product Management** for multiple categories
- **Order Processing** with status tracking
- **Coupon System** with validation
- **Admin Panel** with dashboard and management tools
- **RESTful API** with proper error handling
- **MVC Architecture** with clean separation of concerns

## 📁 Project Structure

```
backend/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── config/                   # Configuration files
│   ├── supabaseClient.js     # Supabase database client
│   ├── twilioClient.js       # Twilio SMS client
│   └── dotenvConfig.js       # Environment variables
├── models/                   # Database models
│   ├── usersModel.js         # User operations
│   ├── productsModel.js      # Product operations
│   ├── ordersModel.js        # Order operations
│   └── couponsModel.js       # Coupon operations
├── controllers/              # Business logic
│   ├── authController.js     # Authentication logic
│   ├── productController.js  # Product management
│   ├── orderController.js    # Order processing
│   ├── adminController.js    # Admin operations
│   └── couponController.js   # Coupon management
├── routes/                   # API routes
│   ├── authRoutes.js         # Authentication routes
│   ├── productRoutes.js      # Product routes
│   ├── orderRoutes.js        # Order routes
│   ├── adminRoutes.js        # Admin routes
│   └── couponRoutes.js       # Coupon routes
├── middleware/               # Custom middleware
│   ├── authMiddleware.js     # JWT authentication
│   └── errorMiddleware.js    # Error handling
└── utils/                    # Utility functions
    ├── generateOtp.js        # OTP generation
    ├── sendOtp.js            # SMS sending
    └── generateToken.js      # JWT token management
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lalitha-mega-mall/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_ANON_KEY=your_supabase_anon_key

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. **Database Setup**
   Create the following tables in your Supabase database:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     phone VARCHAR(15) UNIQUE NOT NULL,
     name VARCHAR(100) NOT NULL,
     role VARCHAR(20) DEFAULT 'customer',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Products table
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR(200) NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     image_url TEXT,
     stock INTEGER DEFAULT 0,
     category VARCHAR(50) NOT NULL,
     discount INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Orders table
   CREATE TABLE orders (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     items JSONB NOT NULL,
     total_amount DECIMAL(10,2) NOT NULL,
     status VARCHAR(20) DEFAULT 'Pending',
     delivery_address TEXT,
     delivery_partner VARCHAR(100),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Coupons table
   CREATE TABLE coupons (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     code VARCHAR(20) UNIQUE NOT NULL,
     discount_percent INTEGER NOT NULL,
     expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
     max_uses INTEGER DEFAULT 100,
     current_uses INTEGER DEFAULT 0,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

## 🚀 Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Production Mode**
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/send-otp` | Send OTP to phone number | No |
| POST | `/api/auth/verify-otp` | Verify OTP and login | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products/:category` | Get products by category | Optional |
| GET | `/api/products/:category/:id` | Get product by ID | Optional |
| GET | `/api/products/search` | Search products | Optional |
| GET | `/api/products` | Get all products | Admin |
| POST | `/api/products/:category` | Create product | Admin |
| PUT | `/api/products/:category/:id` | Update product | Admin |
| DELETE | `/api/products/:category/:id` | Delete product | Admin |
| PUT | `/api/products/:id/stock` | Update stock | Admin |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders/user/:id` | Get user orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| GET | `/api/orders/stats/overview` | Get order statistics | Admin |
| DELETE | `/api/orders/:id` | Delete order | Admin |

### Coupon Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/coupons/active` | Get active coupons | Optional |
| POST | `/api/coupons/validate` | Validate coupon code | Optional |
| GET | `/api/coupons` | Get all coupons | Admin |
| POST | `/api/coupons` | Create coupon | Admin |
| PUT | `/api/coupons/:id` | Update coupon | Admin |
| PUT | `/api/coupons/:id/toggle` | Toggle coupon status | Admin |
| DELETE | `/api/coupons/:id` | Delete coupon | Admin |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard` | Get dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/orders/recent` | Get recent orders | Admin |
| GET | `/api/admin/products/low-stock` | Get low stock products | Admin |

## 🔐 Authentication Flow

1. **Send OTP**: User enters phone number → OTP sent via SMS
2. **Verify OTP**: User enters OTP → JWT tokens generated
3. **Access Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Refresh Token**: Use refresh token to get new access token

## 📱 Product Categories

- `snacks` - Snacks and chips
- `chocolates` - Chocolates and sweets
- `cosmetics` - Beauty and cosmetics
- `dry_fruits` - Dry fruits and nuts
- `plastic_items` - Plastic containers and items
- `utensils` - Kitchen utensils
- `appliances` - Home appliances

## 🛡️ Security Features

- JWT-based authentication
- OTP verification via SMS
- Role-based access control
- Input validation and sanitization
- Error handling middleware
- CORS configuration

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `FRONTEND_URL` | Frontend URL for CORS | No (default: http://localhost:3000) |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | Yes |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | Yes |

## 📝 Example Usage

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456", "name": "John Doe"}'
```

### Get Products
```bash
curl -X GET http://localhost:5000/api/products/snacks
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "items": [
      {"productId": "product-id", "quantity": 2}
    ],
    "total_amount": 100.00,
    "delivery_address": "123 Main St"
  }'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@lalithamegamall.com or create an issue in the repository.













