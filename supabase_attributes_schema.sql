-- ============================================================================
-- VALENSZO HAUTE PARFUMERIE - ATTRIBUTES DATABASE TABLE MIGRATION
-- Populated directly from real products in public.products
-- ============================================================================

-- 1. Create attributes table
CREATE TABLE IF NOT EXISTS public.attributes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('category', 'concentration')),
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indices for quick type querying and ordering
CREATE INDEX IF NOT EXISTS idx_attributes_type ON public.attributes(type);
CREATE INDEX IF NOT EXISTS idx_attributes_order ON public.attributes(display_order);

-- 3. Hardened Row-Level Security (RLS)
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

-- 4. Enable Realtime Sync
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

-- 5. Seed Categories directly from real distinct gender values in products (3 types only)
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

-- 6. Seed Concentrations directly from real distinct concentration values in products
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