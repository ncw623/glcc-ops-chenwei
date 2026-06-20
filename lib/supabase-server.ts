import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { ALL_TAB_KEYS, tabHref } from './tabs'

// Server-side Supabase client tied to the signed-in user's session (cookies).
// Uses the PUBLIC anon key + the user's auth cookie — RLS applies, so this is
// SEPARATE from lib/supabase.ts (which uses the all-powerful service_role key).

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// True once the public auth env vars are actually filled in.
export const authConfigured = Boolean(URL && ANON)

export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(URL!, ANON!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component where cookies are read-only —
          // the middleware refreshes the session cookie instead. Safe to ignore.
        }
      },
    },
  })
}

export type Profile = { id: string; role: string; allowed_tabs: string[] }

export async function getUserAndProfile(): Promise<{ user: { id: string; email?: string } | null; profile: Profile | null }> {
  if (!authConfigured) return { user: null, profile: null }
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, profile: null }
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, allowed_tabs')
    .eq('id', user.id)
    .single()
  return { user: { id: user.id, email: user.email }, profile: (profile as Profile | null) ?? null }
}

// Redirect to /login if not signed in. Returns the user + profile otherwise.
export async function requireUser() {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/login')
  return { user, profile }
}

// Can this profile see a given tab key? Admin sees everything.
export function canSeeTab(profile: Profile | null, tab: string): boolean {
  if (!profile) return false
  if (profile.role === 'admin') return true
  return (profile.allowed_tabs ?? []).includes(tab)
}

// The list of tab keys a profile may see (admin = all).
export function allowedTabKeys(profile: Profile | null): string[] {
  if (!profile) return []
  if (profile.role === 'admin') return [...ALL_TAB_KEYS]
  return profile.allowed_tabs ?? []
}

// Server-side gate for a protected page. Redirects to /login if signed out, or
// away from a tab the user isn't allowed to see (the real, un-bypassable check).
export async function requireTab(tab: string) {
  const { user, profile } = await requireUser()
  if (!canSeeTab(profile, tab)) {
    const first = allowedTabKeys(profile)[0]
    redirect(tabHref(first) ?? '/no-access')
  }
  return { user, profile }
}
