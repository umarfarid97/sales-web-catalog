import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  saveProfileToSupabase, 
  fetchProfileById,
  fetchProfileByEmail
} from '../services/supabaseService';

const ADMIN_EMAILS = [
  'umarfarid90@gmail.com',
  'admin@valenszo.my',
  'atelier@valenszo.my'
];

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Current active user (null = Guest mode)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('valenszo_auth_user') || localStorage.getItem('valenszo_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email && ADMIN_EMAILS.includes(parsed.email.toLowerCase().trim())) {
          parsed.role = 'admin';
        }

        // Ensure addresses array
        if (!Array.isArray(parsed.addresses)) {
          let localAddrs = [];
          try {
            const savedAddrs = localStorage.getItem(`valenszo_addresses_${parsed.id}`);
            if (savedAddrs) localAddrs = JSON.parse(savedAddrs);
          } catch {}
          parsed.addresses = (Array.isArray(localAddrs) && localAddrs.length > 0)
            ? localAddrs
            : parsed.address ? [{
                id: 'addr-default-1',
                label: 'Home',
                recipientName: parsed.name || '',
                phone: parsed.phone || '',
                addressLine1: parsed.address || '',
                addressLine2: '',
                city: parsed.city || 'Kuala Lumpur',
                state: parsed.state || 'Wilayah Persekutuan',
                zip: parsed.zip || '50250',
                country: parsed.country || 'Malaysia',
                isDefault: true
              }] : [];
        }

        // Ensure paymentPreferences object
        if (!parsed.paymentPreferences) {
          let localPrefs = null;
          try {
            const savedPrefs = localStorage.getItem(`valenszo_payment_prefs_${parsed.id}`);
            if (savedPrefs) localPrefs = JSON.parse(savedPrefs);
          } catch {}
          parsed.paymentPreferences = localPrefs || {
            preferredMethod: 'fpx',
            preferredBank: 'MB2U0227',
            bankName: 'Maybank2u'
          };
        }

        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Modal display state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin'); // 'signin' | 'register'
  const [authModalConfig, setAuthModalConfig] = useState({
    title: null,
    subtitle: null,
    onComplete: null
  });

  // Loading and verification states
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasVerifiedSession, setHasVerifiedSession] = useState(false);
  const [isAuthInitializing, setIsAuthInitializing] = useState(isSupabaseConfigured);

  // Helper to fetch and resolve user profile with admin privileges
  const resolveUserProfile = useCallback(async (authUser) => {
    if (!authUser) return null;
    const cleanEmail = authUser.email?.toLowerCase().trim();
    const isWhitelisted = cleanEmail && ADMIN_EMAILS.includes(cleanEmail);

    let profile = await fetchProfileById(authUser.id);
    if (!profile && cleanEmail) {
      profile = await fetchProfileByEmail(cleanEmail);
    }

    // Resolve saved addresses from local cache, metadata or profile
    let localAddresses = [];
    try {
      const savedAddrs = localStorage.getItem(`valenszo_addresses_${authUser.id}`);
      if (savedAddrs) localAddresses = JSON.parse(savedAddrs);
    } catch {}

    const defaultInitialAddress = (profile?.address || authUser.user_metadata?.address) ? [{
      id: 'addr-default-1',
      label: 'Home',
      recipientName: profile?.name || authUser.user_metadata?.full_name || cleanEmail.split('@')[0],
      phone: profile?.phone || authUser.user_metadata?.phone || '',
      addressLine1: profile?.address || authUser.user_metadata?.address || '',
      addressLine2: '',
      city: profile?.city || authUser.user_metadata?.city || 'Kuala Lumpur',
      state: profile?.state || authUser.user_metadata?.state || 'Wilayah Persekutuan',
      zip: profile?.zip || authUser.user_metadata?.zip || '50250',
      country: profile?.country || 'Malaysia',
      isDefault: true
    }] : [];

    const resolvedAddresses = (Array.isArray(localAddresses) && localAddresses.length > 0)
      ? localAddresses
      : (Array.isArray(authUser.user_metadata?.addresses) && authUser.user_metadata.addresses.length > 0)
      ? authUser.user_metadata.addresses
      : (Array.isArray(profile?.addresses) && profile.addresses.length > 0)
      ? profile.addresses
      : defaultInitialAddress;

    // Resolve payment preferences
    let localPaymentPrefs = null;
    try {
      const savedPrefs = localStorage.getItem(`valenszo_payment_prefs_${authUser.id}`);
      if (savedPrefs) localPaymentPrefs = JSON.parse(savedPrefs);
    } catch {}

    const resolvedPaymentPreferences = localPaymentPrefs || authUser.user_metadata?.paymentPreferences || profile?.paymentPreferences || {
      preferredMethod: 'fpx',
      preferredBank: 'MB2U0227',
      bankName: 'Maybank2u'
    };

    const resolved = {
      id: authUser.id,
      email: authUser.email,
      name: profile?.name || authUser.user_metadata?.full_name || cleanEmail.split('@')[0],
      phone: profile?.phone || authUser.user_metadata?.phone || '',
      address: profile?.address || authUser.user_metadata?.address || '',
      city: profile?.city || authUser.user_metadata?.city || 'Kuala Lumpur',
      state: profile?.state || authUser.user_metadata?.state || 'Wilayah Persekutuan',
      zip: profile?.zip || authUser.user_metadata?.zip || '50250',
      country: profile?.country || 'Malaysia',
      role: (isWhitelisted || profile?.role === 'admin') ? 'admin' : (profile?.role || authUser.user_metadata?.role || 'customer'),
      addresses: resolvedAddresses,
      paymentPreferences: resolvedPaymentPreferences
    };

    if (isWhitelisted && profile?.role !== 'admin') {
      saveProfileToSupabase(resolved).catch(() => {});
    }

    return resolved;
  }, []);

  // Sync Supabase Auth Session
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthInitializing(false);
      return;
    }

    // 1. Initial Session Check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const resolved = await resolveUserProfile(session.user);
        if (resolved) {
          setCurrentUser(resolved);
          setHasVerifiedSession(true);
          localStorage.setItem('valenszo_auth_user', JSON.stringify(resolved));
        }
      } else {
        setHasVerifiedSession(false);
        // Retain local admin/profile state for whitelisted administrators or fallback offline mode
      }
      setIsAuthInitializing(false);
    }).catch(() => {
      setIsAuthInitializing(false);
    });

    // 2. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        const resolved = await resolveUserProfile(session.user);
        if (resolved) {
          setCurrentUser(resolved);
          setHasVerifiedSession(true);
          localStorage.setItem('valenszo_auth_user', JSON.stringify(resolved));
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setHasVerifiedSession(false);
        localStorage.removeItem('valenszo_auth_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [resolveUserProfile]);

  // Open Auth Dialog with optional custom messaging and callback
  const openAuthModal = useCallback(({ mode = 'signin', onComplete = null, title = null, subtitle = null } = {}) => {
    setAuthModalMode(mode);
    setAuthModalConfig({
      title: title || (mode === 'signin' ? 'Valenszo Sign In' : 'Create Valenszo Account'),
      subtitle: subtitle || (mode === 'signin' ? 'Sign in to access your account and tracked orders.' : 'Create an account to save your favorite perfumes and track orders.'),
      onComplete
    });
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalConfig({ title: null, subtitle: null, onComplete: null });
  }, []);

  // Secure Sign In Handler
  const login = async (email, password) => {
    setIsAuthenticating(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (!isSupabaseConfigured || !supabase) {
        return {
          success: false,
          error: 'Authentication database is currently offline. Please check your network connection.'
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials or register a new account.' };
        }
        if (error.message?.includes('Email not confirmed')) {
          return { success: false, error: 'Please confirm your email address. Check your inbox for the confirmation link.' };
        }
        return { success: false, error: error.message || 'Invalid email or password.' };
      }

      if (data?.user) {
        const userObj = await resolveUserProfile(data.user);

        setCurrentUser(userObj);
        localStorage.setItem('valenszo_auth_user', JSON.stringify(userObj));
        setIsAuthModalOpen(false);
        if (authModalConfig.onComplete) authModalConfig.onComplete(userObj);
        return { success: true, user: userObj };
      }

      return { success: false, error: 'Failed to sign in. Please check your email and password.' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'An unexpected error occurred during sign in.' };
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Secure Register Handler
  const register = async (userData) => {
    setIsAuthenticating(true);
    const cleanEmail = userData.email.trim().toLowerCase();

    try {
      if (!isSupabaseConfigured || !supabase) {
        return {
          success: false,
          error: 'Authentication database is currently offline. Please check your network connection.'
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name?.trim() || 'Valenszo Customer',
            phone: userData.phone?.trim() || '',
            address: userData.address?.trim() || '',
            city: userData.city?.trim() || 'Kuala Lumpur',
            state: userData.state?.trim() || 'Wilayah Persekutuan',
            zip: userData.zip?.trim() || '50250',
            role: 'customer' // All self-registered users are strictly customers
          }
        }
      });

      if (error) {
        if (error.message?.includes('already registered')) {
          return { success: false, error: 'An account with this email already exists. Please switch to the Sign In tab.' };
        }
        if (error.message?.toLowerCase().includes('rate limit')) {
          return { 
            success: false, 
            error: 'Authentication email limit reached (Supabase restricts unverified email dispatch to ~3/hour). If you already registered, please click "Sign In". If this is your project, turn OFF "Confirm email" in Supabase to allow instant account creation.' 
          };
        }
        return { success: false, error: error.message || 'Registration failed.' };
      }

      if (data?.user) {
        // If email confirmation is required, session will be null
        if (!data.session) {
          return {
            success: true,
            requiresConfirmation: true,
            message: 'Your account was created! Please check your email inbox to confirm your registration before signing in.'
          };
        }

        const newUser = {
          id: data.user.id,
          email: cleanEmail,
          name: userData.name?.trim() || 'Valenszo Customer',
          phone: userData.phone?.trim() || '',
          address: userData.address?.trim() || '',
          city: userData.city?.trim() || 'Kuala Lumpur',
          state: userData.state?.trim() || 'Wilayah Persekutuan',
          zip: userData.zip?.trim() || '50250',
          country: 'Malaysia',
          role: 'customer',
          createdAt: new Date().toISOString()
        };

        // Create profile in public.profiles table
        await saveProfileToSupabase(newUser);

        setCurrentUser(newUser);
        localStorage.setItem('valenszo_auth_user', JSON.stringify(newUser));
        setIsAuthModalOpen(false);
        if (authModalConfig.onComplete) authModalConfig.onComplete(newUser);

        return { success: true, user: newUser };
      }

      return { success: false, error: 'Registration could not be completed. Please try again.' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'An unexpected error occurred during registration.' };
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign Out Handler
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
    localStorage.removeItem('valenszo_auth_user');
    localStorage.removeItem('valenszo_role');
    localStorage.removeItem('lumina_role');
  };

  // Update Profile
  const updateProfile = async (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    localStorage.setItem('valenszo_auth_user', JSON.stringify(updated));
    await saveProfileToSupabase(updated).catch(err => console.warn('Profile update warning:', err));
  };

  // Address Management
  const persistAddresses = async (addressesList) => {
    if (!currentUser) return;
    const updated = { ...currentUser, addresses: addressesList };
    setCurrentUser(updated);
    try {
      localStorage.setItem('valenszo_auth_user', JSON.stringify(updated));
      localStorage.setItem(`valenszo_addresses_${currentUser.id}`, JSON.stringify(addressesList));
    } catch (e) {
      console.warn('Failed saving addresses to localStorage', e);
    }

    // Sync with Supabase user_metadata if online
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.updateUser({
          data: { addresses: addressesList }
        });
      } catch (e) {
        console.warn('Supabase auth metadata update skipped', e);
      }
    }
  };

  const addAddress = async (newAddress) => {
    if (!currentUser) return null;
    const currentAddresses = Array.isArray(currentUser.addresses) ? currentUser.addresses : [];
    const isFirst = currentAddresses.length === 0;
    const shouldBeDefault = isFirst || Boolean(newAddress.isDefault);

    const addressEntry = {
      id: newAddress.id || `addr-${Date.now()}`,
      label: newAddress.label || 'Home',
      recipientName: newAddress.recipientName || currentUser.name || '',
      phone: newAddress.phone || currentUser.phone || '',
      addressLine1: newAddress.addressLine1 || '',
      addressLine2: newAddress.addressLine2 || '',
      city: newAddress.city || 'Kuala Lumpur',
      state: newAddress.state || 'Wilayah Persekutuan',
      zip: newAddress.zip || '',
      country: newAddress.country || 'Malaysia',
      isDefault: shouldBeDefault
    };

    let updatedList;
    if (shouldBeDefault) {
      updatedList = [
        addressEntry,
        ...currentAddresses.map(a => ({ ...a, isDefault: false }))
      ];
    } else {
      updatedList = [...currentAddresses, addressEntry];
    }

    await persistAddresses(updatedList);
    return addressEntry;
  };

  const updateAddress = async (addressId, addressFields) => {
    if (!currentUser) return false;
    const currentAddresses = Array.isArray(currentUser.addresses) ? currentUser.addresses : [];
    const shouldBeDefault = Boolean(addressFields.isDefault);

    const updatedList = currentAddresses.map(addr => {
      if (addr.id === addressId) {
        return {
          ...addr,
          ...addressFields,
          id: addressId,
          isDefault: shouldBeDefault ? true : addr.isDefault
        };
      }
      return shouldBeDefault ? { ...addr, isDefault: false } : addr;
    });

    await persistAddresses(updatedList);
    return true;
  };

  const deleteAddress = async (addressId) => {
    if (!currentUser) return false;
    const currentAddresses = Array.isArray(currentUser.addresses) ? currentUser.addresses : [];
    const target = currentAddresses.find(a => a.id === addressId);
    let updatedList = currentAddresses.filter(a => a.id !== addressId);

    // If we deleted the default address, make the first remaining address default
    if (target?.isDefault && updatedList.length > 0) {
      updatedList[0] = { ...updatedList[0], isDefault: true };
    }

    await persistAddresses(updatedList);
    return true;
  };

  const setDefaultAddress = async (addressId) => {
    if (!currentUser) return false;
    const currentAddresses = Array.isArray(currentUser.addresses) ? currentUser.addresses : [];
    const updatedList = currentAddresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));

    await persistAddresses(updatedList);
    return true;
  };

  // Payment Preferences
  const updatePaymentPreferences = async (newPreferences) => {
    if (!currentUser) return;
    const currentPrefs = currentUser.paymentPreferences || {};
    const updatedPrefs = { ...currentPrefs, ...newPreferences };
    const updated = { ...currentUser, paymentPreferences: updatedPrefs };
    setCurrentUser(updated);

    try {
      localStorage.setItem('valenszo_auth_user', JSON.stringify(updated));
      localStorage.setItem(`valenszo_payment_prefs_${currentUser.id}`, JSON.stringify(updatedPrefs));
    } catch (e) {
      console.warn('Failed saving payment preferences to localStorage', e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.updateUser({
          data: { paymentPreferences: updatedPrefs }
        });
      } catch (e) {
        console.warn('Supabase auth metadata update skipped', e);
      }
    }
  };

  const userEmail = currentUser?.email?.toLowerCase().trim() || '';
  const isWhitelistedAdmin = ADMIN_EMAILS.includes(userEmail);
  const isAdmin = currentUser?.role === 'admin' || isWhitelistedAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isAdmin,
        isAuthenticating,
        isAuthInitializing,
        hasVerifiedSession,
        isAuthModalOpen,
        authModalMode,
        authModalConfig,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        updatePaymentPreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
