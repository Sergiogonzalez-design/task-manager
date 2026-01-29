import { createClient } from '@supabase/supabase-js'

// This allows the app to work both locally AND on Vercel
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://dsovwbektupnwtcsvgaq.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb3Z3YmVrdHVwbnd0Y3N2Z2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzgxODAsImV4cCI6MjA4NDk1NDE4MH0.3ECAe-EJdVAfuwi2mJvxa3_K8i7uBAV4ndrKbEg2JYw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

