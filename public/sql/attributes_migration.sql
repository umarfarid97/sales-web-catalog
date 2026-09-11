-- ============================================================================
-- VALENSZO HAUTE PARFUMERIE - ATTRIBUTES SCHEMA & DATA MIGRATION (V2)
-- Types: 'gender' (3 types: Women, Men, Unisex), 'category' (Fragrance Families), 'concentration'
-- Hardened Row-Level Security (RLS) & Realtime Sync
-- ============================================================================

-- 1. Create or update attributes table
CREATE TABLE IF NOT EXISTS public.attributes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Allow strictly 'gender', 'category', 'concentration'
ALTER TABLE public.attributes DROP CONSTRAINT IF EXISTS attributes_type_check;
ALTER TABLE public.attributes ADD CONSTRAINT attributes_type_check 
  CHECK (type IN ('gender', 'category', 'concentration'));

-- 3. High-performance Indexing
CREATE INDEX IF NOT EXISTS idx_attributes_type ON public.attributes(type);
CREATE INDEX IF NOT EXISTS idx_attributes_order ON public.attributes(display_order);

-- 4. Hardened Row-Level Security (RLS)
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;

-- Allow public read so customers can view catalog categories
DROP POLICY IF EXISTS "Public Read Attributes" ON public.attributes;
CREATE POLICY "Public Read Attributes" 
  ON public.attributes FOR SELECT 
  USING (true);

-- Restrict mutation (INSERT, UPDATE, DELETE) strictly to authenticated administrators
DROP POLICY IF EXISTS "Admin All Attributes" ON public.attributes;
CREATE POLICY "Admin All Attributes" 
  ON public.attributes FOR ALL 
  TO authenticated
  USING (
    public.is_admin() 
    OR (auth.jwt() ->> 'email') IN ('umarfarid90@gmail.com', 'admin@valenszo.my', 'atelier@valenszo.my')
  ) 
  WITH CHECK (
    public.is_admin() 
    OR (auth.jwt() ->> 'email') IN ('umarfarid90@gmail.com', 'admin@valenszo.my', 'atelier@valenszo.my')
  );

-- 5. Realtime Sync Subscription
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'attributes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attributes;
  END IF;
END $$;

-- 6. Clean table to re-seed cleanly
TRUNCATE TABLE public.attributes;

-- 7. Seed GENDERS (Strictly 3 types only: Women, Men, Unisex)
INSERT INTO public.attributes (id, type, name, value, display_order)
VALUES
  ('gen-women', 'gender', 'Women', 'Women', 1),
  ('gen-men', 'gender', 'Men', 'Men', 2),
  ('gen-unisex', 'gender', 'Unisex', 'Unisex', 3)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  value = EXCLUDED.value, 
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- 8. Seed CATEGORIES (Fragrance Families from real public.products)
INSERT INTO public.attributes (id, type, name, value, display_order)
SELECT 
  'cat-' || TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(family, '[^a-zA-Z0-9]+', '-', 'g'))),
  'category',
  family,
  family,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as display_order
FROM (
  SELECT COALESCE(specs->>'olfactoryFamily', specs->>'character') as family
  FROM public.products
  WHERE COALESCE(specs->>'olfactoryFamily', specs->>'character') IS NOT NULL
    AND COALESCE(specs->>'olfactoryFamily', specs->>'character') NOT IN ('', 'Pour Femme', 'Pour Homme')
) f
GROUP BY family
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  value = EXCLUDED.value, 
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- 9. Seed CONCENTRATIONS directly from real public.products
INSERT INTO public.attributes (id, type, name, value, display_order)
SELECT 
  'conc-' || TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(concentration, '[^a-zA-Z0-9]+', '-', 'g'))),
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
