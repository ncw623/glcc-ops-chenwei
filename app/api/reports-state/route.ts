import { supabase } from '@/lib/supabase'

// Server-side store for the Reports (financial-statement) app's data, so imports
// persist and are SHARED across everyone (single 'global' row). The app's iframe
// hydrates from GET on load and debounce-saves to PUT on change. Service_role
// only — RLS blocks the public key, and this route is the sole gateway.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const ROW_ID = 'global'

export async function GET() {
  const { data, error } = await supabase
    .from('reports_state')
    .select('data, updated_at')
    .eq('id', ROW_ID)
    .maybeSingle()
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true, data: data?.data ?? null, updated_at: data?.updated_at ?? null })
}

export async function PUT(req: Request) {
  let body: { data?: unknown }
  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'bad_json' }, { status: 400 })
  }
  if (typeof body?.data === 'undefined') {
    return Response.json({ ok: false, error: 'no_data' }, { status: 400 })
  }
  const { error } = await supabase
    .from('reports_state')
    .upsert({ id: ROW_ID, data: body.data, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
