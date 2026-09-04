import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Helper: Format DB product row to JS camelCase
export const formatProductFromDb = (row) => {
  if (!row) return null;
  const specs = typeof row.specs === 'object' && row.specs !== null ? row.specs : {};
  return {
    id: row.id,
    sku: row.sku || '',
    catalogNo: specs.catalogNo || (row.sku ? Number(row.sku.split('-')[2]) : 0),
    name: row.name,
    displayName: specs.displayName || row.name,
    brandInspiration: specs.brandInspiration || '',
    originalListing: specs.originalListing || '',
    gender: specs.gender || (row.category === 'Pour Homme' ? 'Men' : row.category === 'Pour Femme' ? 'Women' : 'Unisex'),
    category: row.category,
    character: specs.character || row.category,
    olfactoryFamily: specs.olfactoryFamily || specs.character || row.category,
    traits: Array.isArray(specs.traits) ? specs.traits : (specs.character ? specs.character.split('/').map(t => t.trim()) : []),
    tier: specs.tier || (row.badge?.includes('Tier S') ? 'S' : 'B'),
    tagline: row.tagline || '',
    description: row.description || '',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : Number(row.price),
    discountPercent: Number(row.discount_percent || 0),
    stock: Number(row.stock || 0),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    badge: row.badge || '',
    isFeatured: Boolean(row.is_featured),
    concentration: specs.concentration || 'Extrait de Parfum (30%)',
    sillage: specs.sillage || 'Enveloping & Magnetic',
    longevity: specs.longevity || '14+ Hours',
    season: specs.season || 'All Seasons',
    refillable: specs.refillable !== undefined ? specs.refillable : true,
    intensityScore: specs.intensityScore || (specs.tier === 'S' ? 5 : 4),
    pyramid: specs.pyramid || {
      topNotes: ['Calabrian Bergamot', 'Spiced Saffron'],
      heartNotes: ['Damascena Rose', 'French Lavender'],
      baseNotes: ['Royal Woods', 'Ambergris', 'Bourbon Vanilla']
    },
    sizes: specs.sizes || [
      { label: '30 ml Travel Atomizer', ml: 30, priceMultiplier: 0.55, isRefillable: true },
      { label: '50 ml Haute Flacon', ml: 50, priceMultiplier: 0.78, isRefillable: true },
      { label: '100 ml Collector Flacon', ml: 100, priceMultiplier: 1.0, isRefillable: true }
    ],
    features: Array.isArray(row.features) ? row.features : [],
    specs,
    images: Array.isArray(row.images) ? row.images : []
  };
};

// Helper: Format JS camelCase to DB product row
export const formatProductToDb = (product) => {
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
      ...product.specs,
      catalogNo: product.catalogNo,
      displayName: product.displayName,
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
};

// Helper: Format DB order row to JS camelCase
export const formatOrderFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    customer: row.customer || {},
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal),
    discount: Number(row.discount || 0),
    discountCode: row.discount_code || '',
    shipping: Number(row.shipping || 0),
    total: Number(row.total),
    status: row.status || 'Pending',
    paymentMethod: row.payment_method || 'credit-card',
    placedAt: row.placed_at || row.created_at,
    deliveredAt: row.delivered_at || null,
    trackingNumber: row.tracking_number || ''
  };
};

// Helper: Format JS camelCase to DB order row
export const formatOrderToDb = (order) => {
  return {
    id: order.id,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    discount_code: order.discountCode,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    payment_method: order.paymentMethod,
    placed_at: order.placedAt,
    delivered_at: order.deliveredAt,
    tracking_number: order.trackingNumber
  };
};

// --- Products API ---

export const fetchProductsFromSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(formatProductFromDb);
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return null;
  }
};

export const seedProductsToSupabase = async (initialProducts) => {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const dbPayload = initialProducts.map(formatProductToDb);
    const { error } = await supabase.from('products').upsert(dbPayload, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error seeding products to Supabase:', err);
    return false;
  }
};

export const saveProductToSupabase = async (product) => {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const dbPayload = formatProductToDb(product);
    const { error } = await supabase.from('products').upsert(dbPayload, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error saving product to Supabase:', err);
    return false;
  }
};

export const deleteProductFromSupabase = async (productId) => {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting product from Supabase:', err);
    return false;
  }
};

// --- Orders API ---

export const fetchOrdersForUser = async (userEmail, userId) => {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    let query = supabase
      .from('orders')
      .select('*')
      .order('placed_at', { ascending: false });

    if (userEmail && userId) {
      query = query.or(`customer->>email.eq.${userEmail},customer->>userId.eq.${userId}`);
    } else if (userEmail) {
      query = query.eq('customer->>email', userEmail);
    } else if (userId) {
      query = query.eq('customer->>userId', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(formatOrderFromDb);
  } catch (err) {
    console.error('Error fetching orders for user from Supabase:', err);
    return [];
  }
};

export const lookupOrderInSupabase = async (searchQuery) => {
  if (!isSupabaseConfigured || !supabase || !searchQuery) return null;
  const clean = searchQuery.trim();
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`id.ilike.%${clean}%,tracking_number.ilike.%${clean}%`)
      .limit(1);

    if (error) throw error;
    if (data && data.length > 0) {
      return formatOrderFromDb(data[0]);
    }
    return null;
  } catch (err) {
    console.error('Error looking up order in Supabase:', err);
    return null;
  }
};

export const fetchOrdersFromSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('placed_at', { ascending: false });

    if (error) throw error;
    return data.map(formatOrderFromDb);
  } catch (err) {
    console.error('Error fetching orders from Supabase:', err);
    return null;
  }
};

export const seedOrdersToSupabase = async (initialOrders) => {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const dbPayload = initialOrders.map(formatOrderToDb);
    const { error } = await supabase.from('orders').upsert(dbPayload, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error seeding orders to Supabase:', err);
    return false;
  }
};

export const saveOrderToSupabase = async (order) => {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const dbPayload = formatOrderToDb(order);
    const { error } = await supabase.from('orders').upsert(dbPayload, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error saving order to Supabase:', err);
    return false;
  }
};

export const updateOrderStatusInSupabase = async (orderId, status, deliveredAt = null) => {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const updates = { status };
    if (deliveredAt) {
      updates.delivered_at = deliveredAt;
    }
    const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating order status in Supabase:', err);
    return false;
  }
};

// --- Profiles API ---

export const formatProfileFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || 'Kuala Lumpur',
    state: row.state || 'Wilayah Persekutuan',
    zip: row.zip || '',
    country: row.country || 'Malaysia',
    role: row.role || 'customer',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const formatProfileToDb = (profile) => {
  return {
    id: profile.id,
    email: profile.email?.toLowerCase(),
    name: profile.name,
    phone: profile.phone || '',
    address: profile.address || '',
    city: profile.city || 'Kuala Lumpur',
    state: profile.state || 'Wilayah Persekutuan',
    zip: profile.zip || '',
    country: profile.country || 'Malaysia',
    role: profile.role || 'customer',
    updated_at: new Date().toISOString()
  };
};

export const saveProfileToSupabase = async (profile) => {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const payload = formatProfileToDb(profile);
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data && data[0] ? formatProfileFromDb(data[0]) : null;
  } catch (err) {
    console.error('Error saving profile to Supabase:', err);
    return null;
  }
};

export const fetchProfileByEmail = async (email) => {
  if (!isSupabaseConfigured || !supabase || !email) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', email.trim())
      .limit(1);

    if (error) throw error;
    if (data && data.length > 0) {
      return formatProfileFromDb(data[0]);
    }
    return null;
  } catch (err) {
    console.error('Error fetching profile by email from Supabase:', err);
    return null;
  }
};

export const fetchProfileById = async (id) => {
  if (!isSupabaseConfigured || !supabase || !id) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .limit(1);

    if (error) throw error;
    if (data && data.length > 0) {
      return formatProfileFromDb(data[0]);
    }
    return null;
  } catch (err) {
    console.error('Error fetching profile by id from Supabase:', err);
    return null;
  }
};

export const fetchAllProfilesFromSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(formatProfileFromDb);
  } catch (err) {
    console.error('Error fetching all profiles from Supabase:', err);
    return [];
  }
};

// --- Realtime Subscriptions ---

export const subscribeToStoreChanges = (onProductChange, onOrderChange) => {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('store-realtime-sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        if (onProductChange) onProductChange(payload);
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        if (onOrderChange) onOrderChange(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
