import './globals.css'
import SideBar from './_components/SideBar'
import ConnStatus from './_components/ConnStatus'

export const metadata = {
  title: 'Your AI HQ',
  description: 'GLCC Starter — your business in one place',
}

// Ensures phones render at device width (no auto-zoom, mobile-friendly scaling).
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <SideBar />
          <main className="main"><ConnStatus />{children}</main>
        </div>
      </body>
    </html>
  )
}
