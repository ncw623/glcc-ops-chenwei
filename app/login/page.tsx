import { redirect } from 'next/navigation'
import { getUserAndProfile } from '@/lib/supabase-server'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  // Already signed in? Skip the form.
  const { user } = await getUserAndProfile()
  if (user) redirect('/')

  return (
    <div className="login-wrap">
      <LoginForm />
    </div>
  )
}
