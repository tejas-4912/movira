import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://movira-backend.onrender.com'

const LOCATIONS = ['Neck', 'Shoulder', 'Upper back', 'Lower back', 'Hip', 'Knee', 'Ankle/Foot', 'Wrist/Hand', 'Head', 'Chest', 'Other']
const MOODS = [
  { label: 'Great', emoji: '😄', color: 'text-green-400' },
  { label: 'Good', emoji: '🙂', color: 'text-teal-600' },
  { label: 'Okay', emoji: '😐', color: 'text-yellow-400' },
  { label: 'Poor', emoji: '😔', color: 'text-orange-400' },
  { label: 'Bad', emoji: '😣', color: 'text-red-500' },
]

function PainDot({ level }) {
  const colors = ['', 'bg-green-500', 'bg-green-400', 'bg-lime-400', 'bg-yellow-400', 'bg-yellow-500', 'bg-orange-400', 'bg-orange-500', 'bg-red-400', 'bg-red-500', 'bg-red-700']
  return <span className={`inline-block w-3 h-3 rounded-full ${colors[level] || 'bg-slate-300'}`}></span>
}

export default function Journal() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    date: today,
    painLevel: 5,
    painLocation: '',
    notes: '',
    mood: 'Okay',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/journal`, { headers: { Authorization: `Bearer ${token}` } })
        setEntries(res.data.journal || [])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!form.painLocation) return alert('Please select a pain location')
    setSaving(true)
    try {
      const res = await axios.post(`${API}/api/journal`, form, { headers: { Authorization: `Bearer ${token}` } })
      setEntries(res.data.journal || [])
      setShowForm(false)
      setForm({ date: today, painLevel: 5, painLocation: '', notes: '', mood: 'Okay' })
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (date) => {
    if (!confirm('Delete this entry?')) return
    try {
      const res = await axios.delete(`${API}/api/journal/${date}`, { headers: { Authorization: `Bearer ${token}` } })
      setEntries(res.data.journal || [])
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const avgPain = entries.length > 0
    ? (entries.slice(0, 7).reduce((sum, e) => sum + (e.painLevel || 0), 0) / Math.min(entries.length, 7)).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-56 bg-white border-r border-slate-200 flex flex-col py-6 px-4 z-10 hidden lg:flex">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="text-lg font-bold">MOVIRA</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {[
            { icon: '📊', label: 'Dashboard', to: '/dashboard' },
            { icon: '📋', label: 'Assessment', to: '/assessment' },
            { icon: '📓', label: 'Pain Journal', to: '/journal', active: true },
            { icon: '🗓️', label: 'Protocols', to: '/protocols' },
            { icon: '🤖', label: 'AI Consultant', to: '/assessment' },
            { icon: '👤', label: 'My Profile', to: '/profile' },
          ].map(item => (
            <Link key={item.label} to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 pt-4 px-2">
          <p className="text-sm font-semibold text-slate-900 truncate">{user.name || 'User'}</p>
          <button onClick={handleLogout} className="mt-3 text-xs text-slate-500 hover:text-red-500 transition-colors">Sign out</button>
        </div>
      </div>

      <div className="lg:ml-56 px-6 lg:px-10 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-teal-600 text-xs font-semibold uppercase tracking-widest mb-1">Daily Tracking</p>
            <h1 className="text-3xl font-bold">Pain Journal</h1>
            <p className="text-slate-500 text-sm mt-1">Track your pain levels and recovery notes daily</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
            + Log Today
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{entries.length}</p>
            <p className="text-xs text-slate-500 mt-1">Total Entries</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">{avgPain}</p>
            <p className="text-xs text-slate-500 mt-1">Avg Pain (7 days)</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">
              {entries.length > 1 && entries[0].painLevel < entries[entries.length - 1].painLevel ? '📉' :
               entries.length > 1 && entries[0].painLevel > entries[entries.length - 1].painLevel ? '📈' : '➡️'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Pain Trend</p>
          </div>
        </div>

        {/* Log form */}
        {showForm && (
          <div className="bg-white border border-teal-700 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-5">Log Entry</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-slate-600 mb-2">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Pain Level: <strong className="text-slate-900">{form.painLevel}/10</strong></label>
                <input type="range" min="1" max="10" value={form.painLevel}
                  onChange={e => setForm(f => ({ ...f, painLevel: parseInt(e.target.value) }))}
                  className="w-full accent-teal-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 - Minimal</span><span>5 - Moderate</span><span>10 - Severe</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Pain Location</label>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map(loc => (
                    <button key={loc} onClick={() => setForm(f => ({ ...f, painLocation: loc }))}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.painLocation === loc ? 'bg-teal-500/20 border-teal-500 text-teal-700' : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-400'}`}>
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">How are you feeling?</label>
                <div className="flex gap-3">
                  {MOODS.map(m => (
                    <button key={m.label} onClick={() => setForm(f => ({ ...f, mood: m.label }))}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-colors ${form.mood === m.label ? 'border-teal-500 bg-teal-500/10' : 'border-slate-200 hover:border-slate-400'}`}>
                      <span className="text-xl">{m.emoji}</span>
                      <span className={`text-xs ${m.color}`}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Notes <span className="text-slate-500">(optional)</span></label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="How did you feel today? Any specific activities that helped or worsened the pain?"
                  rows={3}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving}
                  className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="border border-slate-200 text-slate-500 px-6 py-2.5 rounded-xl text-sm transition-colors hover:border-slate-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entries */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-3">📓</p>
            <p className="font-medium">No journal entries yet</p>
            <p className="text-sm mt-1">Click "Log Today" to start tracking your recovery</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, i) => {
              const mood = MOODS.find(m => m.label === entry.mood)
              return (
                <div key={i} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mood?.emoji || '😐'}</span>
                      <div>
                        <p className="font-semibold text-slate-900">{new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        <p className="text-xs text-slate-500">{entry.painLocation} · Mood: {entry.mood}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <PainDot level={entry.painLevel} />
                        <span className="text-sm font-bold text-slate-900">{entry.painLevel}/10</span>
                      </div>
                      <button onClick={() => handleDelete(entry.date)} className="text-slate-600 hover:text-red-500 text-lg transition-colors">×</button>
                    </div>
                  </div>
                  {entry.notes && <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-200 pt-3">{entry.notes}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
