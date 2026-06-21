import { supabase } from './supabase'

type TbEntry = [string, { code: string; desc: string; dr: number; cr: number }]

export async function getReportsSummary(): Promise<string | null> {
  const { data, error } = await supabase
    .from('reports_state')
    .select('data')
    .eq('id', 'global')
    .maybeSingle()

  if (error || !data?.data) return null

  const state = data.data as any
  const entity = state.entities?.list?.[0]
  if (!entity) return null

  const ed = state.entityData?.[entity.id]
  if (!ed?.tbCY?.entries) return null

  const entries: TbEntry[] = ed.tbCY.entries
  const sum = (filter: (code: string) => boolean, side: 'dr' | 'cr') =>
    entries
      .filter(([, e]) => filter(e.code))
      .reduce((s, [, e]) => s + Number(e[side] || 0), 0)

  const shareCapital = sum(c => c.startsWith('100'), 'cr')
  const retainedProfits = sum(c => c.startsWith('105'), 'cr')

  const ppeCost = sum(c => c.startsWith('200'), 'dr')
  const ppeDepn = sum(c => c.startsWith('200'), 'cr')

  const tradeReceivables = sum(c => c.startsWith('300'), 'dr') - sum(c => c.startsWith('300'), 'cr')
  const otherReceivables = sum(c => c.startsWith('301'), 'dr')
  const cashBank = sum(c => c.startsWith('302'), 'dr')
  const fixedDeposit = sum(c => c.startsWith('303'), 'dr')
  const contractAssets = sum(c => c.startsWith('309'), 'dr')

  const tradePayables = sum(c => c.startsWith('400'), 'cr')
  const accruals = sum(c => c.startsWith('402'), 'cr')
  const deferredIncome = sum(c => c.startsWith('411'), 'cr')

  const revenueGIS = sum(c => c.startsWith('500'), 'cr')
  const revenueConsult = sum(c => c.startsWith('510'), 'cr')
  const revenueMaintenance = sum(c => c.startsWith('520'), 'cr')
  const totalRevenue = revenueGIS + revenueConsult + revenueMaintenance
  const otherIncome = sum(c => c.startsWith('55'), 'cr')

  const cogs = sum(c => c.startsWith('6'), 'dr')
  const grossProfit = totalRevenue - cogs

  const adminExpenses = sum(c => c.startsWith('9') && !c.startsWith('990'), 'dr')
  const depreciation = sum(c => c.startsWith('951'), 'dr')
  const profitBeforeTax = grossProfit + otherIncome - adminExpenses
  const tax = sum(c => c.startsWith('990'), 'dr') - sum(c => c.startsWith('990'), 'cr')
  const netProfit = profitBeforeTax - tax

  const fmt = (n: number) => 'RM ' + Math.round(n).toLocaleString('en-MY')

  return [
    `Company: ${entity.name}`,
    `--- P&L ---`,
    `Revenue: ${fmt(totalRevenue)} (GIS ${fmt(revenueGIS)}, Consulting ${fmt(revenueConsult)}, M&S ${fmt(revenueMaintenance)})`,
    `COGS: ${fmt(cogs)}`,
    `Gross Profit: ${fmt(grossProfit)} (${(grossProfit / totalRevenue * 100).toFixed(1)}% margin)`,
    `Other Income: ${fmt(otherIncome)}`,
    `Admin & Operating Expenses: ${fmt(adminExpenses)} (incl. depreciation ${fmt(depreciation)})`,
    `Profit Before Tax: ${fmt(profitBeforeTax)}`,
    `Tax: ${fmt(tax)}`,
    `Net Profit: ${fmt(netProfit)}`,
    `--- Balance Sheet ---`,
    `PPE (net): ${fmt(ppeCost - ppeDepn)}`,
    `Trade Receivables (net): ${fmt(tradeReceivables)}`,
    `Cash & Bank: ${fmt(cashBank)}`,
    `Fixed Deposits: ${fmt(fixedDeposit)}`,
    `Trade Payables: ${fmt(tradePayables)}`,
    `Accruals: ${fmt(accruals)}`,
    `Equity: ${fmt(shareCapital + retainedProfits)} (Share Capital ${fmt(shareCapital)}, Retained ${fmt(retainedProfits)})`,
  ].join('\n')
}
