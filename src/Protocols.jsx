import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://movira-backend.onrender.com'

const PROTOCOLS = [
  {
    id: 'back-pain-4w',
    title: '4-Week Lower Back Recovery',
    icon: '🦴',
    category: 'Orthopedic',
    difficulty: 'Beginner',
    duration: '4 weeks',
    sessionsPerWeek: 5,
    color: 'from-blue-600 to-blue-800',
    description: 'A structured program to relieve lower back pain, strengthen core muscles, and restore full mobility.',
    weeks: [
      { week: 1, focus: 'Pain Relief & Gentle Mobility', exercises: ['Cat-cow stretch x 10', 'Knee-to-chest stretch x 30s each', 'Pelvic tilts x 15', 'Diaphragmatic breathing x 5 min', 'Gentle walking x 10 min'] },
      { week: 2, focus: 'Core Activation', exercises: ['Dead bug x 3×10', 'Bird-dog x 3×10', 'Glute bridges x 3×15', 'Side-lying clamshells x 2×15', 'Walking x 15 min'] },
      { week: 3, focus: 'Strength Building', exercises: ['Plank hold x 3×20s', 'Romanian deadlift (bodyweight) x 3×12', 'Hip flexor stretch x 30s', 'Seated lumbar rotation x 10 each', 'Walking x 20 min'] },
      { week: 4, focus: 'Function & Return to Activity', exercises: ['Wall squats x 3×15', 'Single-leg balance x 30s each', 'Resistance band rows x 3×12', 'Full plank x 3×30s', 'Brisk walking x 25 min'] },
    ]
  },
  {
    id: 'knee-recovery-6w',
    title: '6-Week Knee Rehabilitation',
    icon: '🦵',
    category: 'Orthopedic',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    sessionsPerWeek: 4,
    color: 'from-green-600 to-green-800',
    description: 'Progressive knee strengthening program for post-injury or post-surgery recovery.',
    weeks: [
      { week: 1, focus: 'Reduce Swelling & ROM', exercises: ['Ice therapy x 15 min', 'Ankle pumps x 20', 'Straight leg raises x 3×10', 'Heel slides x 3×15', 'Quad sets x 3×10'] },
      { week: 2, focus: 'Quad & Hamstring Activation', exercises: ['Mini squats x 3×15', 'Terminal knee extensions x 3×15', 'Hamstring curls (lying) x 3×12', 'Step-ups (low) x 3×10', 'Calf raises x 3×20'] },
      { week: 3, focus: 'Balance & Proprioception', exercises: ['Single-leg stance x 30s', 'Lateral band walks x 2×15', 'Wall squats x 3×20', 'Leg press (light) x 3×15', 'Cycling x 15 min'] },
      { week: 4, focus: 'Strength', exercises: ['Lunges x 3×12', 'Romanian deadlifts x 3×12', 'Step-ups (high) x 3×10', 'Leg press (moderate) x 3×12', 'Cycling x 20 min'] },
      { week: 5, focus: 'Power & Endurance', exercises: ['Split squats x 3×12', 'Lateral step-overs x 3×10', 'Resisted terminal extensions x 3×15', 'Single-leg press x 3×10', 'Swimming or cycling x 25 min'] },
      { week: 6, focus: 'Return to Sport/Function', exercises: ['Jogging x 10 min', 'Agility ladder drills x 3 sets', 'Plyometric step-ups x 3×8', 'Full squats x 3×15', 'Sport-specific drills x 15 min'] },
    ]
  },
  {
    id: 'posture-fix-3w',
    title: '3-Week Posture Correction',
    icon: '🧍',
    category: 'Ergonomic',
    difficulty: 'Beginner',
    duration: '3 weeks',
    sessionsPerWeek: 6,
    color: 'from-purple-600 to-purple-800',
    description: 'Fix forward head posture, rounded shoulders, and upper back pain from desk work.',
    weeks: [
      { week: 1, focus: 'Mobility & Awareness', exercises: ['Chin tucks x 3×10', 'Chest opener stretch x 30s', 'Thoracic spine rotation x 10 each', 'Shoulder rolls x 20', 'Neck side stretch x 30s each'] },
      { week: 2, focus: 'Strength & Stability', exercises: ['Wall angels x 3×10', 'Band pull-aparts x 3×15', 'Prone Y-T-W x 3×8', 'Serratus anterior push-ups x 3×10', 'Deep neck flexors x 3×10'] },
      { week: 3, focus: 'Integration & Habits', exercises: ['Overhead reach with band x 3×12', 'Thoracic extension over foam roller x 2 min', 'Standing posture holds x 5 min', 'Ergonomic breaks every hour', 'Full routine x daily'] },
    ]
  },
  {
    id: 'desk-warrior-4w',
    title: '4-Week Desk Warrior Reset',
    icon: '💼',
    category: 'Corporate',
    difficulty: 'Beginner',
    duration: '4 weeks',
    sessionsPerWeek: 5,
    color: 'from-slate-500 to-slate-700',
    description: 'Designed for office workers spending 8+ hours at a desk. Targets neck, shoulder, wrist, and lower back pain from prolonged sitting.',
    weeks: [
      { week: 1, focus: 'Awareness & Mobility Breaks', exercises: ['Hourly neck rolls x 5 each direction', 'Chest opener doorway stretch x 30s', 'Wrist circles x 20 each', 'Seated spinal twist x 30s each', 'Stand and walk every 45 min'] },
      { week: 2, focus: 'Posture Correction', exercises: ['Chin tucks x 3×12', 'Shoulder blade squeezes x 3×15', 'Seated hip flexor stretch x 30s each', 'Band pull-aparts x 3×15', 'Standing desk alternation x 30 min/day'] },
      { week: 3, focus: 'Strengthening', exercises: ['Wall angels x 3×10', 'Resistance band rows x 3×15', 'Glute bridges x 3×15', 'Dead bug x 3×10', 'Lunchtime walk x 20 min'] },
      { week: 4, focus: 'Habit Integration', exercises: ['Full morning mobility routine x 10 min', 'Ergonomic workstation audit', 'Pomodoro movement breaks x every 25 min', 'Evening yoga flow x 15 min', 'Maintain all posture habits'] },
    ]
  },
  {
    id: 'eye-neck-strain-3w',
    title: '3-Week Screen Fatigue Relief',
    icon: '👁️',
    category: 'Corporate',
    difficulty: 'Beginner',
    duration: '3 weeks',
    sessionsPerWeek: 6,
    color: 'from-indigo-600 to-indigo-800',
    description: 'Combat digital eye strain, tension headaches, and upper neck tightness caused by long hours on screens.',
    weeks: [
      { week: 1, focus: 'Reduce Strain', exercises: ['20-20-20 rule every 20 min', 'Palming (eye rest) x 2 min', 'Upper trapezius stretch x 30s each', 'Suboccipital release (fingers behind skull) x 1 min', 'Blue light glasses or night mode enabled'] },
      { week: 2, focus: 'Neck Mobility', exercises: ['Chin tucks x 3×12', 'Cervical lateral flexion stretch x 30s each', 'Neck rotation x 10 each side', 'Levator scapulae stretch x 30s each', 'Scalene stretch x 30s each'] },
      { week: 3, focus: 'Prevention Protocol', exercises: ['Morning neck routine x 5 min', 'Eye focus drills (near-far alternation) x 2 min', 'Shoulder shrugs and drops x 3×15', 'Upper back foam rolling x 3 min', 'Evening screen cut-off 1 hour before bed'] },
    ]
  },
  {
    id: 'wrist-rsi-4w',
    title: '4-Week RSI & Wrist Recovery',
    icon: '⌨️',
    category: 'Corporate',
    difficulty: 'Beginner',
    duration: '4 weeks',
    sessionsPerWeek: 5,
    color: 'from-cyan-600 to-cyan-800',
    description: 'For typists, developers, and data entry workers with repetitive strain injury, carpal tunnel symptoms, or wrist pain.',
    weeks: [
      { week: 1, focus: 'Rest & Gentle Mobility', exercises: ['Wrist circles x 20 each direction', 'Finger extensions and spreads x 20', 'Prayer stretch x 30s', 'Reverse prayer stretch x 30s', 'Ice wrist post-work x 10 min'] },
      { week: 2, focus: 'Nerve Gliding & Strengthening', exercises: ['Median nerve glides x 10 each', 'Ulnar nerve glides x 10 each', 'Putty or stress ball squeezes x 3×20', 'Wrist extension stretch x 30s each', 'Typing ergonomics assessment'] },
      { week: 3, focus: 'Strengthening', exercises: ['Wrist curls (light) x 3×15', 'Wrist extensions (light) x 3×15', 'Forearm pronation/supination x 3×15', 'Grip strengthener x 3×20', 'Keyboard shortcut training to reduce mouse use'] },
      { week: 4, focus: 'Prevention & Return', exercises: ['Full wrist warm-up before work x 5 min', 'Micro-break every 30 min of typing', 'Ergonomic keyboard/mouse review', 'Forearm stretching post-work x 5 min', 'Maintain all exercises 3x/week'] },
    ]
  },
  {
    id: 'gym-beginner-6w',
    title: '6-Week Gym Starter Program',
    icon: '🏋️',
    category: 'Gym',
    difficulty: 'Beginner',
    duration: '6 weeks',
    sessionsPerWeek: 3,
    color: 'from-red-600 to-red-800',
    description: 'Safe introduction to gym training with proper movement patterns. Builds strength, mobility, and confidence for first-time gym goers.',
    weeks: [
      { week: 1, focus: 'Movement Patterns & Form', exercises: ['Goblet squat x 3×10 (light)', 'Dumbbell Romanian deadlift x 3×10', 'Push-ups (modified) x 3×8', 'Seated cable row x 3×10', 'Plank hold x 3×20s'] },
      { week: 2, focus: 'Building Confidence', exercises: ['Leg press x 3×12', 'Lat pulldown x 3×10', 'Dumbbell chest press x 3×10', 'Dumbbell shoulder press x 3×10', 'Cable crunch x 3×15'] },
      { week: 3, focus: 'Progressive Overload', exercises: ['Barbell squat (light) x 3×8', 'Dumbbell deadlift x 3×10', 'Incline push-ups x 3×12', 'One-arm dumbbell row x 3×10 each', 'Side plank x 3×20s each'] },
      { week: 4, focus: 'Full Body Strength', exercises: ['Barbell squat x 4×8', 'Barbell deadlift (light) x 3×6', 'Bench press x 4×8', 'Bent-over row x 4×8', 'Core circuit x 3 rounds'] },
      { week: 5, focus: 'Hypertrophy Phase', exercises: ['Split squats x 3×12 each', 'Single-leg press x 3×12', 'Cable fly x 3×15', 'Seated row x 4×12', 'Overhead press x 4×10'] },
      { week: 6, focus: 'Testing & Next Steps', exercises: ['Max rep push-up test', 'Squat form assessment', 'Deadlift technique check', 'Full body circuit x 3 rounds', 'Design 12-week program'] },
    ]
  },
  {
    id: 'gym-muscle-recovery-4w',
    title: '4-Week Gym Injury Recovery',
    icon: '🩹',
    category: 'Gym',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    sessionsPerWeek: 4,
    color: 'from-amber-600 to-amber-800',
    description: 'For gym goers recovering from muscle strains, overuse injuries, or training burnout. Maintain fitness while healing safely.',
    weeks: [
      { week: 1, focus: 'Active Rest', exercises: ['Swimming or pool walking x 30 min', 'Unaffected body parts only', 'Foam rolling x 10 min full body', 'Light yoga x 20 min', 'Sleep 8+ hours prioritised'] },
      { week: 2, focus: 'Controlled Movement', exercises: ['Bodyweight squats x 3×15', 'Push-ups x 3×10', 'Resistance band work only on injury site', 'Core stability work x 20 min', 'Stretching x 15 min post session'] },
      { week: 3, focus: 'Gradual Load', exercises: ['Light dumbbell work (50% usual weight) x 3×12', 'Cable exercises for injured area x 3×15', 'Full body mobility circuit', 'Cardio (no impact if lower body injury) x 20 min', 'Contrast therapy (hot/cold) x 10 min'] },
      { week: 4, focus: 'Return to Training', exercises: ['75% of normal training weight', 'Full session with modified exercises', 'Deload protocol going forward', 'Injury prevention warm-up x 10 min', 'Assessment with trainer or physio'] },
    ]
  },
  {
    id: 'gym-flexibility-4w',
    title: '4-Week Flexibility & Mobility',
    icon: '🧘',
    category: 'Gym',
    difficulty: 'Beginner',
    duration: '4 weeks',
    sessionsPerWeek: 5,
    color: 'from-teal-600 to-teal-800',
    description: 'For gym goers who neglect stretching. Improves range of motion, reduces injury risk, and enhances performance.',
    weeks: [
      { week: 1, focus: 'Baseline Flexibility', exercises: ['Hip flexor stretch x 60s each', 'Hamstring stretch x 60s each', 'Thoracic rotation x 10 each', 'Calf stretch x 60s each', 'Overhead tricep stretch x 30s each'] },
      { week: 2, focus: 'Dynamic Mobility', exercises: ['Leg swings x 20 each direction', 'Arm circles x 20 each direction', 'Hip circles x 15 each', 'Inchworm x 10', 'World greatest stretch x 5 each'] },
      { week: 3, focus: 'Deep Flexibility', exercises: ['Pigeon pose x 90s each side', 'Couch stretch x 60s each', 'Pancake stretch x 2 min', 'Doorway pec stretch x 60s each', 'Shoulder dislocates with band x 15'] },
      { week: 4, focus: 'Integration', exercises: ['Full mobility warm-up before every session x 10 min', 'Post-workout stretch routine x 15 min', 'Foam rolling x 10 min', 'Yoga flow x 20 min', 'Maintain 3x/week going forward'] },
    ]
  },
  {
    id: 'shoulder-6w',
    title: '6-Week Shoulder Recovery',
    icon: '💪',
    category: 'Sports',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    sessionsPerWeek: 4,
    color: 'from-orange-600 to-orange-800',
    description: 'Rotator cuff strengthening and shoulder mobility restoration for sports or daily function.',
    weeks: [
      { week: 1, focus: 'Pain Control & ROM', exercises: ['Pendulum swings x 2×20', 'Codman circles x 2 min', 'Passive external rotation x 30s', 'Scapular retraction x 3×15', 'Ice post-exercise x 15 min'] },
      { week: 2, focus: 'Rotator Cuff Activation', exercises: ['Internal rotation (band) x 3×15', 'External rotation (band) x 3×15', 'Side-lying ER x 3×12', 'Scapular push-ups x 3×10', 'Wall slides x 3×10'] },
      { week: 3, focus: 'Strength Phase 1', exercises: ['Front raises x 3×12', 'Lateral raises x 3×12', 'Bent-over rows x 3×12', 'Face pulls x 3×15', 'Cable ER at 90° x 3×12'] },
      { week: 4, focus: 'Strength Phase 2', exercises: ['Overhead press (light) x 3×10', 'Arnold press x 3×10', 'Single-arm row x 3×12', 'Prone T raises x 3×10', 'Sleeper stretch x 30s'] },
      { week: 5, focus: 'Power', exercises: ['Medicine ball chest pass x 3×10', 'Plyometric push-ups x 3×8', 'Cable diagonal patterns x 3×12', 'Overhead carry x 3×20m', 'Rotational exercises x 3×12'] },
      { week: 6, focus: 'Return to Sport', exercises: ['Sport-specific throws/swings x 3 sets', 'Full shoulder circuit x 1 round', 'Functional movement screen', 'Maintenance program design', 'Return to full activity'] },
    ]
  },
]

export default function Protocols() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [activeProtocol, setActiveProtocol] = useState(null)
  const [selectedProtocol, setSelectedProtocol] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/protocol`, { headers: { Authorization: `Bearer ${token}` } })
        setActiveProtocol(res.data.activeProtocol)
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const startProtocol = async (protocol) => {
    const newActive = {
      protocolId: protocol.id,
      startDate: new Date().toISOString().split('T')[0],
      currentWeek: 1,
      completedDays: [],
    }
    try {
      await axios.put(`${API}/api/protocol`, { activeProtocol: newActive }, { headers: { Authorization: `Bearer ${token}` } })
      setActiveProtocol(newActive)
      setSelectedProtocol(null)
    } catch {}
  }

  const markDayComplete = async () => {
    const today = new Date().toISOString().split('T')[0]
    if (activeProtocol.completedDays.includes(today)) return
    const updated = { ...activeProtocol, completedDays: [...activeProtocol.completedDays, today] }
    // Advance week if 5 days completed in current week
    const weekDays = updated.completedDays.filter(d => {
      const start = new Date(activeProtocol.startDate)
      start.setDate(start.getDate() + (updated.currentWeek - 1) * 7)
      const end = new Date(start)
      end.setDate(end.getDate() + 7)
      const day = new Date(d)
      return day >= start && day < end
    })
    const currentProto = PROTOCOLS.find(p => p.id === activeProtocol.protocolId)
    if (weekDays.length >= (currentProto?.sessionsPerWeek || 5) && updated.currentWeek < (currentProto?.weeks?.length || 4)) {
      updated.currentWeek = updated.currentWeek + 1
    }
    try {
      await axios.put(`${API}/api/protocol`, { activeProtocol: updated }, { headers: { Authorization: `Bearer ${token}` } })
      setActiveProtocol(updated)
    } catch {}
  }

  const stopProtocol = async () => {
    if (!confirm('Stop current protocol?')) return
    try {
      await axios.put(`${API}/api/protocol`, { activeProtocol: null }, { headers: { Authorization: `Bearer ${token}` } })
      setActiveProtocol(null)
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const currentProto = activeProtocol ? PROTOCOLS.find(p => p.id === activeProtocol.protocolId) : null
  const today = new Date().toISOString().split('T')[0]
  const todayDone = activeProtocol?.completedDays?.includes(today)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed left-0 top-0 h-full w-56 bg-slate-900 border-r border-slate-800 flex flex-col py-6 px-4 z-10 hidden lg:flex">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="text-lg font-bold">MOVIRA</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {[
            { icon: '📊', label: 'Dashboard', to: '/dashboard' },
            { icon: '📋', label: 'Assessment', to: '/assessment' },
            { icon: '📓', label: 'Pain Journal', to: '/journal' },
            { icon: '🗓️', label: 'Protocols', to: '/protocols', active: true },
            { icon: '🤖', label: 'AI Consultant', to: '/assessment' },
            { icon: '👤', label: 'My Profile', to: '/profile' },
          ].map(item => (
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

      <div className="lg:ml-56 px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-1">Recovery Programs</p>
          <h1 className="text-3xl font-bold">Protocols</h1>
          <p className="text-slate-400 text-sm mt-1">Pre-built physiotherapy programs designed by experts</p>
        </div>

        {/* Active protocol */}
        {activeProtocol && currentProto && (
          <div className={`bg-gradient-to-br ${currentProto.color} rounded-2xl p-6 mb-8`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Currently Active</p>
                <h2 className="text-xl font-bold">{currentProto.icon} {currentProto.title}</h2>
                <p className="text-white/70 text-sm mt-1">Week {activeProtocol.currentWeek} of {currentProto.weeks.length} · {currentProto.weeks[activeProtocol.currentWeek - 1]?.focus}</p>
              </div>
              <button onClick={stopProtocol} className="text-white/50 hover:text-white text-xs border border-white/20 px-3 py-1.5 rounded-lg transition-colors">Stop</button>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${((activeProtocol.currentWeek - 1) / currentProto.weeks.length) * 100}%` }}></div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Today's Exercises:</p>
              <div className="space-y-1">
                {currentProto.weeks[activeProtocol.currentWeek - 1]?.exercises.map((ex, i) => (
                  <p key={i} className="text-sm text-white/80">▸ {ex}</p>
                ))}
              </div>
            </div>
            <button onClick={markDayComplete} disabled={todayDone}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${todayDone ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-white/90'}`}>
              {todayDone ? '✅ Today Completed!' : '✓ Mark Today Complete'}
            </button>
          </div>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Orthopedic', 'Corporate', 'Gym', 'Sports', 'Ergonomic'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filter === cat ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Protocol list */}
        <div className="grid sm:grid-cols-2 gap-5">
          {PROTOCOLS.filter(p => filter === 'All' || p.category === filter).map(p => {
            const isActive = activeProtocol?.protocolId === p.id
            return (
              <div key={p.id} className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl`}>{p.icon}</div>
                  {isActive && <span className="text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30 px-2 py-1 rounded-full">Active</span>}
                </div>
                <h3 className="font-bold text-white mb-1">{p.title}</h3>
                <p className="text-slate-400 text-sm mb-3 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{p.duration}</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{p.sessionsPerWeek}x/week</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{p.difficulty}</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{p.category}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedProtocol(selectedProtocol?.id === p.id ? null : p)}
                    className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-300 py-2 rounded-xl text-sm transition-colors">
                    {selectedProtocol?.id === p.id ? 'Hide Details' : 'View Details'}
                  </button>
                  {!isActive && (
                    <button onClick={() => startProtocol(p)}
                      className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl text-sm font-medium transition-colors">
                      Start
                    </button>
                  )}
                </div>
                {selectedProtocol?.id === p.id && (
                  <div className="mt-4 border-t border-slate-800 pt-4 space-y-3">
                    {p.weeks.map(w => (
                      <div key={w.week} className="bg-slate-800 rounded-xl p-3">
                        <p className="text-sm font-semibold text-teal-400 mb-1">Week {w.week}: {w.focus}</p>
                        <ul className="space-y-0.5">
                          {w.exercises.map((ex, i) => <li key={i} className="text-xs text-slate-400">▸ {ex}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
