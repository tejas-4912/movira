import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://movira-backend.onrender.com'

const quotes = [
  "Every rep is a vote for the person you want to become.",
  "Recovery is not a destination — it's a daily practice.",
  "Small consistent steps lead to lasting change.",
  "Your body heals faster when your mind believes it can.",
]

function StatCard({ icon, label, value, sub, gradient }) {
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${gradient} flex flex-col gap-1`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">{label}</p>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-white/60">{sub}</p>}
    </div>
  )
}

const DEFAULT_EXERCISES = [
  { id: 1, name: 'Neck stretches', detail: '10 reps · hold 15 seconds each', done: false },
  { id: 2, name: 'Shoulder rolls', detail: '2 sets · 10 forward, 10 backward', done: false },
  { id: 3, name: 'Cat-cow stretch', detail: '8 reps', done: false },
  { id: 4, name: 'Hip flexor stretch', detail: '30 seconds each side', done: false },
  { id: 5, name: 'Ankle circles', detail: '10 reps each direction', done: false },
]

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const quote = quotes[new Date().getDay() % quotes.length]
  const today = new Date().toISOString().split('T')[0]

  const [progress, setProgress] = useState({
    streak: 0,
    xp: 0,
    level: 1,
    recoveryProgress: 0,
    waterMl: 0,
    lastActiveDate: null,
    bestStreak: 0,
    exercisesDoneToday: [],
    challengesDoneToday: [],
  })
  const [exercises, setExercises] = useState(DEFAULT_EXERCISES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const challenges = [
    { id: 'water', text: 'Log your water intake (500ml+)', xp: 10 },
    { id: 'exercises', text: 'Complete all exercises', xp: 25 },
    { id: 'walk', text: 'Take a 10-minute walk', xp: 15 },
  ]

  // Load progress from backend
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await axios.get(`${API}/api/user/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = res.data.progress
        if (data) {
          // Check streak — if last active was yesterday keep streak, if today already counted keep, else reset
          let streak = data.streak || 0
          let bestStreak = data.bestStreak || 0
          const lastActive = data.lastActiveDate ? data.lastActiveDate.split('T')[0] : null
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]

          if (lastActive && lastActive !== today && lastActive !== yesterdayStr) {
            // Missed a day — reset streak
            streak = 0
          }

          // Restore today's exercise states
          const doneTodayIds = data.exercisesDoneToday || []
          setExercises(DEFAULT_EXERCISES.map(ex => ({
            ...ex,
            done: doneTodayIds.includes(ex.id)
          })))

          setProgress({
            streak,
            xp: data.xp || 0,
            level: data.level || 1,
            recoveryProgress: data.recoveryProgress || 0,
            waterMl: data.waterMl || 0,
            lastActiveDate: data.lastActiveDate,
            bestStreak,
            exercisesDoneToday: doneTodayIds,
            challengesDoneToday: data.challengesDoneToday || [],
          })
        }
      } catch (err) {
        console.log('Could not load progress')
      } finally {
        setLoading(false)
      }
    }
    loadProgress()
  }, [])

  const saveProgress = async (newProgress) => {
    setSaving(true)
    try {
      await axios.put(`${API}/api/user/progress`, { progress: newProgress }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.log('Could not save progress')
    } finally {
      setSaving(false)
    }
  }

  const toggleExercise = (id) => {
    const ex = exercises.find(e => e.id === id)
    const wasChecked = ex.done
    const newExercises = exercises.map(e => e.id === id ? { ...e, done: !e.done } : e)
    setExercises(newExercises)

    const doneTodayIds = newExercises.filter(e => e.done).map(e => e.id)
    const doneCount = doneTodayIds.length

    // XP change
    const xpChange = wasChecked ? -10 : 10
    const newXp = Math.max(0, progress.xp + xpChange)
    const newLevel = Math.floor(newXp / 100) + 1

    // Recovery progress = weighted average of exercises done
    const exerciseRecovery = Math.round((doneCount / DEFAULT_EXERCISES.length) * 40)
    const baseRecovery = Math.min(progress.recoveryProgress, 60) // assessment contributes up to 60%
    const newRecovery = Math.min(100, baseRecovery + exerciseRecovery)

    // Streak — mark today as active
    let newStreak = progress.streak
    let newBestStreak = progress.bestStreak
    if (!wasChecked && progress.lastActiveDate !== today) {
      newStreak = progress.streak + 1
      newBestStreak = Math.max(newStreak, progress.bestStreak)
    }

    // Check if all exercises done — complete "exercises" challenge
    let newChallengesDone = [...progress.challengesDoneToday]
    if (doneCount === DEFAULT_EXERCISES.length && !newChallengesDone.includes('exercises')) {
      newChallengesDone.push('exercises')
    } else if (doneCount < DEFAULT_EXERCISES.length) {
      newChallengesDone = newChallengesDone.filter(c => c !== 'exercises')
    }

    const newProgress = {
      ...progress,
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      bestStreak: newBestStreak,
      recoveryProgress: newRecovery,
      lastActiveDate: today,
      exercisesDoneToday: doneTodayIds,
      challengesDoneToday: newChallengesDone,
    }
    setProgress(newProgress)
    saveProgress(newProgress)
  }

  const addWater = (ml) => {
    const newWater = Math.min(progress.waterMl + ml, 2000)
    let newChallengesDone = [...progress.challengesDoneToday]
    let newXp = progress.xp
    if (newWater >= 500 && !newChallengesDone.includes('water')) {
      newChallengesDone.push('water')
      newXp += 10
    }
    const newProgress = {
      ...progress,
      waterMl: newWater,
      xp: newXp,
      level: Math.floor(newXp / 100) + 1,
      challengesDoneToday: newChallengesDone,
    }
    setProgress(newProgress)
    saveProgress(newProgress)
  }

  const completeChallenge = (challengeId, xpAmount) => {
    if (progress.challengesDoneToday.includes(challengeId)) return
    const newChallengesDone = [...progress.challengesDoneToday, challengeId]
    const newXp = progress.xp + xpAmount
    const newProgress = {
      ...progress,
      xp: newXp,
      level: Math.floor(newXp / 100) + 1,
      challengesDoneToday: newChallengesDone,
    }
    setProgress(newProgress)
    saveProgress(newProgress)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const doneCount = exercises.filter(ex => ex.done).length
  const sessionProgress = Math.round((doneCount / exercises.length) * 100)
  const xpToNextLevel = (progress.level * 100) - progress.xp
  const levelProgress = Math.round(((progress.xp % 100) / 100) * 100)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-56 bg-slate-900 border-r border-slate-800 flex flex-col py-6 px-4 z-10 hidden lg:flex">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="text-lg font-bold">MOVIRA</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {[
            { icon: '📊', label: 'Dashboard', to: '/dashboard', active: true },
            { icon: '📋', label: 'Assessment', to: '/assessment', active: false },
            { icon: '🤖', label: 'AI Consultant', to: '/assessment', active: false },
            { icon: '👤', label: 'My Profile', to: '/profile', active: false },
          ].map(item => (
            <Link key={item.label} to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-teal-500/10 text-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-800 pt-4 px-2">
          <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
          <p className="text-xs text-slate-500 truncate">{user.email || ''}</p>
          <button onClick={handleLogout} className="mt-3 text-xs text-slate-500 hover:text-red-400 transition-colors">Sign out</button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-56">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold">MOVIRA</span>
          </div>
          <button onClick={handleLogout} className="text-slate-400 text-sm hover:text-white">Sign out</button>
        </nav>

        <div className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
          {/* Hero banner */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-teal-900 rounded-2xl p-7 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <p className="text-xs text-teal-400 uppercase tracking-widest font-semibold mb-1">Recovery Dashboard</p>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name?.toUpperCase() || 'THERE'}!</h1>
            <p className="text-slate-400 text-sm italic mb-5">"{quote}"</p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-slate-700/80 text-sm px-4 py-1.5 rounded-full flex items-center gap-2">🔥 <strong>{progress.streak}</strong> day streak</span>
              <span className="bg-slate-700/80 text-sm px-4 py-1.5 rounded-full flex items-center gap-2">⭐ <strong>{progress.xp} XP</strong> total</span>
              <span className="bg-slate-700/80 text-sm px-4 py-1.5 rounded-full flex items-center gap-2">🏅 Level <strong>{progress.level}</strong></span>
            </div>
            {saving && <p className="text-xs text-teal-400 mt-3">Saving...</p>}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="🔥" label="Streak" value={`${progress.streak} days`} sub={`Best: ${progress.bestStreak} days`} gradient="from-orange-600 to-orange-800" />
            <StatCard icon="🎯" label="Today's Exercises" value={`${doneCount}/${exercises.length}`} sub="Keep going!" gradient="from-teal-600 to-teal-800" />
            <StatCard icon="💧" label="Water" value={`${progress.waterMl} ml`} sub="Goal: 2000 ml" gradient="from-blue-600 to-blue-800" />
            <StatCard icon="📈" label="Recovery" value={`${progress.recoveryProgress}%`} sub="Overall progress" gradient="from-purple-600 to-purple-800" />
          </div>

          {/* Level progress bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Level {progress.level}</span>
              <span className="text-xs text-slate-400">{progress.xp % 100}/100 XP · {xpToNextLevel} XP to Level {progress.level + 1}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${levelProgress}%` }}></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Exercises */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">Today's Exercises</h2>
                <span className="text-sm text-slate-400">{doneCount}/{exercises.length} done</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mb-5">
                <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${sessionProgress}%` }}></div>
              </div>
              <div className="space-y-3">
                {exercises.map(ex => (
                  <label key={ex.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 hover:border-slate-600 cursor-pointer transition-colors">
                    <input type="checkbox" checked={ex.done} onChange={() => toggleExercise(ex.id)} className="w-5 h-5 accent-teal-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${ex.done ? 'text-slate-500 line-through' : 'text-white'}`}>{ex.name}</p>
                      <p className="text-xs text-slate-500">{ex.detail}</p>
                    </div>
                    {!ex.done && <span className="text-xs text-teal-400">+10 XP</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* Daily challenges */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">🎯 Daily Challenges</h2>
                <div className="space-y-3">
                  {challenges.map(c => {
                    const done = progress.challengesDoneToday.includes(c.id)
                    return (
                      <div key={c.id}
                        onClick={() => !done && c.id === 'walk' && completeChallenge(c.id, c.xp)}
                        className={`flex items-center justify-between gap-2 p-3 rounded-xl border transition-colors ${done ? 'border-teal-700 bg-teal-500/10' : 'border-slate-800 hover:border-slate-600 cursor-pointer'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{done ? '✅' : '⬜'}</span>
                          <p className={`text-sm ${done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{c.text}</p>
                        </div>
                        <span className={`text-xs font-semibold flex-shrink-0 ${done ? 'text-slate-500' : 'text-teal-400'}`}>+{c.xp} XP</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Water tracker */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h2 className="text-base font-bold mb-3 flex items-center gap-2">💧 Water Intake</h2>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((progress.waterMl / 2000) * 100, 100)}%` }}></div>
                </div>
                <p className="text-sm text-slate-400 mb-3">{progress.waterMl} / 2000 ml</p>
                <div className="flex gap-2">
                  {[200, 300, 500].map(ml => (
                    <button key={ml} onClick={() => addWater(ml)}
                      className="flex-1 text-xs bg-slate-800 hover:bg-blue-900 border border-slate-700 text-slate-300 py-2 rounded-lg transition-colors">
                      +{ml}ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex flex-col gap-2">
                <Link to="/assessment" className="bg-teal-500 hover:bg-teal-600 text-white text-center py-3 rounded-xl font-medium text-sm transition-colors">
                  🤖 Start AI Assessment
                </Link>
                <Link to="/profile" className="border border-slate-700 hover:border-slate-500 text-slate-300 py-3 rounded-xl font-medium text-sm transition-colors text-center">
                  👤 View My Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
