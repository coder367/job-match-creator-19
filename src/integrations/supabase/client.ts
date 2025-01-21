import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://clezevmhryyacxzgtkcd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZXpldm1ocnl5YWN4emd0a2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0NzE0NzAsImV4cCI6MjAyNDA0NzQ3MH0.KfWgXVhKJzXDiXBJwQeK4Hs9kXGu-LnQqJZXCQgc8Yk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});