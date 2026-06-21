// Single source of truth for the dashboard tabs. `href` is the route; `label` is
// the nav text. The app is open access (no login), so every tab is always shown.
// Ads Report + Group-Buy are NOT listed here — they live under the Marketing tab
// (the /marketing landing page links to them), to keep the nav tidy.
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
  { key: 'marketing', href: '/marketing', label: 'Marketing' },
] as const

export type TabKey = (typeof TABS)[number]['key']

export const ALL_TAB_KEYS = TABS.map(t => t.key)
