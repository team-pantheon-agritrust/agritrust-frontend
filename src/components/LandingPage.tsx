type Screen = 'landing' | 'farmer-dashboard' | 'grain-scan' | 'scan-results' | 'buyer-dashboard' | 'payment'

interface Props {
  onNavigate: (s: Screen) => void
}

export default function LandingPage({ onNavigate }: Props) {
  return (
    <main>
      <HeroSection onNavigate={onNavigate} />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection onNavigate={onNavigate} />
      <Footer />
    </main>
  )
}

function HeroSection({ onNavigate }: Props) {
  return (
    <section className="min-h-screen pt-16 flex items-center bg-cream relative overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="absolute -top-[200px] -right-[100px] w-[700px] h-[700px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at center,rgba(14,165,233,0.08) 0%,transparent 70%)' }}
      />

      <div className="grid grid-cols-2 gap-20 items-center max-w-6xl mx-auto px-8 py-20 relative z-[1] w-full">
        {/* Left */}
        <div className="animate-fade-up">
          <h1 className="text-[clamp(36px,5vw,58px)] font-extrabold tracking-[-0.04em] leading-[1.08] text-slate-900 mb-5">
            Transparent Grain Trading,{' '}
            <span style={{ background: 'linear-gradient(135deg,#0EA5E9 0%,#0284C7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Powered by AI
            </span>
          </h1>

          <p className="text-[17px] leading-[1.65] text-slate-500 mb-9 max-w-[480px]">
            AgriTrust uses computer vision to grade grain quality, set fair prices, and protect payments — connecting farmers, buyers, and aggregators across Africa.
          </p>

          <div className="flex items-center gap-3 flex-wrap mb-12">
            <button
              className="inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 bg-slate-900 text-white cursor-pointer transition-all duration-[220ms] shadow-sm hover:bg-slate-800 hover:-translate-y-px hover:shadow-md"
              onClick={() => onNavigate('farmer-dashboard')}
            >
              Start as Farmer
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50 hover:border-slate-300"
              onClick={() => onNavigate('buyer-dashboard')}
            >
              I'm a Buyer
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-px bg-slate-900/[0.06] border border-slate-900/[0.06] rounded-[20px] overflow-hidden mb-5">
            {[
              { value: '12K+', label: 'Verified farmers' },
              { value: '₦2.4B', label: 'Grain traded' },
              { value: '8',    label: 'African countries' },
            ].map(s => (
              <div key={s.label} className="px-6 py-5 bg-white">
                <div className="text-[26px] font-extrabold tracking-[-0.04em] text-slate-900 mb-[3px]">{s.value}</div>
                <div className="text-xs text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            {['AI-verified quality', 'Escrow-protected', 'Zero fraud guarantee'].map(t => (
              <div key={t} className="flex items-center gap-[7px] text-[13px] font-medium text-slate-500">
                <CheckIcon />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right — product mockup */}
        <div className="relative flex items-center justify-center">
          <div className="w-full max-w-[440px] bg-white border border-slate-900/[0.06] rounded-[28px] shadow-2xl overflow-hidden animate-float">
            {/* Header */}
            <div className="bg-slate-900 px-5 py-[18px] flex items-center gap-[10px]">
              <div className="flex gap-[5px]">
                <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#FFBC2E]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#28C840]" />
              </div>
              <span className="text-xs font-semibold text-white/40 tracking-[0.05em] ml-1">GRAIN ANALYSIS</span>
            </div>

            {/* Grain preview */}
            <div className="relative h-40 overflow-hidden flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#1a2744 0%,#0d1929 100%)' }}>
              <div className="absolute inset-0 opacity-40"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%,rgba(237,228,213,0.3) 0%,transparent 25%),radial-gradient(circle at 80% 20%,rgba(237,228,213,0.2) 0%,transparent 25%),radial-gradient(circle at 60% 80%,rgba(237,228,213,0.25) 0%,transparent 20%)' }}
              />
              <div className="absolute left-0 right-0 h-[2px] animate-scan-sweep z-10"
                style={{ background: 'linear-gradient(90deg,transparent,#0EA5E9,transparent)', boxShadow: '0 0 20px rgba(14,165,233,0.6)' }}
              />
              {/* Scan corners */}
              <div className="absolute inset-4 pointer-events-none">
                {[['top-0 left-0 border-t-2 border-l-2 rounded-tl-[3px]'],['top-0 right-0 border-t-2 border-r-2 rounded-tr-[3px]'],['bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[3px]'],['bottom-0 right-0 border-b-2 border-r-2 rounded-br-[3px]']].map(([cls], i) => (
                  <div key={i} className={`absolute w-5 h-5 border-sky-500 ${cls}`} />
                ))}
              </div>
              <div className="absolute top-3 right-3 bg-sky-500/90 backdrop-blur text-white text-[11px] font-bold tracking-[0.05em] px-[10px] py-[5px] rounded-[6px]">
                AI SCANNING
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-[52px] h-[52px] rounded-full bg-emerald-50 border-2 border-[#A7F3D0] flex items-center justify-center text-[22px] font-extrabold text-emerald-600">A</div>
                  <div>
                    <div className="text-[15px] font-bold text-slate-900 tracking-[-0.02em]">Maize — Premium Grade</div>
                    <div className="text-xs text-slate-400 mt-0.5">Scanned 2 minutes ago · Kano, NG</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">Recommended</div>
                  <div className="text-[22px] font-bold text-slate-900 tracking-[-0.03em]">₦87,500</div>
                  <div className="text-[11px] text-emerald-500 font-semibold">+12% vs avg</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[{ label: 'Moisture', pct: 88, val: '12.4%' },{ label: 'Protein', pct: 72, val: '9.8%' },{ label: 'Purity', pct: 96, val: '98.2%' }].map(m => (
                  <div key={m.label} className="flex items-center gap-[10px]">
                    <div className="text-xs text-slate-400 font-medium w-[70px] shrink-0">{m.label}</div>
                    <div className="flex-1 h-[5px] bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: 'linear-gradient(90deg,#0EA5E9 0%,#0284C7 100%)' }} />
                    </div>
                    <div className="text-xs font-semibold text-slate-900 min-w-[32px] text-right">{m.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-[14px] bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400 font-medium">
                AI confidence: <span className="text-emerald-500 font-bold">97.3%</span>
              </span>
              <button
                className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-sky-500 text-white cursor-pointer transition-all duration-[220ms] shadow-sky hover:bg-sky-600"
                onClick={() => onNavigate('scan-results')}
              >
                View Results
              </button>
            </div>
          </div>

          {/* Floating cards */}
          <div className="absolute -bottom-2 -left-10 bg-white border border-slate-900/[0.06] rounded-[14px] shadow-xl px-4 py-3 flex items-center gap-[10px] text-[13px] font-medium text-slate-900 whitespace-nowrap animate-float-a">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-[#A7F3D0] flex items-center justify-center text-base">✓</div>
            <div>
              <div className="text-xs font-bold text-slate-900">Payment Released</div>
              <div className="text-[11px] text-slate-400">₦262,500 · Just now</div>
            </div>
          </div>

          <div className="absolute top-12 -right-8 bg-white border border-slate-900/[0.06] rounded-[14px] shadow-xl px-4 py-3 flex items-center gap-[10px] text-[13px] font-medium text-slate-900 whitespace-nowrap animate-float-b">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-ring" />
            <div>
              <div className="text-xs font-bold text-slate-900">3 buyers matched</div>
              <div className="text-[11px] text-slate-400">for your listing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { icon: <ScanIcon />, title: 'AI Grain Grading', desc: 'Upload a photo and our computer vision model grades quality, detects defects, and calculates moisture content in seconds.' },
    { icon: <ShieldIcon />, title: 'Escrow Payments', desc: 'Funds are held securely in escrow and released only after delivery verification and quality confirmation.' },
    { icon: <ChartIcon />, title: 'Fair Price Discovery', desc: 'AI-recommended prices based on real-time market data, ensuring farmers get maximum value for quality grain.' },
    { icon: <TrustIcon />, title: 'Trust Score System', desc: 'Every farmer and buyer builds a reputation score based on transaction history, quality consistency, and reliability.' },
    { icon: <LocationIcon />, title: 'GPS Delivery Tracking', desc: 'Real-time GPS verification for all deliveries. Buyers can track grain from farm gate to warehouse.' },
    { icon: <NetworkIcon />, title: 'Aggregator Network', desc: 'Connect with certified aggregators who can consolidate smaller shipments into bulk orders for larger buyers.' },
  ]

  return (
    <section className="py-[100px] bg-white">
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="text-center max-w-[600px] mx-auto">
          <div className="text-xs font-bold tracking-[0.1em] uppercase text-sky-500 mb-3">Platform Features</div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-0.035em] text-slate-900 leading-[1.15] mb-4">
            Everything grain trading needs,<br />in one platform
          </h2>
          <p className="text-base text-slate-500 leading-[1.7] mx-auto">
            From farm to payment, AgriTrust handles every step with AI precision and financial-grade security.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-[60px]">
          {features.map(f => (
            <div key={f.title}
              className="p-7 bg-cream border border-sand rounded-[20px] transition-all duration-[220ms] hover:bg-white hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-lg cursor-default"
            >
              <div className="w-11 h-11 rounded-[10px] bg-sky-50 border border-sky-100 flex items-center justify-center mb-4 text-sky-500">
                {f.icon}
              </div>
              <div className="text-base font-bold text-slate-900 tracking-[-0.02em] mb-2">{f.title}</div>
              <div className="text-sm text-slate-500 leading-[1.65]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Scan your grain', desc: 'Take a photo or upload an image of your grain. Our AI analyses quality, moisture, and defects in under 10 seconds.' },
    { n: '02', title: 'Receive fair offer', desc: 'AI-matched buyers receive your verified grade report and make offers based on real market prices.' },
    { n: '03', title: 'Get paid securely', desc: 'Payment is held in escrow, released automatically upon delivery confirmation. No delays, no disputes.' },
  ]

  return (
    <section className="py-[100px] bg-cream">
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="text-center max-w-[560px] mx-auto">
          <div className="text-xs font-bold tracking-[0.1em] uppercase text-sky-500 mb-3">How It Works</div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-0.035em] text-slate-900 leading-[1.15] mb-4">
            Sell grain in three steps
          </h2>
        </div>
        <div className="relative grid grid-cols-3 gap-12 mt-[60px]">
          {/* Connector line */}
          <div className="absolute top-6 left-[calc(16.66%+12px)] right-[calc(16.66%+12px)] h-px"
            style={{ background: 'linear-gradient(90deg,#E2E8F0,#38BDF8,#E2E8F0)' }}
          />
          {steps.map((s, i) => (
            <div key={s.n} className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white text-base font-bold flex items-center justify-center mx-auto mb-5 relative z-[1]">
                {i + 1}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 tracking-[-0.02em]">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-[1.6]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { value: '97.3%', label: 'AI grading accuracy' },
    { value: '< 10s', label: 'Average scan time' },
    { value: '₦0',   label: 'Fraud losses to date' },
    { value: '4.9★', label: 'Farmer satisfaction' },
  ]

  return (
    <section className="py-20 bg-slate-900">
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-[20px] overflow-hidden">
          {stats.map(s => (
            <div key={s.label} className="px-7 py-9 bg-slate-900 text-center">
              <div className="text-[40px] font-extrabold tracking-[-0.04em] text-white mb-[6px]">{s.value}</div>
              <div className="text-[13px] text-white/45 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    { text: 'AgriTrust changed everything. Before, buyers would claim my maize was low quality and pay almost nothing. Now the AI grades it and I can\'t be cheated.', name: 'Aminu Yusuf', role: 'Maize Farmer, Kaduna', initials: 'AY', color: '#0EA5E9' },
    { text: 'As a bulk buyer, I used to spend weeks visiting farms. Now I get verified quality reports and can buy with confidence from anywhere. The escrow gives me peace of mind.', name: 'Chioma Okafor', role: 'Grain Buyer, Lagos', initials: 'CO', color: '#10B981' },
    { text: 'We process 200+ transactions a month through AgriTrust. The aggregator tools are exceptional — batch orders, consolidated shipping, real-time tracking.', name: 'Ibrahim Musa', role: 'Aggregator, Kano', initials: 'IM', color: '#D97706' },
  ]

  return (
    <section className="py-[100px] bg-white">
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="text-center max-w-[560px] mx-auto">
          <div className="text-xs font-bold tracking-[0.1em] uppercase text-sky-500 mb-3">Testimonials</div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-0.035em] text-slate-900 leading-[1.15] mb-4">
            Trusted by the people who feed Africa
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-[60px]">
          {testimonials.map(t => (
            <div key={t.name} className="p-7 bg-cream border border-sand rounded-[20px]">
              <div className="flex gap-[3px] mb-4 text-amber-500 text-sm">
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="text-sm leading-[1.75] text-slate-600 mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-[10px]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0" style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection({ onNavigate }: Props) {
  return (
    <section className="py-[100px] bg-slate-900 text-center relative overflow-hidden">
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at center,rgba(14,165,233,0.12) 0%,transparent 70%)' }}
      />
      <div className="w-full max-w-6xl mx-auto px-6 relative">
        <h2 className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-0.04em] text-white mb-4">
          Ready to trade grain<br />the right way?
        </h2>
        <p className="text-[17px] text-white/50 mb-10 max-w-[480px] mx-auto">
          Join 12,000+ farmers and 800+ buyers already using AgriTrust to trade smarter, safer, and fairer.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            className="inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 bg-white text-slate-900 cursor-pointer transition-all duration-[220ms] shadow-sm hover:bg-slate-50 hover:-translate-y-px hover:shadow-lg"
            onClick={() => onNavigate('farmer-dashboard')}
          >
            Start as Farmer
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] bg-white/10 text-white/85 border border-white/15 cursor-pointer transition-all duration-[220ms] hover:bg-white/15 hover:text-white"
            onClick={() => onNavigate('buyer-dashboard')}
          >
            I'm a Buyer
          </button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-[60px] pb-8">
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="grid gap-12 mb-12" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}>
          <div>
            <div className="flex items-center gap-2 font-extrabold text-lg tracking-[-0.04em] text-slate-900">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="#0F172A" />
                <path d="M8 18C8 18 10 12 14 10C18 8 20 14 20 14" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <circle cx="14" cy="17" r="3" fill="#EDE4D5" />
                <circle cx="14" cy="17" r="1.5" fill="#0EA5E9" />
              </svg>
              AgriTrust
            </div>
            <p className="text-sm text-slate-400 leading-[1.7] mt-3 max-w-[260px]">
              AI-powered grain quality verification and escrow payments for Africa's agricultural supply chain.
            </p>
          </div>

          {[
            { title: 'Platform', links: ['Grain Scanning', 'Quality Grading', 'Price Discovery', 'Escrow Payments', 'Delivery Tracking'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-xs font-bold tracking-[0.07em] uppercase text-slate-400 mb-4">{col.title}</div>
              <div className="flex flex-col gap-[10px]">
                {col.links.map(l => (
                  <span key={l} className="text-sm text-slate-500 cursor-pointer transition-colors duration-[220ms] hover:text-slate-900">{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[13px] text-slate-400">© 2025 AgriTrust Technologies Ltd. All rights reserved.</div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">SOC 2 Type II</span>
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-sky-100 text-sky-600">PCI DSS</span>
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-slate-100 text-slate-600">ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
      <path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ScanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="14" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 10h7M10 7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L3 5v5c0 4.4 3 8.3 7 9 4-0.7 7-4.6 7-9V5l-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 14l4-5 4 3 4-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function TrustIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 7v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C7.2 2 5 4.2 5 7c0 4 5 11 5 11s5-7 5-11c0-2.8-2.2-5-5-5z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
function NetworkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="4" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="4" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 6l3 3M14.5 6l-3 3M5.5 14l3-3M14.5 14l-3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
