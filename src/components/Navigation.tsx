import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (location.pathname !== '/') return null

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[200] h-16 flex items-center px-8 transition-all duration-[220ms] ${
      scrolled
        ? 'bg-cream/90 backdrop-blur-[20px] shadow-[0_1px_0_rgba(15,23,42,0.06)]'
        : ''
    }`}>
      <div className="flex items-center gap-2 text-lg font-extrabold tracking-[-0.04em] text-slate-900">
        <LogoMark />
        AgriTrust
      </div>

      <div className="flex items-center gap-1 mx-auto">
        {['Features', 'For Farmers', 'For Buyers', 'Pricing', 'About'].map(link => (
          <button
            key={link}
            className="px-[14px] py-[6px] text-sm font-medium text-slate-600 rounded-[10px] border-0 bg-transparent cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          >
            {link}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-[10px]">
        <button
          className="inline-flex items-center justify-center gap-2 px-[22px] py-[11px] text-sm font-semibold rounded-[10px] border-0 bg-transparent text-slate-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          onClick={() => navigate('/farmer')}
        >
          Sign in
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 px-[22px] py-[11px] text-sm font-semibold rounded-[10px] border-0 bg-slate-900 text-white cursor-pointer transition-all duration-[220ms] shadow-sm hover:bg-slate-800 hover:-translate-y-px hover:shadow-md active:translate-y-0"
          onClick={() => navigate('/onboarding')}
        >
          Get started
        </button>
      </div>
    </nav>
  )
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="#0F172A" />
      <path d="M8 18C8 18 10 12 14 10C18 8 20 14 20 14" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="14" cy="17" r="3" fill="#EDE4D5" />
      <circle cx="14" cy="17" r="1.5" fill="#0EA5E9" />
    </svg>
  )
}
