import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xpqwodjfjxjvyotpvhql.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwcXdvZGpmanhqdnlvdHB2aHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjI2NTYsImV4cCI6MjA2NjIzODY1Nn0.V0ixLnGd4ZIGgTfkwGHTEfe9ZtgElMKKHPwd535UTXc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
