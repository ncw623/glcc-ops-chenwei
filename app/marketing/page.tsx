import Link from 'next/link'
import { getRecords, rm } from '@/lib/records'

export const dynamic = 'force-dynamic'

// Marketing hub. The two marketing reports (Ads Report + Group-Buy) live under
// this single nav tab to keep the sidebar tidy — this page links into them and
// shows a one-line summary of each.
const SPEND_KEYS = ['shopee_cpas', 'lazada_cpas', 'awa', 'lead_to_pm']
const SALES_KEYS = ['fb_new', 'fb_repeat', 'insta_new', 'insta_repeat', 'shopee_sales', 'lazada_sales', 'other_sales']
const sumKeys = (r: { meta?: Record<string, any> }, keys: string[]) =>
  keys.reduce((s, k) => s + Number(r.meta?.[k] || 0), 0)

export default async function Marketing() {
  const all = await getRecords()

  const adDays = all.filter(r => r.category === 'ad')
  const adSpend = adDays.reduce((s, r) => s + sumKeys(r, SPEND_KEYS), 0)
  const adSales = adDays.reduce((s, r) => s + sumKeys(r, SALES_KEYS), 0)
  const roas = adSpend ? adSales / adSpend : 0

  const gb = all.filter(r => r.category === 'groupbuy')
  const gbActive = gb.filter(r => ['active', 'open'].includes(r.status)).length
  const gbRevenue = gb.reduce((s, r) => s + Number(r.amount || 0), 0)

  return (
    <>
      <h1 className="ph">Marketing</h1>
      <p className="cap">Ads &amp; group-buy reports</p>
      <div className="grid">
        <Link href="/ads-report" className="stat" style={{ textDecoration: 'none' }}>
          <p className="l">📣 Ads Report →</p>
          <p className="v">{rm(adSpend)}</p>
          <p className="l">{adDays.length} days · ROAS {roas.toFixed(2)}x</p>
        </Link>
        <Link href="/event-group-buy" className="stat" style={{ textDecoration: 'none' }}>
          <p className="l">🛒 Group-Buy →</p>
          <p className="v">{gbActive} active</p>
          <p className="l">Revenue {rm(gbRevenue)}</p>
        </Link>
      </div>
    </>
  )
}
