/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create a real client if we have a valid URL, otherwise use a dummy to prevent crash at module load
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-key');

export function isSupabaseConfigured() {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl.startsWith('http') && supabaseUrl !== 'https://placeholder-project.supabase.co';
}
