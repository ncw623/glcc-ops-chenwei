'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function UpdatePasswordForm() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (pw.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (pw !== pw2) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: pw })
      if (error) { setError(error.message); setLoading(false); return }
      setDone(true)
      setLoading(false)
      setTimeout(() => { router.push('/'); router.refresh() }, 1200)
    } catch {
      setError('Could not update the password. Try the reset link again.')
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="login-card">
        <div className="brand"><span className="logo" aria-hidden="true" /> Your AI HQ</div>
        <h1 className="login-h">Password updated</h1>
        <p className="login-sub">Taking you to your dashboard…</p>
      </div>
    )
  }

  return (
    <form className="login-card" onSubmit={onSubmit}>
      <div className="brand"><span className="logo" aria-hidden="true" /> Your AI HQ</div>
      <h1 className="login-h">Set a new password</h1>
      <p className="login-sub">Choose a password you&apos;ll use to sign in.</p>

      <label className="login-label">
        New password
        <input
          className="login-input"
          type="password"
          autoComplete="new-password"
          required
          value={pw}
          onChange={e => setPw(e.target.value)}
        />
      </label>

      <label className="login-label">
        Confirm password
        <input
          className="login-input"
          type="password"
          autoComplete="new-password"
          required
          value={pw2}
          onChange={e => setPw2(e.target.value)}
        />
      </label>

      {error && <p className="login-error">{error}</p>}

      <button className="btn login-btn" type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Update password'}
      </button>
    </form>
  )
}
