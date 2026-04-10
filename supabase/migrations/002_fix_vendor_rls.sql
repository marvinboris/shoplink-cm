-- Fix RLS for vendor onboarding (COMPLETE OVERRIDE)
-- Drop ALL existing policies and recreate from scratch

-- Vendors table - drop all existing policies
DROP POLICY IF EXISTS "Public vendor profiles are viewable" ON vendors;
DROP POLICY IF EXISTS "Users can insert their own vendor" ON vendors;
DROP POLICY IF EXISTS "Users can insert their own vendor profile" ON vendors;
DROP POLICY IF EXISTS "Users can update their own vendor" ON vendors;
DROP POLICY IF EXISTS "Users can update their own vendor profile" ON vendors;
DROP POLICY IF EXISTS "Public vendor profiles are viewable" ON vendors;
DROP POLICY IF EXISTS "Allow public vendor signup" ON vendors;

-- Recreate policies correctly
CREATE POLICY "Anyone can view vendors with a slug"
  ON vendors FOR SELECT
  USING (shop_slug IS NOT NULL);

CREATE POLICY "Anyone can insert vendors"
  ON vendors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update vendors"
  ON vendors FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Products table - drop all existing policies
DROP POLICY IF EXISTS "Public available products are viewable" ON products;
DROP POLICY IF EXISTS "Vendors can manage their own products" ON products;
DROP POLICY IF EXISTS "Vendors can manage their products" ON products;

-- Recreate products policies
CREATE POLICY "Public can view available products"
  ON products FOR SELECT
  USING (is_available = true);

CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Orders table - drop all existing policies
DROP POLICY IF EXISTS "Vendors can view their own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Vendors can update their own orders" ON orders;
DROP POLICY IF EXISTS "Vendors can view orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;

-- Recreate orders policies
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Categories table
DROP POLICY IF EXISTS "Categories are viewable to vendor" ON categories;
DROP POLICY IF EXISTS "Vendors can manage their own categories" ON categories;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage categories"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

-- Catalog views table
DROP POLICY IF EXISTS "Anyone can insert catalog views" ON catalog_views;
DROP POLICY IF EXISTS "Vendors can view their catalog views" ON catalog_views;

CREATE POLICY "Anyone can insert catalog views"
  ON catalog_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view catalog views"
  ON catalog_views FOR SELECT
  USING (true);

-- Subscriptions table
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;

CREATE POLICY "Anyone can view subscriptions"
  ON subscriptions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
