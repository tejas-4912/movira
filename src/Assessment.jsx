import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GEMINI_API_KEY = 'AIzaSyC6MIJpMsEeRXnXgPT8c3V32JehDumxjew' // replace with your key

const categories = [
  {
    id: 'orthopedic',
    label: 'Orthopedic',
    icon: '🦴',
    description: 'Joint, spine & musculoskeletal',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'sports',
    label: 'Sports Injury',
    icon: '⚽',
    description: 'Athletic & performance recovery',
    color: 'from-green-500 to-green-700',
  },
  {
    id: 'geriatric',
    label: 'Geriatric',
    icon: '🧓',
    description: 'Older adult mobility & balance',
    color: 'from-amber-500 to-amber-700',
  },
  {
    id: 'obgyn',
    label: 'OB/GYN & Pregnancy',
    icon: '🤰',
    description: 'Prenatal, postnatal & women\'s health',
    color: 'from-pink-500 to-pink-700',
  },
  {
    id: 'cardio',
    label: 'Cardio-Respiratory',
    icon: '❤️',
    description: 'Heart, lungs & breathing',
    color: 'from-red-500 to-red-700',
  },
  {
    id: 'neurological',
    label: 'Neurological',
    icon: '🧠',
    description: 'Nerve, stroke & movement disorders',
    color: 'from-purple-500 to-purple-700',
  },
  {
    id: 'ergonomic',
    label: 'Ergonomic / Corporate',
    icon: '💼',
    description: 'Work-related posture & strain',
    color: 'from-slate-500 to-slate-700',
  },
  {
    id: 'pediatric',
    label: 'Pediatric',
    icon: '👶',
    description: 'Children\'s movement & development',
    color: 'from-cyan-500 to-cyan-700',
  },
]

const questionsByCategory = {
  orthopedic: [
    { id: 'region', question: 'Which body region is affected?', options: ['Cervical Spine (neck)', 'Thoracic Spine (mid-back)', 'Lumbar Spine (lower back)', 'Shoulder', 'Elbow', 'Wrist / Hand', 'Hip', 'Knee', 'Ankle / Foot', 'Pelvis / SIJ'] },
    { id: 'onset', question: 'How long have you had this issue?', options: ['Acute – under 2 weeks', 'Subacute – 2 to 12 weeks', 'Chronic – over 12 weeks', 'Recurrent (comes and goes)'] },
    { id: 'pain', question: 'How would you rate your pain right now?', options: ['Mild (1–3 out of 10)', 'Moderate (4–6 out of 10)', 'Severe (7–10 out of 10)'] },
    { id: 'worse', question: 'What makes the pain worse?', options: ['Sitting for long periods', 'Standing or walking', 'Bending or twisting', 'Lifting or carrying', 'Physical activity / exercise', 'Rest / lying down', 'Morning stiffness'] },
    { id: 'better', question: 'What relieves the pain?', options: ['Rest', 'Ice / cold pack', 'Heat / warm pack', 'Medication', 'Movement / stretching', 'Nothing helps'] },
    { id: 'function', question: 'How much does this affect your daily life?', options: ['Minimal – slightly uncomfortable', 'Moderate – limits some activities', 'Significant – affects work or sleep', 'Severe – unable to perform basic tasks'] },
    { id: 'history', question: 'Have you had treatment for this before?', options: ['No, this is my first time seeking help', 'Yes – physiotherapy', 'Yes – surgery', 'Yes – medication only', 'Yes – multiple treatments'] },
  ],
  sports: [
    { id: 'sport', question: 'Which sport or activity caused the injury?', options: ['Running / Track', 'Football / Soccer', 'Cricket', 'Gym / Weightlifting', 'Swimming', 'Cycling', 'Racket sports', 'Other team sport', 'Other'] },
    { id: 'region', question: 'Which body part is injured?', options: ['Shoulder / Rotator cuff', 'Elbow / Tennis or golfer\'s elbow', 'Wrist / Hand', 'Knee (ligament, meniscus)', 'Ankle (sprain)', 'Hamstring / Thigh', 'Groin / Hip', 'Lower back', 'Shin splints / Calf'] },
    { id: 'mechanism', question: 'How did the injury happen?', options: ['Sudden impact or collision', 'Awkward landing or twist', 'Overuse / repetitive strain', 'Muscle pull during exertion', 'Gradual onset – no single event'] },
    { id: 'onset', question: 'When did this happen?', options: ['Within the last 48 hours', '3–7 days ago', '1–4 weeks ago', 'More than a month ago'] },
    { id: 'swelling', question: 'Is there any swelling or bruising?', options: ['Yes – significant swelling', 'Yes – mild swelling', 'Bruising but no swelling', 'No swelling or bruising'] },
    { id: 'return', question: 'What is your return-to-sport goal?', options: ['Return to full competition ASAP', 'Return to training, not competition', 'General fitness, not competitive', 'Unsure – pain management first'] },
  ],
  geriatric: [
    { id: 'age', question: 'What is your age range?', options: ['60–65', '66–70', '71–75', '76–80', '81 or above'] },
    { id: 'concern', question: 'What is your main concern?', options: ['Falls and balance problems', 'Joint pain (arthritis)', 'Weakness and fatigue', 'Post-fracture recovery', 'Post-surgery recovery', 'General mobility decline', 'Dizziness or vertigo'] },
    { id: 'falls', question: 'Have you had any falls in the past year?', options: ['No falls', '1–2 falls', '3 or more falls', 'Near-falls (almost fell)'] },
    { id: 'mobility', question: 'How do you currently move around?', options: ['Independently without aid', 'Use a walking stick', 'Use a walker / frame', 'Wheelchair some of the time', 'Mostly bed or chair-bound'] },
    { id: 'conditions', question: 'Do you have any of these conditions?', options: ['Osteoporosis', 'Parkinson\'s disease', 'Stroke history', 'Dementia / cognitive changes', 'Heart or lung disease', 'Diabetes', 'None of the above'] },
    { id: 'goal', question: 'What is your main goal from physiotherapy?', options: ['Reduce fall risk', 'Reduce pain', 'Improve strength and independence', 'Recover after surgery or fracture', 'Maintain current function'] },
  ],
  obgyn: [
    { id: 'stage', question: 'What is your current stage?', options: ['Pregnant – 1st trimester', 'Pregnant – 2nd trimester', 'Pregnant – 3rd trimester', 'Postnatal – within 6 weeks', 'Postnatal – 6 weeks to 1 year', 'Beyond 1 year postpartum', 'Not pregnant / general women\'s health'] },
    { id: 'complaint', question: 'What is your main complaint?', options: ['Lower back or pelvic pain', 'Pelvic floor weakness / leakage', 'Diastasis recti (tummy gap)', 'Pelvic organ prolapse', 'Hip pain', 'Pubic symphysis pain (SPD)', 'Return to exercise after birth'] },
    { id: 'severity', question: 'How much does this affect daily life?', options: ['Mild – noticeable but manageable', 'Moderate – affects some activities', 'Significant – affects most activities', 'Severe – unable to function normally'] },
    { id: 'delivery', question: 'If postnatal – what was your delivery type?', options: ['Vaginal birth – no complications', 'Vaginal birth – with tearing or episiotomy', 'Caesarean section (C-section)', 'Not applicable – currently pregnant'] },
    { id: 'pelvic', question: 'Do you experience any of the following?', options: ['Leaking urine when coughing, sneezing, or exercising', 'Urgency to urinate frequently', 'Pelvic heaviness or bulge sensation', 'Pain during intercourse', 'None of the above'] },
  ],
  cardio: [
    { id: 'condition', question: 'What is your primary cardio-respiratory condition?', options: ['Asthma', 'COPD (Chronic Obstructive Pulmonary Disease)', 'Post-COVID breathlessness', 'Heart failure / cardiac rehab', 'Post-cardiac surgery recovery', 'Hypertension (high blood pressure)', 'General breathlessness / deconditioning'] },
    { id: 'breathlessness', question: 'When do you feel breathless?', options: ['Only during intense exercise', 'During moderate activity (stairs, walking fast)', 'During light activity (slow walking)', 'At rest', 'I don\'t feel breathless'] },
    { id: 'symptoms', question: 'Do you experience any of the following?', options: ['Chest tightness or pain', 'Persistent cough', 'Wheezing', 'Swollen ankles', 'Dizziness or lightheadedness', 'Palpitations (racing heart)', 'None of the above'] },
    { id: 'exercise', question: 'What is your current exercise capacity?', options: ['Unable to exercise at all', 'Can do light activity for under 10 minutes', 'Can do moderate activity for 10–30 minutes', 'Can exercise over 30 minutes with effort', 'Normal but want to improve'] },
    { id: 'goal', question: 'What is your main goal?', options: ['Manage breathlessness in daily life', 'Return to work or daily activities', 'Build aerobic fitness safely', 'Reduce medication dependence (with doctor guidance)', 'Understand my condition better'] },
  ],
  neurological: [
    { id: 'condition', question: 'What is your neurological condition?', options: ['Stroke (CVA)', 'Multiple Sclerosis (MS)', 'Parkinson\'s disease', 'Peripheral neuropathy', 'Spinal cord injury', 'Traumatic brain injury (TBI)', 'Vestibular disorder (dizziness / vertigo)', 'Other nerve-related condition'] },
    { id: 'symptoms', question: 'What are your main symptoms?', options: ['Weakness on one or both sides', 'Poor balance and coordination', 'Tremor or involuntary movement', 'Numbness or tingling', 'Difficulty walking', 'Spasticity (stiffness / spasms)', 'Dizziness / vertigo', 'Speech or swallowing difficulty'] },
    { id: 'duration', question: 'How long have you had these symptoms?', options: ['Less than 1 month', '1–6 months', '6 months to 2 years', 'More than 2 years', 'Lifelong / congenital'] },
    { id: 'function', question: 'How does this affect your daily function?', options: ['Minimal – manage independently', 'Moderate – need some assistance', 'Significant – depend on carer for most tasks', 'Severe – fully dependent'] },
    { id: 'goal', question: 'What is your rehabilitation goal?', options: ['Regain walking ability', 'Improve balance and reduce falls', 'Regain arm/hand function', 'Manage fatigue and energy', 'Slow disease progression', 'Improve quality of life generally'] },
  ],
  ergonomic: [
    { id: 'role', question: 'What best describes your work setup?', options: ['Desk / computer work (8+ hours/day)', 'Standing job (retail, hospitality)', 'Manual labour / heavy lifting', 'Driving for long periods', 'Repetitive factory or assembly work', 'Mixed – desk and physical work'] },
    { id: 'complaint', question: 'Where is your work-related pain or discomfort?', options: ['Neck and upper trapezius', 'Shoulders', 'Wrists / forearms (RSI)', 'Lower back', 'Hips or buttocks (piriformis)', 'Eyes or headaches', 'Multiple areas'] },
    { id: 'hours', question: 'How many hours a day do you sit or hold a fixed posture?', options: ['Less than 4 hours', '4–6 hours', '6–8 hours', 'More than 8 hours'] },
    { id: 'breaks', question: 'How often do you take movement breaks?', options: ['Every 30–60 minutes', 'Every 1–2 hours', 'Rarely – once or twice a day', 'Almost never'] },
    { id: 'onset', question: 'When does the discomfort peak?', options: ['Morning before work starts', 'Mid-day during work', 'End of workday', 'After work / in the evening', 'On weekends (improves when not working)'] },
    { id: 'setup', question: 'Do you currently have an ergonomic workstation setup?', options: ['Yes – fully adjusted', 'Partially – some adjustments made', 'No – standard desk with no adjustments', 'Work from home – no proper setup'] },
  ],
  pediatric: [
    { id: 'age', question: 'What is the child\'s age?', options: ['0–2 years (infant)', '3–5 years (toddler)', '6–10 years (child)', '11–14 years (early teen)', '15–17 years (teen)'] },
    { id: 'concern', question: 'What is the main concern?', options: ['Delayed walking or motor milestones', 'Flat feet or gait abnormality', 'Growing pains', 'Sports injury', 'Postural issues (scoliosis)', 'Cerebral palsy or neurological condition', 'Post-fracture rehabilitation'] },
    { id: 'duration', question: 'How long has this been noticed?', options: ['Just recently (under 1 month)', '1–3 months', '3–12 months', 'Over a year or since birth'] },
    { id: 'function', question: 'How does this affect the child\'s daily activities?', options: ['Minimal – active and mostly normal', 'Mild – some activities avoided', 'Moderate – school or play significantly affected', 'Severe – requires daily assistance'] },
    { id: 'referral', question: 'Has a doctor or specialist already assessed the child?', options: ['Yes – referred by paediatrician', 'Yes – seen orthopaedic surgeon', 'No – coming directly for physio assessment', 'Unsure'] },
  ],
}

const commonQuestions = [
  { id: 'lifestyle', question: 'How would you describe your daily activity level?', options: ['Mostly sedentary – desk job, minimal movement', 'Lightly active – short walks, light household tasks', 'Moderately active – regular exercise 2–3x/week', 'Very active – exercise daily or physically demanding job'] },
  { id: 'sleep', question: 'How is your sleep affected by this condition?', options: ['Sleep is not affected', 'Occasionally disturbed', 'Frequently woken by pain or discomfort', 'Severely disrupted – unable to sleep well'] },
  { id: 'goal', question: 'What is your main goal from this assessment?', options: ['Understand what is wrong', 'Get a home exercise program', 'Return to sport or high activity', 'Reduce pain and improve daily function', 'Prevent the problem from recurring'] },
]

function Assessment() {
  const [phase, setPhase] = useState('category') // 'category' | 'questions' | 'loading' | 'done'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [chiefComplaint, setChiefComplaint] = useState('')
  const navigate = useNavigate()

  const allQuestions = selectedCategory
    ? [...(questionsByCategory[selectedCategory.id] || []), ...commonQuestions]
    : []

  const totalSteps = allQuestions.length
  const progress = totalSteps > 0 ? ((currentStep) / totalSteps) * 100 : 0

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat)
    setPhase('questions')
    setCurrentStep(0)
    setAnswers({})
  }

  const handleAnswer = async (option) => {
    const q = allQuestions[currentStep]
    const newAnswers = { ...answers, [q.id]: option }
    setAnswers(newAnswers)

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // All questions answered — call Gemini
      setPhase('loading')
      const diagnosis = await callGemini(newAnswers)
      navigate('/results', {
        state: {
          answers: newAnswers,
          category: selectedCategory,
          chiefComplaint,
          diagnosis,
        },
      })
    }
  }

  const callGemini = async (finalAnswers) => {
    try {
      const answerText = Object.entries(finalAnswers)
        .map(([key, val]) => `${key}: ${val}`)
        .join('\n')

      const prompt = `You are an expert physiotherapist. A patient has completed a detailed assessment.

Category: ${selectedCategory.label}
Chief Complaint: ${chiefComplaint || 'Not specified'}

Patient Answers:
${answerText}

Based on this, provide:
1. A likely diagnosis or condition (2-3 sentences)
2. 4-5 specific recommended exercises with sets/reps
3. 3 diet/nutrition tips relevant to their condition
4. 3 lifestyle modifications
5. Red flags to watch for (when to see a doctor urgently)
6. Expected recovery timeline

Format your response in clear sections using these exact headings:
DIAGNOSIS:
EXERCISES:
DIET:
LIFESTYLE:
RED FLAGS:
TIMELINE:`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate diagnosis.'
    } catch (err) {
      return 'Unable to connect to AI. Please try again.'
    }
  }

  // ── CATEGORY SELECTION SCREEN ──
  if (phase === 'category') {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <nav className="flex items-center px-8 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
            <span className="text-xl font-bold">MOVIRA</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-3">Step 1 of 2</p>
          <h1 className="text-4xl font-bold mb-2">Select Assessment Category</h1>
          <p className="text-slate-400 mb-10">Choose the category that best describes your condition to get a personalised questionnaire.</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                className="flex items-center gap-4 p-5 rounded-2xl border border-slate-700 hover:border-teal-500 bg-slate-900 hover:bg-slate-800 transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {cat.icon}
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-teal-400 transition-colors">{cat.label}</p>
                  <p className="text-sm text-slate-400">{cat.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Chief Complaint <span className="text-slate-500">(optional – describe in your own words)</span></label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Low back pain for 3 weeks after lifting at the gym"
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>
      </div>
    )
  }

  // ── LOADING SCREEN ──
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-2xl font-bold">Analysing your responses…</h2>
        <p className="text-slate-400">Our AI physiotherapist is reviewing your assessment</p>
      </div>
    )
  }

  // ── QUESTIONS SCREEN ──
  const currentQ = allQuestions[currentStep]
  const isCommon = currentStep >= (questionsByCategory[selectedCategory?.id]?.length || 0)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="text-xl font-bold">MOVIRA</span>
        </div>
        <button onClick={() => setPhase('category')} className="text-slate-400 hover:text-white text-sm">← Change category</button>
      </nav>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <div className="h-1 bg-teal-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Category badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center text-xl`}>
            {selectedCategory.icon}
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{isCommon ? 'General Questions' : selectedCategory.label}</p>
            <p className="text-sm text-slate-300 font-medium">Question {currentStep + 1} of {totalSteps}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-8">{currentQ.question}</h2>

        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 rounded-xl border border-slate-700 hover:border-teal-500 hover:bg-slate-800 font-medium text-slate-300 hover:text-white transition-all"
            >
              {option}
            </button>
          ))}
        </div>

        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-8 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}

export default Assessment
