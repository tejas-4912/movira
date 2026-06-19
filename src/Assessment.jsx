import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const questions = [
  {
    id: 1,
    question: "Where is your pain or discomfort located?",
    options: ["Neck", "Shoulder", "Lower back", "Knee", "Hip", "Ankle/Foot"],
  },
  {
    id: 2,
    question: "How would you rate your pain level?",
    options: ["Mild (1-3)", "Moderate (4-6)", "Severe (7-10)"],
  },
  {
    id: 3,
    question: "How long have you had this issue?",
    options: ["Less than a week", "1-4 weeks", "1-6 months", "More than 6 months"],
  },
  {
    id: 4,
    question: "When does the pain feel worse?",
    options: ["Sitting for long periods", "Standing/walking", "After exercise", "In the morning", "At night"],
  },
  {
    id: 5,
    question: "How active is your daily lifestyle?",
    options: ["Mostly sedentary (desk job)", "Lightly active", "Moderately active", "Very active"],
  },
]

function Assessment() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [questions[currentStep].id]: option })
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate('/results', { state: { answers: { ...answers, [questions[currentStep].id]: option } } })
    }
  }

  const progress = ((currentStep + 1) / questions.length) * 100

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

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-500 mb-2">
          Question {currentStep + 1} of {questions.length}
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          {questions[currentStep].question}
        </h2>

        <div className="space-y-3">
          {questions[currentStep].options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 font-medium text-slate-700 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>

        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-6 text-slate-500 font-medium hover:text-slate-700"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}

export default Assessment