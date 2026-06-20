import { redirect } from 'next/navigation'
import { getUserAndProfile } from '@/lib/supabase-server'
import ForgotForm from './ForgotForm'

export const dynamic = 'force-dynamic'

export default async function ForgotPasswordPage() {
  const { user } = await getUserAndProfile()
  if (user) redirect('/')
  return (
    <div className="login-wrap">
      <ForgotForm />
    </div>
  )
}
