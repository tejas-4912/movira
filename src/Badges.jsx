import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://movira-backend.onrender.com'

const ALL_BADGES = [
  { id: 'first_login', icon: '🌟', name: 'First Step', desc: 'Joined MOVIRA', condition: () => true },
  { id: 'first_exercise', icon: '💪', name: 'First Rep', desc: 'Completed your first exercise', condition: (p) => (p.xp || 0) >= 10 },
  { id: 'streak_3', icon: '🔥', name: 'On Fire', desc: '3-day streak', condition: (p) => (p.streak || 0) >= 3 },
  { id: 'streak_7', icon: '🔥🔥', name: 'Week Warrior', desc: '7-day streak', condition: (p) => (p.streak || 0) >= 7 },
  { id: 'streak_14', icon: '⚡', name: 'Fortnight Fighter', desc: '14-day streak', condition: (p) => (p.streak || 0) >= 14 },
  { id: 'streak_30', icon: '👑', name: 'Month Master', desc: '30-day streak', condition: (p) => (p.streak || 0) >= 30 },
  { id: 'xp_100', icon: '⭐', name: 'Level 2', desc: 'Reached 100 XP', condition: (p) => (p.xp || 0) >= 100 },
  { id: 'xp_500', icon: '🌠', name: 'XP Hunter', desc: 'Reached 500 XP', condition: (p) => (p.xp || 0) >= 500 },
  { id: 'xp_1000', icon: '🏆', name: 'Champion', desc: 'Reached 1000 XP', condition: (p) => (p.xp || 0) >= 1000 },
  { id: 'water_goal', icon: '💧', name: 'Hydration Hero', desc: 'Reached daily water goal', condition: (p) => (p.waterMl || 0) >= 2000 },
  { id: 'all_exercises', icon: '🎯', name: 'Perfect Day', desc: 'Completed all exercises in a day', condition: (p) => (p.challengesDoneToday || []).includes('exercises') },
  { id: 'assessment', icon: '🩺', name: 'Self Aware', desc: 'Completed an AI assessment', condition: (p, j) => (p.recoveryProgress || 0) > 0 },
  { id: 'journal_5', icon: '📓', name: 'Consistent Logger', desc: 'Logged 5 journal entries', condition: (p, j) => (j || []).length >= 5 },
  { id: 'journal_10', icon: '📖', name: 'Pain Tracker Pro', desc: 'Logged 10 journal entries', condition: (p, j) => (j || []).length >= 10 },
  { id: 'level_5', icon: '🚀', name: 'Rising Star', desc: 'Reached Level 5', condition: (p) => (p.level || 1) >= 5 },
]

export default function Badges() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [progress, setProgress] = useState({})
  const [journal, setJournal] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, jRes] = await Promise.all([
          axios.get(`${API}/api/user/progress`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/api/journal`, { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setProgress(pRes.data.progress || {})
        setJournal(jRes.data.journal || [])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const earned = ALL_BADGES.filter(b => b.condition(progress, journal))
  const locked = ALL_BADGES.filter(b => !b.condition(progress, journal))

  const navItems = [
    { icon: '📊', label: 'Dashboard', to: '/dashboard' },
    { icon: '📋', label: 'Assessment', to: '/assessment' },
    { icon: '📓', label: 'Pain Journal', to: '/journal' },
    { icon: '🗓️', label: 'Protocols', to: '/protocols' },
    { icon: '🏅', label: 'Badges', to: '/badges', active: true },
    { icon: '🤖', label: 'AI Consultant', to: '/assessment' },
    { icon: '👤', label: 'My Profile', to: '/profile' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed left-0 top-0 h-full w-56 bg-slate-900 border-r border-slate-800 flex flex-col py-6 px-4 z-10 hidden lg:flex">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="text-lg font-bold">MOVIRA</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => (
            <Link key={item.label} to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-teal-500/10 text-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-800 pt-4 px-2">
          <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
          <button onClick={handleLogout} className="mt-3 text-xs text-slate-500 hover:text-red-400 transition-colors">Sign out</button>
        </div>
      </div>

      <div className="lg:ml-56 px-6 lg:px-10 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-1">Achievements</p>
          <h1 className="text-3xl font-bold">Badges</h1>
          <p className="text-slate-400 text-sm mt-1">Earn badges by staying consistent with your recovery</p>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 border border-teal-800 rounded-2xl p-6 mb-8 flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-400">{earned.length}</p>
            <p className="text-sm text-slate-400 mt-1">Earned</p>
          </div>
          <div className="w-px h-12 bg-slate-700"></div>
          <div className="text-center">
            <p className="text-4xl font-bold text-slate-500">{locked.length}</p>
            <p className="text-sm text-slate-400 mt-1">Locked</p>
          </div>
          <div className="w-px h-12 bg-slate-700"></div>
          <div className="flex-1">
            <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
              <div className="bg-teal-500 h-3 rounded-full transition-all" style={{ width: `${(earned.length / ALL_BADGES.length) * 100}%` }}></div>
            </div>
            <p className="text-xs text-slate-400">{Math.round((earned.length / ALL_BADGES.length) * 100)}% complete</p>
          </div>
        </div>

        {/* Earned badges */}
        {earned.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-teal-400">✅ Earned ({earned.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {earned.map(b => (
                <div key={b.id} className="bg-slate-900 border border-teal-700 rounded-2xl p-4 text-center hover:border-teal-500 transition-colors">
                  <p className="text-4xl mb-2">{b.icon}</p>
                  <p className="font-semibold text-white text-sm">{b.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked badges */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-slate-500">🔒 Locked ({locked.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {locked.map(b => (
              <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center opacity-50">
                <p className="text-4xl mb-2 grayscale">{b.icon}</p>
                <p className="font-semibold text-slate-500 text-sm">{b.name}</p>
                <p className="text-xs text-slate-600 mt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
