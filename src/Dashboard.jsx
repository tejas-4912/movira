import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const quote = quotes[new Date().getDay() % quotes.length]

  const [exercises, setExercises] = useState([
    { id: 1, name: 'Neck stretches', detail: '10 reps · hold 15 seconds each', done: false },
    { id: 2, name: 'Shoulder rolls', detail: '2 sets · 10 forward, 10 backward', done: false },
    { id: 3, name: 'Cat-cow stretch', detail: '8 reps', done: false },
    { id: 4, name: 'Hip flexor stretch', detail: '30 seconds each side', done: false },
    { id: 5, name: 'Ankle circles', detail: '10 reps each direction', done: false },
  ])

  const [challenges] = useState([
    { id: 1, text: 'Log your water intake', xp: 10, done: false },
    { id: 2, text: 'Complete all exercises', xp: 25, done: false },
    { id: 3, text: 'Take a 10-minute walk', xp: 15, done: false },
  ])

  const [waterMl, setWaterMl] = useState(0)

  const toggleExercise = (id) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, done: !ex.done } : ex))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const doneCount = exercises.filter(ex => ex.done).length
  const progress = Math.round((doneCount / exercises.length) * 100)

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
            { icon: '🏋️', label: 'Exercises', to: '#', active: false },
            { icon: '❤️', label: 'Health Tracker', to: '#', active: false },
            { icon: '🤖', label: 'AI Consultant', to: '/assessment', active: false },
            { icon: '📅', label: 'Weekly Planner', to: '#', active: false },
            { icon: '👤', label: 'My Profile', to: '#', active: false },
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
        {/* Mobile nav */}
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
              <span className="bg-slate-700/80 text-sm px-4 py-1.5 rounded-full flex items-center gap-2">🔥 <strong>7</strong> day streak</span>
              <span className="bg-slate-700/80 text-sm px-4 py-1.5 rounded-full flex items-center gap-2">⭐ <strong>230 XP</strong> total</span>
              <span className="bg-slate-700/80 text-sm px-4 py-1.5 rounded-full flex items-center gap-2">🏅 Level <strong>2</strong></span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="🔥" label="Streak" value="7 days" sub="Personal best: 12" gradient="from-orange-600 to-orange-800" />
            <StatCard icon="🎯" label="Today's Exercises" value={`${doneCount}/${exercises.length}`} sub="Keep going!" gradient="from-teal-600 to-teal-800" />
            <StatCard icon="💧" label="Water" value={`${waterMl} ml`} sub="Goal: 2000 ml" gradient="from-blue-600 to-blue-800" />
            <StatCard icon="📈" label="Recovery" value={`${progress}%`} sub="Session completion" gradient="from-purple-600 to-purple-800" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Exercises */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">Today's Exercises</h2>
                <span className="text-sm text-slate-400">{doneCount}/{exercises.length} done</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mb-5">
                <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="space-y-3">
                {exercises.map(ex => (
                  <label key={ex.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 hover:border-slate-600 cursor-pointer transition-colors">
                    <input type="checkbox" checked={ex.done} onChange={() => toggleExercise(ex.id)} className="w-5 h-5 accent-teal-500 flex-shrink-0" />
                    <div>
                      <p className={`font-medium text-sm ${ex.done ? 'text-slate-500 line-through' : 'text-white'}`}>{ex.name}</p>
                      <p className="text-xs text-slate-500">{ex.detail}</p>
                    </div>
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
                  {challenges.map(c => (
                    <div key={c.id} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-teal-500" />
                        <p className="text-sm text-slate-300">{c.text}</p>
                      </div>
                      <span className="text-xs text-teal-400 font-semibold flex-shrink-0">+{c.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Water tracker */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h2 className="text-base font-bold mb-3 flex items-center gap-2">💧 Water Intake</h2>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((waterMl / 2000) * 100, 100)}%` }}></div>
                </div>
                <p className="text-sm text-slate-400 mb-3">{waterMl} / 2000 ml</p>
                <div className="flex gap-2">
                  {[200, 300, 500].map(ml => (
                    <button key={ml} onClick={() => setWaterMl(w => Math.min(w + ml, 2000))}
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
                <button className="border border-slate-700 hover:border-slate-500 text-slate-300 py-3 rounded-xl font-medium text-sm transition-colors">
                  📷 Posture Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
