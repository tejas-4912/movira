import { useLocation, Link } from 'react-router-dom'

function Results() {
  const location = useLocation()
  const answers = location.state?.answers || {}

  const painArea = answers[1] || "your body"

  const exercisePlans = {
    Neck: [
      { name: "Neck stretches", detail: "10 reps · hold 15 seconds each" },
      { name: "Chin tucks", detail: "2 sets of 10" },
      { name: "Shoulder rolls", detail: "2 sets · 10 forward, 10 backward" },
    ],
    Shoulder: [
      { name: "Pendulum swings", detail: "2 sets of 15" },
      { name: "Wall slides", detail: "3 sets of 10" },
      { name: "Cross-body stretch", detail: "Hold 20 seconds each side" },
    ],
    "Lower back": [
      { name: "Cat-cow stretch", detail: "8 reps" },
      { name: "Pelvic tilts", detail: "2 sets of 12" },
      { name: "Knee-to-chest stretch", detail: "Hold 20 seconds each leg" },
    ],
    Knee: [
      { name: "Straight leg raises", detail: "3 sets of 10" },
      { name: "Hamstring stretch", detail: "Hold 30 seconds each leg" },
      { name: "Quad sets", detail: "2 sets of 15" },
    ],
    Hip: [
      { name: "Hip flexor stretch", detail: "30 seconds each side" },
      { name: "Glute bridges", detail: "3 sets of 12" },
      { name: "Clamshells", detail: "2 sets of 15 each side" },
    ],
    "Ankle/Foot": [
      { name: "Ankle circles", detail: "10 reps each direction" },
      { name: "Calf raises", detail: "3 sets of 15" },
      { name: "Towel scrunches", detail: "2 sets of 20" },
    ],
  }

  const exercises = exercisePlans[painArea] || exercisePlans["Lower back"]

  const dietTips = [
    "Increase anti-inflammatory foods like fatty fish, leafy greens, and berries",
    "Stay hydrated — aim for 8 glasses of water daily to support tissue recovery",
    "Reduce processed sugar and refined carbs which can increase inflammation",
  ]

  const lifestyleTips = [
    "Take a 5-minute movement break every hour if you sit for long periods",
    "Maintain good posture — keep screens at eye level and shoulders relaxed",
    "Prioritize 7-8 hours of sleep to support tissue repair",
  ]

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold text-slate-900">MOVIRA</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <span className="inline-block bg-teal-100 text-teal-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
          Your personalized plan
        </span>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Recommendations for your {painArea.toLowerCase()}
        </h1>
        <p className="text-slate-600 mb-10">
          Based on your assessment, here's a tailored recovery plan to help you feel better.
        </p>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">🏃 Recommended Exercises</h2>
          <div className="space-y-3">
            {exercises.map((ex, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200">
                <p className="font-medium text-slate-900">{ex.name}</p>
                <p className="text-sm text-slate-500">{ex.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">🥗 Diet Suggestions</h2>
          <ul className="space-y-2">
            {dietTips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-slate-700">
                <span className="text-teal-600">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">🌱 Lifestyle Changes</h2>
          <ul className="space-y-2">
            {lifestyleTips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-slate-700">
                <span className="text-teal-600">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/dashboard"
          className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Results