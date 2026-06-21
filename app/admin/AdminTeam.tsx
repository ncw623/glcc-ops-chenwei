'use client'
import { useState, useTransition } from 'react'
import { GRANTABLE_TABS } from '@/lib/tabs'
import { saveMemberTabs } from './actions'
import type { Member } from '@/lib/admin-data'

// One row per teammate. Members get a grid of tab toggles that save instantly;
// admins are shown read-only (they always see everything).
export default function AdminTeam({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return <p className="cap">No team members yet. Add one with <code>npm run user:add</code>.</p>
  }
  return (
    <div className="admin-list">
      {members.map(m => <MemberRow key={m.id} member={m} />)}
    </div>
  )
}

function MemberRow({ member }: { member: Member }) {
  const [tabs, setTabs] = useState<string[]>(member.allowed_tabs)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  const isAdmin = member.role === 'admin'

  function toggle(key: string) {
    const next = tabs.includes(key) ? tabs.filter(t => t !== key) : [...tabs, key]
    const prev = tabs
    setTabs(next)            // optimistic
    setError('')
    setSaved(false)
    startTransition(async () => {
      const res = await saveMemberTabs(member.id, next)
      if (res.ok) {
        setTabs(res.tabs)
        setSaved(true)
        setTimeout(() => setSaved(false), 1500)
      } else {
        setTabs(prev)         // revert on failure
        setError(res.error === 'not_admin' ? 'Not allowed.' : 'Save failed — try again.')
      }
    })
  }

  return (
    <div className="admin-card">
      <div className="admin-head">
        <span className="admin-email" title={member.email}>
          {isAdmin ? '★ ' : ''}{member.email}
        </span>
        <span className="admin-status">
          {isAdmin ? <em className="admin-role">Admin · all access</em>
            : error ? <span className="admin-err">{error}</span>
            : pending ? 'Saving…'
            : saved ? '✓ Saved' : ''}
        </span>
      </div>

      {isAdmin ? (
        <p className="admin-note">Admins see every tab automatically.</p>
      ) : (
        <div className="admin-tabs">
          {GRANTABLE_TABS.map(t => {
            const on = tabs.includes(t.key)
            return (
              <button
                key={t.key}
                type="button"
                className={`admin-chip${on ? ' on' : ''}`}
                aria-pressed={on}
                disabled={pending}
                onClick={() => toggle(t.key)}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
