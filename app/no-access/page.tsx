import { requireUser } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// Shown when a signed-in user has no tabs they're allowed to see yet.
export default async function NoAccess() {
  await requireUser() // still must be signed in to land here
  return (
    <>
      <h1 className="ph">No access yet</h1>
      <p className="cap">Your account doesn&apos;t have any tabs enabled.</p>
      <p className="empty">
        Ask your admin to grant you access. Once they do, your tabs will appear in the menu.
      </p>
    </>
  )
}
