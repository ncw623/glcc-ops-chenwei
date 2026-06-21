import { getRecords, rm, m } from '@/lib/records'
import Empty from '@/app/_components/Empty'

export const dynamic = 'force-dynamic'

// Group-buy events. category === 'groupbuy'. Extra fields (unit price, order
// count, host) live in `meta`. `amount` holds the revenue collected so far.
export default async function EventGroupBuy() {
  const all = await getRecords()
  const rows = all
    .filter(r => r.category === 'groupbuy')
    .sort((a, b) => ((a.due_date ?? '') < (b.due_date ?? '') ? -1 : 1)) // soonest deadline first

  const active = rows.filter(r => ['active', 'open'].includes(r.status)).length
  const totalOrders = rows.reduce((s, r) => s + Number(r.meta?.orders || 0), 0)
  const revenue = rows.reduce((s, r) => s + Number(r.amount || 0), 0)

  const cards: [string, string][] = [
    ['Active events', String(active)],
    ['Total orders', String(totalOrders)],
    ['Revenue', rm(revenue)],
  ]

  return (
    <>
      <h1 className="ph">Group-Buy</h1>
      <p className="cap">Group-buy events &amp; their orders</p>
      <div className="grid">
        {cards.map(([l, v]) => (
          <div className="stat" key={l}><p className="l">{l}</p><p className="v">{v}</p></div>
        ))}
      </div>
      {rows.length === 0 ? (
        all.length === 0 ? <Empty /> : (
          <p className="empty">No group-buy events yet — paste the seed SQL (category <code>groupbuy</code>) into Supabase.</p>
        )
      ) : (
        <table className="tbl">
          <thead><tr><th>Event</th><th>Unit price</th><th>Orders</th><th>Revenue</th><th>Deadline</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td data-label="Event">{r.title}</td>
                <td data-label="Unit price">{r.meta?.price != null ? rm(Number(r.meta.price)) : '—'}</td>
                <td data-label="Orders">{m(r, 'orders')}</td>
                <td data-label="Revenue">{rm(Number(r.amount || 0))}</td>
                <td data-label="Deadline">{r.due_date ?? '—'}</td>
                <td data-label="Status"><span className={`pill ${r.status}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
