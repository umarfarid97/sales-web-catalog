import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  Copy, 
  Check, 
  ExternalLink, 
  ShoppingBag, 
  RotateCcw, 
  Search, 
  ShieldCheck, 
  Lock, 
  Landmark, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

export const MALAYSIAN_STATES = [
  'Wilayah Persekutuan Kuala Lumpur',
  'Wilayah Persekutuan Putrajaya',
  'Wilayah Persekutuan Labuan',
  'Selangor',
  'Johor',
  'Pulau Pinang (Penang)',
  'Perak',
  'Pahang',
  'Negeri Sembilan',
  'Melaka',
  'Kedah',
  'Terengganu',
  'Kelantan',
  'Perlis',
  'Sabah',
  'Sarawak'
];

export const FPX_BANKS = [
  { code: 'MB2U0227', name: 'Maybank2u' },
  { code: 'BCBB0235', name: 'CIMB Clicks' },
  { code: 'PBB0233', name: 'Public Bank' },
  { code: 'RHB0218', name: 'RHB Now' },
  { code: 'HLB0224', name: 'Hong Leong Connect' },
  { code: 'AMBB0209', name: 'AmBank' },
  { code: 'BIMB0340', name: 'Bank Islam' },
  { code: 'ABB0233', name: 'Affin Bank' },
  { code: 'BKRM0602', name: 'Bank Rakyat' },
  { code: 'BSN0601', name: 'BSN (Bank Simpanan Nasional)' }
];

export const AccountPage = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    isAdmin, 
    openAuthModal, 
    logout, 
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    updatePaymentPreferences
  } = useAuth();

  const { orders, userOrders, addToCart, setIsCartOpen, showToast } = useStore();

  // Active Navigation Tab: 'overview' | 'orders' | 'addresses' | 'payment'
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['overview', 'orders', 'addresses', 'payment'].includes(tab)) {
        return tab;
      }
    } catch {}
    return 'overview';
  });

  // Orders sub-tab: 'active' | 'history'
  const [ordersSubTab, setOrdersSubTab] = useState('active');
  const [orderSearch, setOrderSearch] = useState('');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    label: 'Home',
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    zip: '50250',
    isDefault: false
  });

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || ''
  });

  // Payment Preferences State
  const [paymentPrefs, setPaymentPrefs] = useState({
    preferredMethod: currentUser?.paymentPreferences?.preferredMethod || 'fpx',
    preferredBank: currentUser?.paymentPreferences?.preferredBank || 'MB2U0227'
  });

  // Copy tracking state
  const [copiedTracking, setCopiedTracking] = useState(null);

  // Sync state when currentUser loads
  React.useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        phone: currentUser.phone || ''
      });
      if (currentUser.paymentPreferences) {
        setPaymentPrefs({
          preferredMethod: currentUser.paymentPreferences.preferredMethod || 'fpx',
          preferredBank: currentUser.paymentPreferences.preferredBank || 'MB2U0227'
        });
      }
    }
  }, [currentUser]);

  // Derive relevant orders for current user
  const relevantOrders = useMemo(() => {
    if (!currentUser) return [];
    const cleanEmail = currentUser.email?.toLowerCase();
    const userId = currentUser.id;

    // Merge store orders with any local orders in valenszo_real_orders and user-specific storage
    let allOrders = Array.isArray(orders) ? [...orders] : [];
    try {
      const stored = localStorage.getItem('valenszo_real_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(allOrders.map(o => o.id));
          parsed.forEach(o => {
            if (o && o.id && !existingIds.has(o.id)) {
              allOrders.push(o);
            }
          });
        }
      }
      if (userId) {
        const userStored = localStorage.getItem(`valenszo_user_orders_${userId}`);
        if (userStored) {
          const parsedUser = JSON.parse(userStored);
          if (Array.isArray(parsedUser)) {
            const existingIds = new Set(allOrders.map(o => o.id));
            parsedUser.forEach(o => {
              if (o && o.id && !existingIds.has(o.id)) {
                allOrders.push(o);
              }
            });
          }
        }
      }
    } catch (e) {
      console.warn('Error reading local orders:', e);
    }

    const matched = allOrders.filter((o) => {
      const oEmail = (o.customer?.email || o.customer?.userEmail || '').toLowerCase();
      const oUserId = o.customer?.userId;
      return (cleanEmail && oEmail === cleanEmail) || (userId && oUserId === userId);
    });

    return matched.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, currentUser]);

  // Partition into Active Orders and Order History
  const activeOrders = useMemo(() => {
    return relevantOrders.filter((o) => {
      const st = (o.status || '').toLowerCase();
      return st !== 'delivered' && st !== 'cancelled';
    });
  }, [relevantOrders]);

  const historyOrders = useMemo(() => {
    return relevantOrders.filter((o) => {
      const st = (o.status || '').toLowerCase();
      return st === 'delivered' || st === 'cancelled';
    });
  }, [relevantOrders]);

  // Filtered orders by search query
  const displayedOrders = useMemo(() => {
    const list = ordersSubTab === 'active' ? activeOrders : historyOrders;
    if (!orderSearch.trim()) return list;
    const clean = orderSearch.trim().toLowerCase();
    return list.filter((o) => {
      const idMatch = (o.id || '').toLowerCase().includes(clean);
      const trackingMatch = (o.trackingNumber || '').toLowerCase().includes(clean);
      const itemMatch = (o.items || []).some((item) => (item.name || '').toLowerCase().includes(clean));
      return idMatch || trackingMatch || itemMatch;
    });
  }, [ordersSubTab, activeOrders, historyOrders, orderSearch]);

  const savedAddresses = currentUser?.addresses || [];
  const defaultAddress = savedAddresses.find(a => a.isDefault) || savedAddresses[0] || null;

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressFormData({
      label: 'Home',
      recipientName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan Kuala Lumpur',
      zip: '50250',
      isDefault: savedAddresses.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressFormData({
      label: addr.label || 'Home',
      recipientName: addr.recipientName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || 'Kuala Lumpur',
      state: addr.state || 'Wilayah Persekutuan Kuala Lumpur',
      zip: addr.zip || '',
      isDefault: Boolean(addr.isDefault)
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressFormData.recipientName.trim() || !addressFormData.addressLine1.trim() || !addressFormData.zip.trim()) {
      showToast('Please fill in all required address fields.', 'warning');
      return;
    }

    if (editingAddress) {
      await updateAddress(editingAddress.id, addressFormData);
      showToast('Delivery address updated successfully.', 'success');
    } else {
      await addAddress(addressFormData);
      showToast('New delivery address added.', 'success');
    }
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = async (addrId) => {
    if (window.confirm('Remove this delivery address from your account?')) {
      await deleteAddress(addrId);
      showToast('Address removed.', 'info');
    }
  };

  const handleSetDefault = async (addrId) => {
    await setDefaultAddress(addrId);
    showToast('Default delivery address updated.', 'success');
  };

  // Profile Save Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      showToast('Name cannot be blank.', 'warning');
      return;
    }
    await updateProfile({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim()
    });
    setIsEditingProfile(false);
    showToast('Profile information saved.', 'success');
  };

  // Payment Preferences Save Handler
  const handleSavePaymentPrefs = async (e) => {
    e.preventDefault();
    const bankObj = FPX_BANKS.find(b => b.code === paymentPrefs.preferredBank);
    await updatePaymentPreferences({
      preferredMethod: paymentPrefs.preferredMethod,
      preferredBank: paymentPrefs.preferredBank,
      bankName: bankObj ? bankObj.name : 'Maybank2u'
    });
    showToast('Payment preferences saved.', 'success');
  };

  // Reorder Handler
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    let addedCount = 0;
    order.items.forEach((item) => {
      addToCart({
        id: item.productId || item.id,
        name: item.name,
        price: item.price,
        images: item.image ? [item.image] : [],
        selectedSize: item.size || '100 ml Bottle',
        engravingText: item.engraving || ''
      }, item.quantity || 1);
      addedCount += (item.quantity || 1);
    });
    showToast(`Added ${addedCount} item(s) from order ${order.id} to your shopping bag.`, 'success');
    setIsCartOpen(true);
  };

  // Copy tracking number helper
  const handleCopyTracking = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedTracking(code);
    showToast('Tracking number copied to clipboard.', 'success');
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  // Status step helper for active orders
  const getOrderProgressStep = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return 1;
    if (s === 'paid') return 2;
    if (s === 'processing') return 3;
    if (s === 'shipped') return 4;
    if (s === 'delivered') return 4;
    return 1;
  };

  // =========================================================================
  // VIEW A: GUEST / UNAUTHENTICATED SCREEN
  // =========================================================================
  if (!isAuthenticated || !currentUser) {
    return (
      <div style={{
        minHeight: '75vh',
        background: '#faf8f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem) 1.25rem'
      }}>
        <div style={{
          maxWidth: '540px',
          width: '100%',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 20px 40px rgba(43, 24, 16, 0.06)',
          padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2b1810 0%, #120905 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 20px rgba(43, 24, 16, 0.2)'
          }}>
            <User size={32} strokeWidth={1.5} />
          </div>

          <div style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#b38e44',
            marginBottom: '6px'
          }}>
            Maison Valenszo
          </div>

          <h1 style={{
            fontFamily: 'var(--font-brand, "Bodoni Moda", serif)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.2rem)',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '0.75rem',
            lineHeight: 1.2
          }}>
            Customer Account
          </h1>

          <p style={{
            color: '#6b7280',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Sign in to manage your delivery addresses, preferred payment methods, and trace your active orders and purchase history.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => openAuthModal({ mode: 'signin', title: 'Sign In to Your Account' })}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
            >
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => openAuthModal({ mode: 'register', title: 'Create Maison Account' })}
              style={{
                width: '100%',
                padding: '13px 20px',
                background: 'transparent',
                color: '#111827',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer'
              }}
            >
              Create Account
            </button>
          </div>

          <div style={{
            borderTop: '1px solid #f3f4f6',
            paddingTop: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            textAlign: 'center'
          }}>
            <div>
              <Package size={20} color="#b38e44" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#111827' }}>Live Tracking</div>
              <div style={{ fontSize: '0.66rem', color: '#9ca3af' }}>Real-time updates</div>
            </div>
            <div>
              <MapPin size={20} color="#b38e44" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#111827' }}>Addresses</div>
              <div style={{ fontSize: '0.66rem', color: '#9ca3af' }}>Saved locations</div>
            </div>
            <div>
              <CreditCard size={20} color="#b38e44" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#111827' }}>Express Pay</div>
              <div style={{ fontSize: '0.66rem', color: '#9ca3af' }}>FPX & Cards</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: AUTHENTICATED CLIENT ACCOUNT PORTAL
  // =========================================================================
  return (
    <div style={{ minHeight: '85vh', background: '#faf8f5', padding: 'clamp(1.5rem, 3.5vw, 3rem) 1rem 5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* 1. Top Header Banner & Client Overview Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: 'clamp(1.5rem, 3vw, 2.25rem)',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Initials Avatar */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e130c 0%, #000000 100%)',
              color: '#d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              fontFamily: 'var(--font-brand, serif)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              flexShrink: 0
            }}>
              {(currentUser.name || 'V').charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: 'var(--font-brand, "Bodoni Moda", serif)',
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                  fontWeight: 800,
                  color: '#111827',
                  margin: 0,
                  letterSpacing: '0.02em'
                }}>
                  {currentUser.name}
                </h1>
                {isAdmin ? (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    background: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    👑 Store Admin
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    background: '#faf5eb',
                    color: '#b38e44',
                    border: '1px solid #e8dfcf',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    <Sparkles size={11} />
                    Maison Privé Member
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#6b7280', fontSize: '0.84rem', marginTop: '4px', flexWrap: 'wrap' }}>
                <span>{currentUser.email}</span>
                {currentUser.phone && <span>&bull; {currentUser.phone}</span>}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                  {activeOrders.length}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Active Orders
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                  {savedAddresses.length}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Addresses
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                showToast('Signed out of Maison account.', 'info');
              }}
              style={{
                padding: '9px 16px',
                background: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {[
            { id: 'overview', label: 'Overview & Profile', icon: User },
            { id: 'orders', label: `My Orders (${relevantOrders.length})`, icon: Package },
            { id: 'addresses', label: `Delivery Addresses (${savedAddresses.length})`, icon: MapPin },
            { id: 'payment', label: 'Payment Details', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #000000' : '2px solid transparent',
                  color: isActive ? '#000000' : '#6b7280',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} color={isActive ? '#000000' : '#9ca3af'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. TAB CONTENT VIEWS */}

        {/* ================================================================= */}
        {/* TAB 1: OVERVIEW & PROFILE */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Personal Details Card */}
            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="#b38e44" />
                  <span>Personal Details</span>
                </h2>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  style={{ background: 'none', border: 'none', color: '#b38e44', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Edit3 size={14} />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+60 12-345 6789"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.88rem' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ marginTop: '6px', padding: '10px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>{currentUser.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>{currentUser.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contact Phone</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>{currentUser.phone || 'Not provided'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Membership Tier</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#b38e44' }}>
                      {isAdmin ? 'Maison Administrator' : 'Valenszo Privé Member'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Default Shipping Address Snippet */}
            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="#b38e44" />
                  <span>Default Shipping Address</span>
                </h2>
                <button
                  onClick={() => setActiveTab('addresses')}
                  style={{ background: 'none', border: 'none', color: '#b38e44', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Manage All
                </button>
              </div>

              {defaultAddress ? (
                <div style={{ background: '#fafaf9', border: '1px solid #f3f4f6', borderRadius: '6px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#111827' }}>{defaultAddress.label}</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#000000', color: '#ffffff', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>
                      Default
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1f2937' }}>{defaultAddress.recipientName}</div>
                  <div style={{ fontSize: '0.82rem', color: '#4b5563', marginTop: '2px' }}>{defaultAddress.phone}</div>
                  <div style={{ fontSize: '0.84rem', color: '#374151', marginTop: '8px', lineHeight: 1.5 }}>
                    {defaultAddress.addressLine1}
                    {defaultAddress.addressLine2 && <>, {defaultAddress.addressLine2}</>}
                    <br />
                    {defaultAddress.zip} {defaultAddress.city}, {defaultAddress.state}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 16px', background: '#fafaf9', borderRadius: '6px' }}>
                  <p style={{ fontSize: '0.86rem', color: '#6b7280', marginBottom: '14px' }}>
                    No default shipping address saved yet.
                  </p>
                  <button
                    onClick={handleOpenAddAddress}
                    style={{ padding: '8px 16px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Delivery Address
                  </button>
                </div>
              )}
            </div>

            {/* Latest Active Order Preview Card */}
            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} color="#b38e44" />
                  <span>Recent Fragrance Orders</span>
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  style={{ background: 'none', border: 'none', color: '#b38e44', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  View All Orders &rarr;
                </button>
              </div>

              {relevantOrders.length > 0 ? (
                <div style={{ border: '1px solid #f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                  {relevantOrders.slice(0, 3).map((order) => {
                    const isDelivered = (order.status || '').toLowerCase() === 'delivered';
                    return (
                      <div
                        key={order.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          borderBottom: '1px solid #f3f4f6',
                          background: '#ffffff',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'var(--font-brand, serif)', fontWeight: 800, fontSize: '0.94rem', color: '#111827' }}>
                              #{order.id}
                            </span>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '3px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              background: isDelivered ? '#ecfdf5' : '#eff6ff',
                              color: isDelivered ? '#059669' : '#2563eb'
                            }}>
                              {order.status || 'Processing'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>
                            {new Date(order.createdAt || Date.now()).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; {(order.items || []).length} item(s)
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                            RM {Number(order.total || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              setActiveTab('orders');
                              setOrdersSubTab(isDelivered ? 'history' : 'active');
                            }}
                            style={{
                              padding: '6px 12px',
                              background: '#f9fafb',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              color: '#374151',
                              cursor: 'pointer'
                            }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '36px 16px', background: '#fafaf9', borderRadius: '6px' }}>
                  <Package size={36} color="#9ca3af" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>No orders found</div>
                  <p style={{ fontSize: '0.84rem', color: '#6b7280', marginTop: '4px', marginBottom: '16px' }}>
                    Discover our collection of haute parfumerie creations.
                  </p>
                  <a
                    href="/collection"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 20px',
                      background: '#000000',
                      color: '#ffffff',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    Explore Perfume Collection
                  </a>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MY ORDERS (CURRENT ACTIVE VS HISTORY) */}
        {/* ================================================================= */}
        {activeTab === 'orders' && (
          <div>
            {/* Header Controls: Subtabs (Active vs History) + Search Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '1.5rem'
            }}>
              {/* Active vs History Subtabs */}
              <div style={{ display: 'flex', background: '#e5e7eb', padding: '3px', borderRadius: '6px' }}>
                <button
                  onClick={() => setOrdersSubTab('active')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '4px',
                    border: 'none',
                    background: ordersSubTab === 'active' ? '#ffffff' : 'transparent',
                    color: ordersSubTab === 'active' ? '#111827' : '#4b5563',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: ordersSubTab === 'active' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  Active Orders ({activeOrders.length})
                </button>
                <button
                  onClick={() => setOrdersSubTab('history')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '4px',
                    border: 'none',
                    background: ordersSubTab === 'history' ? '#ffffff' : 'transparent',
                    color: ordersSubTab === 'history' ? '#111827' : '#4b5563',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: ordersSubTab === 'history' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  Order History ({historyOrders.length})
                </button>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: 'clamp(240px, 30vw, 320px)' }}>
                <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by Order ID or perfume..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    background: '#ffffff'
                  }}
                />
                {orderSearch && (
                  <button
                    onClick={() => setOrderSearch('')}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Orders List */}
            {displayedOrders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {displayedOrders.map((order) => {
                  const currentStep = getOrderProgressStep(order.status);
                  const isDelivered = (order.status || '').toLowerCase() === 'delivered';
                  const isCancelled = (order.status || '').toLowerCase() === 'cancelled';

                  return (
                    <div
                      key={order.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Card Header */}
                      <div style={{
                        padding: '16px 20px',
                        background: '#f9fafb',
                        borderBottom: '1px solid #f3f4f6',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Order Number</span>
                            <div style={{ fontFamily: 'var(--font-brand, serif)', fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                              #{order.id}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date Placed</span>
                            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151' }}>
                              {new Date(order.createdAt || Date.now()).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Amount</span>
                            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#111827' }}>
                              RM {Number(order.total || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            background: isCancelled ? '#fee2e2' : isDelivered ? '#dcfce7' : '#fef3c7',
                            color: isCancelled ? '#b91c1c' : isDelivered ? '#15803d' : '#b45309'
                          }}>
                            {order.status || 'Processing'}
                          </span>

                          {/* Reorder Button for past orders */}
                          {isDelivered && (
                            <button
                              onClick={() => handleReorder(order)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: '#000000',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              <RotateCcw size={12} />
                              <span>Reorder</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Visual Stepper for Active Orders */}
                      {ordersSubTab === 'active' && !isCancelled && (
                        <div style={{ padding: '24px 20px', background: '#fafaf9', borderBottom: '1px solid #f3f4f6' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b38e44', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                            Real-Time Fulfillment Timeline
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', position: 'relative' }}>
                            {[
                              { step: 1, title: 'Order Placed', desc: 'Received' },
                              { step: 2, title: 'Payment Confirmed', desc: 'Verified' },
                              { step: 3, title: 'Atelier Packaging', desc: 'In Preparation' },
                              { step: 4, title: 'Dispatched / In Transit', desc: 'Courier Handling' }
                            ].map((s) => {
                              const isCompleted = currentStep >= s.step;
                              const isCurrent = currentStep === s.step;
                              return (
                                <div key={s.step} style={{ textAlign: 'center' }}>
                                  <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    margin: '0 auto 6px',
                                    background: isCompleted ? '#000000' : '#e5e7eb',
                                    color: isCompleted ? '#ffffff' : '#9ca3af',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    border: isCurrent ? '2px solid #d97706' : 'none'
                                  }}>
                                    {isCompleted ? <Check size={14} /> : s.step}
                                  </div>
                                  <div style={{ fontSize: '0.74rem', fontWeight: isCompleted ? 700 : 500, color: isCompleted ? '#111827' : '#9ca3af' }}>
                                    {s.title}
                                  </div>
                                  <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{s.desc}</div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Courier Tracking snippet if present */}
                          {order.trackingNumber && (
                            <div style={{
                              marginTop: '16px',
                              padding: '10px 14px',
                              background: '#ffffff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Truck size={16} color="#059669" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
                                  {order.courierName || 'Courier Partner'}: <strong style={{ color: '#111827' }}>{order.trackingNumber}</strong>
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleCopyTracking(order.trackingNumber)}
                                  style={{ background: 'none', border: 'none', color: '#b38e44', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  {copiedTracking === order.trackingNumber ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                                  <span>{copiedTracking === order.trackingNumber ? 'Copied' : 'Copy Tracking'}</span>
                                </button>
                                {order.trackingUrl && (
                                  <a
                                    href={order.trackingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: '#2563eb', fontSize: '0.74rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <span>Track Online</span>
                                    <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Items Breakdown */}
                      <div style={{ padding: '20px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                          Fragrance Items ({order.items?.length || 0})
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < (order.items.length - 1) ? '1px solid #f3f4f6' : 'none', paddingBottom: idx < (order.items.length - 1) ? '12px' : 0 }}>
                              <img
                                src={item.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&auto=format&fit=crop&q=80'}
                                alt={item.name}
                                style={{ width: '48px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #f3f4f6' }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>
                                  {item.name}
                                </div>
                                <div style={{ fontSize: '0.76rem', color: '#6b7280' }}>
                                  {item.size || '100 ml'} &bull; Qty: {item.quantity || 1}
                                </div>
                                {item.engraving && (
                                  <div style={{ fontSize: '0.72rem', color: '#b38e44', fontStyle: 'italic', marginTop: '2px' }}>
                                    Custom Engraved: &quot;{item.engraving}&quot;
                                  </div>
                                )}
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>
                                  RM {(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                                  RM {Number(item.price || 0).toFixed(2)} each
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer: Shipping details snippet */}
                        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#6b7280', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            Delivery to: <strong style={{ color: '#111827' }}>{order.customer?.name || order.customer?.recipientName || 'Client'}</strong> ({order.customer?.city || 'Malaysia'})
                          </div>
                          <div>
                            Payment Method: <strong style={{ color: '#111827', textTransform: 'uppercase' }}>{order.paymentMethod || 'FPX'}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 16px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <Package size={40} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                  {orderSearch ? `No orders matched "${orderSearch}"` : ordersSubTab === 'active' ? 'No active orders in progress' : 'No past orders in history'}
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6b7280', marginTop: '4px', marginBottom: '18px' }}>
                  {ordersSubTab === 'active' ? 'Your active orders will be displayed here as they are processed.' : 'Completed and delivered purchases will appear here.'}
                </p>
                <a
                  href="/collection"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    background: '#000000',
                    color: '#ffffff',
                    borderRadius: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  Explore Fragrances
                </a>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: DELIVERY ADDRESSES */}
        {/* ================================================================= */}
        {activeTab === 'addresses' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Saved Delivery Addresses
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#6b7280', marginTop: '3px' }}>
                  Manage destination addresses for fast, 1-click checkout across Malaysia.
                </p>
              </div>

              <button
                onClick={handleOpenAddAddress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                <span>Add New Address</span>
              </button>
            </div>

            {savedAddresses.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      background: '#ffffff',
                      border: addr.isDefault ? '2px solid #000000' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {addr.label || 'Address'}
                        </span>
                        {addr.isDefault && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#000000',
                            color: '#ffffff',
                            padding: '2px 8px',
                            borderRadius: '3px',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase'
                          }}>
                            <Star size={10} fill="#ffffff" />
                            Default Shipping
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#111827' }}>
                        {addr.recipientName}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px' }}>
                        {addr.phone}
                      </div>

                      <div style={{ fontSize: '0.86rem', color: '#374151', marginTop: '10px', lineHeight: 1.5 }}>
                        {addr.addressLine1}
                        {addr.addressLine2 && <><br />{addr.addressLine2}</>}
                        <br />
                        {addr.zip} {addr.city}
                        <br />
                        {addr.state}, {addr.country || 'Malaysia'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '14px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>

                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          style={{ background: 'none', border: 'none', color: '#b38e44', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 16px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <MapPin size={40} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>No saved delivery addresses</div>
                <p style={{ fontSize: '0.84rem', color: '#6b7280', marginTop: '4px', marginBottom: '18px' }}>
                  Save your home or office address to enable 1-click checkout.
                </p>
                <button
                  onClick={handleOpenAddAddress}
                  style={{
                    padding: '10px 20px',
                    background: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + Add First Address
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: PAYMENT DETAILS & PREFERENCES */}
        {/* ================================================================= */}
        {activeTab === 'payment' && (
          <div style={{ maxWidth: '680px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Payment Preferences
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#6b7280', marginTop: '3px' }}>
                Choose your default payment method and preferred FPX bank to expedite your checkout experience.
              </p>
            </div>

            <form onSubmit={handleSavePaymentPrefs} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              
              {/* Payment Method Selector */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>
                  Preferred Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                  {[
                    { id: 'fpx', label: 'ToyyibPay FPX', desc: 'Online Banking (Recommended)', icon: Landmark },
                    { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard', icon: CreditCard },
                    { id: 'duitnow', label: 'DuitNow QR', desc: 'Instant Bank Transfer', icon: ShieldCheck },
                    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay upon receipt', icon: Package }
                  ].map((m) => {
                    const isSelected = paymentPrefs.preferredMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setPaymentPrefs({ ...paymentPrefs, preferredMethod: m.id })}
                        style={{
                          border: isSelected ? '2px solid #000000' : '1px solid #e5e7eb',
                          background: isSelected ? '#faf8f5' : '#ffffff',
                          borderRadius: '6px',
                          padding: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <Icon size={18} color={isSelected ? '#000000' : '#6b7280'} />
                          {isSelected && <CheckCircle2 size={16} color="#000000" />}
                        </div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827' }}>{m.label}</div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>{m.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preferred FPX Bank Selector (When FPX selected) */}
              {paymentPrefs.preferredMethod === 'fpx' && (
                <div style={{ marginBottom: '24px', padding: '16px', background: '#fafaf9', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                    Preferred Malaysian FPX Bank
                  </label>
                  <p style={{ fontSize: '0.76rem', color: '#6b7280', marginBottom: '10px' }}>
                    This bank will be pre-selected for you whenever you checkout with ToyyibPay FPX.
                  </p>
                  <select
                    value={paymentPrefs.preferredBank}
                    onChange={(e) => setPaymentPrefs({ ...paymentPrefs, preferredBank: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.88rem',
                      background: '#ffffff',
                      fontWeight: 600
                    }}
                  >
                    {FPX_BANKS.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Security & Assurance Badge */}
              <div style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
                <Lock size={18} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>256-Bit Bank Grade Encryption:</strong> Valenszo processes all payments via ToyyibPay and certified Malaysian financial gateways. We never store raw banking credentials or full credit card numbers on our servers.
                </div>
              </div>

              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer'
                }}
              >
                Save Payment Preferences
              </button>
            </form>
          </div>
        )}

      </div>

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT DELIVERY ADDRESS */}
      {/* =================================================================== */}
      {isAddressModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsAddressModalOpen(false)}
          style={{ zIndex: 1100 }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '560px',
              width: '94%',
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              maxHeight: '90dvh',
              overflowY: 'auto',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Address Label (Home / Office / etc.) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Address Label
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Home', 'Office', 'Atelier', 'Gift Recipient'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setAddressFormData({ ...addressFormData, label: lbl })}
                      style={{
                        flex: 1,
                        padding: '7px 8px',
                        border: addressFormData.label === lbl ? '2px solid #000000' : '1px solid #d1d5db',
                        background: addressFormData.label === lbl ? '#f3f4f6' : '#ffffff',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: addressFormData.label === lbl ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.recipientName}
                    onChange={(e) => setAddressFormData({ ...addressFormData, recipientName: e.target.value })}
                    placeholder="e.g. Umar Farid"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressFormData.phone}
                    onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                    placeholder="+60 12-345 6789"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Street Address Line 1 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Street Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={addressFormData.addressLine1}
                  onChange={(e) => setAddressFormData({ ...addressFormData, addressLine1: e.target.value })}
                  placeholder="e.g. Unit 12-04, Residensi Pavilion, 18 Jalan Sultan Ismail"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.88rem' }}
                />
              </div>

              {/* Street Address Line 2 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Street Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={addressFormData.addressLine2}
                  onChange={(e) => setAddressFormData({ ...addressFormData, addressLine2: e.target.value })}
                  placeholder="Building, suite, floor, or landmark"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.88rem' }}
                />
              </div>

              {/* City, Postal Code, State */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Postcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.zip}
                    onChange={(e) => setAddressFormData({ ...addressFormData, zip: e.target.value })}
                    placeholder="50250"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    placeholder="Kuala Lumpur"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Malaysian State Dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  State / Territory *
                </label>
                <select
                  value={addressFormData.state}
                  onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.88rem', background: '#ffffff' }}
                >
                  {MALAYSIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Default Address Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="defaultAddressCheckbox"
                  checked={addressFormData.isDefault}
                  onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="defaultAddressCheckbox" style={{ fontSize: '0.84rem', color: '#374151', cursor: 'pointer' }}>
                  Set as default shipping address
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default AccountPage;
