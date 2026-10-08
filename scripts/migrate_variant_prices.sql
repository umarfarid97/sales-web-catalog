-- ============================================================================
-- VALENSZO SQL MIGRATION: VARIANT PRICES
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ============================================================================

-- 1. Remove the legacy single price and original_price columns
ALTER TABLE public.products 
  DROP COLUMN IF EXISTS price,
  DROP COLUMN IF EXISTS original_price;

-- 2. Add individual variant price columns for 30ml, 50ml, and 100ml
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS price_30ml NUMERIC(10, 2) NOT NULL DEFAULT 45.00,
  ADD COLUMN IF NOT EXISTS price_50ml NUMERIC(10, 2) NOT NULL DEFAULT 65.00,
  ADD COLUMN IF NOT EXISTS price_100ml NUMERIC(10, 2) NOT NULL DEFAULT 125.00;

-- 3. Populate all existing 345 perfume records with standard variant prices
UPDATE public.products 
SET 
  price_30ml = 45.00,
  price_50ml = 65.00,
  price_100ml = 125.00;

-- 4. Create an index on the base variant price for performance
CREATE INDEX IF NOT EXISTS idx_products_price_30ml ON public.products(price_30ml);
