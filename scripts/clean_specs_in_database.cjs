const { createClient } = require('@supabase/supabase-js');

const url = 'https://tzrmbinkjkaewdnokqlo.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cm1iaW5ramthZXdkbm9rcWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzcxODcsImV4cCI6MjEwMzkxMzE4N30.GNwmBrKGVaLgyvmwb6uOM_qWVYraROco2hNVwnhD0Jo';
const supabase = createClient(url, key);

// Redundant keys to remove from specs JSONB
const REDUNDANT_KEYS = [
  'brandInspiration', // Duplicated by top-level `brand` column
  'gender',           // Duplicated by top-level `category` column
  'sizes',            // Duplicated by top-level `price_30ml`, `price_50ml`, `price_100ml`
  'dominantAccord',   // Duplicated by `olfactoryFamily`
  'traits',           // Duplicated by `mainAccords`
  'character'         // Duplicated by `olfactoryFamily`
];

async function runCleanup() {
  console.log('Fetching all products from Supabase...');
  const { data: products, error } = await supabase.from('products').select('id, name, specs');
  if (error || !products) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  console.log(`Auditing ${products.length} products...`);

  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const product of products) {
    if (!product.specs || typeof product.specs !== 'object') {
      skippedCount++;
      continue;
    }

    let hasRedundant = false;
    const cleanedSpecs = { ...product.specs };

    for (const key of REDUNDANT_KEYS) {
      if (key in cleanedSpecs) {
        delete cleanedSpecs[key];
        hasRedundant = true;
      }
    }

    if (hasRedundant) {
      const { error: updErr } = await supabase
        .from('products')
        .update({ specs: cleanedSpecs })
        .eq('id', product.id);

      if (updErr) {
        console.error(`Failed to update ${product.name} (${product.id}):`, updErr.message);
        failedCount++;
      } else {
        updatedCount++;
      }
    } else {
      skippedCount++;
    }
  }

  console.log(`\nCleanup finished:`);
  console.log(`- Updated: ${updatedCount}`);
  console.log(`- Skipped: ${skippedCount}`);
  console.log(`- Failed:  ${failedCount}`);

  // Verification
  console.log('\n--- Verifying specs across catalog ---');
  const { data: verifyProds } = await supabase.from('products').select('id, name, specs').limit(5);
  verifyProds.forEach(p => {
    console.log(`- ${p.name} specs keys:`, Object.keys(p.specs || {}));
  });
}

runCleanup();
