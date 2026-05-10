import { useState, useEffect } from 'react'

type Screen = 'landing' | 'farmer-dashboard' | 'grain-scan' | 'scan-results' | 'buyer-dashboard' | 'payment'

interface Props {
  onNavigate: (s: Screen) => void
}

const TRUST_SCORE = 87
const CIRCUMFERENCE = 2 * Math.PI * 52 // r=52

const scans = [
  { id: 1, emoji: '🌽', name: 'Yellow Maize', date: '2 hours ago', location: 'Kano, NG', grade: 'A', gradeClass: 'text-green', price: '₦87,500', volume: '500 kg' },
  { id: 2, emoji: '🌾', name: 'Wheat — Hard Red', date: 'Yesterday', location: 'Kaduna, NG', grade: 'B', gradeClass: 'text-sky', price: '₦64,200', volume: '320 kg' },
  { id: 3, emoji: '🫘', name: 'Soybean', date: '3 days ago', location: 'Plateau, NG', grade: 'A', gradeClass: 'text-green', price: '₦112,000', volume: '800 kg' },
  { id: 4, emoji: '🌾', name: 'Sorghum', date: '5 days ago', location: 'Borno, NG', grade: 'C', gradeClass: 'text-amber', price: '₦38,400', volume: '240 kg' },
]

const earnings = [42, 65, 38, 87, 54, 72, 91, 60, 77, 88, 55, 94]

export default function FarmerDashboard({ onNavigate }: Props) {
  const [gaugeAnimated, setGaugeAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setGaugeAnimated(true), 200)
    return () => clearTimeout(t)
  }, [])

  const offset = CIRCUMFERENCE - (TRUST_SCORE / 100) * CIRCUMFERENCE

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-3 flex-1">
          <div>
            <div className="page-title">Farmer Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="badge badge-green">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', opacity: 0.7 }} />
            Online
          </div>
          <button
            className="btn btn-sky btn-sm"
            onClick={() => onNavigate('grain-scan')}
          >
            <CameraIcon /> Scan New Grain
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="page-body">
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard
            label="Active Listings"
            value="7"
            delta="+2 this week"
            up
            icon={<ListingIcon />}
            iconBg="var(--sky-50)"
            iconColor="var(--sky)"
          />
          <StatCard
            label="Earnings This Month"
            value="₦302K"
            delta="+18.4%"
            up
            icon={<MoneyIcon />}
            iconBg="var(--green-50)"
            iconColor="var(--green)"
          />
          <StatCard
            label="Total Scans"
            value="48"
            delta="4 pending"
            icon={<ScanCountIcon />}
            iconBg="var(--amber-50)"
            iconColor="var(--amber)"
          />
          <StatCard
            label="Avg Grade"
            value="A–"
            delta="Top 12%"
            up
            icon={<GradeIcon />}
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
          />
        </div>

        <div className="dashboard-grid">
          {/* Main column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Earnings chart card */}
            <div className="card" style={{ padding: 24 }}>
              <div className="section-header">
                <div>
                  <div className="section-heading">Monthly Earnings</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>Last 12 months</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.03em' }}>₦3.6M</div>
                  <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <span>↑</span> 24.1% YoY
                  </div>
                </div>
              </div>

              {/* Bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, marginTop: 16 }}>
                {earnings.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${(v / 100) * 72}px`,
                        borderRadius: '4px 4px 0 0',
                        background: i === earnings.length - 1
                          ? 'linear-gradient(180deg, var(--sky) 0%, var(--sky-dark) 100%)'
                          : i === earnings.length - 2
                          ? 'var(--sky-100)'
                          : 'var(--gray-100)',
                        transition: 'all 0.3s ease',
                        minHeight: 4,
                      }}
                    />
                    <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>
                      {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent scans */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '20px 20px 0' }}>
                <div className="section-header">
                  <div className="section-heading">Recent Grain Scans</div>
                  <button
                    className="btn btn-ghost btn-sm text-sky"
                    onClick={() => onNavigate('grain-scan')}
                    style={{ color: 'var(--sky)', fontSize: 13 }}
                  >
                    New scan →
                  </button>
                </div>
              </div>

              <div style={{ padding: '8px 8px 8px' }}>
                {scans.map((s) => (
                  <div
                    key={s.id}
                    className="scan-row"
                    onClick={() => onNavigate('scan-results')}
                  >
                    <div className="scan-grain-icon">{s.emoji}</div>
                    <div className="scan-info">
                      <div className="scan-name">{s.name}</div>
                      <div className="scan-date">{s.date} · {s.location} · {s.volume}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className={`scan-grade ${s.gradeClass}`}>Grade {s.grade}</div>
                        <div className="scan-price-label">Offered</div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 72 }}>
                        <div className="scan-price">{s.price}</div>
                      </div>
                      <ChevronIcon />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quick scan CTA */}
            <button
              className="quick-scan-btn"
              onClick={() => onNavigate('grain-scan')}
            >
              <div className="quick-scan-pulse" />
              <span>Scan New Grain</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ opacity: 0.6 }}>
                <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Trust Score */}
            <div className="card trust-gauge-wrap">
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: 12 }}>
                Trust Score
              </div>
              <svg width="160" height="160" viewBox="0 0 120 120" className="trust-gauge-svg">
                <circle
                  className="trust-circle-bg"
                  cx="60" cy="60" r="52"
                />
                <circle
                  className="trust-circle-fill"
                  cx="60" cy="60" r="52"
                  stroke="url(#gaugeGrad)"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={gaugeAnimated ? offset : CIRCUMFERENCE}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
                <text x="60" y="56" textAnchor="middle" className="trust-score-label">
                  {TRUST_SCORE}
                </text>
                <text x="60" y="70" textAnchor="middle" className="trust-score-sub">
                  of 100
                </text>
                <text x="60" y="84" textAnchor="middle" style={{ fontSize: 9, fill: 'var(--green)', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                  ↑ +3 this month
                </text>
              </svg>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, width: '100%' }}>
                {[
                  { label: 'Quality', pct: 92 },
                  { label: 'Delivery', pct: 85 },
                  { label: 'Response', pct: 78 },
                ].map(m => (
                  <div key={m.label} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.02em' }}>{m.pct}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 1 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active offers */}
            <div className="card" style={{ padding: 20 }}>
              <div className="section-heading" style={{ marginBottom: 14 }}>Active Offers</div>
              {[
                { buyer: 'Lagos Grain Co.', amount: '₦87,500', items: 'Maize · 500kg', status: 'Accepted', color: 'var(--green)' },
                { buyer: 'Northgate Foods', amount: '₦112,000', items: 'Soybean · 800kg', status: 'Pending', color: 'var(--amber)' },
              ].map(o => (
                <div key={o.buyer} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray-50)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{o.buyer}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{o.amount}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{o.items}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: o.color }}>{o.status}</div>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%', marginTop: 14 }}
                onClick={() => onNavigate('payment')}
              >
                View all payments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  delta: string
  up?: boolean
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

function StatCard({ label, value, delta, up, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="stat-label">{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className={`stat-delta ${up ? 'up' : 'neutral'}`}>
        {up && <span>↑</span>}
        {delta}
      </div>
    </div>
  )
}

function ListingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function MoneyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v6M6 7h3a1 1 0 010 2H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ScanCountIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function GradeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L8 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--gray-300)', flexShrink: 0 }}>
      <path d="M5 10l4-3-4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 4.5A1.5 1.5 0 012.5 3h.77l.74-1h5l.74 1h.77A1.5 1.5 0 0113 4.5v6A1.5 1.5 0 0111.5 12h-9A1.5 1.5 0 011 10.5v-6z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
