-- ============================================================================
-- VALENSZO SQL SCRIPT: CLEAN REDUNDANT KEYS FROM SPECS JSONB
-- Run in Supabase SQL Editor if you ever need to clean specs directly via SQL
-- ============================================================================

UPDATE public.products
SET specs = (
  specs 
    - 'brandInspiration' -- Redundant with top-level `brand` column
    - 'gender'           -- Redundant with top-level `category` column
    - 'sizes'            -- Redundant with top-level `price_30ml`, `price_50ml`, `price_100ml`
    - 'olfactoryFamily'  -- Renamed to `dominantAccord`
    - 'traits'           -- Duplicate of `mainAccords`
    - 'character'        -- Duplicate of `dominantAccord`
) || jsonb_build_object('dominantAccord', COALESCE(specs->>'dominantAccord', specs->>'olfactoryFamily', specs->>'character'));
