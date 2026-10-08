const fs = require('fs');

const csvFile = 'C:/Users/user/.gemini/antigravity/brain/ab96a058-e803-48c4-96e3-ac099df7d039/scratch/excel_perfumes.csv';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const csvContent = fs.readFileSync(csvFile, 'utf8');
const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);

let sql = `-- ============================================================================
-- VALENSZO COMPLETE DATABASE MIGRATION (1-CLICK RUN IN SUPABASE SQL EDITOR)
-- 1. Drops legacy single price & original_price columns
-- 2. Adds variant price columns (price_30ml, price_50ml, price_100ml)
-- 3. Adds brand column (TEXT)
-- 4. Populates all 345 perfume records with prices and exact brands from Excel
-- ============================================================================

-- Step 1: Remove legacy single price and original_price columns
ALTER TABLE public.products 
  DROP COLUMN IF EXISTS price,
  DROP COLUMN IF EXISTS original_price;

-- Step 2: Add variant price columns and brand column
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS price_30ml NUMERIC(10, 2) NOT NULL DEFAULT 45.00,
  ADD COLUMN IF NOT EXISTS price_50ml NUMERIC(10, 2) NOT NULL DEFAULT 65.00,
  ADD COLUMN IF NOT EXISTS price_100ml NUMERIC(10, 2) NOT NULL DEFAULT 125.00,
  ADD COLUMN IF NOT EXISTS brand TEXT;

-- Step 3: Populate variant prices for all products
UPDATE public.products 
SET 
  price_30ml = 45.00,
  price_50ml = 65.00,
  price_100ml = 125.00;

-- Step 4: Populate exact Brand from Excel for each perfume
`;

for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  if (row.length < 5) continue;
  const collection = row[1]; // Men or Women
  const catalogNo = parseInt(row[2], 10);
  const brand = row[4].replace(/'/g, "''");
  
  sql += `UPDATE public.products SET brand = '${brand}' WHERE (specs->>'catalogNo')::int = ${catalogNo} AND category = '${collection}';\n`;
}

sql += `\n-- Fallback for custom item SZINDORE\nUPDATE public.products SET brand = 'Szindore' WHERE id = 'prod-1788452077683' AND (brand IS NULL OR brand = '');\n`;

sql += `\n-- Step 5: Create indexes for ultra-fast query performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price_30ml ON public.products(price_30ml);
`;

fs.writeFileSync('scripts/master_database_migration.sql', sql, 'utf8');
console.log('Successfully generated scripts/master_database_migration.sql');
