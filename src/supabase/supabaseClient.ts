import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mbtdvrtwzwmagsuqoely.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idGR2cnR3endtYWdzdXFvZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwODUzMTIsImV4cCI6MjA2NjY2MTMxMn0.-MAWL2bmKKUvBNf9iffYOaqzEyFKzqEgA9Dc3VOFrzY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
