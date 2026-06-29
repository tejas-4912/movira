import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Activity, Mail, Lock, User, ArrowRight, Check } from 'lucide-react'

const API = 'https://movira-backend.onrender.com'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await axios.post(`${API}/api/auth/signup`, 
        { name, email, password },
        { timeout: 60000 } // 60 second timeout for cold start
      )
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setSuccess(true)
      setTimeout(() => navigate('/onboarding'), 500)
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Server is starting up, please try again in 30 seconds.')
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 p-12 border-r border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">MOVIRA</span>
        </div>
        <div>
          <p className="text-4xl font-bold leading-tight mb-4">Recover smarter,<br /><span className="text-teal-400">not harder.</span></p>
          <p className="text-slate-400 text-sm leading-relaxed">Get your personalised AI physiotherapy report in under 5 minutes. Free to start.</p>
        </div>
        <div className="flex flex-col gap-3">
          {['Complete AI assessment in 5 minutes', '8 physiotherapy specialties covered', 'Exercises, diet and lifestyle recommendations'].map(f => (
            <div key={f} className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-teal-400" />
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">MOVIRA</span>
          </div>

          <h1 className="text-3xl font-bold mb-1">Create your account</h1>
          <p className="text-slate-400 mb-8 text-sm">Start your recovery journey today</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm rounded-xl p-3 mb-6 flex items-center gap-2">
              <Check className="w-4 h-4" /> Account created! Setting up your profile...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Sarah Johnson" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="At least 6 characters" />
              </div>
            </div>
            <button type="submit" disabled={loading || success}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account... (may take 30s on first load)
                </>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
