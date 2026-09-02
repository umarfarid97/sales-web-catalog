import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, PROMO_CODES } from '../data/initialProducts';
import { INITIAL_ORDERS } from '../data/initialOrders';

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

  // Products Data
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('lumina_products');
    if (saved) {
      try {
        return JSON.parse(saved);
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
        return JSON.parse(saved);
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
        return JSON.parse(saved);
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

  // Persistence Effects
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

  // Toast Helpers
  const showToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const freeShippingThreshold = 150;
  const standardShippingFee = 15;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0;
  const cartShipping = isFreeShipping ? 0 : standardShippingFee;
  
  const discountPercent = appliedPromo ? appliedPromo.discountPercent : 0;
  const cartDiscountAmount = (cartSubtotal * discountPercent) / 100;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscountAmount + cartShipping);

  // Cart Actions
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
    if (PROMO_CODES[formatted]) {
      setAppliedPromo({
        code: formatted,
        discountPercent: PROMO_CODES[formatted].discountPercent,
        description: PROMO_CODES[formatted].description
      });
      showToast(`Promo "${formatted}" applied! (${PROMO_CODES[formatted].discountPercent}% off)`, 'success');
      return true;
    } else {
      showToast(`Invalid promo code "${code}". Try "LUMINA25" or "WELCOME10"`, 'error');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // Favorites / Wishlist Actions
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

  // Orders Actions
  const placeOrder = (customerData, paymentMethod) => {
    if (cart.length === 0) {
      showToast('Cannot checkout with an empty cart!', 'error');
      return null;
    }

    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${orderNumber}`;
    const trackingNumber = `TRK-LUM-${Math.floor(1000000 + Math.random() * 9000000)}`;

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

    // Deduct stock from products
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const orderedItem = cart.find((item) => item.id === prod.id);
        if (orderedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - orderedItem.quantity)
          };
        }
        return prod;
      })
    );

    // Append to orders
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart & promo
    clearCart();
    setIsCheckoutOpen(false);

    showToast(`Order ${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status: newStatus };
          if (newStatus === 'Delivered' && !ord.deliveredAt) {
            updated.deliveredAt = new Date().toISOString();
          }
          return updated;
        }
        return ord;
      })
    );
    showToast(`Order ${orderId} updated to "${newStatus}"`, 'info');
  };

  // Product CRUD (Admin Operations)
  const addProduct = (productData) => {
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
    showToast(`Product "${newProduct.name}" added to catalog`, 'success');
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  const updateProduct = (productId, updatedData) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            ...updatedData,
            price: parseFloat(updatedData.price) || prod.price,
            originalPrice: parseFloat(updatedData.originalPrice) || prod.originalPrice,
            stock: parseInt(updatedData.stock, 10) ?? prod.stock
          };
        }
        return prod;
      })
    );
    showToast(`Product updated successfully`, 'success');
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  const deleteProduct = (productId) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Product "${prod?.name || productId}" deleted`, 'info');
  };

  const restockProduct = (productId, amount = 10) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const newStock = prod.stock + amount;
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );
    showToast(`Restocked +${amount} units`, 'success');
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setFavorites(['prod-1', 'prod-3']);
    setAppliedPromo(null);
    localStorage.removeItem('lumina_products');
    localStorage.removeItem('lumina_orders');
    localStorage.removeItem('lumina_cart');
    localStorage.removeItem('lumina_favorites');
    showToast('Reset store to default factory demo data', 'info');
  };

  // Computed Filtered Products for Customer Catalog
  const filteredProducts = products.filter((product) => {
    // Category Filter
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }
    // Search Query Filter
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
    // Stock Filter
    if (inStockOnly && product.stock <= 0) {
      return false;
    }
    // Price Slider Filter
    if (product.price > maxPrice) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // default: featured first
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  // Admin KPI Analytics Data
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
