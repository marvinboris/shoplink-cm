-- Complete RLS reset - reapply all policies from scratch
-- This re-runs the critical RLS changes

-- Vendors table policies
DROP POLICY IF EXISTS "Public vendor profiles are viewable" ON vendors;
DROP POLICY IF EXISTS "Users can insert their own vendor" ON vendors;
DROP POLICY IF EXISTS "Users can update their own vendor" ON vendors;
DROP POLICY IF EXISTS "Allow public vendor signup" ON vendors;

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

-- Products table policies
DROP POLICY IF EXISTS "Public available products are viewable" ON products;
DROP POLICY IF EXISTS "Vendors can manage their own products" ON products;

CREATE POLICY "Public can view available products"
  ON products FOR SELECT
  USING (is_available = true);

CREATE POLICY "Anyone can manage products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Orders table policies
DROP POLICY IF EXISTS "Vendors can view their own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Vendors can update their own orders" ON orders;

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
