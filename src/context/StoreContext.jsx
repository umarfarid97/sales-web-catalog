import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { PROMO_CODES } from '../data/initialProducts';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import {
  fetchProductsFromSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchOrdersFromSupabase,
  createAtomicOrderInSupabase,
  updateOrderStatusInSupabase,
  updateOrderDispatchInSupabase,
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
  const { currentUser, isAdmin, openAuthModal } = useAuth();

  // Role Mode: 'customer' | 'admin'
  const [role, setRoleState] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('admin')) {
      return 'admin';
    }
    return localStorage.getItem('valenszo_role') || localStorage.getItem('lumina_role') || 'customer';
  });

  const setRole = useCallback((newRole) => {
    if (newRole === 'admin') {
      if (!isAdmin) {
        openAuthModal({
          mode: 'signin',
          title: 'Store Admin Access',
          subtitle: 'Please sign in with administrator credentials to manage store operations.'
        });
        return;
      }
      setRoleState('admin');
      localStorage.setItem('valenszo_role', 'admin');
      if (typeof window !== 'undefined' && !window.location.pathname.toLowerCase().includes('admin')) {
        window.location.href = '/admin';
      }
      return;
    }
    setRoleState('customer');
    localStorage.setItem('valenszo_role', 'customer');
    if (typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('admin')) {
      window.location.href = '/';
    }
  }, [isAdmin, openAuthModal]);

  // Auto revert from admin if logged out or unauthorized
  useEffect(() => {
    if (role === 'admin' && !isAdmin) {
      setRoleState('customer');
      localStorage.setItem('valenszo_role', 'customer');
    }
  }, [isAdmin, role]);

  // Customer View: 'catalog' | 'diagnostic'
  const [customerView, setCustomerView] = useState('catalog');

  // Active Gender Collection: 'Men' | 'Women'
  const [activeGender, setActiveGender] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('women')) return 'Women';
      if (path.includes('men.html') || path.endsWith('/men') || path === '/men') return 'Men';
      const params = new URLSearchParams(window.location.search);
      const g = params.get('gender');
      if (g) return g;
    }
    return localStorage.getItem('valenszo_active_gender') || 'Women';
  });

  // Search, Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState("All Men's Perfumes");
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);

  const selectGenderCollection = (gender) => {
    const isMen = gender === 'Men';
    localStorage.setItem('valenszo_active_gender', gender);
    if (typeof window !== 'undefined') {
      window.location.href = isMen ? '/men' : '/women';
    }
  };

  const navigateToDiagnostic = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/diagnostic';
      return;
    }
    setRole('customer');
    setCustomerView('diagnostic');
    setActiveProduct(null);
  };

  const navigateToCatalog = (category = null, gender = null) => {
    const targetGender = gender || activeGender;
    if (typeof window !== 'undefined') {
      if (targetGender === 'Men') {
        window.location.href = category ? `/men?category=${encodeURIComponent(category)}` : '/men';
        return;
      }
      if (targetGender === 'Women') {
        window.location.href = category ? `/women?category=${encodeURIComponent(category)}` : '/women';
        return;
      }
      window.location.href = '/collection';
      return;
    }
    setRole('customer');
    setCustomerView('catalog');
  };

  // Admin Active Tab: 'analytics' | 'products' | 'orders' | 'inventory'
  const [adminTab, setAdminTab] = useState('analytics');

  // Cloud Sync Status Indicator
  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured);
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(isSupabaseConfigured);

  // Products Data (Loaded dynamically from Supabase PostgreSQL public.products)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('valenszo_products_cache') || localStorage.getItem('lumina_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((p) => p && typeof p === 'object' && typeof p.id === 'string' && p.id.trim());
          if (valid.length > 0) {
            return valid;
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse cached products', e);
      try {
        localStorage.removeItem('valenszo_products_cache');
        localStorage.removeItem('lumina_products');
      } catch {
        // Ignore storage clear failure
      }
    }
    return [];
  });

  // Active Selected Product for Luxury Detail Page (PDP)
  const [activeProduct, setActiveProduct] = useState(null);

  const openProductDetail = useCallback((product) => {
    if (!product) return;
    const targetId = typeof product === 'string' ? product : product.id;
    // Multi-Page Application (MPA) full browser page navigation with Clean URL
    window.location.href = `/product?product=${encodeURIComponent(targetId)}`;
  }, []);

  const closeProductDetail = useCallback(() => {
    const isProductPage = typeof window !== 'undefined' && (window.location.pathname.includes('product.html') || window.location.pathname.includes('/product'));
    if (isProductPage) {
      window.location.href = '/';
      return;
    }
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

  // Helper to match a product by id, sku, catalog number, name or slug using strict multi-pass priority
  const findProductMatch = useCallback((targetId, list, targetGender = null) => {
    if (!targetId || !Array.isArray(list) || list.length === 0) return null;
    const clean = decodeURIComponent(String(targetId)).trim().toLowerCase();
    if (!clean) return null;

    // Pass 1: Strict exact ID match across catalog (e.g. 'vlz-men-79')
    let match = list.find((p) => p && p.id && String(p.id).trim().toLowerCase() === clean);
    if (match) return match;

    // Pass 2: Strict exact SKU match across catalog (e.g. 'vlz-m-79')
    match = list.find((p) => p && p.sku && String(p.sku).trim().toLowerCase() === clean);
    if (match) return match;

    // Pass 3: Strict exact Name match
    match = list.find((p) => p && p.name && String(p.name).trim().toLowerCase() === clean);
    if (match) return match;

    // Pass 4: Detect gender hint from parameter or targetId string
    const detectedGender = targetGender || (
      (clean.includes('men') && !clean.includes('women')) ? 'Men' :
      clean.includes('women') ? 'Women' : null
    );

    if (detectedGender) {
      const genderList = list.filter((p) => p && p.gender && p.gender.toLowerCase() === detectedGender.toLowerCase());
      // Match ID, SKU, Name or clean slug within gender
      match = genderList.find((p) => 
        (p.id && String(p.id).trim().toLowerCase() === clean) ||
        (p.sku && String(p.sku).trim().toLowerCase() === clean) ||
        (p.name && String(p.name).trim().toLowerCase() === clean)
      );
      if (match) return match;

      // Match catalog number within same gender
      const cleanDigits = clean.replace(/\D/g, '');
      if (cleanDigits) {
        match = genderList.find((p) => 
          (p.catalogNo !== undefined && String(p.catalogNo) === cleanDigits) ||
          (p.specs?.catalogNo !== undefined && String(p.specs.catalogNo) === cleanDigits)
        );
        if (match) return match;
      }
    }

    // Pass 5: Pure numeric digits match ONLY if the query itself is purely numeric (e.g. "79")
    if (/^\d+$/.test(clean)) {
      match = list.find((p) => 
        (p.catalogNo !== undefined && String(p.catalogNo) === clean) ||
        (p.specs?.catalogNo !== undefined && String(p.specs.catalogNo) === clean)
      );
      if (match) return match;
    }

    // Pass 6: Fallback partial name contains
    match = list.find((p) => p && p.name && String(p.name).toLowerCase().includes(clean));
    if (match) return match;

    return null;
  }, []);

  // Restore active product or URL parameters on page load
  useEffect(() => {
    if (!products || products.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    const genderParam = params.get('gender');
    const categoryParam = params.get('category');
    const viewParam = params.get('view');
    const isProductPage = typeof window !== 'undefined' && (window.location.pathname.includes('product.html') || window.location.pathname.includes('/product'));

    const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    const detectedGender = genderParam || (path.includes('women') ? 'Women' : (path.includes('men.html') || path.endsWith('/men') || path === '/men') ? 'Men' : null);

    if (detectedGender) {
      setActiveGender(detectedGender);
      localStorage.setItem('valenszo_active_gender', detectedGender);
      if (!categoryParam) {
        setSelectedCategory(detectedGender === 'Men' ? "All Men's Perfumes" : "All Women's Perfumes");
      }
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    if (viewParam === 'diagnostic') {
      setCustomerView('diagnostic');
    }

    if (productId) {
      const found = findProductMatch(productId, products, detectedGender);
      if (found) {
        setActiveProduct(found);
        setCustomerView('product');
        setRoleState('customer');
      }
    } else if (isProductPage && products.length > 0) {
      // Default to flagship creation if on product page without parameter
      setActiveProduct(products[0]);
    }
  }, [products, findProductMatch]);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('product');
      const viewParam = params.get('view');
      if (productId && products.length > 0) {
        const found = findProductMatch(productId, products);
        if (found) {
          setActiveProduct(found);
          setCustomerView('product');
          return;
        }
      }
      if (viewParam === 'diagnostic') {
        setActiveProduct(null);
        setCustomerView('diagnostic');
        return;
      }
      setActiveProduct(null);
      setCustomerView('catalog');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products, findProductMatch]);

  // Cart Items with auto-sanitization for safe rendering
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('valenszo_cart') || localStorage.getItem('lumina_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clear cart if it had old non-fragrance categories
          if (parsed.some((p) => p.category === 'Audio' || p.category === 'Wearables')) {
            localStorage.removeItem('valenszo_cart');
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
    const saved = localStorage.getItem('valenszo_real_orders') || localStorage.getItem('valenszo_orders');
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
    const saved = localStorage.getItem('valenszo_favorites') || localStorage.getItem('lumina_favorites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter((id) => typeof id === 'string' && id.trim());
      } catch (e) {
        console.error('Failed to parse saved favorites', e);
      }
    }
    return ['vlz-men-01', 'vlz-wom-01'];
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

  // Toast Helpers: Enforce single active notification & prevent duplicate stacking
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    if (!message) return;
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => {
      // Prevent duplicate identical messages from stacking
      if (prev.some((t) => t.message === message)) {
        return prev;
      }
      // Keep only single active toast at a time to prevent blocking any UI controls
      return [{ id, message, type }];
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Automatically clear bag toasts when Cart Drawer opens so the drawer footer/checkout is 100% unobstructed
  useEffect(() => {
    if (isCartOpen) {
      setToasts((prev) => prev.filter((t) => !t.message.toLowerCase().includes('bag')));
    }
  }, [isCartOpen]);

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
        // 1. Products Sync directly from Supabase PostgreSQL
        const cloudProducts = await fetchProductsFromSupabase();
        if (cloudProducts !== null && isMounted && cloudProducts.length > 0) {
          setProducts(cloudProducts);
          localStorage.setItem('valenszo_products_cache', JSON.stringify(cloudProducts));
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
    localStorage.setItem('valenszo_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('valenszo_products_cache', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('valenszo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('valenszo_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('valenszo_favorites', JSON.stringify(favorites));
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
  const backupCartForCheckout = () => {
    try {
      if (cart && cart.length > 0) {
        sessionStorage.setItem('valenszo_pending_checkout_cart', JSON.stringify(cart));
      }
    } catch (e) {
      console.warn('Cart snapshot error:', e);
    }
  };

  const placeOrder = async (customerOrOrderData, paymentMethodParam, options = {}) => {
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

    const isSilent = options.silent || customerOrOrderData?.silent || false;
    const isGateway = paymentMethod === 'fpx' || paymentMethod === 'credit-card';
    const initialStatus = isGateway ? 'Pending Payment' : 'Pending';
    const initialPaymentStatus = isGateway ? 'Unpaid' : 'Pending';

    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${orderNumber}`;
    // Tracking numbers are defined by the courier upon Admin dispatch, NOT auto-generated by the system
    const trackingNumber = '';
    const courierName = '';

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
      status: initialStatus,
      paymentStatus: initialPaymentStatus,
      paymentMethod,
      placedAt: new Date().toISOString(),
      trackingNumber,
      courierName,
      dispatchedAt: null
    };

    // 1. Snapshot cart into sessionStorage so it is preserved if payment fails/cancels
    backupCartForCheckout();

    // 2. Save order atomically to Supabase with row locking and stock deduction
    createAtomicOrderInSupabase(newOrder).catch((err) => {
      console.warn('Atomic order placement fallback:', err);
    });

    // 3. Optimistic local stock update
    const updatedProducts = products.map((prod) => {
      const orderedItem = cart.find((item) => item.id === prod.id);
      if (orderedItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - orderedItem.quantity)
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    setOrders((prev) => {
      const updatedOrders = [newOrder, ...prev];
      localStorage.setItem('valenszo_real_orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });

    // 4. For gateway payments (ToyyibPay FPX / Cards), DO NOT show premature confirmation toast!
    // Confirmation toast & cart clearing only happen once payment succeeds.
    if (!isSilent && !isGateway) {
      clearCart();
      setIsCheckoutOpen(false);
      showToast(`Order ${orderId} received! We are preparing your order.`, 'success');
    }

    return newOrder;
  };

  const confirmOrderPayment = async (orderId, details = {}) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'Processing',
            paymentStatus: 'Paid',
            billCode: details.billCode || ord.billCode,
            transactionId: details.transactionId || ord.transactionId,
            paidAt: new Date().toISOString()
          };
        }
        return ord;
      });
      localStorage.setItem('valenszo_real_orders', JSON.stringify(updated));
      return updated;
    });

    // Update in Supabase
    updateOrderStatusInSupabase(orderId, 'Processing').catch(console.warn);

    // Clear cart and backup once payment is confirmed
    clearCart();
    try {
      sessionStorage.removeItem('valenszo_pending_checkout_cart');
    } catch (e) {}
  };

  const cancelOrderAndRestoreStock = async (orderId) => {
    const savedOrders = JSON.parse(localStorage.getItem('valenszo_real_orders') || '[]');
    const orderToCancel = savedOrders.find((o) => o.id === orderId);

    // 1. Mark order as Payment Failed / Cancelled
    setOrders((prevOrders) => {
      const updated = prevOrders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'Cancelled',
            paymentStatus: 'Failed',
            cancelledAt: new Date().toISOString()
          };
        }
        return ord;
      });
      localStorage.setItem('valenszo_real_orders', JSON.stringify(updated));
      return updated;
    });
    updateOrderStatusInSupabase(orderId, 'Cancelled').catch(console.warn);

    // 2. Restore local stock
    if (orderToCancel && Array.isArray(orderToCancel.items)) {
      setProducts((prevProducts) =>
        prevProducts.map((prod) => {
          const orderedItem = orderToCancel.items.find((item) => (item.productId && item.productId === prod.id) || item.id === prod.id);
          if (orderedItem) {
            return {
              ...prod,
              stock: prod.stock + (Number(orderedItem.quantity) || 1)
            };
          }
          return prod;
        })
      );
    }

    // 3. Restore cart from session snapshot if current cart is empty
    try {
      const savedCart = sessionStorage.getItem('valenszo_pending_checkout_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
          localStorage.setItem('valenszo_real_cart', JSON.stringify(parsed));
        }
      }
    } catch (err) {
      console.warn('Could not restore cart from snapshot:', err);
    }
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

  const dispatchOrder = async (orderId, { trackingNumber, courierName = 'J&T Express' }) => {
    const cleanTracking = (trackingNumber || '').trim();
    const cleanCourier = (courierName || 'J&T Express').trim();
    const dispatchedAt = new Date().toISOString();

    setOrders((prevOrders) => {
      const updated = prevOrders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'Shipped',
            trackingNumber: cleanTracking,
            courierName: cleanCourier,
            dispatchedAt
          };
        }
        return ord;
      });
      localStorage.setItem('valenszo_real_orders', JSON.stringify(updated));
      return updated;
    });

    // Update in Supabase
    updateOrderDispatchInSupabase(orderId, {
      trackingNumber: cleanTracking,
      courierName: cleanCourier,
      status: 'Shipped',
      dispatchedAt
    }).catch(console.warn);

    showToast(`Order ${orderId} dispatched via ${cleanCourier}! Tracking: ${cleanTracking}`, 'success');
  };

  const updateOrderTracking = async (orderId, { trackingNumber, courierName }) => {
    const cleanTracking = (trackingNumber || '').trim();
    const cleanCourier = (courierName || '').trim();

    setOrders((prevOrders) => {
      const updated = prevOrders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            trackingNumber: cleanTracking,
            courierName: cleanCourier || ord.courierName || 'Standard Express'
          };
        }
        return ord;
      });
      localStorage.setItem('valenszo_real_orders', JSON.stringify(updated));
      return updated;
    });

    // Update in Supabase
    updateOrderDispatchInSupabase(orderId, {
      trackingNumber: cleanTracking,
      courierName: cleanCourier,
      status: 'Shipped'
    }).catch(console.warn);

    showToast(`Order ${orderId} courier tracking updated!`, 'info');
  };

  // --- Product CRUD (Admin Operations Cloud + Local) ---
  const addProduct = async (productData) => {
    const id = `vlz-custom-${Date.now()}`;
    const newProduct = {
      id,
      sku: productData.sku || `VAL-C-${Date.now().toString().slice(-4)}`,
      name: productData.name,
      category: productData.category || 'Woody & Smoky',
      tagline: productData.tagline || '',
      description: productData.description || '',
      price: parseFloat(productData.price) || 45,
      originalPrice: parseFloat(productData.originalPrice) || parseFloat(productData.price) || 55,
      discountPercent: productData.discountPercent || 0,
      stock: parseInt(productData.stock, 10) || 15,
      rating: parseFloat(productData.rating) || 4.95,
      reviewsCount: parseInt(productData.reviewsCount, 10) || 12,
      badge: productData.badge || 'New Release',
      isFeatured: !!productData.isFeatured,
      concentration: productData.concentration || 'Extrait de Parfum (30%)',
      pyramid: productData.pyramid || {
        topNotes: ['Calabrian Bergamot', 'Spiced Saffron'],
        heartNotes: ['Damascena Rose', 'French Lavender'],
        baseNotes: ['Royal Woods', 'Bourbon Vanilla']
      },
      sizes: productData.sizes || [
        { label: '30 ml Travel Spray', ml: 30, priceMultiplier: 0.55 },
        { label: '50 ml Bottle', ml: 50, priceMultiplier: 0.78 },
        { label: '100 ml Bottle', ml: 100, priceMultiplier: 1.0 }
      ],
      features: productData.features || ['Valenszo Luxury Perfume', 'Eco-Friendly Refillable Bottle'],
      specs: productData.specs || { concentration: 'Extrait de Parfum (30%)', longevity: '14+ Hours' },
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80']
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

  // --- Refresh Database Sync ---
  const resetToDemoData = async () => {
    setCart([]);
    setFavorites(['vlz-men-01', 'vlz-wom-01']);
    setAppliedPromo(null);
    localStorage.removeItem('valenszo_cart');
    localStorage.removeItem('valenszo_favorites');
    localStorage.removeItem('lumina_cart');
    localStorage.removeItem('lumina_favorites');

    if (isSupabaseConfigured) {
      const freshProducts = await fetchProductsFromSupabase();
      if (freshProducts && freshProducts.length > 0) {
        setProducts(freshProducts);
        localStorage.setItem('valenszo_products_cache', JSON.stringify(freshProducts));
      }
      const freshOrders = await fetchOrdersFromSupabase();
      if (freshOrders) {
        setOrders(freshOrders);
        localStorage.setItem('valenszo_real_orders', JSON.stringify(freshOrders));
      }
    }

    showToast('Catalog and orders synchronized with live database', 'info');
  };

  // --- Computed Filtered Products for Customer Catalog (Crash-proof) ---
  const filteredProducts = (products || []).filter((product) => {
    if (!product || typeof product !== 'object' || !product.id) return false;

    // 1. Gender Collection Filter
    const pId = String(product.id || '');
    const pSku = String(product.sku || '');
    const isMen = pId.startsWith('vlz-men') || pSku.startsWith('VLZ-M') || product.category === 'Pour Homme' || product.gender === 'Men';
    const isWomen = pId.startsWith('vlz-women') || pId.startsWith('vlz-wom') || pSku.startsWith('VLZ-W') || product.category === 'Pour Femme' || product.gender === 'Women';

    if (activeGender === 'Men' && !isMen) return false;
    if (activeGender === 'Women' && !isWomen) return false;

    // 2. Category / Cluster Filter within that gender
    const cat = selectedCategory || 'All';
    const isAll = 
      !cat || 
      cat === 'All' || 
      cat === 'All Perfumes' ||
      cat === "All Men's Perfumes" ||
      cat === "All Women's Perfumes" ||
      cat === 'All Creations' || 
      cat === "All Men's Creations" || 
      cat === "All Women's Creations" ||
      (typeof cat === 'string' && cat.startsWith('All'));

    if (!isAll && typeof cat === 'string') {
      const catLower = cat.toLowerCase();
      if (cat.includes('Tier S')) {
        if (product.tier !== 'S') return false;
      } else if (cat.includes('Tier A')) {
        if (product.tier !== 'A') return false;
      } else if (
        product.character !== cat &&
        product.olfactoryFamily !== cat &&
        product.category !== cat &&
        !(Array.isArray(product.traits) && product.traits.some((t) => typeof t === 'string' && t.toLowerCase() === catLower))
      ) {
        return false;
      }
    }

    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = String(product.name || '').toLowerCase().includes(q);
      const matchBrand = String(product.brandInspiration || '').toLowerCase().includes(q);
      const matchListing = String(product.originalListing || '').toLowerCase().includes(q);
      const matchDesc = String(product.description || '').toLowerCase().includes(q);
      const matchCategory = String(product.category || '').toLowerCase().includes(q);
      const matchCharacter = String(product.character || '').toLowerCase().includes(q);
      const matchTraits = Array.isArray(product.traits) && product.traits.some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
      const matchSku = String(product.sku || '').toLowerCase().includes(q);
      const matchNo = String(product.catalogNo) === q || `no. ${product.catalogNo}` === q || `no ${product.catalogNo}` === q || `#${product.catalogNo}` === q;
      if (!matchName && !matchBrand && !matchListing && !matchDesc && !matchCategory && !matchCharacter && !matchTraits && !matchSku && !matchNo) {
        return false;
      }
    }

    if (inStockOnly && (Number(product.stock) || 0) <= 0) {
      return false;
    }

    if ((Number(product.price) || 0) > maxPrice) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (!a || !b) return 0;
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return (Number(b.rating) || 5) - (Number(a.rating) || 5);
    if (sortBy === 'name') {
      const nameA = String(a.name || '');
      const nameB = String(b.name || '');
      return nameA.localeCompare(nameB);
    }
    // Default sort: Tier S first, then Tier A, then Catalog No
    const tierWeight = { 'S': 3, 'A': 2, 'B': 1, 'C': 0 };
    const diffTier = (tierWeight[b.tier] || 0) - (tierWeight[a.tier] || 0);
    if (diffTier !== 0) return diffTier;
    return (Number(a.catalogNo) || 0) - (Number(b.catalogNo) || 0);
  });

  // --- Admin KPI Analytics Data (Safe) ---
  const totalRevenue = (orders || []).reduce((sum, ord) => sum + (ord && ord.status !== 'Cancelled' ? (Number(ord.total) || 0) : 0), 0);
  const totalOrdersCount = (orders || []).length;
  const pendingOrdersCount = (orders || []).filter((o) => o && (o.status === 'Pending' || o.status === 'Processing')).length;
  const lowStockCount = (products || []).filter((p) => p && (Number(p.stock) || 0) < 5).length;
  const outOfStockCount = (products || []).filter((p) => p && (Number(p.stock) || 0) === 0).length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // --- Dynamic Live Category Counts (Safe) ---
  const menCount = useMemo(() => {
    return (products || []).filter((p) => {
      if (!p || typeof p !== 'object') return false;
      const pId = String(p.id || '');
      const pSku = String(p.sku || '');
      return pId.startsWith('vlz-men') || pSku.startsWith('VLZ-M') || p.category === 'Pour Homme' || p.gender === 'Men';
    }).length;
  }, [products]);

  const womenCount = useMemo(() => {
    return (products || []).filter((p) => {
      if (!p || typeof p !== 'object') return false;
      const pId = String(p.id || '');
      const pSku = String(p.sku || '');
      return pId.startsWith('vlz-women') || pId.startsWith('vlz-wom') || pSku.startsWith('VLZ-W') || p.category === 'Pour Femme' || p.gender === 'Women';
    }).length;
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
        dispatchOrder,
        updateOrderTracking,
        confirmOrderPayment,
        cancelOrderAndRestoreStock,
        backupCartForCheckout,

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
