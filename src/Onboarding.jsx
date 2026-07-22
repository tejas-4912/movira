import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://movira-backend.onrender.com'

const STEPS = [
  'Personal Details',
  'Body Measurements',
  'Medical History',
  'Injury History',
  'Lifestyle',
  'Review & Save',
]

const chronicOptions = [
  'Diabetes (Type 1)', 'Diabetes (Type 2)', 'Hypertension', 'Asthma',
  'COPD', 'Heart disease', 'Osteoporosis', 'Arthritis', 'Thyroid disorder',
  'Obesity', 'Depression / Anxiety', 'Epilepsy', 'Cancer (current/past)',
  'Kidney disease', 'None of the above',
]

const familyOptions = [
  'Heart disease', 'Diabetes', 'Hypertension', 'Osteoporosis',
  'Cancer', 'Stroke', 'Mental health conditions', 'None known',
]

const bodyParts = [
  'Neck', 'Shoulder', 'Elbow', 'Wrist / Hand', 'Upper back',
  'Lower back', 'Hip', 'Knee', 'Ankle / Foot', 'Head', 'Other',
]

function ProgressBar({ step, total }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>Step {step + 1} of {total}</span>
        <span>{STEPS[step]}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div
          className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

function Label({ children, optional }) {
  return (
    <label className="block text-sm font-medium text-slate-600 mb-1.5">
      {children} {optional && <span className="text-slate-500 font-normal">(optional)</span>}
    </label>
  )
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
    />
  )
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500 transition-colors"
    >
      {children}
    </select>
  )
}

function Textarea({ ...props }) {
  return (
    <textarea
      {...props}
      rows={3}
      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors resize-none"
    />
  )
}

function MultiSelect({ options, selected, onChange }) {
  const toggle = (opt) => {
    if (opt === 'None of the above' || opt === 'None known') {
      onChange([opt])
      return
    }
    const filtered = selected.filter(s => s !== 'None of the above' && s !== 'None known')
    if (filtered.includes(opt)) onChange(filtered.filter(s => s !== opt))
    else onChange([...filtered, opt])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            selected.includes(opt)
              ? 'bg-teal-500/20 border-teal-500 text-teal-700'
              : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-400'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function BMIBadge({ bmi }) {
  if (!bmi) return null
  let label, color
  if (bmi < 18.5) { label = 'Underweight'; color = 'text-blue-400' }
  else if (bmi < 25) { label = 'Normal weight'; color = 'text-green-400' }
  else if (bmi < 30) { label = 'Overweight'; color = 'text-amber-400' }
  else { label = 'Obese'; color = 'text-red-500' }
  return (
    <div className="mt-3 bg-slate-100 rounded-xl p-4 flex items-center justify-between">
      <span className="text-slate-500 text-sm">Your BMI</span>
      <span className={`text-2xl font-bold ${color}`}>{bmi} <span className="text-sm font-normal">— {label}</span></span>
    </div>
  )
}

export default function Onboarding({ isEditMode = false }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    age: '', gender: '', bloodGroup: '', occupation: '', emergencyContact: '',
    height: '', weight: '',
    chronicConditions: [], currentMedications: '', allergies: '', surgeryHistory: '', familyHistory: [],
    injuryHistory: [],
    activityLevel: '', smoking: '', alcohol: '',
  })

  const [injuries, setInjuries] = useState([])
  const [newInjury, setNewInjury] = useState({ bodyPart: '', severity: '', year: '', details: '' })

  const bmi = form.height && form.weight
    ? parseFloat((form.weight / Math.pow(form.height / 100, 2)).toFixed(1))
    : null

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addInjury = () => {
    if (!newInjury.bodyPart) return
    setInjuries([...injuries, newInjury])
    setNewInjury({ bodyPart: '', severity: '', year: '', details: '' })
  }

  const removeInjury = (i) => setInjuries(injuries.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const profileData = { ...form, bmi, injuryHistory: injuries }
      const res = await axios.put(`${API}/api/user/profile`, { profile: profileData }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const updatedUser = res.data.user
      localStorage.setItem('user', JSON.stringify({
        id: updatedUser.id || updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        onboardingComplete: true,
        profile: updatedUser.profile,
      }))
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="text-xl font-bold">MOVIRA</span>
        </div>
        {isEditMode && (
          <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-slate-900 text-sm">← Back to Dashboard</button>
        )}
        {!isEditMode && (
          <span className="text-xs text-slate-500">Setting up your medical profile</span>
        )}
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {!isEditMode && step === 0 && (
          <div className="mb-8">
            <span className="text-teal-600 text-xs font-semibold uppercase tracking-widest">One-time setup</span>
            <h1 className="text-3xl font-bold mt-1 mb-2">Your Medical Profile</h1>
            <p className="text-slate-500 text-sm">This information helps our AI give you a more accurate physiotherapy assessment. It takes about 3 minutes.</p>
          </div>
        )}
        {isEditMode && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Edit Medical Profile</h1>
            <p className="text-slate-500 text-sm">Update your health information at any time.</p>
          </div>
        )}

        <ProgressBar step={step} total={STEPS.length} />

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-sm rounded-xl p-3 mb-6">{error}</div>
        )}

        {/* ── STEP 0: Personal Details ── */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <Input type="number" placeholder="e.g. 28" value={form.age} onChange={e => set('age', e.target.value)} min="1" max="120" />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="">Select...</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label optional>Blood Group</Label>
                <Select value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}>
                  <option value="">Select...</option>
                  {['A+','A−','B+','B−','AB+','AB−','O+','O−','Unknown'].map(b => <option key={b}>{b}</option>)}
                </Select>
              </div>
              <div>
                <Label optional>Occupation</Label>
                <Input type="text" placeholder="e.g. Software Engineer" value={form.occupation} onChange={e => set('occupation', e.target.value)} />
              </div>
            </div>
            <div>
              <Label optional>Emergency Contact</Label>
              <Input type="text" placeholder="Name & phone number" value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} />
            </div>
          </div>
        )}

        {/* ── STEP 1: Body Measurements ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Height (cm)</Label>
                <Input type="number" placeholder="e.g. 170" value={form.height} onChange={e => set('height', e.target.value)} min="50" max="250" />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input type="number" placeholder="e.g. 68" value={form.weight} onChange={e => set('weight', e.target.value)} min="10" max="300" />
              </div>
            </div>
            <BMIBadge bmi={bmi} />
            <p className="text-xs text-slate-500">BMI is calculated automatically and used to personalise your physiotherapy recommendations.</p>
          </div>
        )}

        {/* ── STEP 2: Medical History ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label>Chronic conditions <span className="text-slate-500 font-normal">(select all that apply)</span></Label>
              <MultiSelect options={chronicOptions} selected={form.chronicConditions} onChange={v => set('chronicConditions', v)} />
            </div>
            <div>
              <Label optional>Family medical history</Label>
              <MultiSelect options={familyOptions} selected={form.familyHistory} onChange={v => set('familyHistory', v)} />
            </div>
            <div>
              <Label optional>Current medications</Label>
              <Textarea placeholder="List any medications you currently take..." value={form.currentMedications} onChange={e => set('currentMedications', e.target.value)} />
            </div>
            <div>
              <Label optional>Allergies</Label>
              <Input type="text" placeholder="e.g. Penicillin, latex..." value={form.allergies} onChange={e => set('allergies', e.target.value)} />
            </div>
            <div>
              <Label optional>Surgery history</Label>
              <Textarea placeholder="List any past surgeries..." value={form.surgeryHistory} onChange={e => set('surgeryHistory', e.target.value)} />
            </div>
          </div>
        )}

        {/* ── STEP 3: Injury History ── */}
        {step === 3 && (
          <div className="space-y-5">
            <p className="text-sm text-slate-500">Add any past or current injuries. You can add multiple.</p>

            {injuries.length > 0 && (
              <div className="space-y-2">
                {injuries.map((inj, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{inj.bodyPart} — {inj.severity}</p>
                      <p className="text-xs text-slate-500">{inj.year && `Year: ${inj.year}`} {inj.details && `· ${inj.details}`}</p>
                    </div>
                    <button onClick={() => removeInjury(i)} className="text-slate-500 hover:text-red-500 text-lg ml-4">×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <p className="text-sm font-semibold text-slate-600">Add an injury</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Body part</Label>
                  <Select value={newInjury.bodyPart} onChange={e => setNewInjury(n => ({ ...n, bodyPart: e.target.value }))}>
                    <option value="">Select...</option>
                    {bodyParts.map(b => <option key={b}>{b}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>Severity</Label>
                  <Select value={newInjury.severity} onChange={e => setNewInjury(n => ({ ...n, severity: e.target.value }))}>
                    <option value="">Select...</option>
                    <option>Minor</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                    <option>Surgery required</option>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label optional>Year</Label>
                  <Input type="number" placeholder="e.g. 2022" value={newInjury.year} onChange={e => setNewInjury(n => ({ ...n, year: e.target.value }))} min="1950" max="2026" />
                </div>
                <div>
                  <Label optional>Details</Label>
                  <Input type="text" placeholder="e.g. ACL tear" value={newInjury.details} onChange={e => setNewInjury(n => ({ ...n, details: e.target.value }))} />
                </div>
              </div>
              <button onClick={addInjury} className="w-full border border-teal-600 text-teal-700 hover:bg-teal-500/10 py-2.5 rounded-xl text-sm font-medium transition-colors">
                + Add injury
              </button>
            </div>

            {injuries.length === 0 && (
              <button
                onClick={next}
                className="text-slate-500 hover:text-slate-600 text-sm transition-colors"
              >
                Skip — no injury history →
              </button>
            )}
          </div>
        )}

        {/* ── STEP 4: Lifestyle ── */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <Label>Activity level</Label>
              <Select value={form.activityLevel} onChange={e => set('activityLevel', e.target.value)}>
                <option value="">Select...</option>
                <option>Sedentary (little or no exercise)</option>
                <option>Lightly active (1–3 days/week)</option>
                <option>Moderately active (3–5 days/week)</option>
                <option>Very active (6–7 days/week)</option>
                <option>Athlete / professional training</option>
              </Select>
            </div>
            <div>
              <Label>Smoking</Label>
              <Select value={form.smoking} onChange={e => set('smoking', e.target.value)}>
                <option value="">Select...</option>
                <option>Non-smoker</option>
                <option>Ex-smoker</option>
                <option>Occasional smoker</option>
                <option>Regular smoker</option>
              </Select>
            </div>
            <div>
              <Label>Alcohol consumption</Label>
              <Select value={form.alcohol} onChange={e => set('alcohol', e.target.value)}>
                <option value="">Select...</option>
                <option>None</option>
                <option>Occasional (social)</option>
                <option>Moderate (weekly)</option>
                <option>Regular (daily or near-daily)</option>
              </Select>
            </div>
          </div>
        )}

        {/* ── STEP 5: Review ── */}
        {step === 5 && (
          <div className="space-y-4">
            <p className="text-slate-500 text-sm mb-4">Review your information before saving.</p>
            {[
              { label: 'Age', value: form.age },
              { label: 'Gender', value: form.gender },
              { label: 'Blood Group', value: form.bloodGroup },
              { label: 'Height', value: form.height ? `${form.height} cm` : '' },
              { label: 'Weight', value: form.weight ? `${form.weight} kg` : '' },
              { label: 'BMI', value: bmi ? `${bmi}` : '' },
              { label: 'Occupation', value: form.occupation },
              { label: 'Activity Level', value: form.activityLevel },
              { label: 'Smoking', value: form.smoking },
              { label: 'Alcohol', value: form.alcohol },
              { label: 'Chronic Conditions', value: form.chronicConditions.join(', ') },
              { label: 'Family History', value: form.familyHistory.join(', ') },
              { label: 'Injuries', value: injuries.map(i => `${i.bodyPart} (${i.severity})`).join(', ') },
              { label: 'Medications', value: form.currentMedications },
              { label: 'Allergies', value: form.allergies },
              { label: 'Surgeries', value: form.surgeryHistory },
            ].filter(r => r.value).map(row => (
              <div key={row.label} className="flex gap-4 py-2 border-b border-slate-200">
                <span className="text-slate-500 text-sm w-40 flex-shrink-0">{row.label}</span>
                <span className="text-slate-900 text-sm">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          {step > 0 ? (
            <button onClick={back} className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">← Back</button>
          ) : (
            <div />
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="bg-teal-500 hover:bg-teal-600 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-colors">
              Continue →
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving} className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-colors">
              {saving ? 'Saving…' : 'Save & go to Dashboard →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
