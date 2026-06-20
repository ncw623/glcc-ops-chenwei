// Set a user's password. You type it into YOUR OWN terminal — the input is
// hidden (shown as ****) and never leaves your machine.
// Usage: npm run user:password -- <email>
import { createClient } from '@supabase/supabase-js'
import readline from 'node:readline'

const email = process.argv[2]
if (!email) {
  console.error('Usage: npm run user:password -- <email>')
  process.exit(1)
}

const url = (process.env.SUPABASE_URL ?? '').trim().replace(/\/+$/, '').replace(/\/rest\/v\d+$/i, '')
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()
if (!url || !key) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}
const admin = createClient(url, key, { auth: { persistSession: false } })

// Prompt for a password, masking the typed characters with *.
function askHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    let first = true
    rl._writeToOutput = (str) => {
      if (first) { rl.output.write(query); first = false; return }
      if (str.includes('\n') || str.includes('\r')) { rl.output.write('\n'); return }
      rl.output.write('*')
    }
    rl.question(query, (value) => { rl.close(); resolve(value) })
  })
}

const pw = (await askHidden(`New password for ${email}: `)).trim()
if (pw.length < 6) {
  console.error('\nPassword must be at least 6 characters.')
  process.exit(1)
}

const { data: list, error: listErr } = await admin.auth.admin.listUsers()
if (listErr) { console.error('lookup failed:', listErr.message); process.exit(1) }
const user = list.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
if (!user) { console.error('User not found:', email); process.exit(1) }

const { error } = await admin.auth.admin.updateUserById(user.id, { password: pw })
if (error) { console.error('Failed:', error.message); process.exit(1) }

console.log(`\n✅ Password set for ${email}. Sign in at /login with this email + password.`)
