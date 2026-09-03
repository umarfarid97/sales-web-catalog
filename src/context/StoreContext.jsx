import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  // Role Mode: 'customer' | 'admin'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('lumina_role') || 'customer';
  });

  // Admin Active Tab: 'analytics' | 'products' | 'orders' | 'inventory'
  const [adminTab, setAdminTab] = useState('analytics');

  // Cloud Sync Status Indicator
  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured);
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(isSupabaseConfigured);

  // Products Data (Auto-purges old headphone cache)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('lumina_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If cached data contains old tech products (like Headphones/Audio/Keyboards), clear it
        if (Array.isArray(parsed) && parsed.some((p) => p.sku?.startsWith('LUM-AUD') || p.category === 'Audio' || p.category === 'Wearables')) {
          localStorage.removeItem('lumina_products');
          return INITIAL_PRODUCTS;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Cart Items
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('lumina_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clear cart if it had old headphones
        if (Array.isArray(parsed) && parsed.some((p) => p.category === 'Audio' || p.category === 'Wearables')) {
          localStorage.removeItem('lumina_cart');
          return [];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
    return [];
  });

  // Orders Data
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lumina_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((o) => o.items?.some((it) => it.category === 'Audio'))) {
          localStorage.removeItem('lumina_orders');
          return INITIAL_ORDERS;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved orders', e);
      }
    }
    return INITIAL_ORDERS;
  });

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

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating', 'name'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);

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

        // 2. Orders Sync
        const cloudOrders = await fetchOrdersFromSupabase();
        if (cloudOrders !== null && isMounted) {
          const hasLegacyOrders = cloudOrders.some((o) => o.items?.some((it) => it.category === 'Audio'));
          if (cloudOrders.length === 0 || hasLegacyOrders) {
            // Seed initial perfume orders to Supabase
            await seedOrdersToSupabase(INITIAL_ORDERS);
            setOrders(INITIAL_ORDERS);
          } else {
            setOrders(cloudOrders);
          }
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
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const freeShippingThreshold = 150;
  const standardShippingFee = 15;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0;
  const cartShipping = isFreeShipping ? 0 : standardShippingFee;
  
  const discountPercent = appliedPromo ? appliedPromo.discountPercent : 0;
  const cartDiscountAmount = (cartSubtotal * discountPercent) / 100;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscountAmount + cartShipping);

  // --- Cart Actions ---
  const addToCart = (product, selectedColor = null, quantity = 1) => {
    const colorToUse = selectedColor || (product.colors && product.colors[0]?.name) || 'Standard';
    const cartItemId = `${product.id}-${colorToUse}`;

    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock!`, 'error');
      return false;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const newQty = Math.min(product.stock, currentQty + quantity);
        if (newQty === currentQty) {
          showToast(`Maximum stock limit (${product.stock}) reached for this item`, 'info');
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
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0],
            color: colorToUse,
            category: product.category,
            quantity: Math.min(product.stock, quantity),
            maxStock: product.stock
          }
        ];
      }
    });

    showToast(`Added ${quantity}x "${product.name}" to cart`, 'success');
    return true;
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const clampedQty = Math.min(item.maxStock || 99, newQty);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.cartItemId === cartItemId);
      if (item) {
        showToast(`Removed "${item.name}" from cart`, 'info');
      }
      return prevCart.filter((i) => i.cartItemId !== cartItemId);
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
  const placeOrder = async (customerData, paymentMethod) => {
    if (cart.length === 0) {
      showToast('Cannot checkout with an empty cart!', 'error');
      return null;
    }

    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${orderNumber}`;
    const trackingNumber = `TRK-VAL-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newOrder = {
      id: orderId,
      customer: customerData,
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
    setOrders((prev) => [newOrder, ...prev]);

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
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchTagline = product.tagline?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCategory && !matchTagline) {
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
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  // --- Admin KPI Analytics Data ---
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  return (
    <StoreContext.Provider
      value={{
        // Role & Tabs
        role,
        setRole,
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
        placeOrder,
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
