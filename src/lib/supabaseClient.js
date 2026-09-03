import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://tzrmbinkjkaewdnokqlo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cm1iaW5ramthZXdkbm9rcWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzcxODcsImV4cCI6MjEwMzkxMzE4N30.GNwmBrKGVaLgyvmwb6uOM_qWVYraROco2hNVwnhD0Jo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your_supabase_project_url')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
