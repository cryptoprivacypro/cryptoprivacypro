import { createClient } from "@supabase/supabase-js";

// Supabase URL
const supabaseUrl = "https://ifvzjrkflxhwjrnjksky.supabase.co";
// Anon public key
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdnpqcmtmbHhod2pybmprc2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MTUyMDksImV4cCI6MjA2OTE5MTIwOX0.wV6N7glKPUq5ax6AJQ5x4sznVlL-u-tutO-Ucm-4TNo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

