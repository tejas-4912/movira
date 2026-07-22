import { useLocation, Link } from 'react-router-dom'

function parseSection(text, heading) {
  const regex = new RegExp(`${heading}:\\s*([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`, 'i')
  const match = text.match(regex)
  return match ? match[1].trim() : ''
}

function SectionCard({ icon, title, content, accent }) {
  const lines = content.split('\n').map(l => l.replace(/^[-*\d.]+\s*/, '').trim()).filter(Boolean)
  return (
    <div className={`bg-white border ${accent} rounded-2xl p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      <ul className="space-y-3">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
            <span className="text-teal-600 mt-0.5 flex-shrink-0">▸</span>
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Results() {
  const location = useLocation()
  const { answers, category, chiefComplaint, diagnosis } = location.state || {}

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-slate-600">No assessment data found.</p>
        <Link to="/assessment" className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600">
          Take Assessment
        </Link>
      </div>
    )
  }

  const diagnosisText = parseSection(diagnosis, 'DIAGNOSIS')
  const exercisesText = parseSection(diagnosis, 'EXERCISES')
  const dietText = parseSection(diagnosis, 'DIET')
  const lifestyleText = parseSection(diagnosis, 'LIFESTYLE')
  const redFlagsText = parseSection(diagnosis, 'RED FLAGS')
  const timelineText = parseSection(diagnosis, 'TIMELINE')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="text-xl font-bold">MOVIRA</span>
        </div>
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 text-sm">← Dashboard</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className={`bg-gradient-to-br ${category?.color || 'from-teal-500 to-teal-700'} text-white rounded-2xl p-8 mb-10`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{category?.icon || '🩺'}</span>
            <span className="text-sm font-semibold uppercase tracking-widest opacity-80">{category?.label} Assessment</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Your AI Physiotherapy Report</h1>
          {chiefComplaint && (
            <p className="text-white/70 text-sm">Chief complaint: "{chiefComplaint}"</p>
          )}
        </div>

        {/* Diagnosis */}
        {diagnosisText && (
          <div className="bg-white border border-teal-700 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🩺</span>
              <h3 className="text-lg font-bold text-teal-600">AI Diagnosis</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">{diagnosisText}</p>
          </div>
        )}

        {/* Grid sections */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {exercisesText && <SectionCard icon="🏋️" title="Recommended Exercises" content={exercisesText} accent="border-blue-700" />}
          {dietText && <SectionCard icon="🥗" title="Diet & Nutrition" content={dietText} accent="border-green-700" />}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {lifestyleText && <SectionCard icon="🌱" title="Lifestyle Changes" content={lifestyleText} accent="border-purple-700" />}
          {timelineText && (
            <div className="bg-white border border-amber-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⏱️</span>
                <h3 className="text-lg font-bold text-slate-900">Recovery Timeline</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{timelineText}</p>
            </div>
          )}
        </div>

        {/* Red Flags */}
        {redFlagsText && (
          <div className="bg-red-950 border border-red-700 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🚨</span>
              <h3 className="text-lg font-bold text-red-300">Red Flags — See a Doctor If:</h3>
            </div>
            <ul className="space-y-2">
              {redFlagsText.split('\n').map(l => l.replace(/^[-*\d.]+\s*/, '').trim()).filter(Boolean).map((line, i) => (
                <li key={i} className="flex gap-3 text-red-200 text-sm">
                  <span className="text-red-400 flex-shrink-0">⚠</span> {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-500">Disclaimer:</strong> This AI-generated report is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified physiotherapist or doctor before starting any exercise program.
        </div>

        <div className="flex gap-4">
          <Link to="/dashboard" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Go to Dashboard
          </Link>
          <Link to="/assessment" className="border border-slate-300 hover:border-slate-400 text-slate-600 px-6 py-3 rounded-xl font-medium transition-colors">
            Retake Assessment
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Results
