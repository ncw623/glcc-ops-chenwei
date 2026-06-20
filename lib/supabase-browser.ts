import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client for the /login form. Uses the PUBLIC anon key,
// which is safe to ship to the browser — Row Level Security protects the data.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
