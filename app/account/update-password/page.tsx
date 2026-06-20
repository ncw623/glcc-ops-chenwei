import { requireUser } from '@/lib/supabase-server'
import UpdatePasswordForm from './UpdatePasswordForm'

export const dynamic = 'force-dynamic'

// Reached either from a password-reset email (via /auth/callback, which signs the
// user in) or by any signed-in user who wants to change their password. The
// requireUser() guard sends signed-out visitors to /login.
export default async function UpdatePasswordPage() {
  await requireUser()
  return (
    <div className="login-wrap">
      <UpdatePasswordForm />
    </div>
  )
}
