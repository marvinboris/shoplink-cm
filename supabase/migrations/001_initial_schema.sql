-- ShopLink CM - Initial Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT NOT NULL,
  business_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  shop_slug TEXT UNIQUE,
  theme_config JSONB DEFAULT '{"primaryColor": "#FF4D00", "backgroundColor": "#FFF5F0", "cardColor": "#FFFFFF"}',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  plan_expires_at TIMESTAMPTZ,
  total_sales INTEGER DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 3.00,
  whatsapp_number TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  compare_price INTEGER CHECK (compare_price >= 0),
  images TEXT[] DEFAULT '{}',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  stock_count INTEGER DEFAULT 0,
  track_stock BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  delivery_note TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  delivery_fee INTEGER DEFAULT 0 CHECK (delivery_fee >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('mtn_momo', 'orange_money', 'wave', 'cash')),
  payment_reference TEXT,
  payment_confirmed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order status history
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catalog views (analytics)
CREATE TABLE catalog_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  visitor_ip_hash TEXT,
  referrer TEXT,
  products_viewed TEXT[] DEFAULT '{}',
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'starter', 'pro')),
  amount INTEGER DEFAULT 0,
  payment_ref TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '📦',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTPs (for auth)
CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment events (for webhook idempotency)
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  provider_ref TEXT NOT NULL,
  payload JSONB,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_ref)
);

-- Indexes
CREATE INDEX idx_products_vendor_available ON products(vendor_id, is_available) WHERE is_available = true;
CREATE INDEX idx_orders_vendor_date ON orders(vendor_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_catalog_views_vendor ON catalog_views(vendor_id);
CREATE INDEX idx_otps_phone_expires ON otps(phone, expires_at DESC);

-- Row Level Security
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Vendors policies
CREATE POLICY "Public vendor profiles are viewable"
  ON vendors FOR SELECT
  USING (shop_slug IS NOT NULL);

CREATE POLICY "Users can insert their own vendor"
  ON vendors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own vendor"
  ON vendors FOR UPDATE
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Public available products are viewable"
  ON products FOR SELECT
  USING (
    is_available = true
    AND vendor_id IN (SELECT id FROM vendors WHERE shop_slug IS NOT NULL)
  );

CREATE POLICY "Vendors can manage their own products"
  ON products FOR ALL
  USING (auth.uid() = vendor_id);

-- Orders policies
CREATE POLICY "Vendors can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Vendors can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = vendor_id);

-- Categories policies
CREATE POLICY "Categories are viewable to vendor"
  ON categories FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can manage their own categories"
  ON categories FOR ALL
  USING (auth.uid() = vendor_id);

-- Catalog views policies
CREATE POLICY "Anyone can insert catalog views"
  ON catalog_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Vendors can view their catalog views"
  ON catalog_views FOR SELECT
  USING (auth.uid() = vendor_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true);

-- Trigger to update vendor total_sales when order is paid
CREATE OR REPLACE FUNCTION update_vendor_total_sales()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    UPDATE vendors
    SET total_sales = total_sales + NEW.total
    WHERE id = NEW.vendor_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_order_paid_update_vendor_sales
AFTER UPDATE OF status ON orders
FOR EACH ROW
WHEN (NEW.status = 'paid' AND OLD.status != 'paid')
EXECUTE FUNCTION update_vendor_total_sales();

-- Trigger to create order status history
CREATE OR REPLACE FUNCTION create_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status)
    VALUES (NEW.id, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION create_order_status_history();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
