-- ============================================================================
-- VALENSZO - REORDER SPECS FIELD IN PRODUCTS TABLE
-- Preserves clean, logical key hierarchy for human readability in Supabase
-- ============================================================================

-- 1. Drop existing GIN index on specs (if any)
DROP INDEX IF EXISTS public.idx_products_specs;

-- 2. Convert specs column to JSON (preserves exact textual key insertion order)
ALTER TABLE public.products 
ALTER COLUMN specs TYPE JSON 
USING specs::json;

-- 3. Reorder specs fields logically across all products
UPDATE public.products
SET specs = json_build_object(
  'catalogNo', COALESCE((specs->>'catalogNo')::int, 0),
  'tier', COALESCE(specs->>'tier', 'B'),
  'originalListing', COALESCE(specs->>'originalListing', ''),
  'dominantAccord', COALESCE(specs->>'dominantAccord', specs->>'olfactoryFamily', specs->>'character', ''),
  'mainAccords', COALESCE(specs->'mainAccords', specs->'traits', '[]'::json),
  'macroZone', COALESCE(specs->>'macroZone', 'Fresh / Clean'),
  'similarityGroup', COALESCE(specs->>'similarityGroup', ''),
  'layerFamily', COALESCE(specs->>'layerFamily', 'L1'),
  'pyramid', json_build_object(
    'topNotes', COALESCE(specs->'pyramid'->'topNotes', '[]'::json),
    'heartNotes', COALESCE(specs->'pyramid'->'heartNotes', '[]'::json),
    'baseNotes', COALESCE(specs->'pyramid'->'baseNotes', '[]'::json)
  ),
  'concentration', COALESCE(specs->>'concentration', 'Extrait de Parfum (30%)'),
  'longevity', COALESCE(specs->>'longevity', '14+ Hours'),
  'sillage', COALESCE(specs->>'sillage', 'Radiant & Enveloping'),
  'intensityScore', COALESCE((specs->>'intensityScore')::int, 4),
  'season', COALESCE(specs->>'season', 'All Seasons & Signature Occasions'),
  'refillable', COALESCE((specs->>'refillable')::boolean, true)
);

-- 4. Re-create GIN index using jsonb cast for high performance queries
CREATE INDEX IF NOT EXISTS idx_products_specs ON public.products USING GIN ((specs::jsonb));
