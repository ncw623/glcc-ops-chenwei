export const dynamic = 'force-dynamic'

// The Reports tab embeds a self-contained financial-statements app (its own
// theming, Excel import, charts) in an isolated iframe so its styles/scripts
// never collide with the dashboard. The static file lives at
// public/reports/financial-statement.html and syncs its data to the server
// (see /api/reports-state) so imports persist and are shared across devices.
export default function Reports() {
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
