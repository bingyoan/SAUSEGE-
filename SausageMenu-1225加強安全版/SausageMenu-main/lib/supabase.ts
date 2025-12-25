import { createClient } from '@supabase/supabase-js';

// Helper to safely access process.env without crashing in strict ESM environments if process is undefined
const getEnv = (key: string) => {
  try {
    return process.env[key];
  } catch (e) {
    return undefined;
  }
};

// 1. Try Next.js env var
// 2. Try Create React App env var
// 3. Fallback to the provided keys directly to ensure the app works immediately
const supabaseUrl =
  getEnv('NEXT_PUBLIC_SUPABASE_URL') ||
  getEnv('REACT_APP_SUPABASE_URL') ||
  '';

const supabaseAnonKey =
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
  getEnv('REACT_APP_SUPABASE_ANON_KEY') ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase environment variables are missing.');
}

// Create client with explicit strings to avoid "supabaseUrl is required" error
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);