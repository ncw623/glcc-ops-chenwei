// Lightweight, dependency-free charts for the Marketing dashboard. Pure inline
// SVG / CSS, rendered on the server (no 'use client', no chart library). Colours
// reuse the app's dark theme tokens from globals.css.

function fmtRM(n: number) {
  return 'RM ' + Math.round(n).toLocaleString('en-MY')
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{title}</p>
      {subtitle && <p style={{ margin: '2px 0 12px', fontSize: 12, color: 'var(--muted)' }}>{subtitle}</p>}
      {children}
    </div>
  )
}

// Two-series line chart: ad spend vs total sales over the days.
export function SpendVsSalesLine({ dates, spend, sales }: { dates: string[]; spend: number[]; sales: number[] }) {
  const W = 680, H = 200, padL = 6, padR = 6, top = 12, bottom = 22
  const n = spend.length
  const max = Math.max(1, ...spend, ...sales)
  const plotH = H - top - bottom
  const x = (i: number) => (n <= 1 ? W / 2 : padL + (i * (W - padL - padR)) / (n - 1))
  const y = (v: number) => top + (1 - v / max) * plotH
  const path = (arr: number[]) => arr.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const ticks = [0, Math.floor((n - 1) / 2), n - 1].filter((v, i, a) => a.indexOf(v) === i && v >= 0)

  return (
    <Card title="📈 Ad spend vs Sales" subtitle="Daily trend across the period">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="none" style={{ display: 'block' }} role="img">
        {/* baseline */}
        <line x1={padL} y1={top + plotH} x2={W - padR} y2={top + plotH} stroke="var(--border)" strokeWidth="1" />
        <polyline fill="none" stroke="#86e0b8" strokeWidth="2" points={path(sales)} />
        <polyline fill="none" stroke="var(--amber)" strokeWidth="2" points={path(spend)} />
        {spend.map((v, i) => <circle key={`s${i}`} cx={x(i)} cy={y(v)} r="2" fill="var(--amber)" />)}
        {ticks.map(i => (
          <text key={`t${i}`} x={x(i)} y={H - 6} fontSize="10" fill="var(--muted)" textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}>{dates[i]}</text>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
        <span style={{ color: 'var(--amber)' }}>● Ad spend</span>
        <span style={{ color: '#86e0b8' }}>● Sales</span>
        <span style={{ color: 'var(--muted)', marginLeft: 'auto' }}>peak {fmtRM(max)}</span>
      </div>
    </Card>
  )
}

// Daily bar chart (e.g. ROAS per day).
export function DailyBars({ dates, values, title, subtitle, color = '#8ec5ff', suffix = '' }: {
  dates: string[]; values: number[]; title: string; subtitle?: string; color?: string; suffix?: string
}) {
  const W = 680, H = 170, top = 12, bottom = 22
  const n = values.length
  const max = Math.max(1, ...values)
  const plotH = H - top - bottom
  const bw = (W) / n
  const baseY = top + plotH
  const peakIdx = values.indexOf(Math.max(...values))

  return (
    <Card title={title} subtitle={subtitle}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="none" style={{ display: 'block' }} role="img">
        <line x1={0} y1={baseY} x2={W} y2={baseY} stroke="var(--border)" strokeWidth="1" />
        {values.map((v, i) => {
          const h = (v / max) * plotH
          return (
            <rect key={i} x={i * bw + bw * 0.15} y={baseY - h} width={bw * 0.7} height={h}
              fill={i === peakIdx ? 'var(--amber)' : color} rx="1.5">
              <title>{dates[i]}: {v.toLocaleString('en-MY')}{suffix}</title>
            </rect>
          )
        })}
        <text x={2} y={baseY + 16} fontSize="10" fill="var(--muted)" textAnchor="start">{dates[0]}</text>
        <text x={W - 2} y={baseY + 16} fontSize="10" fill="var(--muted)" textAnchor="end">{dates[n - 1]}</text>
      </svg>
      <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--muted)' }}>peak {max.toLocaleString('en-MY')}{suffix} on {dates[peakIdx]}</p>
    </Card>
  )
}

// Horizontal bars for channel-level totals.
export function ChannelTotals({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map(i => i.value))
  return (
    <Card title="📊 Ad spend by channel" subtitle="Where the budget went">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <div key={it.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: 'var(--text)' }}>{it.label}</span>
              <span style={{ color: 'var(--muted)' }}>{fmtRM(it.value)}</span>
            </div>
            <div style={{ height: 10, background: 'var(--surface2, #222226)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ width: `${(it.value / max) * 100}%`, height: '100%', background: 'var(--amber)', borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
