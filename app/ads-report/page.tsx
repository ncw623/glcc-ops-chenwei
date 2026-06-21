import { getRecords, rm } from '@/lib/records'
import Empty from '@/app/_components/Empty'
import { requireTab } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// Daily Meta ad report. category === 'ad' — one row per day. The per-platform
// numbers live in `meta`; we sum them here so the math stays transparent and no
// schema change is needed.
const SPEND_KEYS = ['shopee_cpas', 'lazada_cpas', 'awa', 'lead_to_pm']
const SALES_KEYS = ['fb_new', 'fb_repeat', 'insta_new', 'insta_repeat', 'shopee_sales', 'lazada_sales', 'other_sales']
const sumKeys = (r: { meta?: Record<string, any> }, keys: string[]) =>
  keys.reduce((s, k) => s + Number(r.meta?.[k] || 0), 0)
const orders = (r: { meta?: Record<string, any> }) =>
  Number(r.meta?.new_order || 0) + Number(r.meta?.repeat_order || 0)

export default async function AdsReport() {
  await requireTab('ads')
  const all = await getRecords()
  // Newest day first.
  const rows = all
    .filter(r => r.category === 'ad')
    .sort((a, b) => ((a.due_date ?? '') < (b.due_date ?? '') ? 1 : -1))

  const totalSpend = rows.reduce((s, r) => s + sumKeys(r, SPEND_KEYS), 0)
  const totalSales = rows.reduce((s, r) => s + sumKeys(r, SALES_KEYS), 0)
  const totalOrders = rows.reduce((s, r) => s + orders(r), 0)
  const roas = totalSpend ? totalSales / totalSpend : 0

  const cards: [string, string][] = [
    ['Total ad spend', rm(totalSpend)],
    ['Total sales', rm(totalSales)],
    ['ROAS', `${roas.toFixed(2)}x`],
    ['Orders', String(totalOrders)],
  ]

  return (
    <>
      <h1 className="ph">Ads Report</h1>
      <p className="cap">Daily Meta ad spend vs sales &amp; orders</p>
      <div className="grid">
        {cards.map(([l, v]) => (
          <div className="stat" key={l}><p className="l">{l}</p><p className="v">{v}</p></div>
        ))}
      </div>
      {all.length === 0 ? <Empty /> : rows.length === 0 ? (
        <p className="empty">No ad-report rows yet — paste the seed SQL (category <code>ad</code>) into Supabase.</p>
      ) : (
        <table className="tbl">
          <thead><tr><th>Date</th><th>Ad spend</th><th>Orders</th><th>Products</th><th>Sales</th><th>ROAS</th></tr></thead>
          <tbody>
            {rows.map(r => {
              const spend = sumKeys(r, SPEND_KEYS)
              const sales = sumKeys(r, SALES_KEYS)
              const rr = spend ? sales / spend : 0
              return (
                <tr key={r.id}>
                  <td data-label="Date">{r.due_date ?? r.title}</td>
                  <td data-label="Ad spend">{rm(spend)}</td>
                  <td data-label="Orders">{orders(r)}</td>
                  <td data-label="Products">{Number(r.meta?.products_sold || 0)}</td>
                  <td data-label="Sales">{rm(sales)}</td>
                  <td data-label="ROAS">{spend ? `${rr.toFixed(2)}x` : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </>
  )
}
