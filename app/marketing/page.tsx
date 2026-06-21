import { supabase } from '@/lib/supabase'
import { SpendVsSalesLine, DailyBars, ChannelTotals } from './Charts'

export const dynamic = 'force-dynamic'

type Row = {
  date: string
  shopee_cpas_ads_cost: number
  shopee_add_to_cart: number
  lazada_cpas_ads_cost: number
  lazada_add_to_cart: number
  awa_ads_cost: number
  lead_to_pm_ad_cost: number
  new_pm: number
  pmed: number
  total_comments: number
  new_order: number
  repeat_order: number
  product_sold: number
  fb_new_sales: number
  fb_repeat_sales: number
  insta_new_sales: number
  insta_repeat_sales: number
  shopee_sales: number
  lazada_sales: number
  other_platform_sales: number
}

function rm(n: number) {
  return 'RM ' + n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function adSpend(r: Row) {
  return Number(r.shopee_cpas_ads_cost) + Number(r.lazada_cpas_ads_cost) + Number(r.awa_ads_cost) + Number(r.lead_to_pm_ad_cost)
}

function totalSales(r: Row) {
  return Number(r.fb_new_sales) + Number(r.fb_repeat_sales) + Number(r.insta_new_sales) + Number(r.insta_repeat_sales) + Number(r.shopee_sales) + Number(r.lazada_sales) + Number(r.other_platform_sales)
}

export default async function Marketing() {
  const { data: rows, error } = await supabase
    .from('marketing_daily')
    .select('*')
    .order('date', { ascending: true })

  const data = (rows ?? []) as Row[]

  const sumAds = data.reduce((s, r) => s + adSpend(r), 0)
  const sumSales = data.reduce((s, r) => s + totalSales(r), 0)
  const sumOrders = data.reduce((s, r) => s + Number(r.new_order) + Number(r.repeat_order), 0)
  const sumProducts = data.reduce((s, r) => s + Number(r.product_sold), 0)
  const sumPM = data.reduce((s, r) => s + Number(r.new_pm), 0)
  const roas = sumAds > 0 ? (sumSales / sumAds).toFixed(2) + 'x' : '—'

  const cards: [string, string | number][] = [
    ['Total Ad Spend', rm(sumAds)],
    ['Total Sales', rm(sumSales)],
    ['ROAS', roas],
    ['Orders', sumOrders],
    ['Products Sold', sumProducts],
    ['New PMs', sumPM],
  ]

  if (error || data.length === 0) {
    return (
      <>
        <h1 className="ph">Marketing</h1>
        <p className="cap">LactoDay CMO daily tracker</p>
        <p className="empty">{error ? `Error: ${error.message}` : 'No marketing data yet.'}</p>
      </>
    )
  }

  // --- Chart series for the dashboard view ---
  const dates = data.map(r => 'May ' + new Date(r.date).getDate())
  const spendArr = data.map(adSpend)
  const salesArr = data.map(totalSales)
  const roasArr = data.map(r => { const a = adSpend(r); return a > 0 ? Number((totalSales(r) / a).toFixed(2)) : 0 })
  const channels = [
    { label: 'LEAD to PM', value: data.reduce((s, r) => s + Number(r.lead_to_pm_ad_cost), 0) },
    { label: 'Shopee CPAS', value: data.reduce((s, r) => s + Number(r.shopee_cpas_ads_cost), 0) },
    { label: 'Lazada CPAS', value: data.reduce((s, r) => s + Number(r.lazada_cpas_ads_cost), 0) },
    { label: 'Awa', value: data.reduce((s, r) => s + Number(r.awa_ads_cost), 0) },
  ].sort((a, b) => b.value - a.value)

  return (
    <>
      <h1 className="ph">Marketing</h1>
      <p className="cap">LactoDay CMO daily tracker — May 2026</p>

      <div className="grid">
        {cards.map(([l, v]) => (
          <div className="stat" key={l}><p className="l">{l}</p><p className="v">{v}</p></div>
        ))}
      </div>

      <h2 className="ph" style={{ fontSize: 16, marginTop: 26 }}>Dashboard view</h2>
      <p className="cap">Visual trends from the daily tracker</p>
      <SpendVsSalesLine dates={dates} spend={spendArr} sales={salesArr} />
      <DailyBars dates={dates} values={roasArr} title="📊 Daily ROAS" subtitle="Sales ÷ ad spend, per day" suffix="x" />
      <ChannelTotals items={channels} />

      <div className="mkt-scroll">
        <table className="tbl mkt-tbl">
          <thead>
            <tr>
              <th>Date</th>
              <th>Ad Spend</th>
              <th>New PM</th>
              <th>PMed</th>
              <th>Orders</th>
              <th>Prod Sold</th>
              <th>FB Sales</th>
              <th>Shopee</th>
              <th>Lazada</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => {
              const day = new Date(r.date).getDate()
              const orders = Number(r.new_order) + Number(r.repeat_order)
              const fb = Number(r.fb_new_sales) + Number(r.fb_repeat_sales) + Number(r.insta_new_sales) + Number(r.insta_repeat_sales)
              return (
                <tr key={r.date}>
                  <td data-label="Date">May {day}</td>
                  <td data-label="Ad Spend">{rm(adSpend(r))}</td>
                  <td data-label="New PM">{r.new_pm}</td>
                  <td data-label="PMed">{r.pmed}</td>
                  <td data-label="Orders">{orders}</td>
                  <td data-label="Prod Sold">{r.product_sold}</td>
                  <td data-label="FB Sales">{rm(fb)}</td>
                  <td data-label="Shopee">{rm(Number(r.shopee_sales))}</td>
                  <td data-label="Lazada">{rm(Number(r.lazada_sales))}</td>
                  <td data-label="Total Sales">{rm(totalSales(r))}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td data-label=""><strong>Total</strong></td>
              <td data-label="Ad Spend"><strong>{rm(sumAds)}</strong></td>
              <td data-label="New PM"><strong>{sumPM}</strong></td>
              <td data-label="PMed"><strong>{data.reduce((s, r) => s + Number(r.pmed), 0)}</strong></td>
              <td data-label="Orders"><strong>{sumOrders}</strong></td>
              <td data-label="Prod Sold"><strong>{sumProducts}</strong></td>
              <td data-label="FB Sales"><strong>{rm(data.reduce((s, r) => s + Number(r.fb_new_sales) + Number(r.fb_repeat_sales) + Number(r.insta_new_sales) + Number(r.insta_repeat_sales), 0))}</strong></td>
              <td data-label="Shopee"><strong>{rm(data.reduce((s, r) => s + Number(r.shopee_sales), 0))}</strong></td>
              <td data-label="Lazada"><strong>{rm(data.reduce((s, r) => s + Number(r.lazada_sales), 0))}</strong></td>
              <td data-label="Total Sales"><strong>{rm(sumSales)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
