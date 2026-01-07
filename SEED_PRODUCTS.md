# Seeding Products into Database

## Problem
The database is empty, which is why products are not loading on the frontend.

## Solution
Run the SQL script to populate products in your Supabase database.

## Steps

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `bniqkmttkhzmfgyqkkoa`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the contents of `seed_products.sql`
6. Click "Run" or press `Ctrl+Enter`

### Option 2: Using Supabase CLI

```bash
supabase db execute -f seed_products.sql
```

## Verify Products

After running the script, verify products were added:

1. In Supabase Dashboard, go to "Table Editor"
2. Select the `products` table
3. You should see products listed

Or test via API:
```bash
curl http://localhost:5000/api/products/snacks
```

## Troubleshooting

If you get an error about the `products` table not existing, run this SQL first:

```sql
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
```













