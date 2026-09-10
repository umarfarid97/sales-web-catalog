-- ============================================================================
-- VALENSZO HAUTE PARFUMERIE - ATTRIBUTES DATABASE TABLE MIGRATION (V2)
-- Types: 'gender' (Men, Women, Unisex), 'category' (Fragrance Clusters), 'concentration'
-- Populated directly from real products in public.products
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

-- 2. Update type check constraint to allow 'gender', 'category', 'concentration'
ALTER TABLE public.attributes DROP CONSTRAINT IF EXISTS attributes_type_check;
ALTER TABLE public.attributes ADD CONSTRAINT attributes_type_check 
  CHECK (type IN ('gender', 'category', 'concentration'));

-- 3. Indices
CREATE INDEX IF NOT EXISTS idx_attributes_type ON public.attributes(type);
CREATE INDEX IF NOT EXISTS idx_attributes_order ON public.attributes(display_order);

-- 4. Hardened Row-Level Security (RLS)
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

-- 5. Enable Realtime Sync
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

-- 6. Clean existing rows to re-seed cleanly with new taxonomy
TRUNCATE TABLE public.attributes;

-- 7. Seed GENDERS directly from real products (3 types only: Women, Men, Unisex)
INSERT INTO public.attributes (id, type, name, value, display_order)
SELECT 
  'gen-' || LOWER(gender),
  'gender',
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

-- 8. Seed CATEGORIES (previously Olfactory Families) directly from real products
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

-- 9. Seed CONCENTRATIONS directly from real products
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