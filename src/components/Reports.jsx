import { useMemo, useState } from 'react'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function monthKey(date) {
  const value = new Date(`${date}T12:00:00`)
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`
}

export default function Reports({ transactions }) {
  const [range, setRange] = useState('6')
  const report = useMemo(() => {
    const months = Number(range)
    const now = new Date()
    const keys = Array.from({ length: months }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (months - index - 1), 1)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    })
    return keys.map((key) => {
      const items = transactions.filter((item) => monthKey(item.date) === key)
      const income = items.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0)
      const expense = items.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0)
      const [year, month] = key.split('-')
      const label = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(year, Number(month) - 1, 1)).replace('.', '')
      return { key, label, income, expense, balance: income - expense }
    })
  }, [range, transactions])

  const max = Math.max(...report.flatMap((month) => [month.income, month.expense]), 1)
  const totals = report.reduce((sum, item) => ({ income: sum.income + item.income, expense: sum.expense + item.expense }), { income: 0, expense: 0 })

  function exportCsv() {
    const header = ['Descrição', 'Tipo', 'Categoria', 'Data', 'Valor']
    const rows = transactions.map((item) => [item.description, item.type === 'income' ? 'Receita' : 'Despesa', item.category, item.date, Number(item.amount).toFixed(2)])
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a'); link.href = url; link.download = `fincontrol-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url)
  }

  return <section className="reports-section" aria-labelledby="reports-title">
    <div className="reports-heading"><div><span className="eyebrow">RELATÓRIOS</span><h2 id="reports-title">Sua evolução financeira</h2><p>Compare receitas e despesas usando apenas os seus registros.</p></div><div className="report-actions"><select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Período do relatório"><option value="3">Últimos 3 meses</option><option value="6">Últimos 6 meses</option><option value="12">Últimos 12 meses</option></select><button className="outline-button" onClick={exportCsv}>⇩ Exportar CSV</button></div></div>
    <div className="report-kpis"><div><span>Receitas no período</span><strong className="income-text">{money.format(totals.income)}</strong></div><div><span>Despesas no período</span><strong className="expense-text">{money.format(totals.expense)}</strong></div><div><span>Resultado do período</span><strong>{money.format(totals.income - totals.expense)}</strong></div></div>
    <div className="chart-wrap"><div className="chart-legend"><span><i className="legend-income" /> Receitas</span><span><i className="legend-expense" /> Despesas</span></div><div className="bar-chart">{report.map((month) => <div className="chart-column" key={month.key}><div className="bar-pair" title={`${month.label}: receitas ${money.format(month.income)}, despesas ${money.format(month.expense)}`}><i className="income-bar" style={{ height: `${Math.max(month.income / max * 100, month.income ? 4 : 0)}%` }} /><i className="expense-bar" style={{ height: `${Math.max(month.expense / max * 100, month.expense ? 4 : 0)}%` }} /></div><span>{month.label}</span></div>)}</div></div>
  </section>
}
