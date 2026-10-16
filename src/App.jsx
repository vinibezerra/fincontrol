import { useEffect, useMemo, useState } from 'react'

const initialTransactions = [
  { id: '1', description: 'Salário', amount: 3500, type: 'income', category: 'Salário', date: '2026-10-05' },
  { id: '2', description: 'Supermercado', amount: 286.4, type: 'expense', category: 'Alimentação', date: '2026-10-11' },
  { id: '3', description: 'Freelance', amount: 450, type: 'income', category: 'Freelance', date: '2026-10-13' },
]

const categories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Salário', 'Freelance', 'Outros']
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fincontrol:transactions')
    return saved ? JSON.parse(saved) : initialTransactions
  })
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ description: '', amount: '', type: 'expense', category: 'Alimentação', date: new Date().toISOString().slice(0, 10) })

  useEffect(() => {
    localStorage.setItem('fincontrol:transactions', JSON.stringify(transactions))
  }, [transactions])

  const summary = useMemo(() => transactions.reduce((acc, item) => {
    acc[item.type] += Number(item.amount)
    return acc
  }, { income: 0, expense: 0 }), [transactions])

  const visibleTransactions = useMemo(() => {
    const list = filter === 'all' ? transactions : transactions.filter((item) => item.type === filter)
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, filter])

  function handleSubmit(event) {
    event.preventDefault()
    const amount = Number(form.amount.replace(',', '.'))
    if (!form.description.trim() || !amount || amount <= 0) return

    setTransactions((current) => [{ ...form, id: crypto.randomUUID(), description: form.description.trim(), amount }, ...current])
    setForm((current) => ({ ...current, description: '', amount: '' }))
  }

  function removeTransaction(id) {
    setTransactions((current) => current.filter((item) => item.id !== id))
  }

  const balance = summary.income - summary.expense

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">F</span><span>FinControl</span></div>
        <p>Seu dinheiro, sob controle.</p>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">VISÃO GERAL</span>
          <h1>Olá! Vamos organizar suas finanças.</h1>
          <p>Acompanhe suas entradas e saídas em um só lugar.</p>
        </div>
        <div className="month">Outubro de 2026</div>
      </section>

      <section className="summary-grid" aria-label="Resumo financeiro">
        <article className="summary-card balance"><span>Saldo disponível</span><strong>{currency.format(balance)}</strong><small>Receitas menos despesas</small></article>
        <article className="summary-card income"><span>Receitas</span><strong>{currency.format(summary.income)}</strong><small>↗ Entradas registradas</small></article>
        <article className="summary-card expense"><span>Despesas</span><strong>{currency.format(summary.expense)}</strong><small>↘ Saídas registradas</small></article>
      </section>

      <section className="content-grid">
        <article className="panel form-panel">
          <div className="panel-heading"><div><span className="eyebrow">NOVA MOVIMENTAÇÃO</span><h2>Adicionar transação</h2></div></div>
          <form onSubmit={handleSubmit}>
            <label>Descrição<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex.: Conta de luz" required /></label>
            <label>Valor<input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} inputMode="decimal" placeholder="0,00" required /></label>
            <div className="form-row">
              <label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="expense">Despesa</option><option value="income">Receita</option></select></label>
              <label>Data<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
            </div>
            <label>Categoria<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <button className="primary-button" type="submit">Adicionar transação</button>
          </form>
        </article>

        <article className="panel transactions-panel">
          <div className="panel-heading transactions-heading"><div><span className="eyebrow">HISTÓRICO</span><h2>Transações recentes</h2></div><div className="filter-group">{[['all', 'Todas'], ['income', 'Receitas'], ['expense', 'Despesas']].map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div></div>
          <div className="transaction-list">
            {visibleTransactions.length === 0 ? <p className="empty-state">Nenhuma transação encontrada.</p> : visibleTransactions.map((item) => (
              <div className="transaction" key={item.id}>
                <div className={`transaction-icon ${item.type}`}>{item.type === 'income' ? '↗' : '↘'}</div>
                <div className="transaction-info"><strong>{item.description}</strong><span>{item.category} · {new Date(`${item.date}T12:00:00`).toLocaleDateString('pt-BR')}</span></div>
                <strong className={item.type === 'income' ? 'amount income-text' : 'amount expense-text'}>{item.type === 'income' ? '+' : '-'} {currency.format(item.amount)}</strong>
                <button className="delete-button" onClick={() => removeTransaction(item.id)} aria-label={`Excluir ${item.description}`}>×</button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
