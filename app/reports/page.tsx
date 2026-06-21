import { requireTab } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// The Reports tab embeds a self-contained financial-statements app (its own
// theming, Excel import, charts, and IndexedDB storage) in an isolated iframe so
// its styles/scripts never collide with the dashboard. The static file lives at
// public/reports/financial-statement.html. Access is gated by requireTab below;
// the financial data itself lives only in the viewer's own browser (IndexedDB).
export default async function Reports() {
  await requireTab('reports')
  return (
    <div className="embed-wrap">
      <iframe
        className="embed-frame"
        src="/reports/financial-statement.html"
        title="Financial Statements"
      />
    </div>
  )
}
