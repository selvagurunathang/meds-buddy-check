import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://aktndperhuvvpcypgbcd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrdG5kcGVyaHV2dnBjeXBnYmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTAyODQsImV4cCI6MjA2NjA2NjI4NH0.0zig_VALly7iEES3FuRaDGDTSY9TJCdT581MO4Y_eOY"

console.log(supabaseUrl, supabaseAnonKey);
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Password reset
  resetPasswordForEmail: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  }
}

// Sample function to test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('medications').select('*').limit(1);
    if (error) throw error;
    console.log('Supabase connection successful. Sample data:', data);
    return data;
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return null;
  }
} 