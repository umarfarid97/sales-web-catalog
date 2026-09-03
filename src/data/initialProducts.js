export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    sku: 'LUM-OUD-001',
    name: 'Oud Royal Extrait',
    category: 'Woody & Smoky',
    tagline: 'Imperial Wild Agarwood, Spiced Persian Saffron & Velvet Damask Rose',
    description: 'An opulent masterpiece of olfactory alchemy. Oud Royal Extrait marries 25-year aged wild Cambodian agarwood with glowing crimson saffron, honeyed Taif rose, and crystalline ambergris for an indelible royal sillage that commands presence.',
    price: 320.00,
    originalPrice: 380.00,
    discountPercent: 15,
    stock: 14,
    rating: 4.96,
    reviewsCount: 184,
    badge: 'Iconic Signature',
    isFeatured: true,
    concentration: 'Extrait de Parfum (32% Concentration)',
    olfactoryFamily: 'Woody & Smoky',
    sillage: 'Intense & Enveloping',
    longevity: '16+ Hours (Eternal)',
    season: 'Autumn / Winter / Black Tie Evening',
    pyramid: {
      topNotes: ['Persian Saffron', 'Calabrian Bergamot', 'Pink Peppercorn'],
      heartNotes: ['Taif Damascena Rose', 'Midnight Jasmine', 'Smoked Incense'],
      baseNotes: ['25-Yr Royal Agarwood Oud', 'Baltic Ambergris', 'Bourbon Vanilla', 'Atlas Cedar']
    },
    sizes: [
      { label: '50 ml Classic Flacon', ml: 50, priceMultiplier: 0.72 },
      { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0 },
      { label: '10 ml Travel Atomizer', ml: 10, priceMultiplier: 0.28 }
    ],
    colors: [
      { name: 'Royal Gold Cap', hex: '#d4af37' },
      { name: 'Smoked Obsidian Cap', hex: '#18181b' },
      { name: 'Rose Gold Cap', hex: '#e2a8b2' }
    ],
    features: [
      '32% Pure Artisanal Fragrance Oil Concentration (Extrait Grade)',
      'Handcrafted in Grasse, France using centuries-old enfleurage techniques',
      'Heavyweight Smoked Crystal Flacon with 24k Gold Magnetic Closure',
      'Complimentary Custom Name or Initials Flacon Engraving'
    ],
    specs: {
      'Concentration': 'Extrait de Parfum',
      'Maceration Time': '6 Months in French Oak',
      'Origin': 'Grasse, France',
      'Formulation': '100% Vegan & Cruelty-Free'
    },
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-2',
    sku: 'LUM-VAN-002',
    name: 'Brumes de Vanille Intense',
    category: 'Amber & Oriental',
    tagline: 'Smoked Bourbon Vanilla, Golden Benzoin & Roasted Venezuelan Tonka',
    description: 'Transcending conventional sweetness, Brumes de Vanille is a seductive, nocturnal amber. Hand-harvested Madagascar vanilla pods are roasted over birchwood, bathed in liquid benzoin resin, and softened with creamy sandalwood for a hypnotic, velvet warmth.',
    price: 285.00,
    originalPrice: 320.00,
    discountPercent: 11,
    stock: 22,
    rating: 4.92,
    reviewsCount: 142,
    badge: 'Best Seller',
    isFeatured: true,
    concentration: 'Extrait de Parfum (30% Concentration)',
    olfactoryFamily: 'Amber & Oriental',
    sillage: 'Generous & Alluring',
    longevity: '14+ Hours',
    season: 'Autumn / Winter / Intimate Dates',
    pyramid: {
      topNotes: ['Spiced Cardamom', 'Almond Blossom', 'Bitter Orange'],
      heartNotes: ['Smoked Bourbon Vanilla Pods', 'Heliotrope', 'Orchid'],
      baseNotes: ['Roasted Tonka Bean', 'Golden Benzoin', 'Mysore Sandalwood', 'White Musk']
    },
    sizes: [
      { label: '50 ml Classic Flacon', ml: 50, priceMultiplier: 0.72 },
      { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0 },
      { label: '10 ml Travel Atomizer', ml: 10, priceMultiplier: 0.28 }
    ],
    colors: [
      { name: 'Warm Amber Glass', hex: '#d97706' },
      { name: 'Noir Matte', hex: '#111827' }
    ],
    features: [
      'Aged Madagascar Grand Cru Vanilla Caviar Extract',
      'Ultra-fine Micro-mist Atomizer for cloud dispersion',
      'Silk Ribbon Packaging with Wax-sealed Certificate',
      'Zero synthetic dyes — 100% natural nectar hue'
    ],
    specs: {
      'Concentration': 'Extrait de Parfum',
      'Maceration Time': '4 Months',
      'Origin': 'Grasse & Florence',
      'Formulation': 'Phthalate-Free'
    },
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-3',
    sku: 'LUM-NER-003',
    name: "Fleur d'Oranger & Néroli Blanc",
    category: 'Fresh & Citrus',
    tagline: 'Italian Bigarade Petitgrain, Sparkling Neroli & Sunny Mediterranean Cypress',
    description: 'An invigorating sun-drenched escape along the Amalfi cliffside. Luminous orange blossom petals distilled at dawn harmonize with Italian green mandarin, cooling petitgrain, and clean white cedar to create an effervescent, aristocratic freshness.',
    price: 245.00,
    originalPrice: 275.00,
    discountPercent: 10,
    stock: 18,
    rating: 4.88,
    reviewsCount: 96,
    badge: 'Summer Favorite',
    isFeatured: true,
    concentration: 'Eau de Parfum Intense (24% Concentration)',
    olfactoryFamily: 'Fresh & Citrus',
    sillage: 'Radiant & Crisp',
    longevity: '10+ Hours',
    season: 'Spring / Summer / Daytime Signature',
    pyramid: {
      topNotes: ['Calabrian Green Mandarin', 'Italian Bergamot', 'Grapefruit Zest'],
      heartNotes: ['Tunisian Neroli', 'Grasse Orange Blossom', 'Petitgrain Bigarade'],
      baseNotes: ['White Cedarwood', 'Clean Silk Musk', 'Coastal Amber']
    },
    sizes: [
      { label: '50 ml Classic Flacon', ml: 50, priceMultiplier: 0.72 },
      { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0 },
      { label: '10 ml Travel Atomizer', ml: 10, priceMultiplier: 0.28 }
    ],
    colors: [
      { name: 'Crystal Clear Flacon', hex: '#f8fafc' },
      { name: 'Emerald Tint Flacon', hex: '#059669' }
    ],
    features: [
      'Harvested from certified organic Italian coastal groves',
      'Cold-pressed extraction preserves delicate citrus volatiles',
      'Crisp, uplifting projection without sharp chemical edges',
      'Perfect signature everyday luxury scent'
    ],
    specs: {
      'Concentration': 'Eau de Parfum Intense',
      'Maceration Time': '3 Months',
      'Origin': 'Riviera, Italy & Grasse',
      'Formulation': 'Hypoallergenic Certified'
    },
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-4',
    sku: 'LUM-SAN-004',
    name: 'Santale Royale Nocturne',
    category: 'Woody & Smoky',
    tagline: 'Creamy Mysore Sandalwood, Violet Leaf, Cracked Cardamom & Suede',
    description: 'An enigmatic, contemporary interpretation of classic sandalwood. Velvety Australian and Mysore sandalwood intertwine with fresh crushed cardamom, dewy violet leaf, and warm Tuscan suede for an understated elegance that whispers sophistication.',
    price: 295.00,
    originalPrice: 340.00,
    discountPercent: 13,
    stock: 8,
    rating: 4.94,
    reviewsCount: 167,
    badge: 'Editor Pick',
    isFeatured: true,
    concentration: 'Extrait de Parfum (30% Concentration)',
    olfactoryFamily: 'Woody & Smoky',
    sillage: 'Subtle yet Magnetic',
    longevity: '14+ Hours',
    season: 'Year-Round / Office to Black Tie',
    pyramid: {
      topNotes: ['Guatemalan Cardamom', 'Violet Leaf', 'Papyrus'],
      heartNotes: ['Iris Concrete', 'Virginia Cedar', 'Cypress'],
      baseNotes: ['Mysore Sandalwood', 'Tuscan Suede Leather', 'Iso-E Super Pure', 'Cashmeran']
    },
    sizes: [
      { label: '50 ml Classic Flacon', ml: 50, priceMultiplier: 0.72 },
      { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0 },
      { label: '10 ml Travel Atomizer', ml: 10, priceMultiplier: 0.28 }
    ],
    colors: [
      { name: 'Deep Espresso Wood', hex: '#451a03' },
      { name: 'Brushed Brass', hex: '#d4af37' }
    ],
    features: [
      'Sustainable plantation-grown Mysore Sandalwood species',
      'Silky, non-sticky oil formulation that nourishes skin',
      'Unisex architectural scent profile beloved worldwide',
      'Hand-numbered limited production batch'
    ],
    specs: {
      'Concentration': 'Extrait de Parfum',
      'Maceration Time': '5 Months',
      'Origin': 'Paris, France',
      'Formulation': 'Cruelty-Free'
    },
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-5',
    sku: 'LUM-ROS-005',
    name: 'Rose Velours Impériale',
    category: 'Floral & Romantic',
    tagline: 'Crimson May Rose, Candied Lychee, Blackcurrant & Cashmere Musk',
    description: 'A seductive celebration of the Queen of Flowers. Handpicked Centifolia roses blended with tart blackcurrant bud, luscious lychee, and whisper-soft cashmere musk. Neither powdery nor vintage — vibrant, modern, and intoxicatingly romantic.',
    price: 275.00,
    originalPrice: 310.00,
    discountPercent: 11,
    stock: 15,
    rating: 4.91,
    reviewsCount: 118,
    badge: 'Romantic Choice',
    isFeatured: false,
    concentration: 'Eau de Parfum Supreme (26% Concentration)',
    olfactoryFamily: 'Floral & Romantic',
    sillage: 'Beguiling & Lush',
    longevity: '12+ Hours',
    season: 'Spring / Autumn / Special Occasions',
    pyramid: {
      topNotes: ['Rosewater Mist', 'Sparkling Lychee', 'Blackcurrant Cassis'],
      heartNotes: ['Grasse Centifolia Rose Absolute', 'Damask Rose Petals', 'Magnolia'],
      baseNotes: ['Cashmere Woods', 'White Patchouli', 'Modern Ambergris']
    },
    sizes: [
      { label: '50 ml Classic Flacon', ml: 50, priceMultiplier: 0.72 },
      { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0 },
      { label: '10 ml Travel Atomizer', ml: 10, priceMultiplier: 0.28 }
    ],
    colors: [
      { name: 'Rose Quartz Tint', hex: '#fb7185' },
      { name: 'Champagne Gold', hex: '#fce08b' }
    ],
    features: [
      'Over 10,000 hand-harvested May rose petals per 100ml flacon',
      'Luminous floral trail that turns heads gently',
      'Includes complimentary engraved atomizer charm',
      'Custom gold-embossed presentation chest'
    ],
    specs: {
      'Concentration': 'Eau de Parfum Supreme',
      'Maceration Time': '4 Months',
      'Origin': 'Grasse, France',
      'Formulation': '100% Vegan'
    },
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-6',
    sku: 'LUM-TAB-006',
    name: 'Tabac & Cognac Réserve',
    category: 'Gourmand & Spiced',
    tagline: 'Aged Cognac Barrels, Blonde Havana Leaf, Cocoa & Dark Honey',
    description: 'An opulent private club in liquid form. Rich blond tobacco leaves steeped in aged French oak cognac, dusted with dark Venezuelan cacao, bitter cinnamon bark, and wild wildflower honey. Decadent, warm, and unapologetically addictive.',
    price: 310.00,
    originalPrice: 350.00,
    discountPercent: 11,
    stock: 11,
    rating: 4.97,
    reviewsCount: 156,
    badge: 'Cult Classic',
    isFeatured: true,
    concentration: 'Extrait de Parfum (33% Concentration)',
    olfactoryFamily: 'Gourmand & Spiced',
    sillage: 'Monolithic & Warm',
    longevity: '18+ Hours (Eternal)',
    season: 'Autumn / Winter / Speakeasy Nights',
    pyramid: {
      topNotes: ['VSOP Cognac Accord', 'Wild Honey', 'Nutmeg'],
      heartNotes: ['Blonde Havana Tobacco', 'Ceylon Cinnamon', 'Dark Cacao Butter'],
      baseNotes: ['Bourbon Vanilla Extract', 'Tonka Bean', 'French Oak', 'Labdanum']
    },
    sizes: [
      { label: '50 ml Classic Flacon', ml: 50, priceMultiplier: 0.72 },
      { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0 },
      { label: '10 ml Travel Atomizer', ml: 10, priceMultiplier: 0.28 }
    ],
    colors: [
      { name: 'Smoked Cognac Glass', hex: '#78350f' },
      { name: 'Antiqued Gold', hex: '#b45309' }
    ],
    features: [
      'Real oak barrel infusion creates genuine aged boozy nuances',
      'Unsurpassed 18+ hour staying power on fabric and skin',
      'Bespoke heavy weighted zamak metallic cap',
      'The definitive evening cold-weather fragrance'
    ],
    specs: {
      'Concentration': 'Extrait de Parfum',
      'Maceration Time': '8 Months',
      'Origin': 'Cognac & Paris, France',
      'Formulation': 'Artisanal Batch'
    },
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-7',
    sku: 'LUM-JAS-007',
    name: 'Jasmin Éthéré & Ambre Blanc',
    category: 'Floral & Romantic',
    tagline: 'Night-blooming Jasmine Sambac, Crisp Nashi Pear & Silken White Amber',
    description: 'An ethereal nocturnal garden bathed in silver moonlight. Pristine night-blooming Grasse jasmine married with juicy crystalline Asian pear, sparkling pink pepper, and a second-skin veil of white amber and pure cashmere.',
    price: 265.00,
    originalPrice: 295.00,
    discountPercent: 10,
    stock: 19,
    rating: 4.89,
    reviewsCount: 88,
    badge: 'Trending',
    isFeatured: false,
    concentration: 'Eau de Parfum (22% Concentration)',
    olfactoryFamily: 'Floral & Romantic',
    sillage: 'Airy & Mesmerizing',
    longevity: '11+ Hours',
    season: 'Spring / Summer Evenings',
    pyramid: {
      topNotes: ['Nashi Pear', 'Pink Peppercorn', 'Dewy Violet Leaves'],
      heartNotes: ['Night-Blooming Jasmine Sambac', 'Lily of the Valley', 'White Peony'],
      baseNotes: ['White Amber', 'Silken Musks', 'Sandalwood']
    },
    sizes: [
      { label: '50 ml Classic Flacon', ml: 50, priceMultiplier: 0.72 },
      { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0 },
      { label: '10 ml Travel Atomizer', ml: 10, priceMultiplier: 0.28 }
    ],
    colors: [
      { name: 'Opaline White', hex: '#f1f5f9' },
      { name: 'Platinum Silver', hex: '#cbd5e1' }
    ],
    features: [
      'Night-harvested jasmine picked at maximum scent release',
      'Gentle, hypoallergenic formulation suitable for sensitive skin',
      'Perfect signature everyday romantic fragrance',
      'Packaged in an opaline lacquered bottle with velvet pouch'
    ],
    specs: {
      'Concentration': 'Eau de Parfum',
      'Maceration Time': '3 Months',
      'Origin': 'Grasse, France',
      'Formulation': 'Eco-Friendly Extract'
    },
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-8',
    sku: 'LUM-SET-008',
    name: "L'Élixir Masterpiece Discovery Coffret",
    category: 'Discovery & Sets',
    tagline: '5x 10ml Collector Flacons + $50 Voucher towards Full Size Bottle',
    description: 'The ultimate olfactory voyage. Experience the complete LUMINA Haute Parfumerie collection in luxury 10ml travel-ready spray atomizers. Includes: Oud Royal, Brumes de Vanille, Fleur d’Oranger, Santale Royale, and Tabac & Cognac, packaged in a handcrafted lacquer vault.',
    price: 185.00,
    originalPrice: 240.00,
    discountPercent: 23,
    stock: 25,
    rating: 4.99,
    reviewsCount: 310,
    badge: 'Best Gift Set',
    isFeatured: true,
    concentration: 'Discovery Set (5x 10ml Extrait / EDP Sprays)',
    olfactoryFamily: 'Discovery & Sets',
    sillage: 'Varies by Fragrance',
    longevity: '12-18 Hours per Fragrance',
    season: 'All Seasons / The Perfect Luxury Gift',
    pyramid: {
      topNotes: ['Includes 5 Signature Scents Across All Olfactory Families'],
      heartNotes: ['Curated by Master French Parfumeurs'],
      baseNotes: ['Comes with $50 Credit towards any 100ml Flacon']
    },
    sizes: [
      { label: '5x 10ml Collector Coffret', ml: 50, priceMultiplier: 1.0 }
    ],
    colors: [
      { name: 'Piano Black Lacquer Vault', hex: '#09090b' },
      { name: 'Imperial Gold Chest', hex: '#d4af37' }
    ],
    features: [
      'Contains 5 Deluxe 10ml spray atomizers with metallic caps',
      'Includes $50 redeemable gift certificate for any 100ml purchase',
      'Luxury velvet-lined presentation box with magnetic ribbon',
      'Ideal introduction to high-end bespoke artisanal perfumery'
    ],
    specs: {
      'Includes': '5x 10ml Eau de Parfum & Extraits',
      'Voucher Value': '$50 Included',
      'Packaging': 'Lacquered Wooden Chest',
      'Travel Ready': 'TSA Carry-on Approved'
    },
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80'
    ]
  }
];

export const PROMO_CODES = {
  'LUXE25': {
    code: 'LUXE25',
    discountPercent: 25,
    description: '25% Off Premier Haute Parfumerie Purchase'
  },
  'PARFUM10': {
    code: 'PARFUM10',
    discountPercent: 10,
    description: '10% Off Entire Fragrance Order'
  },
  'VIPGOLD': {
    code: 'VIPGOLD',
    discountPercent: 20,
    description: 'VIP Gold Member 20% Discount'
  }
};

export const OLFACTORY_FAMILIES = [
  'All',
  'Woody & Smoky',
  'Amber & Oriental',
  'Floral & Romantic',
  'Fresh & Citrus',
  'Gourmand & Spiced',
  'Discovery & Sets'
];

export const COMPLIMENTARY_SAMPLES = [
  { id: 'smp-1', name: 'Oud Royal Extrait (2ml Vial)', family: 'Woody & Smoky' },
  { id: 'smp-2', name: 'Brumes de Vanille (2ml Vial)', family: 'Amber & Oriental' },
  { id: 'smp-3', name: "Fleur d'Oranger & Néroli (2ml Vial)", family: 'Fresh & Citrus' },
  { id: 'smp-4', name: 'Santale Royale Nocturne (2ml Vial)', family: 'Woody & Smoky' },
  { id: 'smp-5', name: 'Rose Velours Impériale (2ml Vial)', family: 'Floral & Romantic' },
  { id: 'smp-6', name: 'Tabac & Cognac Réserve (2ml Vial)', family: 'Gourmand & Spiced' }
];
