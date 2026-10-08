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

async function checkMapping() {
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
  console.log('Total Excel rows:', excelList.length);

  const { data: dbProducts, error } = await supabase.from('products').select('id, sku, name, category, specs');
  if (error) {
    console.error(error);
    return;
  }
  console.log('Total DB products:', dbProducts.length);

  let matchedCount = 0;
  let unmatched = [];
  const brandMapping = [];

  for (const db of dbProducts) {
    const catNo = db.specs?.catalogNo;
    const gender = db.category; // Men or Women
    
    // Match 1: By catalogNo and gender
    let match = excelList.find(e => e.catalogNo === catNo && e.collection.toLowerCase() === gender.toLowerCase());
    
    // Match 2: By exact SKU (e.g. M006 vs vlz-m-6 or SKU in specs)
    if (!match && db.sku) {
      match = excelList.find(e => e.sku.toLowerCase() === db.sku.replace('VLZ-', '').replace('-', '').toLowerCase());
    }

    // Match 3: By fragrance name and gender
    if (!match) {
      match = excelList.find(e => e.fragrance.toLowerCase() === db.name.toLowerCase() && e.collection.toLowerCase() === gender.toLowerCase());
    }

    // Match 4: Loose name match
    if (!match) {
      match = excelList.find(e => (e.fragrance.toLowerCase().includes(db.name.toLowerCase()) || db.name.toLowerCase().includes(e.fragrance.toLowerCase())) && e.collection.toLowerCase() === gender.toLowerCase());
    }

    if (match) {
      matchedCount++;
      brandMapping.push({
        id: db.id,
        name: db.name,
        catalogNo: catNo,
        gender: gender,
        brand: match.brand,
        excelFragrance: match.fragrance
      });
    } else {
      unmatched.push({ id: db.id, name: db.name, catNo, gender, specsListing: db.specs?.originalListing, specsBrand: db.specs?.brandInspiration });
    }
  }

  console.log(`Matched: ${matchedCount} / ${dbProducts.length}`);
  console.log(`Unmatched: ${unmatched.length}`);
  if (unmatched.length > 0) {
    console.log('Unmatched products:', unmatched);
  }

  // Sample brands
  console.log('\nSample Brand Mappings (first 10):');
  console.table(brandMapping.slice(0, 10));
}

checkMapping();
