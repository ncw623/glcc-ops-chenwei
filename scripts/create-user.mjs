// Create (or update) a team member's login + access.
// Usage:
//   npm run user:add -- <email> admin
//   npm run user:add -- <email> member dashboard,tasks,content
//
// Uses the service_role key (admin API) to create the auth user, then sets their
// role + allowed tabs in the `profiles` table. The user sets their own PASSWORD
// afterwards in the Supabase dashboard (Authentication → Users) — never here.
import { createClient } from '@supabase/supabase-js'

const [, , email, role = 'member', tabsArg] = process.argv
if (!email) {
  console.error('Usage: npm run user:add -- <email> <admin|member> [tab,tab,...]')
  process.exit(1)
}

const url = (process.env.SUPABASE_URL ?? '').trim().replace(/\/+$/, '').replace(/\/rest\/v\d+$/i, '')
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()
if (!url || !key) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const ALL = ['dashboard', 'pipeline', 'money', 'tasks', 'projects', 'contacts', 'content', 'agents']
const MEMBER_DEFAULT = ['dashboard', 'pipeline', 'tasks', 'projects', 'contacts', 'content']
const tabs = role === 'admin'
  ? ALL
  : (tabsArg ? tabsArg.split(',').map(s => s.trim()).filter(Boolean) : MEMBER_DEFAULT)

const admin = createClient(url, key, { auth: { persistSession: false } })

// A throwaway password just so the account can be created. The real one is set
// by the user in the Supabase dashboard.
const tempPassword = 'Tmp-' + Math.random().toString(36).slice(2, 12) + 'X9!'

let userId
let isNew = false
const created = await admin.auth.admin.createUser({ email, password: tempPassword, email_confirm: true })

if (created.error) {
  if (/already|registered|exists/i.test(created.error.message)) {
    const { data, error } = await admin.auth.admin.listUsers()
    if (error) { console.error('lookup failed:', error.message); process.exit(1) }
    userId = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase())?.id
    if (!userId) { console.error('User exists but was not found in the list.'); process.exit(1) }
    console.log(`User ${email} already existed — updating role/tabs only (password unchanged).`)
  } else {
    console.error('createUser failed:', created.error.message)
    process.exit(1)
  }
} else {
  userId = created.data.user.id
  isNew = true
  console.log(`Created auth user: ${email}`)
}

const { error: pErr } = await admin
  .from('profiles')
  .upsert({ id: userId, role, allowed_tabs: tabs }, { onConflict: 'id' })
if (pErr) { console.error('profile upsert failed:', pErr.message); process.exit(1) }

console.log(`\n✅ ${email}`)
console.log(`   role:        ${role}`)
console.log(`   allowed_tabs: [${tabs.join(', ')}]`)
if (isNew) {
  console.log(`\n🔐 Set your real password in Supabase:`)
  console.log(`   Authentication → Users → ${email} → (⋯) → "Reset password" / set a new password.`)
}
