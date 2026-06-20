'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function ForgotForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/account/update-password`,
      })
      setLoading(false)
      if (error) { setError(error.message); return }
      setSent(true)
    } catch {
      setLoading(false)
      setError('Could not send the reset email. Try again in a moment.')
    }
  }

  if (sent) {
    return (
      <div className="login-card">
        <div className="brand"><span className="logo" aria-hidden="true" /> Your AI HQ</div>
        <h1 className="login-h">Check your email</h1>
        <p className="login-sub">
          If an account exists for <strong>{email.trim()}</strong>, we&apos;ve sent a link to
          reset your password. Open it on this device, then set a new password.
        </p>
        <a className="btn login-btn" href="/login" style={{ textAlign: 'center', textDecoration: 'none' }}>
          Back to sign in
        </a>
      </div>
    )
  }

  return (
    <form className="login-card" onSubmit={onSubmit}>
      <div className="brand"><span className="logo" aria-hidden="true" /> Your AI HQ</div>
      <h1 className="login-h">Reset password</h1>
      <p className="login-sub">Enter your team email and we&apos;ll send you a reset link.</p>

      <label className="login-label">
        Email
        <input
          className="login-input"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>

      {error && <p className="login-error">{error}</p>}

      <button className="btn login-btn" type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send reset link'}
      </button>
      <a className="login-link" href="/login">Back to sign in</a>
    </form>
  )
}
