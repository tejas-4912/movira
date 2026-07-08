import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Dashboard from './Dashboard'
import Assessment from './Assessment'
import Results from './Results'
import Login from './Login'
import Signup from './Signup'
import Onboarding from './Onboarding'
import Journal from './Journal'
import Protocols from './Protocols'
import Badges from './Badges'
import ProtectedRoute from './ProtectedRoute'
import ChatAssistant from './ChatAssistant'
import './App.css'

// ── Logo component ──
function Logo({ size = 36 }) {
  return (
    <img src="/movira-logo.png" alt="MOVIRA" style={{ height: size, width: 'auto', borderRadius: 8 }} />
  )
}

// ── Landing Page ──
function Landing() {
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { q: 'Is MOVIRA a replacement for a physiotherapist?', a: 'No. MOVIRA is a support tool that helps you track recovery, follow evidence-based exercise programs, and get AI-powered guidance. It is not a substitute for professional medical diagnosis or treatment. Always consult a qualified physiotherapist for clinical decisions.' },
    { q: 'How does the AI assessment work?', a: 'You answer a detailed questionnaire across 8 physiotherapy specialties. Our AI analyses your responses and generates a personalised report covering diagnosis, exercises, diet tips, lifestyle changes, red flags, and recovery timeline — all based on your specific answers.' },
    { q: 'Who is MOVIRA for?', a: 'MOVIRA is designed for office workers with desk-related pain, gym goers recovering from injuries, elderly individuals managing mobility, patients in post-surgery recovery, athletes returning to sport, and anyone wanting to proactively manage their musculoskeletal health.' },
    { q: 'Is my health data secure?', a: 'Yes. All data is encrypted in transit and stored securely in MongoDB Atlas. We do not sell or share your personal health information with any third parties.' },
    { q: 'What is the difference between Free and Pro plans?', a: 'The Free plan gives you access to the AI assessment, basic exercise tracking, and pain journal. The Pro plan unlocks unlimited assessments, all 10 recovery protocols, AI chat assistant, advanced analytics, and priority support.' },
    { q: 'Can my physiotherapist access my data?', a: 'Currently MOVIRA is a self-use platform. A physiotherapist portal where your physio can monitor your progress remotely is on our roadmap for later this year.' },
    { q: 'Does MOVIRA work on mobile?', a: 'Yes. MOVIRA is a responsive web app that works on all modern browsers on mobile, tablet, and desktop. A dedicated mobile app is on our roadmap.' },
  ]

  const benefits = [
    { icon: '🧠', title: 'AI-Powered Diagnosis', desc: 'Get a personalised physiotherapy report in under 5 minutes — covering diagnosis, exercises, diet, and red flags.' },
    { icon: '📊', title: 'Real-Time Progress Tracking', desc: 'Track your streak, XP, water intake, exercise history, and recovery percentage — all updated live.' },
    { icon: '📓', title: 'Daily Pain Journal', desc: 'Log your pain levels, mood, and location daily. Spot trends and share insights with your physiotherapist.' },
    { icon: '🗓️', title: 'Recovery Protocols', desc: '10 pre-built programs for desk workers, gym goers, and orthopedic recovery — week-by-week guidance.' },
    { icon: '💬', title: 'AI Chat Assistant', desc: 'Ask any physiotherapy question and get instant, expert-level answers powered by AI — available 24/7.' },
    { icon: '🏅', title: 'Gamified Recovery', desc: 'Earn XP, level up, unlock badges, and build daily streaks to stay motivated throughout your recovery journey.' },
  ]

  const whoFor = [
    { icon: '💼', title: 'Corporate Employees', desc: 'Neck pain, RSI, back pain from desk work. MOVIRA gives you structured desk-worker recovery programs and posture correction guides.' },
    { icon: '🏋️', title: 'Gym Goers & Athletes', desc: 'Recover from training injuries, prevent overuse, and return to sport safely with evidence-based protocols.' },
    { icon: '🧓', title: 'Elderly & Post-Surgery', desc: 'Geriatric mobility programs and post-operative recovery guidance designed for older adults and post-surgical patients.' },
    { icon: '🤰', title: 'Women\'s Health', desc: 'Prenatal, postnatal, and pelvic floor rehabilitation programs designed specifically for women at every stage.' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800 sticky top-0 bg-slate-950/90 backdrop-blur-sm z-40">
        <Logo size={65} />
        <div className="hidden md:flex gap-8 text-slate-400 font-medium text-sm">
          <a href="#what" className="hover:text-teal-400 transition-colors">What is MOVIRA</a>
          <a href="#who" className="hover:text-teal-400 transition-colors">Who it's for</a>
          <a href="#benefits" className="hover:text-teal-400 transition-colors">Benefits</a>
          <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-teal-400 transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-400 hover:text-white font-medium text-sm transition-colors">Sign in</Link>
          <Link to="/signup" className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-xl font-medium text-sm transition-colors">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-block bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            AI-Powered Physiotherapy Platform
          </span>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Move better.<br />
            <span className="text-teal-400">Recover faster.</span><br />
            Live fully.
          </h1>
          <p className="text-xl text-slate-400 max-w-xl mb-10 leading-relaxed">
            MOVIRA combines expert physiotherapy knowledge with AI to deliver personalised recovery programs, real-time progress tracking, and 24/7 guidance — tailored to your body.
          </p>
          <div className="flex gap-4 flex-wrap mb-8">
            <Link to="/signup" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              Start for free →
            </Link>
            <a href="#what" className="border border-slate-700 hover:border-slate-500 text-slate-300 px-8 py-4 rounded-xl font-medium text-lg transition-colors">
              Learn more
            </a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">✓ No credit card required</span>
            <span className="flex items-center gap-2">✓ Free plan available</span>
            <span className="flex items-center gap-2">✓ Setup in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* What is MOVIRA */}
      <section id="what" className="px-8 py-20 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">What is MOVIRA?</p>
            <h2 className="text-4xl font-bold mb-6">Your AI physiotherapy companion</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              MOVIRA is a digital physiotherapy platform that uses artificial intelligence to assess your condition, create personalised recovery plans, and track your progress — all without needing to visit a clinic. Think of it as having a physiotherapy expert available 24/7, right in your pocket.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { step: '01', title: 'Complete your assessment', desc: 'Answer a detailed questionnaire about your condition, pain level, history, and goals.' },
              { step: '02', title: 'Get your AI report', desc: 'Receive a personalised physiotherapy report with diagnosis, exercises, diet tips, and red flags.' },
              { step: '03', title: 'Track your recovery', desc: 'Follow your daily program, log pain levels, and watch your recovery progress in real time.' },
            ].map(s => (
              <div key={s.step} className="relative">
                <div className="text-6xl font-bold text-teal-500/10 mb-4">{s.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="who" className="px-8 py-20 max-w-6xl mx-auto">
        <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3 text-center">Who is MOVIRA for?</p>
        <h2 className="text-4xl font-bold mb-4 text-center">Built for real people with real pain</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">Whether you sit at a desk all day, train hard at the gym, or are recovering from surgery — MOVIRA has a program designed specifically for you.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whoFor.map(w => (
            <div key={w.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-teal-700 transition-colors">
              <span className="text-4xl mb-4 block">{w.icon}</span>
              <h3 className="font-bold text-white mb-2">{w.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="px-8 py-20 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3 text-center">Why MOVIRA?</p>
          <h2 className="text-4xl font-bold mb-4 text-center">Everything you need to recover</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">Unlike generic fitness apps, MOVIRA is built specifically for physiotherapy recovery — evidence-based, AI-powered, and personalised to your condition.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(b => (
              <div key={b.title} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-teal-700 transition-colors">
                <span className="text-3xl mb-4 block">{b.icon}</span>
                <h3 className="font-bold text-white mb-2">{b.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '8', label: 'Physiotherapy specialties' },
            { value: '10+', label: 'Recovery protocols' },
            { value: '5 min', label: 'To get your AI report' },
            { value: '24/7', label: 'AI assistant available' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-5xl font-bold text-teal-400 mb-2">{s.value}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-8 py-20 bg-slate-900 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3 text-center">Pricing</p>
          <h2 className="text-4xl font-bold mb-4 text-center">Simple, transparent pricing</h2>
          <p className="text-slate-400 text-center mb-12">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">
              <p className="font-bold text-lg text-white mb-1">Free</p>
              <p className="text-4xl font-bold text-white mb-1">₹0</p>
              <p className="text-slate-500 text-sm mb-6">Forever free</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                {['1 AI assessment per month', 'Basic exercise tracking', 'Pain journal (10 entries)', '3 recovery protocols', 'Streak & XP tracking'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-teal-400">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full text-center border border-slate-600 hover:border-teal-500 text-white py-3 rounded-xl font-medium transition-colors">Get started free</Link>
            </div>
            {/* Pro */}
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 border border-teal-500 rounded-2xl p-7 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
              <p className="font-bold text-lg text-white mb-1">Pro</p>
              <p className="text-4xl font-bold text-white mb-1">₹499<span className="text-lg font-normal text-slate-400">/mo</span></p>
              <p className="text-slate-400 text-sm mb-6">Billed monthly</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                {['Unlimited AI assessments', 'All 10 recovery protocols', 'AI chat assistant', 'Unlimited pain journal', 'Advanced weekly reports', 'Badges & achievements', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-teal-400">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition-colors">Start Pro — ₹499/mo</Link>
            </div>
            {/* Enterprise */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">
              <p className="font-bold text-lg text-white mb-1">Enterprise</p>
              <p className="text-4xl font-bold text-white mb-1">Custom</p>
              <p className="text-slate-500 text-sm mb-6">For clinics & corporates</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                {['Everything in Pro', 'Physiotherapist portal', 'Patient management dashboard', 'Bulk user management', 'Custom branding', 'Dedicated account manager', 'SLA & compliance support'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-teal-400">✓</span>{f}</li>
                ))}
              </ul>
              <a href="mailto:hello@movira.in" className="block w-full text-center border border-slate-600 hover:border-teal-500 text-white py-3 rounded-xl font-medium transition-colors">Contact us</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-8 py-20 max-w-4xl mx-auto">
        <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3 text-center">FAQ</p>
        <h2 className="text-4xl font-bold mb-12 text-center">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between font-medium text-white hover:text-teal-400 transition-colors">
                {faq.q}
                <span className={`text-teal-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 border border-teal-800 rounded-3xl p-14 text-center">
          <h2 className="text-4xl font-bold mb-4">Start your recovery today</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto text-lg">Join thousands recovering smarter with MOVIRA. Free to start, no credit card required.</p>
          <Link to="/signup" className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors inline-block">
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <Logo size={40} />
              <p className="text-slate-400 text-sm mt-4 leading-relaxed">AI-powered physiotherapy for everyone. Move better. Recover faster. Live fully.</p>
              <div className="flex gap-4 mt-5">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">In</a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">Fb</a>
                <a href="https://wa.me" target="_blank" rel="noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">Wa</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">Li</a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Product</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#what" className="hover:text-teal-400 transition-colors">What is MOVIRA</a></li>
                <li><a href="#benefits" className="hover:text-teal-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                <li><Link to="/signup" className="hover:text-teal-400 transition-colors">Get started</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Use cases</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><span>Corporate wellness</span></li>
                <li><span>Sports recovery</span></li>
                <li><span>Post-surgery rehab</span></li>
                <li><span>Elderly care</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Contact</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="mailto:hello@movira.in" className="hover:text-teal-400 transition-colors">hello@movira.in</a></li>
                <li><a href="https://wa.me" className="hover:text-teal-400 transition-colors">WhatsApp us</a></li>
                <li><span>Mumbai, India</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2026 MOVIRA. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
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
      <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="/protocols" element={<ProtectedRoute><Protocols /></ProtectedRoute>} />
      <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

function AppWithChat() {
  const isLoggedIn = !!localStorage.getItem('token')
  return (
    <>
      <App />
      {isLoggedIn && <ChatAssistant />}
    </>
  )
}

export default AppWithChat
