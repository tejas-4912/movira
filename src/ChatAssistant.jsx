import { useState, useRef, useEffect } from 'react'

const API = 'https://movira-backend.onrender.com'

const SUGGESTED = [
  "What exercises help with lower back pain?",
  "How long does a rotator cuff injury take to heal?",
  "Is it okay to exercise with knee pain?",
  "What foods reduce inflammation?",
  "How do I improve my posture at a desk?",
]

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI physiotherapy assistant. Ask me anything about pain, recovery, exercises, or your health. 💪" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async (text) => {
  const msg = text || input.trim()
  if (!msg) return
  setInput('')
  setMessages(prev => [...prev, { role: 'user', text: msg }])
  setLoading(true)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90000)
    
    const response = await fetch(`${API}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ message: msg }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    const data = await response.json()
    setMessages(prev => [...prev, { role: 'assistant', text: data.reply || 'Sorry, I could not answer that.' }])
  } catch (err) {
    if (err.name === 'AbortError') {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Server is waking up, please send your message again in 10 seconds.' }])
    } else {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error. Please try again.' }])
    }
  }
  setLoading(false)
}

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full shadow-lg shadow-teal-500/30 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="font-semibold text-white text-sm">MOVIRA AI Assistant</p>
              <p className="text-teal-100 text-xs">Physiotherapy expert · Always available</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-teal-500 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-slate-500 mb-2">Suggested questions:</p>
              <div className="flex flex-col gap-1">
                {SUGGESTED.slice(0, 3).map((s, i) => (
                  <button key={i} onClick={() => send(s)}
                    className="text-left text-xs text-teal-400 hover:text-teal-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-800 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a physio question..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button onClick={() => send()}
              disabled={loading || !input.trim()}
              className="bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
