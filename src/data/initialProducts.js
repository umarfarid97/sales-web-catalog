// ==========================================================================
// LUMINA SAUVAGE - HAUTE PARFUMERIE CATALOG & SAVOIR-FAIRE DATA
// Concentrations: Elixir, Parfum, Eau de Parfum, Eau de Toilette, Privée Coffrets
// ==========================================================================

export const OLFACTORY_FAMILIES = [
  'All Creations',
  'Sauvage Spectrum',
  'Woody & Smoky',
  'Fresh & Radiant',
  'Amber & Spiced',
  'La Collection Privée',
  'Discovery & Sets'
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
    origin: 'Artisanal French Atelier',
    role: 'Base Endless Sillage',
    description: 'A precious distillation releasing ocean driftwood accords, noble cedarwood facets, and a velvety magnetic trail that endures over 16 hours.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'sauvage-elixir',
    sku: 'SVG-LX-001',
    name: 'Sauvage Elixir Intense',
    category: 'Sauvage Spectrum',
    concentration: 'Elixir Concentrate (35%)',
    olfactoryFamily: 'Amber & Spiced',
    tagline: 'An unprecedented concentration steeped in nocturnal woods and rare spices',
    description: 'Sauvage Elixir is an extraordinarily concentrated fragrance steeped in the iconic freshness of Sauvage with an intoxicating heart of spices, a custom "tailor-made" Lavender essence, and a blend of rich, liquor-like Woods that forms a powerful, lavish, and captivating trail.',
    price: 260.00,
    originalPrice: 295.00,
    discountPercent: 12,
    stock: 14,
    rating: 4.98,
    reviewsCount: 342,
    badge: 'Iconic Masterpiece',
    isFeatured: true,
    refillable: true,
    intensityScore: 5,
    sillage: 'Magnetic & Overwhelming (Room-Filling)',
    longevity: '18+ Hours (Eternal)',
    season: 'Twilight & Autumn / Winter Nights',
    pyramid: {
      topNotes: ['Spiced Cardamom', 'Nutmeg Essence', 'Cinnamon Bark', 'Calabrian Grapefruit'],
      heartNotes: ['Nyons Organic Lavender', 'Wild Coumarin', 'Smoked Frankincense'],
      baseNotes: ['Licorice Liqueur', 'Haitian Vetiver', 'Ambergris Accord', 'Indonesian Patchouli']
    },
    sizes: [
      { label: '60 ml Midnight Flacon', ml: 60, priceMultiplier: 0.85, isRefillable: true },
      { label: '100 ml Collector Flacon', ml: 100, priceMultiplier: 1.0, isRefillable: true },
      { label: '200 ml Eco-Refill Flacon', ml: 200, priceMultiplier: 1.65, isRefillable: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&auto=format&fit=crop&q=80'
    ],
    features: [
      'Ultra-concentrated 35% Elixir formulation',
      'Engraved lacquered midnight blue glass flacon',
      'Magnetic metallic couture cap',
      'Complimentary custom gold initials engraving'
    ]
  },
  {
    id: 'sauvage-parfum',
    sku: 'SVG-PF-002',
    name: 'Sauvage Parfum Extrême',
    category: 'Sauvage Spectrum',
    concentration: 'Parfum Extrême (28%)',
    olfactoryFamily: 'Amber & Spiced',
    tagline: 'Extreme freshness meets warm oriental tones and fierce nobility',
    description: 'In Sauvage Parfum, a concentrated burst of citrus freshness is supported by the sensual warmth of Sri Lankan Sandalwood and enveloped in the rich allure of sweet Tonka Bean and smoky Papua New Guinea Vanilla.',
    price: 195.00,
    originalPrice: 220.00,
    discountPercent: 11,
    stock: 22,
    rating: 4.95,
    reviewsCount: 284,
    badge: 'Bestseller',
    isFeatured: true,
    refillable: true,
    intensityScore: 4.5,
    sillage: 'Enveloping & Sophisticated',
    longevity: '14+ Hours',
    season: 'Evening & All Seasons',
    pyramid: {
      topNotes: ['Reggio di Calabria Bergamot', 'Mandarin Essence', 'Elemi Resin'],
      heartNotes: ['Sri Lankan Sandalwood', 'Virginia Cedarwood', 'Smoked Amber'],
      baseNotes: ['Papua New Guinea Vanilla', 'Roasted Tonka Bean', 'Frankincense']
    },
    sizes: [
      { label: '60 ml Flacon', ml: 60, priceMultiplier: 0.75, isRefillable: true },
      { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0, isRefillable: true },
      { label: '200 ml Mega Flacon', ml: 200, priceMultiplier: 1.7, isRefillable: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80'
    ],
    features: [
      '28% high-concentration extrait formulation',
      'Sustainably sourced Sri Lankan sandalwood',
      'Refillable couture flacon system'
    ]
  },
  {
    id: 'sauvage-edp',
    sku: 'SVG-EDP-003',
    name: 'Sauvage Eau de Parfum',
    category: 'Sauvage Spectrum',
    concentration: 'Eau de Parfum (20%)',
    olfactoryFamily: 'Woody & Smoky',
    tagline: 'The magical desert twilight hour brought to life with mysterious vanilla',
    description: 'The powerful freshness of Sauvage exudes new sensual and mysterious facets. Calabrian Bergamot, as juicy and spirited as ever, invites new spicy notes to add fullness and sensuality.',
    price: 165.00,
    originalPrice: 165.00,
    discountPercent: 0,
    stock: 35,
    rating: 4.92,
    reviewsCount: 512,
    badge: 'Signature',
    isFeatured: true,
    refillable: true,
    intensityScore: 4,
    sillage: 'Radiant & Distinctive',
    longevity: '12+ Hours',
    season: 'Versatile / Signature Everyday & Night',
    pyramid: {
      topNotes: ['Calabrian Bergamot', 'Spiced Sichuan Pepper'],
      heartNotes: ['Star Anise', 'Nutmeg', 'Lavender Essence'],
      baseNotes: ['Papua Vanilla Absolute', 'Ambroxan Crystals', 'White Musk']
    },
    sizes: [
      { label: '60 ml Flacon', ml: 60, priceMultiplier: 0.76, isRefillable: true },
      { label: '100 ml Flacon', ml: 100, priceMultiplier: 1.0, isRefillable: true },
      { label: '200 ml Eco-Refillable', ml: 200, priceMultiplier: 1.72, isRefillable: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80'
    ],
    features: [
      'Refillable at all Sauvage Refill Stations',
      'Infused with rare Papua New Guinea Vanilla Absolute',
      'Complimentary 2x deluxe travel sample vials'
    ]
  },
  {
    id: 'sauvage-edt',
    sku: 'SVG-EDT-004',
    name: 'Sauvage Eau de Toilette',
    category: 'Sauvage Spectrum',
    concentration: 'Eau de Toilette (15%)',
    olfactoryFamily: 'Fresh & Radiant',
    tagline: 'An electric, raw, and noble blast of crisp Bergamot & Ambroxan',
    description: 'A radically fresh composition, dictated by a name that has the ring of a manifesto. That was the way François Demachy, Dior Perfumer-Creator, wanted it: raw and noble all at once.',
    price: 135.00,
    originalPrice: 145.00,
    discountPercent: 7,
    stock: 40,
    rating: 4.88,
    reviewsCount: 680,
    badge: 'Popular',
    isFeatured: true,
    refillable: true,
    intensityScore: 3.5,
    sillage: 'Vibrant & Clean Projection',
    longevity: '9 - 11 Hours',
    season: 'Spring / Summer & Daytime Energy',
    pyramid: {
      topNotes: ['Reggio di Calabria Bergamot', 'Pink Pepper'],
      heartNotes: ['Sichuan Pepper', 'Lavender', 'Pink Geranium', 'Elemi Resin'],
      baseNotes: ['Ambroxan', 'Virginian Cedarwood', 'Labdanum']
    },
    sizes: [
      { label: '60 ml Flacon', ml: 60, priceMultiplier: 0.74, isRefillable: true },
      { label: '100 ml Flacon', ml: 100, priceMultiplier: 1.0, isRefillable: true },
      { label: '200 ml Flacon', ml: 200, priceMultiplier: 1.68, isRefillable: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=900&auto=format&fit=crop&q=80'
    ],
    features: [
      'Crisp Calabrian bergamot awakening',
      'Eco-friendly refillable bottle cap',
      'Iconic magnetized pleated cap'
    ]
  },
  {
    id: 'oud-ispahan-nocturne',
    sku: 'SVG-PRV-005',
    name: 'Oud Ispahan & Rose Nocturne',
    category: 'La Collection Privée',
    concentration: 'Extrait de Parfum (32%)',
    olfactoryFamily: 'Woody & Smoky',
    tagline: 'An opulent royal encounter of smoky Agarwood and velvety Damascena Rose',
    description: 'An homage to Eastern palaces where the smoky scent of burning oud woods meets the intoxicating aroma of velvety Persian rose water.',
    price: 320.00,
    originalPrice: 350.00,
    discountPercent: 9,
    stock: 9,
    rating: 4.97,
    reviewsCount: 165,
    badge: 'Haute Joaillerie',
    isFeatured: true,
    refillable: true,
    intensityScore: 5,
    sillage: 'Intense Regal Aura',
    longevity: '18+ Hours (Eternal)',
    season: 'Autumn / Winter Galas & Seductive Evenings',
    pyramid: {
      topNotes: ['Labdanum Resin', 'Golden Saffron'],
      heartNotes: ['Damascena Rose Absolute', 'Indonesian Patchouli'],
      baseNotes: ['Royal Agarwood Oud', 'Sandalwood', 'Ambergris']
    },
    sizes: [
      { label: '125 ml Privée Flacon', ml: 125, priceMultiplier: 1.0, isRefillable: true },
      { label: '250 ml Monumental Flacon', ml: 250, priceMultiplier: 1.75, isRefillable: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80'
    ],
    features: [
      'Hand-numbered 32% Extrait de Parfum',
      'Pure wild Cambodian oud distillation',
      'Includes luxury white lacquer presentation coffret'
    ]
  },
  {
    id: 'tobacco-volute-ambre',
    sku: 'SVG-PRV-006',
    name: 'Tobacco Volute & Ambre Noir',
    category: 'La Collection Privée',
    concentration: 'Extrait de Parfum (30%)',
    olfactoryFamily: 'Amber & Spiced',
    tagline: 'Warm blonde tobacco leaves swirled with aged French cognac and honeyed vanilla',
    description: 'Evoking the intimate atmosphere of a Parisian salon with leather armchairs, aged oak barrels, and warm aromatic tobacco curls.',
    price: 295.00,
    originalPrice: 295.00,
    discountPercent: 0,
    stock: 12,
    rating: 4.94,
    reviewsCount: 128,
    badge: 'Connoisseur Edition',
    isFeatured: false,
    refillable: true,
    intensityScore: 4.8,
    sillage: 'Enveloping & Warm',
    longevity: '16+ Hours',
    season: 'Cozy Fireside Nights & Winter',
    pyramid: {
      topNotes: ['Blonde Tobacco Leaves', 'Aged French Cognac', 'Ginger Root'],
      heartNotes: ['Dark Cacao Bean', 'Tonka Bean', 'Wild Honey'],
      baseNotes: ['Madagascar Bourbon Vanilla', 'Cedarwood', 'Benzoin Tears']
    },
    sizes: [
      { label: '125 ml Privée Flacon', ml: 125, priceMultiplier: 1.0, isRefillable: true },
      { label: '250 ml Monumental Flacon', ml: 250, priceMultiplier: 1.75, isRefillable: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&auto=format&fit=crop&q=80'
    ],
    features: [
      'Aged French oak barrel infused cognac notes',
      'Artisanal batch extraction',
      'Complimentary personalized calligraphy card'
    ]
  },
  {
    id: 'gris-dior-chypre',
    sku: 'SVG-PRV-007',
    name: 'Gris Dior & Chypre Éthéré',
    category: 'La Collection Privée',
    concentration: 'Eau de Parfum (22%)',
    olfactoryFamily: 'Fresh & Radiant',
    tagline: 'The iconic grey houndstooth signature translated into an elusive floral chypre',
    description: 'An elegant, unexpected harmony of crisp citrus, velvety floral jasmine, and deep damp oakmoss. Subtle, sophisticated, and unmistakably Parisian.',
    price: 280.00,
    originalPrice: 310.00,
    discountPercent: 10,
    stock: 16,
    rating: 4.96,
    reviewsCount: 210,
    badge: 'Couture Classic',
    isFeatured: false,
    refillable: true,
    intensityScore: 3.8,
    sillage: 'Elegant Whisper & Trail',
    longevity: '12 Hours',
    season: 'Spring, Autumn & Tailored Occasions',
    pyramid: {
      topNotes: ['Calabrian Bergamot', 'Grapefruit Zest'],
      heartNotes: ['Turkish Damask Rose', 'Grasse Night Jasmine'],
      baseNotes: ['Macedonian Oakmoss', 'Ambery Patchouli', 'Cedar']
    },
    sizes: [
      { label: '125 ml Privée Flacon', ml: 125, priceMultiplier: 1.0, isRefillable: true },
      { label: '250 ml Monumental Flacon', ml: 250, priceMultiplier: 1.75, isRefillable: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=900&auto=format&fit=crop&q=80'
    ],
    features: [
      'The emblematic Dior Couture olfactory signature',
      'French Grasse rose & jasmine harvest',
      'Includes silver engraved travel atomiser'
    ]
  },
  {
    id: 'le-coffret-sauvage-vault',
    sku: 'SVG-SET-008',
    name: 'Le Coffret Sauvage Discovery Vault',
    category: 'Discovery & Sets',
    concentration: 'Multi-Concentration Set',
    olfactoryFamily: 'Discovery & Sets',
    tagline: 'The complete Sauvage journey in 5 luxury 10ml travel spray atomizers',
    description: 'Experience the full olfactory spectrum from radiant freshness to extreme nocturnal intensity. Includes: Sauvage Eau de Toilette (10ml), Eau de Parfum (10ml), Parfum (10ml), Elixir (10ml), and Oud Ispahan (10ml) with an engraved leather magnetic travel case.',
    price: 210.00,
    originalPrice: 245.00,
    discountPercent: 14,
    stock: 18,
    rating: 4.99,
    reviewsCount: 430,
    badge: 'Gift Perfection',
    isFeatured: true,
    refillable: true,
    intensityScore: 5,
    sillage: 'Complete Olfactory Wardrobe',
    longevity: 'Multi-day Discovery',
    season: 'Ideal for Gifting & Jet-Set Travel',
    pyramid: {
      topNotes: ['5 Unique Fragrance Journeys', 'Includes Elixir & Parfum'],
      heartNotes: ['100% Refillable 10ml Atomizers'],
      baseNotes: ['Magnetic Black Leather Travel Case']
    },
    sizes: [
      { label: '5x 10ml Collector Coffret', ml: 50, priceMultiplier: 1.0, isRefillable: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80'
    ],
    features: [
      '5x 10ml refillable spray atomizers',
      'Includes $50 voucher toward a 100ml full flacon',
      'Wrapped in Dior Art of Gifting signature ribbon box'
    ]
  }
];

export const PROMO_CODES = [
  { code: 'SAUVAGE25', discountPercent: 25, description: '25% Off Sauvage First Purchase' },
  { code: 'DIOR10', discountPercent: 10, description: '10% Off Entire Fragrance Order' },
  { code: 'PRIVEE20', discountPercent: 20, description: '20% Off La Collection Privée' }
];

export const COMPLIMENTARY_SAMPLES = [
  { id: 'smp-1', name: 'Sauvage Elixir (2ml Deluxe Spray)', concentration: 'Elixir Concentrate' },
  { id: 'smp-2', name: 'Sauvage Parfum (2ml Deluxe Spray)', concentration: 'Parfum Extrême' },
  { id: 'smp-3', name: 'Oud Ispahan (2ml Privée Spray)', concentration: 'Extrait de Parfum' },
  { id: 'smp-4', name: 'Tobacco Volute (2ml Privée Spray)', concentration: 'Extrait de Parfum' },
  { id: 'smp-5', name: 'Gris Dior (2ml Privée Spray)', concentration: 'Eau de Parfum' }
];
