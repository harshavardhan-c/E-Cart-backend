-- =====================================================
-- FINAL COMPLETE SCHEMA for Lalitha Mega Mall
-- Run this ENTIRE file in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: CLEAN UP OLD TABLES
-- =====================================================

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS snacks CASCADE;
DROP TABLE IF EXISTS chocolates CASCADE;
DROP TABLE IF EXISTS cosmetics CASCADE;
DROP TABLE IF EXISTS dry_fruits CASCADE;
DROP TABLE IF EXISTS plastic_items CASCADE;
DROP TABLE IF EXISTS utensils CASCADE;
DROP TABLE IF EXISTS appliances CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;

-- =====================================================
-- STEP 2: CREATE USERS TABLE (with email)
-- =====================================================

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- STEP 3: CREATE PRODUCTS TABLE (unified)
-- =====================================================

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2),
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  brand TEXT,
  unit TEXT DEFAULT 'packet',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);

-- =====================================================
-- STEP 4: CREATE CART TABLE
-- =====================================================

CREATE TABLE cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

CREATE INDEX idx_cart_customer ON cart(customer_id);

-- =====================================================
-- STEP 5: CREATE ORDERS TABLE
-- =====================================================

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  items JSONB,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'Pending',
  delivery_address TEXT,
  delivery_partner TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'cancelled')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- =====================================================
-- STEP 6: CREATE COUPONS TABLE
-- =====================================================

CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent DECIMAL(10,2) NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 7: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 8: CREATE RLS POLICIES
-- =====================================================

CREATE POLICY "Users full access" ON users FOR ALL USING (true);
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Customers can manage own cart" ON cart FOR ALL USING (true);
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true AND expiry_date > NOW());

-- =====================================================
-- STEP 9: INSERT SAMPLE PRODUCTS
-- =====================================================

-- Snacks
INSERT INTO products (name, description, price, mrp, image_url, stock, category, discount_percent, brand, unit) VALUES
('Lays Classic', 'Crispy potato chips', 50.00, 60.00, 'https://via.placeholder.com/150', 100, 'snacks', 10, 'Lays', 'packet'),
('Maggie 2-Minute Noodles', 'Instant noodles', 40.00, 45.00, 'https://via.placeholder.com/150', 200, 'snacks', 5, 'Maggie', 'packet'),
('Mixed Dry Fruits (500g)', 'Premium dry fruits mix', 450.00, 600.00, 'https://via.placeholder.com/150', 50, 'snacks', 25, 'Premium', 'packet'),
('Roasted Chickpeas (200g)', 'Healthy roasted snack', 120.00, 150.00, 'https://via.placeholder.com/150', 75, 'snacks', 20, 'Healthy', 'packet');

-- Chocolates
INSERT INTO products (name, description, price, mrp, image_url, stock, category, discount_percent, brand, unit) VALUES
('Dairy Milk', 'Milk chocolate bar', 60.00, 60.00, 'https://via.placeholder.com/150', 150, 'chocolates', 0, 'Cadbury', 'packet'),
('Perk', 'Chocolate wafer', 30.00, 35.00, 'https://via.placeholder.com/150', 200, 'chocolates', 5, 'Cadbury', 'packet'),
('Dark Chocolate Bar (100g)', 'Premium dark chocolate', 150.00, 180.00, 'https://via.placeholder.com/150', 100, 'chocolates', 15, 'Premium', 'packet');

-- Cosmetics
INSERT INTO products (name, description, price, mrp, image_url, stock, category, discount_percent, brand, unit) VALUES
('Lipstick', 'Matte lipstick', 200.00, 250.00, 'https://via.placeholder.com/150', 50, 'cosmetics', 10, 'Beauty', 'piece'),
('Face Cream', 'Moisturizing cream', 350.00, 450.00, 'https://via.placeholder.com/150', 30, 'cosmetics', 15, 'Beauty', 'jar'),
('Shampoo (200ml)', 'Nourishing hair shampoo', 180.00, 250.00, 'https://via.placeholder.com/150', 60, 'cosmetics', 20, 'Haircare', 'bottle');

-- Dry Fruits
INSERT INTO products (name, description, price, mrp, image_url, stock, category, discount_percent, brand, unit) VALUES
('Almonds (500g)', 'Premium California almonds', 500.00, 600.00, 'https://via.placeholder.com/150', 50, 'dry_fruits', 0, 'Premium', 'packet'),
('Cashews (500g)', 'Fresh cashews', 600.00, 700.00, 'https://via.placeholder.com/150', 40, 'dry_fruits', 5, 'Premium', 'packet'),
('Pistachios (500g)', 'Premium Iranian pistachios', 550.00, 650.00, 'https://via.placeholder.com/150', 35, 'dry_fruits', 18, 'Premium', 'packet');

-- Plastic Items
INSERT INTO products (name, description, price, mrp, image_url, stock, category, discount_percent, brand, unit) VALUES
('Dustbin (20L)', 'Plastic dustbin with lid', 250.00, 300.00, 'https://via.placeholder.com/150', 20, 'plastic_items', 0, 'HomePlus', 'piece'),
('Water Bottle (1L)', 'BPA-free reusable bottle', 150.00, 200.00, 'https://via.placeholder.com/150', 50, 'plastic_items', 20, 'HomePlus', 'piece'),
('Storage Containers Set (10 pieces)', 'Airtight storage containers', 350.00, 450.00, 'https://via.placeholder.com/150', 45, 'plastic_items', 22, 'HomePlus', 'set');

-- Utensils
INSERT INTO products (name, description, price, mrp, image_url, stock, category, discount_percent, brand, unit) VALUES
('Pressure Cooker (5L)', 'Stainless steel cooker', 1500.00, 2000.00, 'https://via.placeholder.com/150', 10, 'utensils', 10, 'CookPro', 'piece'),
('Kettle (1.5L)', 'Electric kettle', 700.00, 900.00, 'https://via.placeholder.com/150', 15, 'utensils', 5, 'CookPro', 'piece'),
('Non-Stick Frying Pan (10 inch)', 'Durable non-stick cookware', 450.00, 600.00, 'https://via.placeholder.com/150', 30, 'utensils', 25, 'CookPro', 'piece'),
('Mixing Bowls Set (3 pieces)', 'Stainless steel mixing bowls', 280.00, 350.00, 'https://via.placeholder.com/150', 40, 'utensils', 20, 'CookPro', 'set');

-- Appliances
INSERT INTO products (name, description, price, mrp, image_url, stock, category, discount_percent, brand, unit) VALUES
('Mixer Grinder (500W)', '3-in-1 mixer grinder', 2000.00, 2500.00, 'https://via.placeholder.com/150', 8, 'appliances', 5, 'KitchenPlus', 'piece'),
('Electric Oven (35L)', 'Convection oven', 4500.00, 5500.00, 'https://via.placeholder.com/150', 5, 'appliances', 10, 'KitchenPlus', 'piece'),
('Rice Cooker (2L)', 'Automatic rice cooker', 1200.00, 1500.00, 'https://via.placeholder.com/150', 20, 'appliances', 18, 'KitchenPlus', 'piece');

-- =====================================================
-- STEP 10: INSERT COUPONS
-- =====================================================

INSERT INTO coupons (code, discount_percent, expiry_date) VALUES
('WELCOME10', 10, '2026-12-31'::timestamp),
('MEGAMALL20', 20, '2026-12-31'::timestamp),
('SAVE5', 5, '2025-12-31'::timestamp);

-- =====================================================
-- STEP 11: INSERT ADMIN USER
-- =====================================================

INSERT INTO users (name, email, phone, role) VALUES
('Admin User', 'admin@lalithamegamall.com', '9999999999', 'admin');

-- =====================================================
-- STEP 12: VERIFICATION
-- =====================================================

SELECT '✅ Schema created successfully!' as status;
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as coupon_count FROM coupons WHERE is_active = true;

-- Show all categories
SELECT category, COUNT(*) as product_count FROM products GROUP BY category ORDER BY category;











