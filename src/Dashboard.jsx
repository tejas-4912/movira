import { Link } from 'react-router-dom'
import { useState } from 'react'

function Dashboard() {
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Neck stretches', detail: '10 reps · hold 15 seconds each', done: false },
    { id: 2, name: 'Shoulder rolls', detail: '2 sets · 10 forward, 10 backward', done: false },
    { id: 3, name: 'Cat-cow stretch', detail: '8 reps', done: false },
    { id: 4, name: 'Hip flexor stretch', detail: '30 seconds each side', done: false },
    { id: 5, name: 'Ankle circles', detail: '10 reps each direction', done: false },
  ])

  const toggleExercise = (id) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, done: !ex.done } : ex
    ))
  }

  const doneCount = exercises.filter(ex => ex.done).length

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold text-slate-900">MOVIRA</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-sm font-medium text-teal-600">Your dashboard</p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">Welcome back, Sarah!</h1>
        <p className="text-slate-600 mt-2">Keep up the momentum — every session brings you closer to full recovery.</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-2xl">🔥</p>
            <p className="text-sm text-slate-500 mt-2">Current streak</p>
            <p className="text-3xl font-bold text-slate-900">7 days</p>
            <p className="text-xs text-slate-400 mt-1">Exercises completed in a row</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Recovery progress</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">62%</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: '62%' }}></div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Based on your program completion and daily activity</p>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Today's Exercises</h2>
            <span className="text-sm text-slate-500">{doneCount}/{exercises.length} done</span>
          </div>
          <div className="mt-4 space-y-3">
            {exercises.map(ex => (
              <label key={ex.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={ex.done}
                  onChange={() => toggleExercise(ex.id)}
                  className="w-5 h-5 accent-teal-600"
                />
                <div>
                  <p className={`font-medium ${ex.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{ex.name}</p>
                  <p className="text-sm text-slate-500">{ex.detail}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700">
            Start Posture Check
          </button>
          <Link to="/assessment" className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 text-center">
            Take Assessment
        </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard