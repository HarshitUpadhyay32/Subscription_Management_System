import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ixcsplwnrwqbylivxkeq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.warn('⚠️ Supabase anon key not found. Please set VITE_SUPABASE_ANON_KEY in frontend/.env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder-anon-key');
