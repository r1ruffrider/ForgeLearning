import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True when Supabase env vars are present. When false, the /api/waitlist
 * route falls back to logging signups so local-only mode still works.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let cached: SupabaseClient | null = null;

/**
 * Returns a Supabase client using the anon/publishable key, or null when the
 * project isn't configured. The anon key is safe to use here because the
 * `waitlist` table is protected by an INSERT-only RLS policy for the anon role.
 * The service_role key is never referenced.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (cached) return cached;

  cached = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
    auth: { persistSession: false },
  });
  return cached;
}

// Postgres unique-violation error code. We treat a duplicate email as success
// (the person is already on the list) rather than surfacing an error.
export const PG_UNIQUE_VIOLATION = "23505";
