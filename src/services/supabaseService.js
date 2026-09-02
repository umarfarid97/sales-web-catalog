import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Helper: Format DB product row to JS camelCase
export const formatProductFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    sku: row.sku || '',
    name: row.name,
    category: row.category,
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
    colors: Array.isArray(row.colors) ? row.colors : [],
    features: Array.isArray(row.features) ? row.features : [],
    specs: typeof row.specs === 'object' && row.specs !== null ? row.specs : {},
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
    colors: product.colors,
    features: product.features,
    specs: product.specs,
    images: product.images
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
