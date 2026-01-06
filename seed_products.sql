-- Insert Products for Lalitha Mega Mall

-- Clear existing products (optional - comment out if you want to keep existing data)
-- DELETE FROM products;

-- Snacks
INSERT INTO products (name, description, price, image_url, stock, category, discount) VALUES
('Mixed Dry Fruits (500g)', 'Premium dry fruits mix', 450.00, '/placeholder.svg?height=300&width=300', 50, 'snacks', 25),
('Roasted Chickpeas (200g)', 'Healthy roasted snack', 120.00, '/placeholder.svg?height=300&width=300', 75, 'snacks', 20),
('Organic Granola (400g)', 'Healthy breakfast granola', 280.00, '/placeholder.svg?height=300&width=300', 60, 'snacks', 20),
('Cashew Nuts (250g)', 'Premium cashew nuts', 380.00, '/placeholder.svg?height=300&width=300', 40, 'snacks', 24);

-- Chocolates
INSERT INTO products (name, description, price, image_url, stock, category, discount) VALUES
('Dark Chocolate Bar (100g)', 'Premium dark chocolate', 150.00, '/placeholder.svg?height=300&width=300', 100, 'chocolates', 15),
('Milk Chocolate Truffles (200g)', 'Delicious milk chocolate truffles', 250.00, '/placeholder.svg?height=300&width=300', 80, 'chocolates', 20),
('Assorted Chocolates Box (300g)', 'Premium chocolate assortment', 450.00, '/placeholder.svg?height=300&width=300', 50, 'chocolates', 18),
('White Chocolate Bar (100g)', 'Creamy white chocolate', 140.00, '/placeholder.svg?height=300&width=300', 90, 'chocolates', 12);

-- Utensils
INSERT INTO products (name, description, price, image_url, stock, category, discount) VALUES
('Non-Stick Frying Pan (10 inch)', 'Durable non-stick cookware', 450.00, '/non-stick-frying-pan.jpg', 30, 'utensils', 25),
('Stainless Steel Pressure Cooker (5L)', 'Heavy-duty pressure cooker', 1200.00, '/pressure-cooker-stainless-steel.jpg', 25, 'utensils', 20),
('Mixing Bowls Set (3 pieces)', 'Stainless steel mixing bowls', 280.00, '/mixing-bowls-stainless-steel-set.jpg', 40, 'utensils', 20),
('Kitchen Knife Set (6 pieces)', 'Professional kitchen knives', 650.00, '/kitchen-knife-set-professional.jpg', 20, 'utensils', 24);

-- Cosmetics
INSERT INTO products (name, description, price, image_url, stock, category, discount) VALUES
('Face Cream (50g)', 'Moisturizing face cream', 250.00, '/placeholder.svg?height=300&width=300', 45, 'cosmetics', 15),
('Shampoo (200ml)', 'Nourishing hair shampoo', 180.00, '/placeholder.svg?height=300&width=300', 60, 'cosmetics', 20),
('Body Lotion (250ml)', 'Silky smooth body lotion', 200.00, '/placeholder.svg?height=300&width=300', 55, 'cosmetics', 18),
('Lip Balm (10g)', 'Hydrating lip balm', 50.00, '/placeholder.svg?height=300&width=300', 100, 'cosmetics', 12);

-- Dry Fruits
INSERT INTO products (name, description, price, image_url, stock, category, discount) VALUES
('Almonds (500g)', 'Premium California almonds', 650.00, '/placeholder.svg?height=300&width=300', 35, 'dry_fruits', 22),
('Pistachios (500g)', 'Premium Iranian pistachios', 550.00, '/placeholder.svg?height=300&width=300', 40, 'dry_fruits', 18),
('Raisins (500g)', 'Juicy golden raisins', 180.00, '/placeholder.svg?height=300&width=300', 70, 'dry_fruits', 15),
('Dates (500g)', 'Sweet Medjool dates', 300.00, '/placeholder.svg?height=300&width=300', 50, 'dry_fruits', 20);

-- Plastic Items
INSERT INTO products (name, description, price, image_url, stock, category, discount) VALUES
('Storage Containers Set (10 pieces)', 'Airtight storage containers', 350.00, '/products/storage-containers.jpg', 45, 'plastic_items', 22),
('Water Bottle (1L)', 'BPA-free water bottle', 120.00, '/placeholder.svg?height=300&width=300', 60, 'plastic_items', 18),
('Lunch Box Set (3 pieces)', 'Durable lunch containers', 280.00, '/placeholder.svg?height=300&width=300', 40, 'plastic_items', 20),
('Trash Bin with Lid (20L)', 'Durable waste bin', 180.00, '/trash-bin-with-lid.jpg', 35, 'plastic_items', 18);

-- Appliances
INSERT INTO products (name, description, price, image_url, stock, category, discount) VALUES
('Electric Kettle (1.5L)', 'Fast boiling electric kettle', 850.00, '/placeholder.svg?height=300&width=300', 25, 'appliances', 20),
('Rice Cooker (2L)', 'Automatic rice cooker', 1200.00, '/placeholder.svg?height=300&width=300', 20, 'appliances', 18),
('Mixer Grinder (500W)', 'Powerful mixer grinder', 2500.00, '/placeholder.svg?height=300&width=300', 15, 'appliances', 15),
('Toaster (2 Slice)', 'Compact 2-slice toaster', 650.00, '/placeholder.svg?height=300&width=300', 30, 'appliances', 22);













