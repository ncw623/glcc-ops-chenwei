'use server'
import { getUserAndProfile } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'
import { GRANTABLE_TABS } from '@/lib/tabs'

const GRANTABLE = new Set<string>(GRANTABLE_TABS.map(t => t.key))

// Set a member's allowed tabs. Re-checks the CALLER is an admin (never trust the
// client) and drops any unknown/'admin' keys, then writes via the service_role
// client (members can't update other profiles under RLS).
export async function saveMemberTabs(
  userId: string,
  tabs: string[],
): Promise<{ ok: true; tabs: string[] } | { ok: false; error: string }> {
  const { profile } = await getUserAndProfile()
  if (!profile || profile.role !== 'admin') return { ok: false, error: 'not_admin' }

  const clean = [...new Set(tabs.filter(t => GRANTABLE.has(t)))]
  const { error } = await supabase
    .from('profiles')
    .update({ allowed_tabs: clean })
    .eq('id', userId)
  if (error) return { ok: false, error: error.message }
  return { ok: true, tabs: clean }
}
