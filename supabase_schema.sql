-- ============================================================================
-- VALENSZO HAUTE PARFUMERIE - PRODUCTION SUPABASE DATABASE SCHEMA
-- PostgreSQL 15+ / Supabase Row-Level Security (RLS) Hardened Architecture
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase Auth auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Maison Client',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  city TEXT DEFAULT 'Kuala Lumpur',
  state TEXT DEFAULT 'Wilayah Persekutuan',
  zip TEXT DEFAULT '50250',
  country TEXT DEFAULT 'Malaysia',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper function: Check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 2. PRODUCTS TABLE (345 Fragrance Creations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(10, 2),
  discount_percent INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  reviews_count INTEGER DEFAULT 0,
  badge TEXT,
  is_featured BOOLEAN DEFAULT false,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for catalog searching and filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_specs ON public.products USING GIN (specs);

-- ----------------------------------------------------------------------------
-- 3. ORDERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer JSONB NOT NULL DEFAULT '{}'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  discount_code TEXT,
  shipping NUMERIC(10, 2) DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  payment_method TEXT DEFAULT 'credit-card',
  tracking_number TEXT,
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_placed_at ON public.orders(placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders ((customer->>'email'));
CREATE INDEX IF NOT EXISTS idx_orders_customer_userid ON public.orders ((customer->>'userId'));

-- ----------------------------------------------------------------------------
-- 4. ATOMIC ORDER CREATION & STOCK DEDUCTION (Eliminates Race Conditions)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_order_with_stock_deduction(order_payload JSONB)
RETURNS JSONB AS $$
DECLARE
  v_item RECORD;
  v_order_id TEXT;
  v_current_stock INT;
BEGIN
  v_order_id := order_payload->>'id';

  -- Verify each item stock with row-level locks
  FOR v_item IN SELECT * FROM jsonb_to_recordset(order_payload->'items') AS (
    "productId" TEXT,
    id TEXT,
    quantity INT
  ) LOOP
    SELECT stock INTO v_current_stock
    FROM public.products
    WHERE id = COALESCE(v_item."productId", v_item.id)
    FOR UPDATE;

    IF v_current_stock IS NOT NULL AND v_current_stock < v_item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product id % (Available: %, Requested: %)', 
        COALESCE(v_item."productId", v_item.id), v_current_stock, v_item.quantity;
    END IF;

    -- Deduct stock atomically
    UPDATE public.products
    SET stock = GREATEST(0, stock - v_item.quantity),
        updated_at = NOW()
    WHERE id = COALESCE(v_item."productId", v_item.id);
  END LOOP;

  -- Insert Order
  INSERT INTO public.orders (
    id,
    customer,
    items,
    subtotal,
    discount,
    discount_code,
    shipping,
    total,
    status,
    payment_method,
    tracking_number,
    placed_at
  ) VALUES (
    v_order_id,
    order_payload->'customer',
    order_payload->'items',
    (order_payload->>'subtotal')::NUMERIC,
    COALESCE((order_payload->>'discount')::NUMERIC, 0.00),
    order_payload->>'discountCode',
    COALESCE((order_payload->>'shipping')::NUMERIC, 0.00),
    (order_payload->>'total')::NUMERIC,
    COALESCE(order_payload->>'status', 'Pending'),
    COALESCE(order_payload->>'paymentMethod', 'credit-card'),
    order_payload->>'trackingNumber',
    COALESCE((order_payload->>'placedAt')::TIMESTAMPTZ, NOW())
  );

  RETURN jsonb_build_object('success', true, 'orderId', v_order_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 5. HARDENED ROW-LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- --- Profiles Security ---
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Public profile creation" ON public.profiles;
CREATE POLICY "Public profile creation"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- --- Products Security ---
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" 
  ON public.products FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admin Full Products Access" ON public.products;
CREATE POLICY "Admin Full Products Access" 
  ON public.products FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- --- Orders Security ---
DROP POLICY IF EXISTS "Public Can Place Orders" ON public.orders;
CREATE POLICY "Public Can Place Orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users Read Own Orders" ON public.orders;
CREATE POLICY "Users Read Own Orders" 
  ON public.orders FOR SELECT 
  USING (
    public.is_admin() OR 
    (auth.uid() IS NOT NULL AND (customer->>'userId') = auth.uid()::text) OR
    (auth.email() IS NOT NULL AND (customer->>'email') ILIKE auth.email())
  );

DROP POLICY IF EXISTS "Admin Manage Orders" ON public.orders;
CREATE POLICY "Admin Manage Orders" 
  ON public.orders FOR UPDATE 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Delete Orders" ON public.orders;
CREATE POLICY "Admin Delete Orders" 
  ON public.orders FOR DELETE 
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. REALTIME REPLICATION (For live sync between admin and customer devices)
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'attributes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attributes;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 7. ATTRIBUTES TABLE (Categories & Concentrations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attributes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('category', 'concentration')),
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attributes_type ON public.attributes(type);
CREATE INDEX IF NOT EXISTS idx_attributes_order ON public.attributes(display_order);

ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Attributes" ON public.attributes;
CREATE POLICY "Public Read Attributes" 
  ON public.attributes FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admin All Attributes" ON public.attributes;
CREATE POLICY "Admin All Attributes" 
  ON public.attributes FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Seed Categories directly from real distinct gender values in products (3 types only)
INSERT INTO public.attributes (id, type, name, value, display_order)
SELECT 
  'cat-' || LOWER(gender),
  'category',
  gender,
  gender,
  CASE gender 
    WHEN 'Women' THEN 1 
    WHEN 'Men' THEN 2 
    WHEN 'Unisex' THEN 3 
    ELSE 4 
  END
FROM (
  SELECT DISTINCT specs->>'gender' as gender 
  FROM public.products 
  WHERE specs->>'gender' IS NOT NULL AND specs->>'gender' != ''
) g
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  value = EXCLUDED.value,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- Seed Concentrations directly from real distinct concentration values in products
INSERT INTO public.attributes (id, type, name, value, display_order)
SELECT 
  'conc-' || LOWER(REGEXP_REPLACE(SPLIT_PART(concentration, '(', 1), '\s+', '-', 'g')) || 
  CASE 
    WHEN concentration LIKE '%(35%)%' THEN '-35'
    WHEN concentration LIKE '%(30%)%' THEN '-30'
    WHEN concentration LIKE '%(25%)%' THEN '-25'
    WHEN concentration LIKE '%(20%)%' THEN '-20'
    ELSE ''
  END,
  'concentration',
  concentration,
  concentration,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as display_order
FROM (
  SELECT specs->>'concentration' as concentration 
  FROM public.products 
  WHERE specs->>'concentration' IS NOT NULL AND specs->>'concentration' != ''
) c
GROUP BY concentration
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  value = EXCLUDED.value,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

