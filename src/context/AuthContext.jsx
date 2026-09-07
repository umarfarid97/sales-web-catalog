import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  saveProfileToSupabase, 
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

export const AuthProvider = ({ children }) => {
  // Current active user (null = Guest mode)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('valenszo_auth_user');
      return saved ? JSON.parse(saved) : null;
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

  // Loading state
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Sync Supabase Auth Session
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // 1. Initial Session Check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfileById(session.user.id);
        if (profile) {
          setCurrentUser(profile);
          localStorage.setItem('valenszo_auth_user', JSON.stringify(profile));
        } else {
          // Construct user from metadata
          const fallbackUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            phone: session.user.user_metadata?.phone || '',
            address: session.user.user_metadata?.address || '',
            city: session.user.user_metadata?.city || 'Kuala Lumpur',
            state: session.user.user_metadata?.state || 'Wilayah Persekutuan',
            zip: session.user.user_metadata?.zip || '50250',
            country: 'Malaysia',
            role: session.user.user_metadata?.role || 'customer'
          };
          setCurrentUser(fallbackUser);
          localStorage.setItem('valenszo_auth_user', JSON.stringify(fallbackUser));
          saveProfileToSupabase(fallbackUser).catch(() => {});
        }
      }
    });

    // 2. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfileById(session.user.id);
        const resolved = profile || {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          role: session.user.user_metadata?.role || 'customer'
        };
        setCurrentUser(resolved);
        localStorage.setItem('valenszo_auth_user', JSON.stringify(resolved));
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        localStorage.removeItem('valenszo_auth_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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
        return { success: false, error: error.message || 'Invalid email or password.' };
      }

      if (data?.user) {
        const profile = await fetchProfileById(data.user.id);
        const userObj = profile || {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          phone: data.user.user_metadata?.phone || '',
          address: data.user.user_metadata?.address || '',
          city: data.user.user_metadata?.city || 'Kuala Lumpur',
          state: data.user.user_metadata?.state || 'Wilayah Persekutuan',
          zip: data.user.user_metadata?.zip || '50250',
          country: 'Malaysia',
          role: data.user.user_metadata?.role || 'customer'
        };

        setCurrentUser(userObj);
        localStorage.setItem('valenszo_auth_user', JSON.stringify(userObj));
        setIsAuthModalOpen(false);
        if (authModalConfig.onComplete) authModalConfig.onComplete(userObj);
        return { success: true, user: userObj };
      }

      return { success: false, error: 'Failed to authenticate with Maison Atelier.' };
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
            full_name: userData.name?.trim() || 'Maison Client',
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
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const newUser = {
          id: data.user.id,
          email: cleanEmail,
          name: userData.name?.trim() || 'Maison Client',
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
