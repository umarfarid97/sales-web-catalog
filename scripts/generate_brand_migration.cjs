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

let sql = '-- ============================================================================\n';
sql += '-- VALENSZO SQL MIGRATION: ADD BRAND COLUMN AND POPULATE FROM EXCEL\n';
sql += '-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)\n';
sql += '-- ============================================================================\n\n';
sql += '-- 1. Add brand column to products table\n';
sql += 'ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;\n\n';
sql += '-- 2. Populate brand for all 345 catalog perfumes from Excel\n';

for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  if (row.length < 5) continue;
  const collection = row[1]; // Men or Women
  const catalogNo = parseInt(row[2], 10);
  const brand = row[4].replace(/'/g, "''");
  
  sql += `UPDATE public.products SET brand = '${brand}' WHERE (specs->>'catalogNo')::int = ${catalogNo} AND category = '${collection}';\n`;
}

sql += `\n-- Fallback for custom item SZINDORE\nUPDATE public.products SET brand = 'Szindore' WHERE id = 'prod-1788452077683' AND (brand IS NULL OR brand = '');\n`;
sql += `\n-- 3. Create index for fast brand filtering and searching\nCREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);\n`;

fs.writeFileSync('scripts/add_brand_column_and_populate.sql', sql, 'utf8');
console.log('Successfully generated scripts/add_brand_column_and_populate.sql with length', sql.length);
