'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TABS } from '@/lib/tabs'

// Open access (no login) — every tab is always shown.
export default function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname()

  return (
    <nav className="nav">
      {TABS.map(t => (
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
