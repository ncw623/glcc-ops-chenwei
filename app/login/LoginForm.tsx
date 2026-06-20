'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('Could not reach sign-in. Check that the Supabase anon key is set.')
      setLoading(false)
    }
  }

  return (
    <form className="login-card" onSubmit={onSubmit}>
      <div className="brand"><span className="logo" aria-hidden="true" /> Your AI HQ</div>
      <h1 className="login-h">Sign in</h1>
      <p className="login-sub">Use your team email and password.</p>

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

      <label className="login-label">
        Password
        <input
          className="login-input"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>

      {error && <p className="login-error">{error}</p>}

      <button className="btn login-btn" type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
