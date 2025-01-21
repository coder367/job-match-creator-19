import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://clezevmhryyacxzgtkcd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZXpldm1ocnl5YWN4emd0a2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU4NDQ4MDAsImV4cCI6MjAyMTQyMDgwMH0.ZB94RLQGgtw0jBWGNKwl89u8nSRkzYBgrVZPNxQWXZE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
});