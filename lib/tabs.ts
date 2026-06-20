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
] as const

export type TabKey = (typeof TABS)[number]['key']

export const ALL_TAB_KEYS = TABS.map(t => t.key)

export function tabHref(key?: string): string | undefined {
  return TABS.find(t => t.key === key)?.href
}
