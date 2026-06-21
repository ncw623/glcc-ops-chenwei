import { requireAdmin } from '@/lib/supabase-server'
import { listMembers } from '@/lib/admin-data'
import AdminTeam from './AdminTeam'

export const dynamic = 'force-dynamic'

// Admin-only team-management page. Admins toggle which tabs each member can see;
// the toggles call a server action that re-checks admin and writes via service_role.
export default async function Admin() {
  await requireAdmin()
  const members = await listMembers()
  return (
    <>
      <h1 className="ph">Team access</h1>
      <p className="cap">Tap a tab to open or close it for a teammate — changes save instantly.</p>
      <AdminTeam members={members} />
    </>
  )
}
