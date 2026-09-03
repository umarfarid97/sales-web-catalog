export const INITIAL_ORDERS = [
  {
    id: 'ORD-98421',
    customer: {
      name: 'Victoria von Habsburg',
      email: 'victoria.habsburg@luxury-estates.ch',
      phone: '+41 79 555 3821',
      address: 'Villa Belle Époque, 12 Quai du Mont-Blanc',
      city: 'Geneva',
      state: 'GE',
      zip: '1201',
      country: 'Switzerland',
      giftPackaging: true,
      giftNote: 'Happy 30th Birthday my darling! May this scent remind you of our Paris nights.',
      engravingText: 'V.H. • Paris 2026',
      samples: ['Oud Royal Extrait (2ml Vial)', 'Brumes de Vanille (2ml Vial)']
    },
    items: [
      {
        cartItemId: 'prod-1-100 ml Grand Flacon-Royal Gold Cap',
        id: 'prod-1',
        name: 'Oud Royal Extrait',
        price: 320.00,
        originalPrice: 380.00,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
        color: 'Royal Gold Cap',
        size: '100 ml Grand Flacon',
        category: 'Woody & Smoky',
        quantity: 1,
        engraving: 'V.H. • Paris 2026'
      },
      {
        cartItemId: 'prod-8-5x 10ml Collector Coffret-Piano Black Lacquer Vault',
        id: 'prod-8',
        name: "L'Élixir Masterpiece Discovery Coffret",
        price: 185.00,
        originalPrice: 240.00,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
        color: 'Piano Black Lacquer Vault',
        size: '5x 10ml Collector Coffret',
        category: 'Discovery & Sets',
        quantity: 1
      }
    ],
    subtotal: 505.00,
    discount: 126.25,
    discountCode: 'LUXE25',
    shipping: 0,
    total: 378.75,
    status: 'Delivered',
    paymentMethod: 'apple-pay',
    placedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: 'TRK-LUM-9482710'
  },
  {
    id: 'ORD-98422',
    customer: {
      name: 'Julian Montgomery',
      email: 'julian.m@montgomery-capital.co.uk',
      phone: '+44 20 7946 0912',
      address: '42 Mayfair Square, Flat 4B',
      city: 'London',
      state: 'Greater London',
      zip: 'W1J 8AJ',
      country: 'United Kingdom',
      giftPackaging: true,
      giftNote: 'With compliments from the Partners.',
      engravingText: 'J.M. • Mayfair',
      samples: ['Tabac & Cognac Réserve (2ml Vial)', 'Santale Royale Nocturne (2ml Vial)']
    },
    items: [
      {
        cartItemId: 'prod-6-100 ml Grand Flacon-Smoked Cognac Glass',
        id: 'prod-6',
        name: 'Tabac & Cognac Réserve',
        price: 310.00,
        originalPrice: 350.00,
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
        color: 'Smoked Cognac Glass',
        size: '100 ml Grand Flacon',
        category: 'Gourmand & Spiced',
        quantity: 2,
        engraving: 'J.M. • Mayfair'
      }
    ],
    subtotal: 620.00,
    discount: 62.00,
    discountCode: 'PARFUM10',
    shipping: 0,
    total: 558.00,
    status: 'Processing',
    paymentMethod: 'credit-card',
    placedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    deliveredAt: null,
    trackingNumber: 'TRK-LUM-5839201'
  },
  {
    id: 'ORD-98423',
    customer: {
      name: 'Elena Rostova',
      email: 'elena.rostova@design-studio.fr',
      phone: '+33 6 12 34 56 78',
      address: '18 Rue du Faubourg Saint-Honoré',
      city: 'Paris',
      state: 'Île-de-France',
      zip: '75008',
      country: 'France',
      giftPackaging: false,
      giftNote: '',
      engravingText: '',
      samples: ["Fleur d'Oranger & Néroli (2ml Vial)", 'Rose Velours Impériale (2ml Vial)']
    },
    items: [
      {
        cartItemId: 'prod-2-50 ml Classic Flacon-Warm Amber Glass',
        id: 'prod-2',
        name: 'Brumes de Vanille Intense',
        price: 205.20,
        originalPrice: 230.40,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80',
        color: 'Warm Amber Glass',
        size: '50 ml Classic Flacon',
        category: 'Amber & Oriental',
        quantity: 1
      },
      {
        cartItemId: 'prod-5-10 ml Travel Atomizer-Rose Quartz Tint',
        id: 'prod-5',
        name: 'Rose Velours Impériale',
        price: 77.00,
        originalPrice: 86.80,
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80',
        color: 'Rose Quartz Tint',
        size: '10 ml Travel Atomizer',
        category: 'Floral & Romantic',
        quantity: 1
      }
    ],
    subtotal: 282.20,
    discount: 0,
    discountCode: '',
    shipping: 0,
    total: 282.20,
    status: 'Pending',
    paymentMethod: 'apple-pay',
    placedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    deliveredAt: null,
    trackingNumber: 'TRK-LUM-2940182'
  }
];
