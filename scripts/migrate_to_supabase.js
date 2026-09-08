// scripts/migrate_to_supabase.js
// Batch-seeds all 345 VALENSZO fragrances to Supabase PostgreSQL

import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS } from '../src/data/initialProducts.js';

function formatProductToDb(product) {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    tagline: product.tagline,
    description: product.description,
    price: product.price,
    original_price: product.originalPrice,
    discount_percent: product.discountPercent,
    stock: product.stock,
    rating: product.rating,
    reviews_count: product.reviewsCount,
    badge: product.badge,
    is_featured: product.isFeatured,
    features: product.features || [],
    specs: {
      catalogNo: product.catalogNo,
      brandInspiration: product.brandInspiration,
      originalListing: product.originalListing,
      gender: product.gender,
      character: product.character,
      olfactoryFamily: product.olfactoryFamily,
      traits: product.traits,
      tier: product.tier,
      refillable: product.refillable,
      intensityScore: product.intensityScore,
      concentration: product.concentration,
      pyramid: product.pyramid,
      sizes: product.sizes,
      sillage: product.sillage,
      longevity: product.longevity,
      season: product.season
    },
    images: product.images || []
  };
}

// Read from arguments or environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.argv[2];
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[3];

if (!SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_URL.startsWith('https://')) {
  console.error('\n❌ Error: Missing Supabase credentials.');
  console.log('Usage: node scripts/migrate_to_supabase.js <SUPABASE_URL> <SUPABASE_ANON_KEY>');
  console.log('Example: node scripts/migrate_to_supabase.js https://xyz.supabase.co eyJhbGci...\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runMigration() {
  console.log(`\n🚀 Starting VALENSZO migration to Supabase: ${SUPABASE_URL}`);
  console.log(`📦 Total Products to migrate: ${INITIAL_PRODUCTS.length} SKUs\n`);

  const dbPayload = INITIAL_PRODUCTS.map(formatProductToDb);

  // Batch insert in chunks of 50 for stability and speed
  const CHUNK_SIZE = 50;
  let successCount = 0;

  for (let i = 0; i < dbPayload.length; i += CHUNK_SIZE) {
    const chunk = dbPayload.slice(i, i + CHUNK_SIZE);
    const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
    const totalChunks = Math.ceil(dbPayload.length / CHUNK_SIZE);

    process.stdout.write(`⏳ Uploading Batch ${chunkNum}/${totalChunks} (${chunk.length} products)... `);

    const { error } = await supabase
      .from('products')
      .upsert(chunk, { onConflict: 'id' });

    if (error) {
      console.error('\n❌ Error uploading chunk:', error.message);
      console.log('Hint: Make sure you have executed supabase_schema.sql in your Supabase SQL Editor first!');
      process.exit(1);
    } else {
      successCount += chunk.length;
      console.log('✅ Done');
    }
  }

  console.log(`\n🎉 Migration Complete! Successfully synced ${successCount} products to Supabase.\n`);
}

runMigration().catch(err => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
