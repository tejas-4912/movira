import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import confetti from 'canvas-confetti'

const API = 'https://movira-backend.onrender.com'

const quotes = [
  "Every rep is a vote for the person you want to become.",
  "Recovery is not a destination — it's a daily practice.",
  "Small consistent steps lead to lasting change.",
  "Your body heals faster when your mind believes it can.",
]

const DEFAULT_EXERCISES = [
  { id: 1, name: 'Neck stretches', detail: '10 reps · hold 15 seconds each' },
  { id: 2, name: 'Shoulder rolls', detail: '2 sets · 10 forward, 10 backward' },
  { id: 3, name: 'Cat-cow stretch', detail: '8 reps' },
  { id: 4, name: 'Hip flexor stretch', detail: '30 seconds each side' },
  { id: 5, name: 'Ankle circles', detail: '10 reps each direction' },
]

function Ring({ value, max, color, label, icon, size = 80 }) {
  const r = size * 0.38
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const dash = pct * circ
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{icon}</span>
          <span className="text-xs font-bold text-slate-900">{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 text-center">{label}</p>
    </div>
  )
}

function ExerciseCalendar({ history }) {
  const days = []
  for (let i = 27; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const entry = (history || []).find(h => h.date === dateStr)
    days.push({ date: dateStr, completed: entry?.completed || false, count: entry?.count || 0 })
  }
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-600 mb-3">Last 28 Days</h3>
      <div className="flex flex-wrap gap-1.5">
        {days.map((d, i) => (
          <div key={i} title={`${d.date}: ${d.completed ? `${d.count} exercises` : 'None'}`}
            className={`w-6 h-6 rounded-md transition-all hover:scale-125 cursor-default ${d.completed ? 'bg-teal-500 shadow-sm shadow-teal-500/50' : 'bg-slate-100'}`} />
        ))}
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-teal-500"></div><span className="text-xs text-slate-500">Completed</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-100"></div><span className="text-xs text-slate-500">Missed</span></div>
      </div>
    </div>
  )
}

function WeeklyReport({ progress, journalEntries }) {
  const weekDates = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    weekDates.push(d.toISOString().split('T')[0])
  }
  const history = progress.exerciseHistory || []
  const daysActive = history.filter(h => weekDates.includes(h.date) && h.completed).length
  const weekJournal = (journalEntries || []).filter(e => weekDates.includes(e.date))
  const avgPain = weekJournal.length > 0
    ? (weekJournal.reduce((s, e) => s + (e.painLevel || 0), 0) / weekJournal.length).toFixed(1) : 'N/A'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
      <h2 className="text-base font-bold mb-4">📊 Weekly Report</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Days Active', value: `${daysActive}/7`, icon: '🏃', color: 'text-teal-600' },
          { label: 'XP Earned', value: `+${progress.xp || 0}`, icon: '⭐', color: 'text-yellow-400' },
          { label: 'Avg Pain', value: avgPain, icon: '🩺', color: 'text-orange-400' },
          { label: 'Streak', value: `${progress.streak || 0}d`, icon: '🔥', color: 'text-red-500' },
        ].map(item => (
          <div key={item.label} className="bg-slate-100 rounded-xl p-3 text-center">
            <p className="text-lg mb-1">{item.icon}</p>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
      {daysActive >= 5 && <div className="mt-3 bg-teal-500/10 border border-teal-500/30 rounded-xl p-3 text-sm text-teal-700">🎉 Great week! You were active {daysActive} days!</div>}
      {daysActive < 3 && <div className="mt-3 bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 text-sm text-orange-300">💪 Try to be more active this week. Aim for at least 5 days!</div>}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const quote = quotes[new Date().getDay() % quotes.length]
  const today = new Date().toISOString().split('T')[0]
  const prevStreak = useRef(null)
  const prevLevel = useRef(null)

  const [progress, setProgress] = useState({ streak: 0, xp: 0, level: 1, recoveryProgress: 0, waterMl: 0, lastActiveDate: null, bestStreak: 0, exercisesDoneToday: [], challengesDoneToday: [], exerciseHistory: [] })
  const [exercises, setExercises] = useState(DEFAULT_EXERCISES.map(e => ({ ...e, done: false })))
  const [journalEntries, setJournalEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [milestone, setMilestone] = useState(null)

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#14b8a6', '#06b6d4', '#8b5cf6', '#f59e0b'] })
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, jRes] = await Promise.all([
          axios.get(`${API}/api/user/progress`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/api/journal`, { headers: { Authorization: `Bearer ${token}` } }),
        ])
        const data = pRes.data.progress
        if (data) {
          let streak = data.streak || 0
          const lastActive = data.lastActiveDate ? data.lastActiveDate.split('T')[0] : null
          const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]
          if (lastActive && lastActive !== today && lastActive !== yesterdayStr) streak = 0
          const doneTodayIds = data.exercisesDoneToday || []
          setExercises(DEFAULT_EXERCISES.map(ex => ({ ...ex, done: doneTodayIds.includes(ex.id) })))
          const prog = { ...data, streak, exercisesDoneToday: doneTodayIds, exerciseHistory: data.exerciseHistory || [] }
          setProgress(prog)
          prevStreak.current = streak
          prevLevel.current = data.level || 1
        }
        setJournalEntries(jRes.data.journal || [])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const saveProgress = async (newProgress) => {
    setSaving(true)
    try {
      await axios.put(`${API}/api/user/progress`, { progress: newProgress }, { headers: { Authorization: `Bearer ${token}` } })
    } catch {}
    setSaving(false)
  }

  const checkMilestones = (newP) => {
    const milestoneStreaks = [3, 7, 14, 30]
    if (milestoneStreaks.includes(newP.streak) && newP.streak !== prevStreak.current) {
      setMilestone(`🔥 ${newP.streak}-day streak! Keep going!`)
      fireConfetti()
      prevStreak.current = newP.streak
    }
    if (newP.level > (prevLevel.current || 1)) {
      setMilestone(`🎉 Level Up! You're now Level ${newP.level}!`)
      fireConfetti()
      prevLevel.current = newP.level
    }
    setTimeout(() => setMilestone(null), 4000)
  }

  const toggleExercise = (id) => {
    const ex = exercises.find(e => e.id === id)
    const wasChecked = ex.done
    const newExercises = exercises.map(e => e.id === id ? { ...e, done: !e.done } : e)
    setExercises(newExercises)
    const doneTodayIds = newExercises.filter(e => e.done).map(e => e.id)
    const doneCount = doneTodayIds.length
    const xpChange = wasChecked ? -10 : 10
    const newXp = Math.max(0, progress.xp + xpChange)
    const newLevel = Math.floor(newXp / 100) + 1
    const exerciseRecovery = Math.round((doneCount / DEFAULT_EXERCISES.length) * 40)
    const newRecovery = Math.min(100, Math.min(progress.recoveryProgress, 60) + exerciseRecovery)
    let newStreak = progress.streak
    let newBest = progress.bestStreak
    if (!wasChecked && progress.lastActiveDate !== today) { newStreak = progress.streak + 1; newBest = Math.max(newStreak, progress.bestStreak) }
    let newChallenges = [...progress.challengesDoneToday]
    if (doneCount === DEFAULT_EXERCISES.length && !newChallenges.includes('exercises')) newChallenges.push('exercises')
    else if (doneCount < DEFAULT_EXERCISES.length) newChallenges = newChallenges.filter(c => c !== 'exercises')
    const existingHistory = progress.exerciseHistory || []
    const todayHist = existingHistory.find(h => h.date === today)
    const newHistory = todayHist
      ? existingHistory.map(h => h.date === today ? { date: today, completed: doneCount > 0, count: doneCount } : h)
      : [...existingHistory, { date: today, completed: doneCount > 0, count: doneCount }]
    const newP = { ...progress, xp: newXp, level: newLevel, streak: newStreak, bestStreak: newBest, recoveryProgress: newRecovery, lastActiveDate: today, exercisesDoneToday: doneTodayIds, challengesDoneToday: newChallenges, exerciseHistory: newHistory }
    setProgress(newP)
    saveProgress(newP)
    checkMilestones(newP)
  }

  const addWater = (ml) => {
    const newWater = Math.min(progress.waterMl + ml, 2000)
    let newChallenges = [...progress.challengesDoneToday]
    let newXp = progress.xp
    if (newWater >= 500 && !newChallenges.includes('water')) { newChallenges.push('water'); newXp += 10 }
    const newP = { ...progress, waterMl: newWater, xp: newXp, level: Math.floor(newXp / 100) + 1, challengesDoneToday: newChallenges }
    setProgress(newP); saveProgress(newP)
  }

  const completeChallenge = (id, xp) => {
    if (progress.challengesDoneToday.includes(id)) return
    const newChallenges = [...progress.challengesDoneToday, id]
    const newXp = progress.xp + xp
    const newP = { ...progress, xp: newXp, level: Math.floor(newXp / 100) + 1, challengesDoneToday: newChallenges }
    setProgress(newP); saveProgress(newP)
  }

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') }

  const doneCount = exercises.filter(e => e.done).length
  const sessionProgress = Math.round((doneCount / exercises.length) * 100)
  const xpToNext = (progress.level * 100) - progress.xp
  const levelPct = Math.round(((progress.xp % 100) / 100) * 100)

  const challenges = [
    { id: 'water', text: 'Log water intake (500ml+)', xp: 10 },
    { id: 'exercises', text: 'Complete all exercises', xp: 25 },
    { id: 'walk', text: 'Take a 10-minute walk', xp: 15 },
  ]

  const navItems = [
    { icon: '📊', label: 'Dashboard', to: '/dashboard', active: true },
    { icon: '📋', label: 'Assessment', to: '/assessment' },
    { icon: '📓', label: 'Pain Journal', to: '/journal' },
    { icon: '🗓️', label: 'Protocols', to: '/protocols' },
    { icon: '🏅', label: 'Badges', to: '/badges' },
    { icon: '🤖', label: 'AI Consultant', to: '/assessment' },
    { icon: '👤', label: 'My Profile', to: '/profile' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Milestone toast */}
      {milestone && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-teal-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold text-sm animate-bounce">
          {milestone}
        </div>
      )}

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-56 bg-white border-r border-slate-200 flex flex-col py-6 px-4 z-10 hidden lg:flex">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/30">M</div>
          <span className="text-lg font-bold">MOVIRA</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => (
            <Link key={item.label} to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 pt-4 px-2">
          <p className="text-sm font-semibold text-slate-900 truncate">{user.name || 'User'}</p>
          <p className="text-xs text-slate-500 truncate">{user.email || ''}</p>
          <button onClick={handleLogout} className="mt-3 text-xs text-slate-500 hover:text-red-500 transition-colors">Sign out</button>
        </div>
      </div>

      <div className="lg:ml-56">
        {/* Mobile nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold">MOVIRA</span>
          </div>
          <button onClick={handleLogout} className="text-slate-500 text-sm">Sign out</button>
        </nav>

        <div className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
          {/* Hero */}
          <div className="bg-gradient-to-br from-teal-50 via-white to-slate-50 rounded-2xl p-7 mb-8 relative overflow-hidden border border-slate-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            <p className="text-xs text-teal-600 uppercase tracking-widest font-semibold mb-1">Recovery Dashboard</p>
            <h1 className="text-3xl font-bold mb-1 text-slate-900">Welcome back, {user.name?.toUpperCase() || 'THERE'}! 👋</h1>
            <p className="text-slate-500 text-sm italic mb-5">"{quote}"</p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-orange-50 border border-orange-200 text-sm px-4 py-1.5 rounded-full flex items-center gap-2 text-orange-700">🔥 <strong>{progress.streak}</strong> day streak</span>
              <span className="bg-yellow-50 border border-yellow-200 text-sm px-4 py-1.5 rounded-full flex items-center gap-2 text-yellow-700">⭐ <strong>{progress.xp} XP</strong></span>
              <span className="bg-purple-50 border border-purple-200 text-sm px-4 py-1.5 rounded-full flex items-center gap-2 text-purple-700">🏅 Level <strong>{progress.level}</strong></span>
            </div>
            {saving && <p className="text-xs text-teal-600 mt-3 animate-pulse">Saving...</p>}
          </div>

          {/* Progress rings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
            <h2 className="text-base font-bold mb-5">Today's Progress</h2>
            <div className="flex justify-around flex-wrap gap-4">
              <Ring value={doneCount} max={exercises.length} color="#14b8a6" label="Exercises" icon="🎯" size={90} />
              <Ring value={progress.waterMl} max={2000} color="#3b82f6" label="Hydration" icon="💧" size={90} />
              <Ring value={progress.recoveryProgress} max={100} color="#8b5cf6" label="Recovery" icon="📈" size={90} />
              <Ring value={progress.streak} max={30} color="#f59e0b" label="Streak" icon="🔥" size={90} />
              <Ring value={progress.xp % 100} max={100} color="#ec4899" label="Level XP" icon="⭐" size={90} />
            </div>
          </div>

          {/* Level bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Level {progress.level}</span>
              <span className="text-xs text-slate-500">{progress.xp % 100}/100 XP · {xpToNext} XP to Level {progress.level + 1}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${levelPct}%` }}></div>
            </div>
          </div>

          {/* Weekly report */}
          <WeeklyReport progress={progress} journalEntries={journalEntries} />

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Exercises */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">Today's Exercises</h2>
                <span className="text-sm text-slate-500">{doneCount}/{exercises.length} done</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-5">
                <div className="bg-gradient-to-r from-teal-500 to-teal-400 h-2 rounded-full transition-all duration-500" style={{ width: `${sessionProgress}%` }}></div>
              </div>
              <div className="space-y-3">
                {exercises.map(ex => (
                  <label key={ex.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${ex.done ? 'border-teal-700 bg-teal-500/5' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="checkbox" checked={ex.done} onChange={() => toggleExercise(ex.id)} className="w-5 h-5 accent-teal-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${ex.done ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{ex.name}</p>
                      <p className="text-xs text-slate-500">{ex.detail}</p>
                    </div>
                    <span className={`text-xs font-semibold ${ex.done ? 'text-teal-500' : 'text-slate-500'}`}>{ex.done ? '✓ +10 XP' : '+10 XP'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Right col */}
            <div className="flex flex-col gap-4">
              {/* Challenges */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h2 className="text-base font-bold mb-4">🎯 Daily Challenges</h2>
                <div className="space-y-3">
                  {challenges.map(c => {
                    const done = progress.challengesDoneToday.includes(c.id)
                    return (
                      <div key={c.id} onClick={() => !done && c.id === 'walk' && completeChallenge(c.id, c.xp)}
                        className={`flex items-center justify-between gap-2 p-3 rounded-xl border transition-all ${done ? 'border-teal-700 bg-teal-500/10' : 'border-slate-200 hover:border-slate-300 cursor-pointer'}`}>
                        <div className="flex items-center gap-3">
                          <span>{done ? '✅' : '⬜'}</span>
                          <p className={`text-sm ${done ? 'text-slate-500 line-through' : 'text-slate-600'}`}>{c.text}</p>
                        </div>
                        <span className={`text-xs font-bold flex-shrink-0 ${done ? 'text-slate-600' : 'text-teal-600'}`}>+{c.xp}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Water */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h2 className="text-base font-bold mb-3">💧 Water Intake</h2>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min((progress.waterMl / 2000) * 100, 100)}%` }}></div>
                </div>
                <p className="text-sm text-slate-500 mb-3">{progress.waterMl} / 2000 ml</p>
                <div className="flex gap-2">
                  {[200, 300, 500].map(ml => (
                    <button key={ml} onClick={() => addWater(ml)} className="flex-1 text-xs bg-slate-100 hover:bg-blue-900/50 border border-slate-200 hover:border-blue-600 text-slate-600 py-2 rounded-lg transition-all">+{ml}ml</button>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex flex-col gap-2">
                <Link to="/assessment" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-center py-3 rounded-xl font-medium text-sm transition-all shadow-lg shadow-teal-500/20">🤖 Start AI Assessment</Link>
                <Link to="/journal" className="bg-white border border-slate-200 hover:border-orange-500 text-slate-600 hover:text-orange-300 py-3 rounded-xl font-medium text-sm transition-all text-center">📓 Log Pain Journal</Link>
                <Link to="/badges" className="bg-white border border-slate-200 hover:border-yellow-500 text-slate-600 hover:text-yellow-300 py-3 rounded-xl font-medium text-sm transition-all text-center">🏅 View Badges</Link>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <ExerciseCalendar history={progress.exerciseHistory} />
          </div>
        </div>
      </div>
    </div>
  )
}
