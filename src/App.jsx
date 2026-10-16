import { useEffect, useMemo, useState } from 'react'

const initialTransactions = [
  { id: '1', description: 'Salário mensal', amount: 3500, type: 'income', category: 'Salário', date: '2026-10-05' },
  { id: '2', description: 'Supermercado', amount: 286.4, type: 'expense', category: 'Alimentação', date: '2026-10-11' },
  { id: '3', description: 'Projeto freelance', amount: 450, type: 'income', category: 'Freelance', date: '2026-10-13' },
  { id: '4', description: 'Assinatura de streaming', amount: 39.9, type: 'expense', category: 'Lazer', date: '2026-10-15' },
  { id: '5', description: 'Combustível', amount: 180, type: 'expense', category: 'Transporte', date: '2026-10-16' },
]

const categories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Salário', 'Freelance', 'Outros']
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { description: '', amount: '', type: 'expense', category: 'Alimentação', date: today() }

const icon = {
  wallet: '◒', arrowUp: '↗', arrowDown: '↘', plus: '+', search: '⌕', chart: '◔', close: '×', edit: '✎', sun: '☼', moon: '☾', target: '◎', check: '✓', trash: '⌫', calendar: '◷', food: '◉', transport: '↝', home: '⌂', health: '✚', fun: '★', education: '▣', work: '▥', other: '●',
}

function categoryIcon(category) {
  const map = { Alimentação: 'food', Transporte: 'transport', Moradia: 'home', Saúde: 'health', Lazer: 'fun', Educação: 'education', Salário: 'work', Freelance: 'work', Outros: 'other' }
  return icon[map[category] || 'other']
}

function App() {
  const [transactions, setTransactions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fincontrol:transactions')) || initialTransactions } catch { return initialTransactions }
  })
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('fincontrol:theme') || 'light')
  const [notice, setNotice] = useState('')

  useEffect(() => { localStorage.setItem('fincontrol:transactions', JSON.stringify(transactions)) }, [transactions])
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('fincontrol:theme', theme) }, [theme])
  useEffect(() => { if (!notice) return; const timeout = setTimeout(() => setNotice(''), 2800); return () => clearTimeout(timeout) }, [notice])

  const summary = useMemo(() => transactions.reduce((acc, item) => { acc[item.type] += Number(item.amount); return acc }, { income: 0, expense: 0 }), [transactions])
  const balance = summary.income - summary.expense
  const expenseByCategory = useMemo(() => {
    const totals = transactions.filter((item) => item.type === 'expense').reduce((acc, item) => ({ ...acc, [item.category]: (acc[item.category] || 0) + Number(item.amount) }), {})
    return Object.entries(totals).sort((a, b) => b[1] - a[1])
  }, [transactions])
  const visibleTransactions = useMemo(() => transactions
    .filter((item) => filter === 'all' || item.type === filter)
    .filter((item) => `${item.description} ${item.category}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date)), [transactions, filter, query])

  const expenseLimit = 1800
  const budgetProgress = Math.min((summary.expense / expenseLimit) * 100, 100)
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date()).replace(/^./, (letter) => letter.toUpperCase())

  function openNewTransaction() { setEditingId(null); setForm(emptyForm); setModalOpen(true) }
  function openEdit(item) { setEditingId(item.id); setForm({ description: item.description, amount: String(item.amount).replace('.', ','), type: item.type, category: item.category, date: item.date }); setModalOpen(true) }
  function handleSubmit(event) {
    event.preventDefault()
    const amount = Number(String(form.amount).replace(',', '.'))
    if (!form.description.trim() || !amount || amount <= 0) return
    const transaction = { ...form, id: editingId || crypto.randomUUID(), description: form.description.trim(), amount }
    setTransactions((items) => editingId ? items.map((item) => item.id === editingId ? transaction : item) : [transaction, ...items])
    setModalOpen(false); setNotice(editingId ? 'Transação atualizada com sucesso.' : 'Transação adicionada com sucesso.')
  }
  function removeTransaction(id) { setTransactions((items) => items.filter((item) => item.id !== id)); setNotice('Transação excluída.') }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="FinControl, início"><span className="brand-mark">{icon.wallet}</span><span>FinControl</span></a>
        <nav><a href="#visao-geral">Visão geral</a><a href="#transacoes">Transações</a><a href="#insights">Insights</a></nav>
        <div className="header-actions"><button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Alternar tema">{theme === 'light' ? icon.moon : icon.sun}</button><button className="topbar-add" onClick={openNewTransaction}><span>{icon.plus}</span> Nova transação</button></div>
      </header>

      <section className="hero" id="inicio">
        <div><span className="eyebrow">PAINEL FINANCEIRO</span><h1>Seu dinheiro, <em>sob controle.</em></h1><p>Uma visão simples e inteligente para suas decisões financeiras.</p></div>
        <div className="period-selector"><span>{icon.calendar}</span>{monthLabel}<button aria-label="Selecionar período">⌄</button></div>
      </section>

      <section className="summary-grid" id="visao-geral" aria-label="Resumo financeiro">
        <article className="summary-card balance"><div className="card-label"><span>Saldo disponível</span><i>{icon.wallet}</i></div><strong>{currency.format(balance)}</strong><small><b>+12,5%</b> em relação ao mês passado</small></article>
        <article className="summary-card income"><div className="card-label"><span>Receitas</span><i>{icon.arrowUp}</i></div><strong>{currency.format(summary.income)}</strong><small>Entradas registradas este mês</small></article>
        <article className="summary-card expense"><div className="card-label"><span>Despesas</span><i>{icon.arrowDown}</i></div><strong>{currency.format(summary.expense)}</strong><small>Saídas registradas este mês</small></article>
      </section>

      <section className="dashboard-grid" id="insights">
        <article className="panel spending-panel"><div className="panel-heading"><div><span className="eyebrow">ANÁLISE</span><h2>Gastos por categoria</h2></div><span className="panel-badge">{icon.chart} Este mês</span></div>
          <div className="category-chart">{expenseByCategory.length ? expenseByCategory.slice(0, 5).map(([category, amount]) => <div className="category-row" key={category}><span className="category-symbol">{categoryIcon(category)}</span><div className="category-data"><div><strong>{category}</strong><span>{currency.format(amount)}</span></div><div className="track"><i style={{ width: `${(amount / expenseByCategory[0][1]) * 100}%` }} /></div></div></div>) : <p className="empty-state">Adicione despesas para ver a análise.</p>}</div>
        </article>
        <article className="panel goal-panel"><div className="goal-icon">{icon.target}</div><span className="eyebrow">META DO MÊS</span><h2>Controle de gastos</h2><p>Você definiu um limite de <strong>{currency.format(expenseLimit)}</strong> para suas despesas.</p><div className="goal-progress"><div><span>Utilizado</span><strong>{currency.format(summary.expense)}</strong></div><div className="track"><i style={{ width: `${budgetProgress}%` }} /></div><small>Restam <b>{currency.format(Math.max(expenseLimit - summary.expense, 0))}</b> no seu orçamento.</small></div></article>
      </section>

      <section className="panel transactions-panel" id="transacoes">
        <div className="transactions-toolbar"><div><span className="eyebrow">HISTÓRICO</span><h2>Suas transações</h2></div><button className="outline-button" onClick={openNewTransaction}>{icon.plus} Adicionar</button></div>
        <div className="controls"><div className="filter-group">{[['all', 'Todas'], ['income', 'Receitas'], ['expense', 'Despesas']].map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div><label className="search-box"><span>{icon.search}</span><input aria-label="Buscar transações" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar transação" /></label></div>
        <div className="transaction-list">{visibleTransactions.length === 0 ? <div className="empty-state"><span>{icon.search}</span><strong>Nenhuma transação encontrada</strong><p>Tente outro filtro ou adicione uma movimentação.</p></div> : visibleTransactions.map((item) => <div className="transaction" key={item.id}><div className={`transaction-icon ${item.type}`}>{categoryIcon(item.category)}</div><div className="transaction-info"><strong>{item.description}</strong><span>{item.category} <b>·</b> {new Date(`${item.date}T12:00:00`).toLocaleDateString('pt-BR')}</span></div><strong className={`amount ${item.type === 'income' ? 'income-text' : 'expense-text'}`}>{item.type === 'income' ? '+' : '−'} {currency.format(item.amount)}</strong><div className="row-actions"><button onClick={() => openEdit(item)} aria-label={`Editar ${item.description}`}>{icon.edit}</button><button onClick={() => removeTransaction(item.id)} aria-label={`Excluir ${item.description}`}>{icon.trash}</button></div></div>)}</div>
      </section>

      {isModalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Fechar">{icon.close}</button><span className="eyebrow">{editingId ? 'EDITAR MOVIMENTAÇÃO' : 'NOVA MOVIMENTAÇÃO'}</span><h2 id="modal-title">{editingId ? 'Atualize sua transação' : 'Registre uma transação'}</h2><form onSubmit={handleSubmit}><label>Descrição<input autoFocus value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex.: Conta de luz" required /></label><div className="form-row"><label>Valor<input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} inputMode="decimal" placeholder="0,00" required /></label><label>Data<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label></div><div className="form-row"><label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="expense">Despesa</option><option value="income">Receita</option></select></label><label>Categoria<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label></div><button className="primary-button" type="submit">{icon.check} {editingId ? 'Salvar alterações' : 'Adicionar transação'}</button></form></section></div>}
      {notice && <div className="toast">{icon.check} {notice}</div>}
    </main>
  )
}

export default App
