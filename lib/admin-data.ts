import { supabase } from './supabase'

// Server-only. Lists every team member with their role + allowed tabs, joining
// auth.users (for the email) with the profiles table. Uses the service_role
// client, so this must only ever be called from admin-gated server code.
export type Member = { id: string; email: string; role: string; allowed_tabs: string[] }

export async function listMembers(): Promise<Member[]> {
  const [{ data: usersData }, { data: profiles }] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 200 }),
    supabase.from('profiles').select('id, role, allowed_tabs'),
  ])
  const pById = new Map((profiles ?? []).map(p => [p.id as string, p]))
  const users = usersData?.users ?? []
  return users
    .map(u => {
      const p = pById.get(u.id) as { role?: string; allowed_tabs?: string[] } | undefined
      return {
        id: u.id,
        email: u.email ?? '(no email)',
        role: p?.role ?? 'member',
        allowed_tabs: p?.allowed_tabs ?? [],
      }
    })
    // Admins first, then alphabetical by email.
    .sort((a, b) =>
      a.role === b.role ? a.email.localeCompare(b.email) : a.role === 'admin' ? -1 : 1,
    )
}
