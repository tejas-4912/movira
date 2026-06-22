import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard'
import Assessment from './Assessment'
import Results from './Results'
import Login from './Login'
import Signup from './Signup'
import ProtectedRoute from './ProtectedRoute'
import './App.css'

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold text-slate-900">MOVIRA</span>
        </div>
        <div className="hidden md:flex gap-8 text-slate-700 font-medium">
          <a href="#" className="hover:text-teal-600">Services</a>
          <a href="#" className="hover:text-teal-600">Programs</a>
          <a href="#" className="hover:text-teal-600">About</a>
          <a href="#" className="hover:text-teal-600">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-700 font-medium">Sign in</Link>
          <Link to="/signup" className="bg-teal-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-teal-700">
          Get Started
        </Link>
        </div>
      </nav>

      <section className="px-8 py-20 bg-gradient-to-br from-teal-50 to-white">
        <span className="inline-block bg-teal-100 text-teal-700 text-sm font-medium px-4 py-1 rounded-full mb-6">
          Physiotherapy reimagined
        </span>
        <h1 className="text-5xl font-bold text-slate-900 max-w-2xl leading-tight mb-6">
          Move better. Recover faster. Live fully.
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mb-8">
          MOVIRA connects you with expert-guided rehabilitation programs, progress tracking, and AI-powered exercise recommendations tailored to your recovery goals.
        </p>
        <div className="flex gap-4">
          <Link to="/dashboard" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700">
            Start your recovery
          </Link>
          <button className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">
            View programs
          </button>
        </div>
      </section>
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
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App