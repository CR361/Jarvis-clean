import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Create a dummy client that returns empty data but doesn't throw errors
const createDummyClient = () => {
  return {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  };
};

// Singleton pattern for client-side Supabase client
let clientSideSupabaseClient: any = null;

export const createClientSideSupabaseClient = () => {
  if (clientSideSupabaseClient) return clientSideSupabaseClient;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables are missing");
    return createDummyClient();
  }

  try {
    clientSideSupabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return clientSideSupabaseClient;
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return createDummyClient();
  }
};

// Server-side Supabase client
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase server environment variables are missing");
    return createDummyClient();
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("Error creating server Supabase client:", error);
    return createDummyClient();
  }
};
