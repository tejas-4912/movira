import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await axios.post('https://movira-backend.onrender.com/api/auth/signup', { name, email, password })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/onboarding') // ← goes to medical profile first
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 p-12 border-r border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-lg">M</div>
          <span className="text-xl font-bold">MOVIRA</span>
        </div>
        <div>
          <p className="text-4xl font-bold leading-tight mb-4">Recover smarter,<br /><span className="text-teal-400">not harder.</span></p>
          <p className="text-slate-400 text-sm leading-relaxed">Get your personalised AI physiotherapy report in under 5 minutes. Free to start.</p>
        </div>
        <div className="flex flex-col gap-3">
          {['Complete AI assessment in 5 minutes', '8 physiotherapy specialties covered', 'Exercises, diet & lifestyle recommendations'].map(f => (
            <div key={f} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 text-xs flex-shrink-0">✓</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-lg">M</div>
            <span className="text-xl font-bold">MOVIRA</span>
          </div>

          <h1 className="text-3xl font-bold mb-1">Create your account</h1>
          <p className="text-slate-400 mb-8 text-sm">Start your recovery journey today — free</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="Sarah Johnson" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="At least 6 characters" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors mt-2">
              {loading ? 'Creating account…' : 'Create account →'}
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
