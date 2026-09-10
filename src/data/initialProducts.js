// ==========================================================================
// VALENSZO HAUTE PARFUMERIE - TAXONOMY & CLUSTER DEFINITIONS
// Database-first architecture: Full 345 catalog is queried live from Supabase
// ==========================================================================

export const MEN_CLUSTERS = [
  "All Men's Perfumes",
  "★ Best Sellers",
  "Fresh / Aquatic / Citrus",
  "Blue / Aromatic / Fresh-Woody",
  "Sweet / Amber / Gourmand",
  "Spicy / Warm / Tobacco",
  "Oud / Oriental / Resinous",
  "Leather / Smoky / Dark",
  "Woody / Vetiver / Green",
  "Clean / Musk / Powdery",
  "Floral / Fruity / Niche-Unisex",
  "Classic / Fougere / Heritage"
];

export const WOMEN_CLUSTERS = [
  "All Women's Perfumes",
  "★ Best Sellers",
  "Fruity-Floral / Mass Appeal",
  "Sweet / Gourmand / Vanilla",
  "Fruity / Juicy / Tropical",
  "Floral / Bouquet",
  "Fresh / Aquatic / Citrus / Green",
  "Dark / Seductive / Night",
  "Rose / Peony / Romantic Floral",
  "Niche / Woody / Unisex",
  "Clean / Musk / Powdery",
  "Amber / Warm / Oriental"
];

export const OLFACTORY_FAMILIES = [
  'All Perfumes',
  'Best Sellers',
  'Men',
  'Women',
  'Niche & Unisex',
  'Blue / Aromatic / Fresh-Woody',
  'Sweet / Amber / Gourmand',
  'Fruity-Floral / Mass Appeal',
  'Fresh / Aquatic / Citrus',
  'Rose / Peony / Romantic Floral',
  'Floral / Bouquet',
  'Dark / Seductive / Night',
  'Spicy / Warm / Tobacco',
  'Oud / Oriental / Resinous',
  'Woody / Vetiver / Green',
  'Clean / Musk / Powdery',
  'Fruity / Juicy / Tropical',
  'Classic / Fougere / Heritage',
  'Leather / Smoky / Dark'
];

export const SAUVAGE_SPECTRUM_LEVELS = [
  {
    id: 'edt',
    name: 'Sauvage Eau de Toilette',
    tagline: 'Radiant, Crisp & Vibrant',
    intensity: 'Fresh & Unmistakable',
    intensityScore: 3,
    concentration: 'Eau de Toilette (15%)',
    price: 135,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80',
    description: 'A radically fresh composition, dictated by a name that has the ring of a manifesto. Radiant top notes burst with the juicy freshness of Reggio di Calabria Bergamot.'
  },
  {
    id: 'edp',
    name: 'Sauvage Eau de Parfum',
    tagline: 'Sensual, Mysterious & Enveloping',
    intensity: 'Smooth & Powerful',
    intensityScore: 4,
    concentration: 'Eau de Parfum (20%)',
    price: 165,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&auto=format&fit=crop&q=80',
    description: 'Inspired by the desert at twilight, the magical hour when nocturnal nature awakes and the sky is set ablaze. Enriched with a smoky Papua New Guinea vanilla absolute.'
  },
  {
    id: 'parfum',
    name: 'Sauvage Parfum',
    tagline: 'Rich, Deep & Magnetic',
    intensity: 'Profound & Noble',
    intensityScore: 4.5,
    concentration: 'Parfum Extrême (28%)',
    price: 195,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=900&auto=format&fit=crop&q=80',
    description: 'A new, highly concentrated interpretation of Sauvage, melding extreme freshness with warm, oriental tones and fierce beauty that springs to life on the skin.'
  },
  {
    id: 'elixir',
    name: 'Sauvage Elixir Intense',
    tagline: 'Ultra-Concentrated, Nocturnal & Spiced',
    intensity: 'Unprecedented Overdose',
    intensityScore: 5,
    concentration: 'Elixir Concentrate (35%)',
    price: 260,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80',
    description: 'An extraordinarily concentrated fragrance steeped in the iconic freshness of Sauvage with an intoxicating heart of spices, a custom Lavender essence, and a rich liquor-like woods base.'
  }
];

export const SAVOIR_FAIRE_RAW_MATERIALS = [
  {
    id: 'mat-1',
    name: 'Reggio di Calabria Bergamot',
    origin: 'Calabria, Southern Italy',
    role: 'Top Note Awakening',
    description: 'Sourced exclusively from sustainable harvests in Reggio Calabria. Sun-drenched, sparkling, and juicy with a peppery facet that electrifies the senses.',
    image: 'https://images.unsplash.com/photo-1597714026733-4700d1c9fa9c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mat-2',
    name: 'Sichuan & Pink Peppercorns',
    origin: 'Guizhou Highlands',
    role: 'Heart Vibrant Spice',
    description: 'Hand-selected berries that release an invigorating, warm vibration with lemony undertones and crisp tingling vibrancy.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mat-3',
    name: 'Papua Vanilla Absolute',
    origin: 'Papua New Guinea',
    role: 'Base Sensual Enclosure',
    description: 'Harvested green and scalded using an innovative extraction technique. Imparts irresistible smoky, tobacco, and balsamic gourmand depth.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mat-4',
    name: 'Royal Amberwood & Ambroxan',
    origin: 'France & Grasse Oils',
    role: 'Base Endless Sillage',
    description: 'A precious distillation releasing ocean driftwood accords, noble cedarwood facets, and a velvety magnetic trail that endures over 16 hours.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80'
  }
];

export const PROMO_CODES = [
  { code: 'VALENSZO25', discountPercent: 25, description: '25% Off Valenszo First Purchase' },
  { code: 'VALENSZO10', discountPercent: 10, description: '10% Off Entire Fragrance Order' },
  { code: 'SAUVAGE25', discountPercent: 25, description: '25% Off Valenszo First Purchase' },
  { code: 'DIOR10', discountPercent: 10, description: '10% Off Entire Fragrance Order' },
  { code: 'PRIVEE20', discountPercent: 20, description: '20% Off Private Collection' }
];

export const COMPLIMENTARY_SAMPLES = [
  { id: 'smp-1', name: 'Sauvage No. 63 (2ml Deluxe Spray)', concentration: 'Extrait de Parfum' },
  { id: 'smp-2', name: 'Bleu de Chanel No. 49 (2ml Deluxe Spray)', concentration: 'Extrait de Parfum' },
  { id: 'smp-3', name: 'Delina No. 172 (2ml Privée Spray)', concentration: 'Extrait de Parfum' },
  { id: 'smp-4', name: 'Baccarat Rouge No. 68 (2ml Deluxe Spray)', concentration: 'Extrait de Parfum' },
  { id: 'smp-5', name: 'Angels Share No. 227 (2ml Privée Spray)', concentration: 'Extrait de Parfum' }
];

// In production, the catalog is fetched dynamically from Supabase PostgreSQL public.products.
export const INITIAL_PRODUCTS = [];
