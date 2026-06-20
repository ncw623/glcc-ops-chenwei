'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TABS } from '@/lib/tabs'

// Renders only the tabs this user is allowed to see. This is the FIRST of two
// enforcement points — the server-side requireTab() guard on each page is the
// one that actually blocks direct-URL access.
export default function Nav({
  allowedTabs,
  onNavigate,
}: {
  allowedTabs: string[]
  onNavigate?: () => void
}) {
  const path = usePathname()
  const visible = TABS.filter(t => allowedTabs.includes(t.key))

  return (
    <nav className="nav">
      {visible.map(t => (
        <Link
          key={t.href}
          href={t.href}
          className={path === t.href ? 'active' : ''}
          onClick={onNavigate}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}
