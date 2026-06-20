import { NextResponse } from 'next/server'
import { createServerSupabase, authConfigured } from '@/lib/supabase-server'

export async function POST(request: Request) {
  if (authConfigured) {
    const supabase = await createServerSupabase()
    await supabase.auth.signOut()
  }
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 })
}
