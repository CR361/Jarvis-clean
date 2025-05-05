// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,  // Supabase URL uit je omgeving
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Supabase Anon Key uit je omgeving
);

export default supabase;
