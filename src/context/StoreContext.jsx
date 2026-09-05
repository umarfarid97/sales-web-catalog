import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_PRODUCTS, PROMO_CODES } from '../data/initialProducts';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import {
  fetchProductsFromSupabase,
  seedProductsToSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchOrdersFromSupabase,
  seedOrdersToSupabase,
  saveOrderToSupabase,
  updateOrderStatusInSupabase,
  subscribeToStoreChanges,
  formatProductFromDb,
  formatOrderFromDb
} from '../services/supabaseService';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const { currentUser, isAuthenticated, isAdmin, openAuthModal } = useAuth();

  // Role Mode: 'customer' | 'admin'
  const [role, setRoleState] = useState(() => {
    return localStorage.getItem('lumina_role') || 'customer';
  });

  const setRole = useCallback((newRole) => {
    if (newRole === 'admin' && !isAdmin) {
      openAuthModal({
        mode: 'signin',
        title: 'Atelier Administrator Access',
        subtitle: 'Please sign in with Maison Atelier administrator credentials to manage boutique operations.'
      });
      return;
    }
    setRoleState(newRole);
    localStorage.setItem('lumina_role', newRole);
  }, [isAdmin, openAuthModal]);

  // Auto revert from admin if logged out or customer
  useEffect(() => {
    if (role === 'admin' && !isAdmin) {
      setRoleState('customer');
      localStorage.setItem('lumina_role', 'customer');
    }
  }, [isAdmin, role]);

  // Customer View: 'catalog' | 'diagnostic'
  const [customerView, setCustomerView] = useState('catalog');

  // Active Gender Collection: 'Men' | 'Women'
  const [activeGender, setActiveGender] = useState(() => {
    return localStorage.getItem('valenszo_active_gender') || 'Men';
  });

  // Search, Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState("All Men's Creations");
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);

  const selectGenderCollection = (gender) => {
    setRole('customer');
    setActiveGender(gender);
    localStorage.setItem('valenszo_active_gender', gender);
    setSelectedCategory(gender === 'Men' ? "All Men's Creations" : "All Women's Creations");
    setCustomerView('catalog');
    setActiveProduct(null);
    try {
      const url = new URL(window.location);
      if (url.searchParams.has('product')) {
        url.searchParams.delete('product');
        window.history.pushState({}, '', url.toString());
      }
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDiagnostic = () => {
    setRole('customer');
    setCustomerView('diagnostic');
    setActiveProduct(null);
    try {
      const url = new URL(window.location);
      if (url.searchParams.has('product')) {
        url.searchParams.delete('product');
        window.history.pushState({}, '', url.toString());
      }
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCatalog = (category = null, gender = null) => {
    setRole('customer');
    setCustomerView('catalog');
    setActiveProduct(null);
    try {
      const url = new URL(window.location);
      if (url.searchParams.has('product')) {
        url.searchParams.delete('product');
        window.history.pushState({}, '', url.toString());
      }
    } catch (e) {}
    if (gender) {
      setActiveGender(gender);
      localStorage.setItem('valenszo_active_gender', gender);
    }
    const currentG = gender || activeGender;
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(currentG === 'Men' ? "All Men's Creations" : "All Women's Creations");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Active Tab: 'analytics' | 'products' | 'orders' | 'inventory'
  const [adminTab, setAdminTab] = useState('analytics');

  // Cloud Sync Status Indicator
  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured);
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(isSupabaseConfigured);

  // Products Data (Auto-purges old cache to load the full 345 VALENSZO portfolio)
  const [products, setProducts] = useState(() => {
    const version = localStorage.getItem('valenszo_catalog_version');
    const saved = localStorage.getItem('lumina_products');
    if (saved && version === 'v4_portfolio_345_authentic_images') {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 300) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    // Upgrade to 345 real fragrances with authentic individual bottle imagery
    localStorage.setItem('valenszo_catalog_version', 'v4_portfolio_345_authentic_images');
    localStorage.setItem('lumina_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  // Active Selected Product for Luxury Detail Page (PDP)
  const [activeProduct, setActiveProduct] = useState(null);

  const openProductDetail = useCallback((product) => {
    if (!product) return;
    setActiveProduct(product);
    setRole('customer');
    setCustomerView('product');

    // SPA history update without page reload
    try {
      const url = new URL(window.location);
      url.searchParams.set('product', product.id);
      window.history.pushState({ productId: product.id }, '', url.toString());
    } catch (e) {
      console.warn('History pushState skipped', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setRole]);

  const closeProductDetail = useCallback(() => {
    setActiveProduct(null);
    setCustomerView('catalog');
    try {
      const url = new URL(window.location);
      url.searchParams.delete('product');
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      console.warn('History pushState skipped', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Restore active product from URL on direct link or initial load
  useEffect(() => {
    if (!products || products.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId) {
      const found = products.find(p => p.id === productId || String(p.catalogNo) === productId);
      if (found) {
        setActiveProduct(found);
        setCustomerView('product');
        setRoleState('customer');
      }
    }
  }, [products]);

  // Handle browser Back / Forward buttons seamlessly (100% SPA navigation)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('product');
      if (productId && products.length > 0) {
        const found = products.find(p => p.id === productId || String(p.catalogNo) === productId);
        if (found) {
          setActiveProduct(found);
          setCustomerView('product');
          return;
        }
      }
      setActiveProduct(null);
      setCustomerView('catalog');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Cart Items with auto-sanitization for safe rendering
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('lumina_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clear cart if it had old non-fragrance categories
          if (parsed.some((p) => p.category === 'Audio' || p.category === 'Wearables')) {
            localStorage.removeItem('lumina_cart');
            return [];
          }
          // Sanitize every cart item: ensure numbers and image arrays exist
          return parsed.map((item) => {
            const firstImg = item.image || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80';
            const itemPrice = Number(item.price) || 150;
            const itemQty = Math.max(1, Number(item.quantity) || 1);
            return {
              ...item,
              price: itemPrice,
              quantity: itemQty,
              image: firstImg,
              images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [firstImg],
              selectedSize: item.selectedSize || item.size || '100 ml',
              cartItemId: item.cartItemId || `${item.id}-${item.selectedSize || 'std'}`
            };
          });
        }
        return [];
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
    return [];
  });

  // Orders Data (Real Supabase / persistent database sync - no fake mock orders)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('valenszo_real_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse saved orders', e);
      }
    }
    return [];
  });

  // Automatically filter orders belonging to the logged-in client
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    const cleanEmail = currentUser.email?.toLowerCase();
    const userId = currentUser.id;
    return orders.filter((o) => {
      const oEmail = (o.customer?.email || o.customer?.userEmail || '').toLowerCase();
      const oUserId = o.customer?.userId;
      return (cleanEmail && oEmail === cleanEmail) || (userId && oUserId === userId);
    });
  }, [orders, currentUser]);

  // Favorites (Wishlist)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('lumina_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved favorites', e);
      }
    }
    return ['prod-1', 'prod-3'];
  });

  // Promo Code
  const [appliedPromo, setAppliedPromo] = useState(null);

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Toast Helpers
  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Initial Cloud Load & Real-Time Sync ---
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsCloudConnected(false);
      setIsLoadingFromCloud(false);
      return;
    }

    let isMounted = true;

    const syncCloudData = async () => {
      setIsLoadingFromCloud(true);
      try {
        // 1. Products Sync
        const cloudProducts = await fetchProductsFromSupabase();
        if (cloudProducts !== null && isMounted) {
          const hasLegacy = cloudProducts.some((p) => p.sku?.startsWith('LUM-AUD') || p.category === 'Audio' || p.category === 'Wearables');
          if (cloudProducts.length === 0 || hasLegacy) {
            // Seed luxury perfume catalog to Supabase
            await seedProductsToSupabase(INITIAL_PRODUCTS);
            setProducts(INITIAL_PRODUCTS);
          } else {
            setProducts(cloudProducts);
          }
          setIsCloudConnected(true);
        }

        // 2. Orders Sync (Real database records only)
        const cloudOrders = await fetchOrdersFromSupabase();
        if (cloudOrders !== null && isMounted) {
          // Filter out any legacy audio orders if present
          const realOrders = cloudOrders.filter((o) => !o.items?.some((it) => it.category === 'Audio'));
          setOrders(realOrders);
          localStorage.setItem('valenszo_real_orders', JSON.stringify(realOrders));
        }
      } catch (err) {
        console.error('Supabase initial sync error:', err);
        if (isMounted) setIsCloudConnected(false);
      } finally {
        if (isMounted) setIsLoadingFromCloud(false);
      }
    };

    syncCloudData();

    // Subscribe to Postgres Real-Time Changes
    const unsubscribe = subscribeToStoreChanges(
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const updated = formatProductFromDb(payload.new);
          if (updated) {
            setProducts((prev) => {
              const idx = prev.findIndex((p) => p.id === updated.id);
              if (idx > -1) {
                const next = [...prev];
                next[idx] = updated;
                return next;
              }
              return [updated, ...prev];
            });
          }
        } else if (payload.eventType === 'DELETE' && payload.old?.id) {
          setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const updatedOrder = formatOrderFromDb(payload.new);
          if (updatedOrder) {
            setOrders((prev) => {
              const idx = prev.findIndex((o) => o.id === updatedOrder.id);
              if (idx > -1) {
                const next = [...prev];
                next[idx] = updatedOrder;
                return next;
              }
              return [updatedOrder, ...prev];
            });
          }
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // --- Local Storage Backup Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('lumina_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('lumina_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lumina_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lumina_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // --- Cart Calculations ---
  const cartSubtotal = cart.reduce((sum, item) => {
    const p = Number(item.price) || 0;
    const q = Number(item.quantity) || 1;
    return sum + (p * q);
  }, 0);
  const cartItemCount = cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  const cartTotalItems = cartItemCount;
  const freeShippingThreshold = 150;
  const standardShippingFee = 15;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0;
  const cartShipping = isFreeShipping ? 0 : standardShippingFee;
  
  const discountPercent = appliedPromo ? (Number(appliedPromo.discountPercent) || 0) : 0;
  const cartDiscountAmount = (cartSubtotal * discountPercent) / 100;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscountAmount + cartShipping);

  // --- Cart Actions ---
  const addToCart = (product, arg2 = 1, arg3 = null, arg4 = null, arg5 = null) => {
    if (!product) return false;

    let quantity = 1;
    let selectedSize = '100 ml';
    let engravingText = null;
    let overridePrice = null;

    if (typeof arg2 === 'number') {
      quantity = Math.max(1, Math.round(arg2) || 1);
      selectedSize = typeof arg3 === 'string' ? arg3 : (product.sizes?.[0]?.label || '100 ml');
      engravingText = typeof arg4 === 'string' ? arg4 : null;
      overridePrice = typeof arg5 === 'number' ? arg5 : null;
    } else if (typeof arg2 === 'string') {
      selectedSize = arg2;
      quantity = typeof arg3 === 'number' ? Math.max(1, arg3) : 1;
      engravingText = typeof arg4 === 'string' ? arg4 : null;
      overridePrice = typeof arg5 === 'number' ? arg5 : null;
    }

    const price = typeof overridePrice === 'number' ? overridePrice : (Number(product.price) || 0);
    const cartItemId = `${product.id}-${selectedSize}-${engravingText || 'std'}`;
    const firstImg = (Array.isArray(product.images) && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80';
    const imagesList = Array.isArray(product.images) && product.images.length > 0 ? product.images : [firstImg];
    const maxStock = typeof product.stock === 'number' ? product.stock : 99;

    if (maxStock <= 0) {
      showToast(`${product.name} is currently out of stock!`, 'error');
      return false;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId || (item.id === product.id && item.selectedSize === selectedSize));
      if (existingIndex > -1) {
        const currentQty = Number(prevCart[existingIndex].quantity) || 1;
        const newQty = Math.min(maxStock, currentQty + quantity);
        if (newQty === currentQty && maxStock > 0) {
          showToast(`Maximum stock limit (${maxStock}) reached for this item`, 'info');
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            price: price,
            originalPrice: product.originalPrice || price,
            image: firstImg,
            images: imagesList,
            size: selectedSize,
            selectedSize: selectedSize,
            engravingText: engravingText,
            category: product.category,
            quantity: Math.min(maxStock, quantity),
            maxStock: maxStock
          }
        ];
      }
    });

    showToast(`Added ${quantity}x "${product.name}" to bag`, 'success');
    return true;
  };

  const updateCartQuantity = (idOrCartItemId, newQty, optionalSize = null) => {
    const qty = Number(newQty);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(idOrCartItemId, optionalSize);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        const isMatch = item.cartItemId === idOrCartItemId || 
                        (item.id === idOrCartItemId && (!optionalSize || item.selectedSize === optionalSize));
        if (isMatch) {
          const clampedQty = Math.min(item.maxStock || 99, qty);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (idOrCartItemId, optionalSize = null) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => 
        i.cartItemId === idOrCartItemId || 
        (i.id === idOrCartItemId && (!optionalSize || i.selectedSize === optionalSize))
      );
      if (item) {
        showToast(`Removed "${item.name}" from bag`, 'info');
      }
      return prevCart.filter((i) => 
        !(i.cartItemId === idOrCartItemId || 
          (i.id === idOrCartItemId && (!optionalSize || i.selectedSize === optionalSize)))
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code) => {
    const formatted = code.trim().toUpperCase();
    const promo = Array.isArray(PROMO_CODES)
      ? PROMO_CODES.find((p) => p.code === formatted)
      : PROMO_CODES[formatted];

    if (promo) {
      setAppliedPromo({
        code: formatted,
        discountPercent: promo.discountPercent,
        description: promo.description
      });
      showToast(`Promo "${formatted}" applied! (${promo.discountPercent}% off)`, 'success');
      return true;
    } else {
      showToast(`Invalid promo code "${code}". Try "VALENSZO25" or "VALENSZO10"`, 'error');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // --- Favorites / Wishlist Actions ---
  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      const product = products.find((p) => p.id === productId);
      const productName = product ? product.name : 'Item';
      if (isFav) {
        showToast(`Removed "${productName}" from wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${productName}" to wishlist`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId) => favorites.includes(productId);

  // --- Orders Actions (Cloud + Local) ---
  const placeOrder = async (customerOrOrderData, paymentMethodParam) => {
    if (cart.length === 0) {
      showToast('Cannot checkout with an empty cart!', 'error');
      return null;
    }

    let customerData = customerOrOrderData;
    let paymentMethod = paymentMethodParam || 'credit-card';

    if (customerOrOrderData && customerOrOrderData.customer) {
      customerData = customerOrOrderData.customer;
      paymentMethod = customerOrOrderData.paymentMethod || paymentMethodParam || 'credit-card';
    }

    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${orderNumber}`;
    const trackingNumber = `TRK-VAL-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const customerWithUser = {
      ...customerData,
      userId: currentUser?.id || 'guest',
      userEmail: currentUser?.email || customerData.email || ''
    };

    const newOrder = {
      id: orderId,
      customer: customerWithUser,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscountAmount,
      discountCode: appliedPromo ? appliedPromo.code : '',
      shipping: cartShipping,
      total: cartTotal,
      status: 'Pending',
      paymentMethod,
      placedAt: new Date().toISOString(),
      trackingNumber
    };

    // 1. Deduct stock in memory and Supabase
    const updatedProducts = products.map((prod) => {
      const orderedItem = cart.find((item) => item.id === prod.id);
      if (orderedItem) {
        const updated = {
          ...prod,
          stock: Math.max(0, prod.stock - orderedItem.quantity)
        };
        saveProductToSupabase(updated);
        return updated;
      }
      return prod;
    });

    setProducts(updatedProducts);
    setOrders((prev) => {
      const updatedOrders = [newOrder, ...prev];
      localStorage.setItem('valenszo_real_orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });

    // 2. Save order to Supabase
    saveOrderToSupabase(newOrder);

    // 3. Clear cart & promo
    clearCart();
    setIsCheckoutOpen(false);

    showToast(`Order ${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const deliveredAt = newStatus === 'Delivered' ? new Date().toISOString() : null;

    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status: newStatus };
          if (deliveredAt && !ord.deliveredAt) {
            updated.deliveredAt = deliveredAt;
          }
          return updated;
        }
        return ord;
      })
    );

    // Update in Supabase
    updateOrderStatusInSupabase(orderId, newStatus, deliveredAt);
    showToast(`Order ${orderId} updated to "${newStatus}"`, 'info');
  };

  // --- Product CRUD (Admin Operations Cloud + Local) ---
  const addProduct = async (productData) => {
    const id = `prod-${Date.now()}`;
    const newProduct = {
      id,
      sku: productData.sku || `LUM-${Date.now().toString().slice(-4)}`,
      name: productData.name,
      category: productData.category || 'Accessories',
      tagline: productData.tagline || '',
      description: productData.description || '',
      price: parseFloat(productData.price) || 0,
      originalPrice: parseFloat(productData.originalPrice) || parseFloat(productData.price) || 0,
      discountPercent: productData.discountPercent || 0,
      stock: parseInt(productData.stock, 10) || 0,
      rating: parseFloat(productData.rating) || 5.0,
      reviewsCount: parseInt(productData.reviewsCount, 10) || 0,
      badge: productData.badge || '',
      isFeatured: !!productData.isFeatured,
      colors: productData.colors && productData.colors.length > 0 ? productData.colors : [{ name: 'Standard', hex: '#6366f1' }],
      features: productData.features || ['Premium Aerospace Materials', '1-Year Manufacturer Warranty'],
      specs: productData.specs || { 'Standard Warranty': '1 Year' },
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80']
    };

    setProducts((prev) => [newProduct, ...prev]);
    saveProductToSupabase(newProduct);

    showToast(`Product "${newProduct.name}" added to catalog`, 'success');
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  const updateProduct = async (productId, updatedData) => {
    let savedProd = null;

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          savedProd = {
            ...prod,
            ...updatedData,
            price: parseFloat(updatedData.price) || prod.price,
            originalPrice: parseFloat(updatedData.originalPrice) || prod.originalPrice,
            stock: parseInt(updatedData.stock, 10) ?? prod.stock
          };
          return savedProd;
        }
        return prod;
      })
    );

    if (savedProd) {
      saveProductToSupabase(savedProd);
    }

    showToast(`Product updated successfully`, 'success');
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  const deleteProduct = async (productId) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromSupabase(productId);
    showToast(`Product "${prod?.name || productId}" deleted`, 'info');
  };

  const restockProduct = async (productId, amount = 10) => {
    let target = null;
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const newStock = prod.stock + amount;
          target = { ...prod, stock: newStock };
          return target;
        }
        return prod;
      })
    );

    if (target) {
      saveProductToSupabase(target);
    }

    showToast(`Restocked +${amount} units`, 'success');
  };

  // --- Reset to Demo Data ---
  const resetToDemoData = async () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setFavorites(['prod-1', 'prod-3']);
    setAppliedPromo(null);
    localStorage.removeItem('lumina_products');
    localStorage.removeItem('lumina_orders');
    localStorage.removeItem('lumina_cart');
    localStorage.removeItem('lumina_favorites');

    if (isSupabaseConfigured) {
      await seedProductsToSupabase(INITIAL_PRODUCTS);
      await seedOrdersToSupabase(INITIAL_ORDERS);
    }

    showToast('Reset store to default factory demo data', 'info');
  };

  // --- Computed Filtered Products for Customer Catalog ---
  const filteredProducts = products.filter((product) => {
    // 1. Gender Collection Filter
    const isMen = product.id?.startsWith('vlz-men') || product.sku?.startsWith('VLZ-M') || product.category === 'Pour Homme';
    const isWomen = product.id?.startsWith('vlz-women') || product.sku?.startsWith('VLZ-W') || product.category === 'Pour Femme';

    if (activeGender === 'Men' && !isMen) return false;
    if (activeGender === 'Women' && !isWomen) return false;

    // 2. Category / Cluster Filter within that gender
    const cat = selectedCategory || 'All';
    const isAll = 
      cat === 'All' || 
      cat === 'All Creations' || 
      cat === "All Men's Creations" || 
      cat === "All Women's Creations" ||
      (typeof cat === 'string' && cat.startsWith('All'));

    if (!isAll && typeof cat === 'string') {
      if (cat.includes('Tier S')) {
        if (product.tier !== 'S') return false;
      } else if (cat.includes('Tier A')) {
        if (product.tier !== 'A') return false;
      } else if (
        product.character !== cat &&
        product.olfactoryFamily !== cat &&
        product.category !== cat &&
        !product.traits?.some((t) => t?.toLowerCase() === cat.toLowerCase())
      ) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name?.toLowerCase().includes(q);
      const matchBrand = product.brandInspiration?.toLowerCase().includes(q);
      const matchListing = product.originalListing?.toLowerCase().includes(q);
      const matchDesc = product.description?.toLowerCase().includes(q);
      const matchCategory = product.category?.toLowerCase().includes(q);
      const matchCharacter = product.character?.toLowerCase().includes(q);
      const matchTraits = product.traits?.some((t) => t.toLowerCase().includes(q));
      const matchSku = product.sku?.toLowerCase().includes(q);
      const matchNo = String(product.catalogNo) === q || `no. ${product.catalogNo}` === q || `no ${product.catalogNo}` === q || `#${product.catalogNo}` === q;
      if (!matchName && !matchBrand && !matchListing && !matchDesc && !matchCategory && !matchCharacter && !matchTraits && !matchSku && !matchNo) {
        return false;
      }
    }

    if (inStockOnly && product.stock <= 0) {
      return false;
    }

    if (product.price > maxPrice) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // Default sort: Tier S first, then Tier A, then Catalog No
    const tierWeight = { 'S': 3, 'A': 2, 'B': 1, 'C': 0 };
    const diffTier = (tierWeight[b.tier] || 0) - (tierWeight[a.tier] || 0);
    if (diffTier !== 0) return diffTier;
    return (a.catalogNo || 0) - (b.catalogNo || 0);
  });

  // --- Admin KPI Analytics Data ---
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // --- Dynamic Live Category Counts ---
  const menCount = useMemo(() => {
    return products.filter((p) => p.id?.startsWith('vlz-men') || p.sku?.startsWith('VLZ-M') || p.category === 'Pour Homme').length;
  }, [products]);

  const womenCount = useMemo(() => {
    return products.filter((p) => p.id?.startsWith('vlz-women') || p.sku?.startsWith('VLZ-W') || p.category === 'Pour Femme').length;
  }, [products]);

  return (
    <StoreContext.Provider
      value={{
        // Role & Tabs & Views
        role,
        setRole,
        customerView,
        setCustomerView,
        activeProduct,
        setActiveProduct,
        openProductDetail,
        closeProductDetail,
        activeGender,
        setActiveGender,
        selectGenderCollection,
        menCount,
        womenCount,
        navigateToDiagnostic,
        navigateToCatalog,
        adminTab,
        setAdminTab,

        // Cloud & Connection State
        isCloudConnected,
        isLoadingFromCloud,

        // Products
        products,
        filteredProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,

        // Filters & Search
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        maxPrice,
        setMaxPrice,

        // Cart
        cart,
        cartSubtotal,
        cartItemCount,
        cartTotalItems,
        cartShipping,
        cartDiscountAmount,
        cartTotal,
        freeShippingThreshold,
        isFreeShipping,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,

        // Promo
        appliedPromo,
        applyPromoCode,
        removePromoCode,

        // Wishlist
        favorites,
        toggleFavorite,
        isFavorite,

        // Orders
        orders,
        userOrders,
        placeOrder,
        createOrder: placeOrder,
        updateOrderStatus,

        // Admin KPIs
        totalRevenue,
        totalOrdersCount,
        pendingOrdersCount,
        lowStockCount,
        outOfStockCount,
        averageOrderValue,

        // UI Modals
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductModal,
        setSelectedProductModal,
        isProductFormOpen,
        setIsProductFormOpen,
        editingProduct,
        setEditingProduct,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        viewingOrder,
        setViewingOrder,

        // Toasts
        toasts,
        showToast,
        removeToast,

        // Dev Utilities
        resetToDemoData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
