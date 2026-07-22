// Shared sidebar component with proper icons
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  CalendarDays,
  Award,
  Bot,
  User,
  LogOut,
  Activity,
  Dumbbell,
} from 'lucide-react'

export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: ClipboardList, label: 'Assessment', to: '/assessment' },
  { icon: BookOpen, label: 'Pain Journal', to: '/journal' },
  { icon: CalendarDays, label: 'Protocols', to: '/protocols' },
  { icon: Award, label: 'Badges', to: '/badges' },
  { icon: Bot, label: 'AI Consultant', to: '/assessment' },
  { icon: User, label: 'My Profile', to: '/profile' },
]

export function Sidebar({ activePath, user, onLogout }) {
  return (
    <div className="fixed left-0 top-0 h-full w-56 bg-white border-r border-slate-200 flex flex-col py-6 px-4 z-10 hidden lg:flex">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900">MOVIRA</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = activePath === item.to
          return (
            <Link key={item.label} to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-200 pt-4 px-2">
        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
        <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
        <button onClick={onLogout} className="mt-3 flex items-center gap-2 text-xs text-slate-500 hover:text-red-500 transition-colors">
          <LogOut className="w-3 h-3" /> Sign out
        </button>
        <p className="mt-4 text-[11px] text-slate-400 leading-snug">Preferred by physiotherapists and medical professionals</p>
      </div>
    </div>
  )
}

export function MobileNav({ onLogout }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 lg:hidden">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-900">MOVIRA</span>
      </div>
      <button onClick={onLogout} className="text-slate-500 text-sm hover:text-slate-900 flex items-center gap-1">
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </nav>
  )
}
