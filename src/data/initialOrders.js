export const INITIAL_ORDERS = [
  {
    id: 'ORD-89241',
    customer: {
      name: 'Alexander Wright',
      email: 'alex.wright@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States'
    },
    items: [
      {
        id: 'prod-1',
        name: 'AeroPulse Wireless Studio Pro',
        price: 349.99,
        quantity: 1,
        color: 'Obsidian Black',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'prod-5',
        name: 'Vortex MagSafe 3-in-1 Fast Charging Station',
        price: 89.99,
        quantity: 1,
        color: 'Space Gray',
        image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=300&q=80'
      }
    ],
    subtotal: 439.98,
    discount: 43.99,
    discountCode: 'WELCOME10',
    shipping: 0,
    total: 395.99,
    status: 'Delivered',
    paymentMethod: 'Credit Card (Visa **** 4242)',
    placedAt: '2026-08-28T14:32:00Z',
    deliveredAt: '2026-08-31T11:20:00Z',
    trackingNumber: 'TRK-LUM-9482103'
  },
  {
    id: 'ORD-89242',
    customer: {
      name: 'Elena Rostova',
      email: 'elena.rostova@techmail.io',
      phone: '+1 (555) 876-5432',
      address: '10880 Wilshire Blvd #1400',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90024',
      country: 'United States'
    },
    items: [
      {
        id: 'prod-2',
        name: 'Chronos Horizon Smartwatch X5',
        price: 429.00,
        quantity: 1,
        color: 'Raw Titanium',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'
      }
    ],
    subtotal: 429.00,
    discount: 107.25,
    discountCode: 'LUMINA25',
    shipping: 0,
    total: 321.75,
    status: 'Shipped',
    paymentMethod: 'Apple Pay',
    placedAt: '2026-08-30T09:15:00Z',
    trackingNumber: 'TRK-LUM-7731920'
  },
  {
    id: 'ORD-89243',
    customer: {
      name: 'Marcus Sterling',
      email: 'm.sterling@capital.org',
      phone: '+1 (555) 345-9876',
      address: '350 5th Ave',
      city: 'New York',
      state: 'NY',
      zip: '10118',
      country: 'United States'
    },
    items: [
      {
        id: 'prod-3',
        name: 'OmniDesk Pro Mechanical Keyboard',
        price: 199.50,
        quantity: 2,
        color: 'Matte Charcoal',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'prod-7',
        name: 'ErgoView 4K UltraWide Monitor Arm',
        price: 145.00,
        quantity: 1,
        color: 'Stealth Black',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80'
      }
    ],
    subtotal: 544.00,
    discount: 0,
    discountCode: '',
    shipping: 0,
    total: 544.00,
    status: 'Processing',
    paymentMethod: 'PayPal',
    placedAt: '2026-09-01T16:40:00Z',
    trackingNumber: 'TRK-LUM-3829011'
  },
  {
    id: 'ORD-89244',
    customer: {
      name: 'Sophia Chen',
      email: 'sophia.c@designstudio.co',
      phone: '+1 (555) 901-2345',
      address: '500 Howard St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States'
    },
    items: [
      {
        id: 'prod-4',
        name: 'AuraGlow Ambient Smart Lamp',
        price: 129.00,
        quantity: 1,
        color: 'Frost White',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80'
      }
    ],
    subtotal: 129.00,
    discount: 0,
    discountCode: '',
    shipping: 15.00,
    total: 144.00,
    status: 'Pending',
    paymentMethod: 'Credit Card (Mastercard **** 8821)',
    placedAt: '2026-09-02T10:12:00Z',
    trackingNumber: 'TRK-LUM-PENDING'
  }
];
