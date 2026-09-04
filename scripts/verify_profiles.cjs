const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tzrmbinkjkaewdnokqlo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cm1iaW5ramthZXdkbm9rcWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzcxODcsImV4cCI6MjEwMzkxMzE4N30.GNwmBrKGVaLgyvmwb6uOM_qWVYraROco2hNVwnhD0Jo'
);

async function testProfiles() {
  console.log('--- Testing Supabase public.profiles Integration ---');

  const demoProfiles = [
    {
      id: 'usr_valenszo_admin_001',
      email: 'admin@valenszo.my',
      name: "Directeur de l'Atelier",
      phone: '+60 12-888 2026',
      address: 'Maison Valenszo Boutique, Pavilion Kuala Lumpur',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan',
      zip: '55100',
      country: 'Malaysia',
      role: 'admin'
    },
    {
      id: 'usr_valenszo_cust_001',
      email: 'adrien.laurent@valenszo.my',
      name: 'Adrien Laurent',
      phone: '+60 12-345 6789',
      address: '18 Jalan Sultan Ismail, Penthouse Suite 22A',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan',
      zip: '50250',
      country: 'Malaysia',
      role: 'customer'
    }
  ];

  const { data: upsertData, error: upsertErr } = await supabase
    .from('profiles')
    .upsert(demoProfiles, { onConflict: 'id' })
    .select();

  if (upsertErr) {
    console.error('❌ Error seeding profiles:', upsertErr.message);
    process.exit(1);
  }
  console.log('✅ Seeded demo profiles successfully:', upsertData.length);

  const { data: fetchProfiles, error: fetchErr } = await supabase
    .from('profiles')
    .select('*');

  if (fetchErr) {
    console.error('❌ Error fetching profiles:', fetchErr.message);
    process.exit(1);
  }

  console.log('✅ Current profiles in Supabase table:');
  console.table(
    fetchProfiles.map((p) => ({
      id: p.id,
      email: p.email,
      name: p.name,
      role: p.role,
      city: p.city
    }))
  );
}

testProfiles().catch(console.error);
