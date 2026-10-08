const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = 'https://tzrmbinkjkaewdnokqlo.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cm1iaW5ramthZXdkbm9rcWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzcxODcsImV4cCI6MjEwMzkxMzE4N30.GNwmBrKGVaLgyvmwb6uOM_qWVYraROco2hNVwnhD0Jo';
const supabase = createClient(url, key);

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

async function run() {
  console.log('Testing if `brand` column exists on `products` table in Supabase...');
  const { data: testData, error: testError } = await supabase.from('products').select('id, brand').limit(1);

  if (testError && testError.message?.includes('column products.brand does not exist')) {
    console.log('\n⚠️ `brand` column does not exist yet in Supabase.');
    console.log('Please execute the SQL in `scripts/add_brand_column_and_populate.sql` in your Supabase SQL Editor,');
    console.log('or add the `brand` (text) column in your Supabase Table Editor.');
    return;
  }

  console.log('`brand` column exists! Populating all products with accurate brand information...');

  const csvContent = fs.readFileSync(csvFile, 'utf8');
  const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
  
  const excelList = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < 5) continue;
    excelList.push({
      sku: row[0],
      collection: row[1],
      catalogNo: parseInt(row[2], 10),
      fragrance: row[3],
      brand: row[4]
    });
  }

  const { data: dbProducts, error: fetchErr } = await supabase.from('products').select('id, sku, name, category, specs');
  if (fetchErr) {
    console.error('Error fetching DB products:', fetchErr);
    return;
  }

  let updated = 0;
  let failed = 0;

  for (const db of dbProducts) {
    const catNo = db.specs?.catalogNo;
    const gender = db.category;
    let match = excelList.find(e => e.catalogNo === catNo && e.collection.toLowerCase() === gender.toLowerCase());
    if (!match && db.sku) {
      match = excelList.find(e => e.sku.toLowerCase() === db.sku.replace('VLZ-', '').replace('-', '').toLowerCase());
    }
    if (!match) {
      match = excelList.find(e => e.fragrance.toLowerCase() === db.name.toLowerCase() && e.collection.toLowerCase() === gender.toLowerCase());
    }

    const brandName = match ? match.brand : (db.specs?.brandInspiration || (db.id === 'prod-1788452077683' ? 'Szindore' : 'Valenszo'));

    const updatedSpecs = {
      ...(db.specs || {}),
      brandInspiration: brandName
    };

    const { error: updErr } = await supabase
      .from('products')
      .update({
        brand: brandName,
        specs: updatedSpecs
      })
      .eq('id', db.id);

    if (updErr) {
      console.error(`Failed to update ${db.name} (${db.id}):`, updErr.message);
      failed++;
    } else {
      updated++;
    }
  }

  console.log(`\n✅ Completed! Successfully updated ${updated} products with Brand. Failed: ${failed}.`);
}

run();
