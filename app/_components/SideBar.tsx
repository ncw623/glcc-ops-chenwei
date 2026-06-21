'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Nav from './Nav'

// Desktop: the topbar + overlay are display:none (see globals.css), so this renders
// exactly the same sidebar as before. Mobile: the topbar shows a hamburger that
// slides the <aside> in as a drawer, with a tap-to-close overlay.
//
// When signed out (loggedIn=false) it renders nothing, so the /login page shows
// on its own with no nav.
export default function SideBar({
  loggedIn,
  email,
  role,
  allowedTabs,
}: {
  loggedIn: boolean
  email: string
  role: string | null
  allowedTabs: string[]
}) {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  // Close the drawer whenever the route changes (i.e. after tapping a nav item).
  useEffect(() => { setOpen(false) }, [path])

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!loggedIn) return null

  return (
    <>
      <header className="topbar">
        <button
          className="burger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span /><span /><span />
        </button>
        <div className="brand"><span className="logo" aria-hidden="true" /> Your AI HQ</div>
      </header>

      <div
        className={`overlay${open ? ' show' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className={`side${open ? ' open' : ''}`}>
        <div className="brand"><span className="logo" aria-hidden="true" /> Your AI HQ</div>
        <Nav allowedTabs={allowedTabs} onNavigate={() => setOpen(false)} />
        <div className="side-foot">
          <p className="hint">One <code>records</code> table behind your data tabs.</p>
          <div className="acct">
            <span className="acct-who" title={email}>
              {role === 'admin' ? '★ ' : ''}{email}
            </span>
            <form action="/auth/signout" method="post">
              <button className="signout" type="submit">Sign out</button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
