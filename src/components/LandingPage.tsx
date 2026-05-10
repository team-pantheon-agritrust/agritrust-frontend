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
    <section className="hero-section">
      <div className="hero-bg-grid" />
      <div className="hero-bg-glow" />
      <div className="hero-container">
        {/* Left */}
        <div className="animate-fade-up">

          <h1 className="hero-title">
            Transparent Grain Trading,{' '}
            <span className="hero-title-accent">Powered by AI</span>
          </h1>

          <p className="hero-subtitle">
            GrainTrust uses computer vision to grade grain quality, set fair
            prices, and protect payments — connecting farmers, buyers, and
            aggregators across Africa.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('farmer-dashboard')}
            >
              Start as Farmer
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => onNavigate('buyer-dashboard')}
            >
              I'm a Buyer
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">12K+</div>
              <div className="hero-stat-label">Verified farmers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">₦2.4B</div>
              <div className="hero-stat-label">Grain traded</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">8</div>
              <div className="hero-stat-label">African countries</div>
            </div>
          </div>

          <div className="hero-trust">
            <div className="hero-trust-item">
              <CheckIcon />
              AI-verified quality
            </div>
            <div className="hero-trust-item">
              <CheckIcon />
              Escrow-protected
            </div>
            <div className="hero-trust-item">
              <CheckIcon />
              Zero fraud guarantee
            </div>
          </div>
        </div>

        {/* Right — product mockup */}
        <div className="hero-visual">
          <div className="hero-card-main">
            <div className="hero-card-header">
              <div className="hero-card-dots">
                <div className="dot dot-red" />
                <div className="dot dot-yellow" />
                <div className="dot dot-green" />
              </div>
              <span className="hero-card-title-bar">GRAIN ANALYSIS</span>
            </div>

            <div className="hero-grain-preview">
              <div className="hero-grain-pattern" />
              <div className="scan-overlay" />
              <div className="scan-corners">
                <div className="scan-corner tl" />
                <div className="scan-corner tr" />
                <div className="scan-corner bl" />
                <div className="scan-corner br" />
              </div>
              <div className="ai-badge">AI SCANNING</div>
            </div>

            <div className="hero-card-body">
              <div className="hero-result-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="grade-badge grade-a">A</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.02em' }}>
                      Maize — Premium Grade
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                      Scanned 2 minutes ago · Kano, NG
                    </div>
                  </div>
                </div>
                <div className="hero-price">
                  <div className="hero-price-label">Recommended</div>
                  <div className="hero-price-value">₦87,500</div>
                  <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
                    +12% vs avg
                  </div>
                </div>
              </div>

              <div className="hero-metrics">
                {[
                  { label: 'Moisture', pct: 88, val: '12.4%' },
                  { label: 'Protein', pct: 72, val: '9.8%' },
                  { label: 'Purity', pct: 96, val: '98.2%' },
                ].map(m => (
                  <div className="hero-metric" key={m.label}>
                    <div className="hero-metric-label">{m.label}</div>
                    <div className="hero-metric-track">
                      <div className="hero-metric-fill" style={{ width: `${m.pct}%` }} />
                    </div>
                    <div className="hero-metric-val">{m.val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-card-footer">
              <span className="confidence-text">
                AI confidence: <span className="confidence-value">97.3%</span>
              </span>
              <button
                className="btn btn-sky btn-sm"
                onClick={() => onNavigate('scan-results')}
              >
                View Results
              </button>
            </div>
          </div>

          {/* Floating mini cards */}
          <div className="hero-float-card card-a">
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green-50)', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>Payment Released</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>₦262,500 · Just now</div>
            </div>
          </div>

          <div className="hero-float-card card-b">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-ring 2s infinite' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>3 buyers matched</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>for your listing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: <ScanIcon />,
      title: 'AI Grain Grading',
      desc: 'Upload a photo and our computer vision model grades quality, detects defects, and calculates moisture content in seconds.',
    },
    {
      icon: <ShieldIcon />,
      title: 'Escrow Payments',
      desc: 'Funds are held securely in escrow and released only after delivery verification and quality confirmation.',
    },
    {
      icon: <ChartIcon />,
      title: 'Fair Price Discovery',
      desc: 'AI-recommended prices based on real-time market data, ensuring farmers get maximum value for quality grain.',
    },
    {
      icon: <TrustIcon />,
      title: 'Trust Score System',
      desc: 'Every farmer and buyer builds a reputation score based on transaction history, quality consistency, and reliability.',
    },
    {
      icon: <LocationIcon />,
      title: 'GPS Delivery Tracking',
      desc: 'Real-time GPS verification for all deliveries. Buyers can track grain from farm gate to warehouse.',
    },
    {
      icon: <NetworkIcon />,
      title: 'Aggregator Network',
      desc: 'Connect with certified aggregators who can consolidate smaller shipments into bulk orders for larger buyers.',
    },
  ]

  return (
    <section className="features-section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div className="section-label">Platform Features</div>
          <h2 className="section-title">
            Everything grain trading needs,<br />in one platform
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            From farm to payment, GrainTrust handles every step with
            AI precision and financial-grade security.
          </p>
        </div>

        <div className="features-grid">
          {features.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Scan your grain',
      desc: 'Take a photo or upload an image of your grain. Our AI analyses quality, moisture, and defects in under 10 seconds.',
    },
    {
      n: '02',
      title: 'Receive fair offer',
      desc: 'AI-matched buyers receive your verified grade report and make offers based on real market prices.',
    },
    {
      n: '03',
      title: 'Get paid securely',
      desc: 'Payment is held in escrow, released automatically upon delivery confirmation. No delays, no disputes.',
    },
  ]

  return (
    <section className="hiw-section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <div className="section-label">How It Works</div>
          <h2 className="section-title">
            Sell grain in three steps
          </h2>
        </div>
        <div className="hiw-steps">
          {steps.map((s, i) => (
            <div className="hiw-step" key={s.n}>
              <div className="hiw-step-number">{i + 1}</div>
              {i < steps.length - 1 && (
                <div style={{ display: 'none' }} />
              )}
              <h3 className="hiw-step-title">{s.title}</h3>
              <p className="hiw-step-desc">{s.desc}</p>
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
    { value: '₦0', label: 'Fraud losses to date' },
    { value: '4.9★', label: 'Farmer satisfaction' },
  ]

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map(s => (
            <div className="stat-block" key={s.label}>
              <div className="stat-block-value">{s.value}</div>
              <div className="stat-block-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      text: 'GrainTrust changed everything. Before, buyers would claim my maize was low quality and pay almost nothing. Now the AI grades it and I can\'t be cheated.',
      name: 'Aminu Yusuf',
      role: 'Maize Farmer, Kaduna',
      initials: 'AY',
      color: '#0EA5E9',
    },
    {
      text: 'As a bulk buyer, I used to spend weeks visiting farms. Now I get verified quality reports and can buy with confidence from anywhere. The escrow gives me peace of mind.',
      name: 'Chioma Okafor',
      role: 'Grain Buyer, Lagos',
      initials: 'CO',
      color: '#10B981',
    },
    {
      text: 'We process 200+ transactions a month through GrainTrust. The aggregator tools are exceptional — batch orders, consolidated shipping, real-time tracking.',
      name: 'Ibrahim Musa',
      role: 'Aggregator, Kano',
      initials: 'IM',
      color: '#D97706',
    },
  ]

  return (
    <section className="testimonials-section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">Trusted by the people who feed Africa</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div className="testimonial-card" key={t.name}>
              <div className="testimonial-stars">
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar" style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
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
    <section className="cta-section">
      <div className="container">
        <h2 className="cta-title">
          Ready to trade grain<br />the right way?
        </h2>
        <p className="cta-sub">
          Join 12,000+ farmers and 800+ buyers already using GrainTrust
          to trade smarter, safer, and fairer.
        </p>
        <div className="cta-actions">
          <button
            className="btn btn-white btn-lg"
            onClick={() => onNavigate('farmer-dashboard')}
          >
            Start as Farmer
          </button>
          <button
            className="btn btn-ghost-white btn-lg"
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
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 18, letterSpacing: '-0.04em', color: 'var(--navy)' }}>
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="#0F172A" />
                <path d="M8 18C8 18 10 12 14 10C18 8 20 14 20 14" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <circle cx="14" cy="17" r="3" fill="#EDE4D5" />
                <circle cx="14" cy="17" r="1.5" fill="#0EA5E9" />
              </svg>
              GrainTrust
            </div>
            <p className="footer-brand-desc">
              AI-powered grain quality verification and escrow payments for
              Africa's agricultural supply chain.
            </p>
          </div>

          {[
            { title: 'Platform', links: ['Grain Scanning', 'Quality Grading', 'Price Discovery', 'Escrow Payments', 'Delivery Tracking'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'] },
          ].map(col => (
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <div className="footer-links">
                {col.links.map(l => (
                  <span className="footer-link" key={l}>{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2025 GrainTrust Technologies Ltd. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-green">SOC 2 Type II</span>
            <span className="badge badge-sky">PCI DSS</span>
            <span className="badge badge-gray">ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="var(--green-50)" stroke="#A7F3D0" strokeWidth="1" />
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
