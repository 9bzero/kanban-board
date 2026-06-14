import { useState, useEffect, useRef } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'

type Priority = 'low' | 'medium' | 'high'
type Card = { id: string; title: string; description: string; priority: Priority }
type Column = { id: string; title: string; cards: Card[] }

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  high: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
}

const DEFAULT_COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog', cards: [
    { id: '1', title: 'Design system setup', description: 'Create color tokens and typography scale', priority: 'medium' },
    { id: '2', title: 'Write unit tests', description: 'Cover core business logic', priority: 'low' },
  ]},
  { id: 'todo', title: 'To Do', cards: [
    { id: '3', title: 'API integration', description: 'Connect frontend to REST endpoints', priority: 'high' },
  ]},
  { id: 'in-progress', title: 'In Progress', cards: [
    { id: '4', title: 'Authentication', description: 'JWT login and refresh token flow', priority: 'high' },
  ]},
  { id: 'done', title: 'Done', cards: [
    { id: '5', title: 'Project setup', description: 'Init repo, CI/CD pipeline', priority: 'low' },
  ]},
]

function genId() { return Math.random().toString(36).slice(2) }

export default function App() {
  const [columns, setColumns] = useState<Column[]>(() => {
    try { const s = localStorage.getItem('kanban'); return s ? JSON.parse(s) : DEFAULT_COLUMNS } catch { return DEFAULT_COLUMNS }
  })
  const [adding, setAdding] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' as Priority })
  const dragging = useRef<{ cardId: string; fromCol: string } | null>(null)

  useEffect(() => { localStorage.setItem('kanban', JSON.stringify(columns)) }, [columns])

  function addCard(colId: string) {
    if (!form.title.trim()) return
    setColumns(cols => cols.map(c => c.id === colId
      ? { ...c, cards: [...c.cards, { id: genId(), title: form.title, description: form.description, priority: form.priority }] }
      : c))
    setForm({ title: '', description: '', priority: 'medium' })
    setAdding(null)
  }

  function deleteCard(colId: string, cardId: string) {
    setColumns(cols => cols.map(c => c.id === colId ? { ...c, cards: c.cards.filter(card => card.id !== cardId) } : c))
  }

  function onDragStart(cardId: string, fromCol: string) { dragging.current = { cardId, fromCol } }
  function onDrop(toColId: string) {
    if (!dragging.current) return
    const { cardId, fromCol } = dragging.current
    if (fromCol === toColId) return
    setColumns(cols => {
      const card = cols.find(c => c.id === fromCol)?.cards.find(c => c.id === cardId)
      if (!card) return cols
      return cols.map(c => {
        if (c.id === fromCol) return { ...c, cards: c.cards.filter(x => x.id !== cardId) }
        if (c.id === toColId) return { ...c, cards: [...c.cards, card] }
        return c
      })
    })
    dragging.current = null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Kanban Board</h1>
          <p className="text-slate-400 mt-1">Drag cards between columns to update status</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {columns.map(col => (
            <div key={col.id} className="flex flex-col"
              onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col.id)}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{col.title}</span>
                  <span className="text-xs bg-slate-800 text-slate-400 rounded-full px-2 py-0.5">{col.cards.length}</span>
                </div>
                <button onClick={() => setAdding(col.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                  <Plus size={14}/>
                </button>
              </div>
              <div className="flex flex-col gap-2 min-h-32 bg-slate-900/50 rounded-xl p-2 border border-slate-800">
                {col.cards.map(card => (
                  <div key={card.id} draggable onDragStart={() => onDragStart(card.id, col.id)}
                    className="bg-slate-800 rounded-lg p-3 cursor-grab active:cursor-grabbing border border-slate-700 hover:border-slate-600 transition-colors group">
                    <div className="flex items-start justify-between gap-2">
                      <GripVertical size={14} className="text-slate-600 mt-0.5 shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-100 leading-snug">{card.title}</p>
                        {card.description && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{card.description}</p>}
                        <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded border ${PRIORITY_COLORS[card.priority]} capitalize`}>{card.priority}</span>
                      </div>
                      <button onClick={() => deleteCard(col.id, card.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all shrink-0">
                        <X size={14}/>
                      </button>
                    </div>
                  </div>
                ))}
                {adding === col.id && (
                  <div className="bg-slate-800 rounded-lg p-3 border border-blue-500/50">
                    <input autoFocus value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                      placeholder="Card title..." className="w-full bg-slate-900 rounded px-2 py-1.5 text-sm text-slate-100 outline-none border border-slate-700 mb-2"/>
                    <input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                      placeholder="Description (optional)" className="w-full bg-slate-900 rounded px-2 py-1.5 text-xs text-slate-300 outline-none border border-slate-700 mb-2"/>
                    <select value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value as Priority}))}
                      className="w-full bg-slate-900 rounded px-2 py-1.5 text-xs text-slate-300 border border-slate-700 mb-3">
                      <option value="low">Low priority</option>
                      <option value="medium">Medium priority</option>
                      <option value="high">High priority</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => addCard(col.id)} className="flex-1 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors">Add Card</button>
                      <button onClick={() => setAdding(null)} className="px-3 py-1.5 rounded bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
