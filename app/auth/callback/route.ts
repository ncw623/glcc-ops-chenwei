import { NextResponse } from 'next/server'
import { createServerSupabase, authConfigured } from '@/lib/supabase-server'

// Handles the link from a password-reset email. Supabase redirects here with a
// one-time `code`; we exchange it for a session, then send the user to the
// page where they set a new password.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/account/update-password'

  if (code && authConfigured) {
    const supabase = await createServerSupabase()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, url.origin))
  }

  return NextResponse.redirect(new URL('/login?error=reset_link', url.origin))
}
