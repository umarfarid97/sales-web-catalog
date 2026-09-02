export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    sku: 'LUM-AUD-001',
    name: 'AeroPulse Wireless Studio Pro',
    category: 'Audio',
    tagline: 'Ultra-low latency lossless audio with adaptive active noise cancellation',
    description: 'Engineered for audiophiles and creators, the AeroPulse Studio Pro delivers 45-hour battery life, custom 40mm titanium drivers, and spatial audio tracking that transforms how you experience music and sound design.',
    price: 349.99,
    originalPrice: 399.99,
    discountPercent: 12,
    stock: 18,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Best Seller',
    isFeatured: true,
    colors: [
      { name: 'Obsidian Black', hex: '#18181b' },
      { name: 'Cosmic Silver', hex: '#94a3b8' },
      { name: 'Midnight Navy', hex: '#1e3a8a' }
    ],
    features: [
      'Hybrid Adaptive Active Noise Cancellation (-42dB)',
      'Lossless LDAC & aptX HD Wireless Audio',
      '45 Hours Playback with Quick Charge (10m = 5h)',
      'Dual Beamforming Microphones with AI Noise Suppression'
    ],
    specs: {
      'Driver Size': '40mm Titanium Composite',
      'Frequency Response': '10Hz - 40kHz',
      'Bluetooth Version': '5.3 Multipoint',
      'Weight': '248g'
    },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-2',
    sku: 'LUM-WEAR-002',
    name: 'Chronos Horizon Smartwatch X5',
    category: 'Wearables',
    tagline: 'Aerospace-grade titanium chassis with continuous biometric telemetry',
    description: 'The Horizon X5 features a sapphire crystal AMOLED screen, dual-frequency GPS, ECG monitoring, and up to 14 days of battery longevity in an ultra-slim, rugged architectural profile.',
    price: 429.00,
    originalPrice: 479.00,
    discountPercent: 10,
    stock: 9,
    rating: 4.8,
    reviewsCount: 98,
    badge: 'Popular',
    isFeatured: true,
    colors: [
      { name: 'Raw Titanium', hex: '#71717a' },
      { name: 'Stealth Black', hex: '#09090b' },
      { name: 'Rose Gold', hex: '#fb7185' }
    ],
    features: [
      '1.43" Always-On Sapphire Crystal AMOLED (1000 nits)',
      'Advanced ECG, SpO2 & HRV Heart Health Telemetry',
      'Dual-Band Multi-Constellation GNSS Navigation',
      '50m Water Resistant (5 ATM Grade)'
    ],
    specs: {
      'Battery Life': '14 Days Standard / 36h Full GPS',
      'Case Material': 'Grade 5 Aerospace Titanium',
      'Sensors': 'Optical PPG, Bio-impedance, Barometer, Gyro',
      'Compatibility': 'iOS & Android'
    },
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-3',
    sku: 'LUM-DESK-003',
    name: 'OmniDesk Pro Mechanical Keyboard',
    category: 'Workstation',
    tagline: 'Gasket-mounted hot-swappable tactile powerhouse with OLED display',
    description: 'Crafted from a solid CNC aluminum unibody, the OmniDesk Pro delivers supreme acoustic dampening, custom-lubricated switches, per-key programmable RGB, and an interactive telemetry OLED knob.',
    price: 199.50,
    originalPrice: 229.00,
    discountPercent: 13,
    stock: 4,
    rating: 4.95,
    reviewsCount: 215,
    badge: 'Low Stock',
    isFeatured: true,
    colors: [
      { name: 'Cyberpunk Purple', hex: '#7c3aed' },
      { name: 'Matte Charcoal', hex: '#27272a' },
      { name: 'Polar White', hex: '#f8fafc' }
    ],
    features: [
      'Full CNC Machined Aluminum Enclosure with Brass Weight',
      'Factory Lubricated Linear Gateron Jade Switches',
      'Programmable Rotary Knob with 128x64 Mini OLED',
      'Tri-Mode Connectivity (2.4GHz, Bluetooth 5.2, USB-C)'
    ],
    specs: {
      'Layout': '75% Compact (82 Keys)',
      'Polling Rate': '1000Hz (1ms)',
      'Battery': '4000mAh Rechargable',
      'Keycaps': 'Double-shot PBT Cherry Profile'
    },
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-4',
    sku: 'LUM-SMART-004',
    name: 'AuraGlow Ambient Smart Lamp',
    category: 'Smart Home',
    tagline: 'Circadian rhythm synchronization and immersive sound-reactive illumination',
    description: 'Bring biometric lighting to your workspace and bedroom. AuraGlow mimics the natural progression of daylight to boost focus during working hours and promote restful melatonin production at night.',
    price: 129.00,
    originalPrice: 159.00,
    discountPercent: 19,
    stock: 22,
    rating: 4.7,
    reviewsCount: 76,
    badge: 'Sale',
    isFeatured: false,
    colors: [
      { name: 'Frost White', hex: '#f1f5f9' },
      { name: 'Anodized Silver', hex: '#cbd5e1' }
    ],
    features: [
      '16.8 Million Colors + Pure High-CRI 98+ Tunable White',
      'Matter & Apple HomeKit / Google Assistant Certified',
      'Integrated Qi2 15W Magnetic Wireless Charging Base',
      'Capacitive Touch Slide Dimmer'
    ],
    specs: {
      'Max Brightness': '1200 Lumens',
      'Color Temp': '1800K - 6500K',
      'Power Consumption': '18W Max',
      'Dimensions': '180mm x 320mm'
    },
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-5',
    sku: 'LUM-ACC-005',
    name: 'Vortex MagSafe 3-in-1 Fast Charging Station',
    category: 'Accessories',
    tagline: 'Sculpted aircraft-grade aluminum dock for Phone, Watch, and Earbuds',
    description: 'Declutter your nightstand and desk. The Vortex 3-in-1 provides simultaneous 15W fast charging with seamless magnetic alignment and floating viewing angles in portrait or landscape.',
    price: 89.99,
    originalPrice: 109.99,
    discountPercent: 18,
    stock: 35,
    rating: 4.85,
    reviewsCount: 310,
    badge: 'Top Pick',
    isFeatured: true,
    colors: [
      { name: 'Space Gray', hex: '#3f3f46' },
      { name: 'Silver Mist', hex: '#e2e8f0' }
    ],
    features: [
      'Official Apple Qi2 15W Certified Fast Magnetic Wireless',
      'Foldable Travel-Friendly Architectural Design',
      'Weighted Anti-Slip Base with Heat Dissipation Channels',
      'Includes 45W GaN Power Adapter & Braided Cable'
    ],
    specs: {
      'Total Output': '25W Concurrent',
      'Input': 'USB-C PD 3.0',
      'Weight': '320g',
      'Protection': 'FOD, OVP, OTP Temperature Sensing'
    },
    images: [
      'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-6',
    sku: 'LUM-AUD-006',
    name: 'EchoPod Sonic Hi-Res Earbuds',
    category: 'Audio',
    tagline: 'Dual balanced armature drivers with crystal-clear spatial audio',
    description: 'Uncompromising acoustic fidelity in pocket format. Features 32-hour playback with case, IPX7 waterproof rating, and low-latency gaming mode.',
    price: 159.00,
    originalPrice: 189.00,
    discountPercent: 15,
    stock: 15,
    rating: 4.65,
    reviewsCount: 88,
    badge: '',
    isFeatured: false,
    colors: [
      { name: 'Gloss Pearl', hex: '#f8fafc' },
      { name: 'Onyx Matte', hex: '#18181b' }
    ],
    features: [
      'Active Noise Cancellation up to 38dB',
      'Wireless Qi Fast Charging Case',
      'Multipoint Bluetooth 5.4 connection',
      'IPX7 Sweat and Rain Protection'
    ],
    specs: {
      'Playtime': '8h Earbuds + 24h Case',
      'Codecs': 'AAC, SBC, LHDC 5.0',
      'Latency': '45ms Gaming Mode'
    },
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-7',
    sku: 'LUM-DESK-007',
    name: 'ErgoView 4K UltraWide Monitor Arm',
    category: 'Workstation',
    tagline: 'Gas spring counterbalance mechanism with internal cable routing',
    description: 'Supports heavy 49" ultrawide displays effortlessly. Full 360-degree rotation, tilt, and height articulation with premium powder-coated steel construction.',
    price: 145.00,
    originalPrice: 175.00,
    discountPercent: 17,
    stock: 2,
    rating: 4.9,
    reviewsCount: 64,
    badge: 'Low Stock',
    isFeatured: false,
    colors: [
      { name: 'Stealth Black', hex: '#0f172a' },
      { name: 'Pure White', hex: '#f1f5f9' }
    ],
    features: [
      'Supports Screens from 17" to 49" (up to 20kg / 44 lbs)',
      'Integrated Quick-Release VESA 75/100 Bracket',
      'Dual USB 3.0 Pass-through Ports in Base',
      'Desk Clamp & Grommet Mounting included'
    ],
    specs: {
      'Tilt Range': '+90° to -45°',
      'Swivel': '180°',
      'Rotation': '360°',
      'Max Height': '510mm'
    },
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'prod-8',
    sku: 'LUM-SMART-008',
    name: 'Zenith Smart Air Purifier & Ionizer',
    category: 'Smart Home',
    tagline: 'Medical-grade H13 True HEPA filtration with laser PM2.5 monitoring',
    description: 'Clean up to 1,200 sq ft in 30 minutes. Real-time air quality index display with whisper-quiet sleep mode operating at under 22dB.',
    price: 279.00,
    originalPrice: 320.00,
    discountPercent: 12,
    stock: 11,
    rating: 4.75,
    reviewsCount: 112,
    badge: 'Eco Friendly',
    isFeatured: false,
    colors: [
      { name: 'Minimalist Gray', hex: '#64748b' },
      { name: 'Nordic White', hex: '#f8fafc' }
    ],
    features: [
      '4-Stage Filtration: Pre-filter, H13 HEPA, Activated Carbon, Ionizer',
      'Real-Time OLED Air Quality Telemetry',
      'WiFi App Control & Voice Scheduling',
      'WhisperQuiet 21dB Sleep Mode'
    ],
    specs: {
      'CADR': '400 m³/h',
      'Coverage Area': 'Up to 1,200 sq ft',
      'Filter Lifespan': '8-12 Months'
    },
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
    ]
  }
];

export const CATEGORIES = [
  { id: 'All', name: 'All Products', icon: 'Sparkles' },
  { id: 'Audio', name: 'Premium Audio', icon: 'Headphones' },
  { id: 'Wearables', name: 'Wearables', icon: 'Watch' },
  { id: 'Workstation', name: 'Workstation', icon: 'Laptop' },
  { id: 'Smart Home', name: 'Smart Home', icon: 'Home' },
  { id: 'Accessories', name: 'Accessories', icon: 'Zap' }
];

export const PROMO_CODES = {
  'LUMINA25': { discountPercent: 25, description: 'Special 25% Off Storewide' },
  'WELCOME10': { discountPercent: 10, description: 'Welcome 10% Off First Order' },
  'VIP50': { discountPercent: 50, description: 'Exclusive VIP 50% Off Voucher' }
};
