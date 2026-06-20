import './globals.css'
import SideBar from './_components/SideBar'
import ConnStatus from './_components/ConnStatus'
import { getUserAndProfile, allowedTabKeys } from '@/lib/supabase-server'

export const metadata = {
  title: 'Your AI HQ',
  description: 'GLCC Starter — your business in one place',
}

// Ensures phones render at device width (no auto-zoom, mobile-friendly scaling).
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Load the signed-in user's role + allowed tabs so the nav shows only what
  // they're permitted to see. (Server-side guards still enforce the real block.)
  const { user, profile } = await getUserAndProfile()

  return (
    <html lang="en">
      <body>
        <div className="app">
          <SideBar
            loggedIn={!!user}
            email={user?.email ?? ''}
            role={profile?.role ?? null}
            allowedTabs={allowedTabKeys(profile)}
          />
          <main className="main"><ConnStatus />{children}</main>
        </div>
      </body>
    </html>
  )
}
