import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  saveProfileToSupabase, 
  fetchProfileByEmail, 
  fetchProfileById 
} from '../services/supabaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default pre-configured demo credentials for frictionless evaluation
export const DEMO_ACCOUNTS = {
  admin: {
    id: 'usr_valenszo_admin_001',
    email: 'admin@valenszo.my',
    name: "Directeur de l'Atelier",
    role: 'admin',
    phone: '+60 12-888 2026',
    address: 'Maison Valenszo Boutique, Pavilion Kuala Lumpur',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan',
    zip: '55100',
    country: 'Malaysia'
  },
  customer: {
    id: 'usr_valenszo_cust_001',
    email: 'adrien.laurent@valenszo.my',
    name: 'Adrien Laurent',
    role: 'customer',
    phone: '+60 12-345 6789',
    address: '18 Jalan Sultan Ismail, Penthouse Suite 22A',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan',
    zip: '50250',
    country: 'Malaysia'
  }
};

export const AuthProvider = ({ children }) => {
  // Current active user (null = Guest mode)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('valenszo_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse cached auth user', e);
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

  // Loading state
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Sync session changes to localStorage and Supabase public.profiles
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('valenszo_auth_user', JSON.stringify(currentUser));
      if (isSupabaseConfigured) {
        saveProfileToSupabase(currentUser).catch((err) => {
          console.warn('Background Supabase profile sync warning:', err);
        });
      }
    } else {
      localStorage.removeItem('valenszo_auth_user');
    }
  }, [currentUser]);

  // Open Auth Dialog with optional custom messaging and callback
  const openAuthModal = useCallback(({ mode = 'signin', onComplete = null, title = null, subtitle = null } = {}) => {
    setAuthModalMode(mode);
    setAuthModalConfig({
      title: title || (mode === 'signin' ? 'Maison Valenszo Sign In' : 'Create Maison Account'),
      subtitle: subtitle || (mode === 'signin' ? 'Sign in to access your personal fragrance portfolio and tracked orders.' : 'Join Maison Valenszo to curate your olfactory collection and track deliveries.'),
      onComplete
    });
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalConfig({ title: null, subtitle: null, onComplete: null });
  }, []);

  // Helper: Retrieve registered users list from storage
  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem('valenszo_registered_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Sign In Handler
  const login = async (email, password) => {
    setIsAuthenticating(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Check Demo Admin Account
      if (cleanEmail === DEMO_ACCOUNTS.admin.email.toLowerCase() && password === 'MaisonValenszo2026!') {
        saveProfileToSupabase(DEMO_ACCOUNTS.admin).catch(() => {});
        setCurrentUser(DEMO_ACCOUNTS.admin);
        setIsAuthModalOpen(false);
        if (authModalConfig.onComplete) authModalConfig.onComplete(DEMO_ACCOUNTS.admin);
        return { success: true, user: DEMO_ACCOUNTS.admin };
      }

      // 2. Check Demo Customer Account
      if (cleanEmail === DEMO_ACCOUNTS.customer.email.toLowerCase() && password === 'MaisonValenszo2026!') {
        saveProfileToSupabase(DEMO_ACCOUNTS.customer).catch(() => {});
        setCurrentUser(DEMO_ACCOUNTS.customer);
        setIsAuthModalOpen(false);
        if (authModalConfig.onComplete) authModalConfig.onComplete(DEMO_ACCOUNTS.customer);
        return { success: true, user: DEMO_ACCOUNTS.customer };
      }

      // 3. Check Supabase public.profiles table
      const dbProfile = await fetchProfileByEmail(cleanEmail);
      const registered = getRegisteredUsers();
      const matchedLocal = registered.find(u => u.email.toLowerCase() === cleanEmail);

      if (dbProfile) {
        if (!matchedLocal || matchedLocal.password === password) {
          setCurrentUser(dbProfile);
          setIsAuthModalOpen(false);
          if (authModalConfig.onComplete) authModalConfig.onComplete(dbProfile);
          return { success: true, user: dbProfile };
        } else if (matchedLocal && matchedLocal.password !== password) {
          return { success: false, error: 'Incorrect password for this Maison account.' };
        }
      }

      // 4. Attempt Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password
          });

          if (data?.user && !error) {
            const userObj = {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
              phone: data.user.user_metadata?.phone || '',
              address: data.user.user_metadata?.address || '',
              city: data.user.user_metadata?.city || 'Kuala Lumpur',
              state: data.user.user_metadata?.state || 'Wilayah Persekutuan',
              zip: data.user.user_metadata?.zip || '',
              country: data.user.user_metadata?.country || 'Malaysia',
              role: data.user.user_metadata?.role || (cleanEmail.includes('admin') ? 'admin' : 'customer')
            };

            // Sync to profiles table
            saveProfileToSupabase(userObj).catch(() => {});

            setCurrentUser(userObj);
            setIsAuthModalOpen(false);
            if (authModalConfig.onComplete) authModalConfig.onComplete(userObj);
            return { success: true, user: userObj };
          }
        } catch (supaErr) {
          console.warn('Supabase auth sign-in warning:', supaErr.message);
        }
      }

      // 5. Check Registered Local Store Accounts
      if (matchedLocal) {
        if (matchedLocal.password === password) {
          const { password: _, ...safeUser } = matchedLocal;
          saveProfileToSupabase(safeUser).catch(() => {});
          setCurrentUser(safeUser);
          setIsAuthModalOpen(false);
          if (authModalConfig.onComplete) authModalConfig.onComplete(safeUser);
          return { success: true, user: safeUser };
        }
        return { success: false, error: 'Incorrect password for this Maison account.' };
      }

      return { 
        success: false, 
        error: 'No account found with this email. Please verify your email or click "Create Account".' 
      };
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Register Handler
  const register = async (userData) => {
    setIsAuthenticating(true);
    const cleanEmail = userData.email.trim().toLowerCase();

    try {
      const registered = getRegisteredUsers();
      if (registered.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email address already exists.' };
      }

      // Check if already in Supabase profiles
      const existingInDb = await fetchProfileByEmail(cleanEmail);
      if (existingInDb) {
        return { success: false, error: 'An account with this email address already exists in the database.' };
      }

      const userId = 'usr_' + Math.random().toString(36).substring(2, 10);
      const newUser = {
        id: userId,
        email: cleanEmail,
        name: userData.name?.trim() || 'Maison Client',
        phone: userData.phone?.trim() || '',
        address: userData.address?.trim() || '',
        city: userData.city?.trim() || 'Kuala Lumpur',
        state: userData.state?.trim() || 'Wilayah Persekutuan',
        zip: userData.zip?.trim() || '',
        country: 'Malaysia',
        role: cleanEmail.includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };

      // 1. Save directly to Supabase public.profiles table
      await saveProfileToSupabase(newUser);

      // 2. Save to registered list with password for subsequent logins
      registered.push({ ...newUser, password: userData.password });
      localStorage.setItem('valenszo_registered_users', JSON.stringify(registered));

      // 3. Also attempt background Supabase Auth registration
      if (isSupabaseConfigured && supabase) {
        supabase.auth.signUp({
          email: cleanEmail,
          password: userData.password,
          options: {
            data: {
              full_name: newUser.name,
              phone: newUser.phone,
              address: newUser.address,
              city: newUser.city,
              state: newUser.state,
              zip: newUser.zip,
              role: newUser.role
            }
          }
        }).catch(err => console.warn('Supabase background signup notice:', err.message));
      }

      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      if (authModalConfig.onComplete) authModalConfig.onComplete(newUser);

      return { success: true, user: newUser };
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign Out Handler
  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
    localStorage.removeItem('valenszo_auth_user');
  };

  // Update Profile
  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      // Save directly to Supabase profiles
      saveProfileToSupabase(updated).catch(err => console.warn('Supabase profile update warning:', err));
      // Also update in registered list
      const registered = getRegisteredUsers();
      const idx = registered.findIndex(u => u.id === prev.id || u.email === prev.email);
      if (idx !== -1) {
        registered[idx] = { ...registered[idx], ...updatedFields };
        localStorage.setItem('valenszo_registered_users', JSON.stringify(registered));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isAdmin: currentUser?.role === 'admin',
        isAuthenticating,
        isAuthModalOpen,
        authModalMode,
        authModalConfig,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
