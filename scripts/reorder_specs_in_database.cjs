const { createClient } = require('@supabase/supabase-js');

const url = 'https://tzrmbinkjkaewdnokqlo.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cm1iaW5ramthZXdkbm9rcWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzcxODcsImV4cCI6MjEwMzkxMzE4N30.GNwmBrKGVaLgyvmwb6uOM_qWVYraROco2hNVwnhD0Jo';
const supabase = createClient(url, key);

function reorderSpecs(specs, product) {
  if (!specs || typeof specs !== 'object') return {};

  const catalogNo = Number(specs.catalogNo) || (product && product.catalogNo) || 0;
  const tier = specs.tier || 'B';
  const originalListing = String(specs.originalListing || '').trim();
  const dominantAccord = String(specs.dominantAccord || specs.olfactoryFamily || specs.character || '').trim();
  
  const mainAccords = Array.isArray(specs.mainAccords) && specs.mainAccords.length > 0
    ? specs.mainAccords
    : (Array.isArray(specs.traits) && specs.traits.length > 0 ? specs.traits : []);
  
  const macroZone = String(specs.macroZone || 'Fresh / Clean').trim();
  const similarityGroup = String(specs.similarityGroup || '').trim();
  const layerFamily = String(specs.layerFamily || 'L1').trim();

  // Note pyramid in standard evaporation order: Top -> Heart -> Base
  const pyramid = {
    topNotes: Array.isArray(specs.pyramid?.topNotes) ? specs.pyramid.topNotes : [],
    heartNotes: Array.isArray(specs.pyramid?.heartNotes) ? specs.pyramid.heartNotes : [],
    baseNotes: Array.isArray(specs.pyramid?.baseNotes) ? specs.pyramid.baseNotes : []
  };

  const concentration = String(specs.concentration || 'Extrait de Parfum (30%)').trim();
  const longevity = String(specs.longevity || '14+ Hours').trim();
  const sillage = String(specs.sillage || 'Radiant & Enveloping').trim();
  const intensityScore = Number(specs.intensityScore) || (tier === 'S' ? 5 : 4);
  const season = String(specs.season || 'All Seasons & Signature Occasions').trim();
  const refillable = specs.refillable !== undefined ? Boolean(specs.refillable) : true;

  // Exact orderly hierarchy
  return {
    catalogNo,
    tier,
    originalListing,
    dominantAccord,
    mainAccords,
    macroZone,
    similarityGroup,
    layerFamily,
    pyramid,
    concentration,
    longevity,
    sillage,
    intensityScore,
    season,
    refillable
  };
}

async function run() {
  console.log('Fetching all products from Supabase...');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, catalogNo:sku, specs');

  if (error || !products) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  console.log(`Processing ${products.length} products...`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const prod of products) {
    const ordered = reorderSpecs(prod.specs, prod);

    const { error: updErr } = await supabase
      .from('products')
      .update({ specs: ordered })
      .eq('id', prod.id);

    if (updErr) {
      console.error(`Error updating ${prod.name} (${prod.id}):`, updErr.message);
      errorCount++;
    } else {
      updatedCount++;
    }
  }

  console.log(`\nReorder complete:`);
  console.log(`- Updated: ${updatedCount}`);
  console.log(`- Errors:  ${errorCount}`);

  // Verification sample
  console.log('\n--- Sample Verified Product ---');
  const { data: sample } = await supabase
    .from('products')
    .select('id, name, specs')
    .eq('id', 'vlz-men-14')
    .single();

  console.log(JSON.stringify(sample, null, 2));
}

run();
