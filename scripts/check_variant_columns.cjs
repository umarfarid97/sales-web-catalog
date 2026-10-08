const { createClient } = require('@supabase/supabase-js');

const url = 'https://tzrmbinkjkaewdnokqlo.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cm1iaW5ramthZXdkbm9rcWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzcxODcsImV4cCI6MjEwMzkxMzE4N30.GNwmBrKGVaLgyvmwb6uOM_qWVYraROco2hNVwnhD0Jo';
const supabase = createClient(url, key);

async function check() {
  console.log('Checking Supabase products table schema...');
  const { data, error } = await supabase.from('products').select('*').limit(3);
  if (error) {
    console.error('Error selecting from products:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No products found.');
    return;
  }

  const sample = data[0];
  const keys = Object.keys(sample);
  console.log('Available columns in products table:');
  console.log(keys);

  const hasLegacyPrice = keys.includes('price');
  const hasLegacyOriginalPrice = keys.includes('original_price');
  const hasPrice30ml = keys.includes('price_30ml');
  const hasPrice50ml = keys.includes('price_50ml');
  const hasPrice100ml = keys.includes('price_100ml');

  console.log('\n--- Migration Status ---');
  console.log('Legacy `price` column exists:', hasLegacyPrice);
  console.log('Legacy `original_price` column exists:', hasLegacyOriginalPrice);
  console.log('New `price_30ml` column exists:', hasPrice30ml);
  console.log('New `price_50ml` column exists:', hasPrice50ml);
  console.log('New `price_100ml` column exists:', hasPrice100ml);

  if (hasPrice30ml && hasPrice50ml && hasPrice100ml) {
    console.log('\nSample product prices:');
    data.forEach(p => {
      console.log(`- ${p.name}: 30ml = RM${p.price_30ml}, 50ml = RM${p.price_50ml}, 100ml = RM${p.price_100ml}`);
    });
  }
}

check();
