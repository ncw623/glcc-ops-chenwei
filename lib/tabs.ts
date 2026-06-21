// Single source of truth for the 8 tabs. `key` is what we store in
// profiles.allowed_tabs; `href` is the route; `label` is the nav text.
export const TABS = [
  { key: 'dashboard', href: '/',          label: 'Dashboard' },
  { key: 'pipeline',  href: '/pipeline',  label: 'Pipeline'  },
  { key: 'money',     href: '/money',     label: 'Money'     },
  { key: 'tasks',     href: '/tasks',     label: 'Tasks'     },
  { key: 'projects',  href: '/projects',  label: 'Projects'  },
  { key: 'contacts',  href: '/contacts',  label: 'Contacts'  },
  { key: 'content',   href: '/content',   label: 'Content'   },
  { key: 'agents',    href: '/agents',    label: 'Agents'    },
  { key: 'reports',   href: '/reports',   label: 'Reports'   },
  { key: 'admin',     href: '/admin',     label: 'Admin'     },
] as const

// The data/feature tabs an admin can grant to a member. Excludes 'admin' itself —
// admin access is a role, set via the user:add script, not a per-tab toggle.
export const GRANTABLE_TABS = TABS.filter(t => t.key !== 'admin')

export type TabKey = (typeof TABS)[number]['key']

export const ALL_TAB_KEYS = TABS.map(t => t.key)

export function tabHref(key?: string): string | undefined {
  return TABS.find(t => t.key === key)?.href
}
