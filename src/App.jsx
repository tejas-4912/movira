import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard'
import Assessment from './Assessment'
import Results from './Results'
import Login from './Login'
import Signup from './Signup'
import Onboarding from './Onboarding'
import ProtectedRoute from './ProtectedRoute'
import './App.css'

function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="text-xl font-bold">MOVIRA</span>
        </div>
        <div className="hidden md:flex gap-8 text-slate-400 font-medium text-sm">
          <a href="#features" className="hover:text-teal-400 transition-colors">Services</a>
          <a href="#programs" className="hover:text-teal-400 transition-colors">Programs</a>
          <a href="#about" className="hover:text-teal-400 transition-colors">About</a>
          <a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-400 hover:text-white font-medium text-sm transition-colors">Sign in</Link>
          <Link to="/signup" className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-xl font-medium text-sm transition-colors">Get Started</Link>
        </div>
      </nav>

      <section className="px-8 py-24 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-block bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            AI-Powered Physiotherapy
          </span>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Move better.<br />
            <span className="text-teal-400">Recover faster.</span><br />
            Live fully.
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">
            MOVIRA combines expert physiotherapy knowledge with AI to deliver personalised recovery programs, real-time progress tracking, and detailed assessments — tailored to your body.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/signup" className="bg-teal-500 hover:bg-teal-600 text-white px-7 py-3.5 rounded-xl font-semibold transition-colors">Start your recovery →</Link>
            <Link to="/login" className="border border-slate-700 hover:border-slate-500 text-slate-300 px-7 py-3.5 rounded-xl font-medium transition-colors">Sign in</Link>
          </div>
        </div>
      </section>

      <section id="features" className="px-8 py-20 max-w-6xl mx-auto">
        <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">What MOVIRA offers</p>
        <h2 className="text-3xl font-bold mb-12">Everything you need to recover</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'AI Assessment', desc: 'Answer a detailed questionnaire across 8 specialties. Our AI analyses your responses and generates a personalised physiotherapy report.' },
            { icon: '🏋️', title: 'Exercise Programs', desc: 'Get a tailored daily exercise plan with sets, reps, and guidance based on your specific condition and goals.' },
            { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your streak, XP, water intake, and recovery percentage — all in one clean dashboard.' },
            { icon: '🦴', title: '8 Specialties', desc: 'Orthopedic, Sports, Geriatric, OB/GYN, Cardio-Respiratory, Neurological, Ergonomic, and Pediatric.' },
            { icon: '🚨', title: 'Red Flag Detection', desc: 'The AI flags symptoms that need urgent medical attention, keeping your safety first.' },
            { icon: '📋', title: 'Medical Profile', desc: 'Build your complete health history including BMI, injury history, chronic conditions, and lifestyle factors.' },
          ].map((f) => (
            <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-teal-800 transition-colors">
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 border border-teal-800 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to start recovering?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join MOVIRA today and get your personalised AI physiotherapy assessment in under 5 minutes.</p>
          <Link to="/signup" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors inline-block">
            Get started — it's free
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-8 py-8 text-center text-slate-500 text-sm">
        © 2026 MOVIRA. AI-powered physiotherapy for everyone.
      </footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Onboarding isEditMode={true} /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
