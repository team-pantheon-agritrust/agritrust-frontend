import { useState } from 'react'

type Screen = 'landing' | 'farmer-dashboard' | 'grain-scan' | 'scan-results' | 'buyer-dashboard' | 'payment'

interface Props {
  onNavigate: (s: Screen) => void
}

const result = {
  grain: 'Yellow Maize',
  location: 'Kano, Kano State, NG',
  weight: '500 kg',
  scanDate: '10 May 2025, 14:32',
  grade: 'A',
  gradeLabel: 'Premium Grade',
  confidence: 97.3,
  moisture: 12.4,
  protein: 9.8,
  purity: 98.2,
  price: 87500,
  avgPrice: 78200,
  defects: [
    { name: 'Mold / Fungal', pct: 0.8, color: '#EF4444', barColor: 'var(--red)' },
    { name: 'Pest damage', pct: 0.5, color: '#D97706', barColor: 'var(--amber)' },
    { name: 'Foreign matter', pct: 0.3, color: '#94A3B8', barColor: 'var(--gray-300)' },
    { name: 'Broken kernels', pct: 1.2, color: '#F59E0B', barColor: '#F59E0B' },
    { name: 'Discolouration', pct: 0.4, color: '#6366F1', barColor: '#6366F1' },
  ],
}

const premium = Math.round(((result.price - result.avgPrice) / result.avgPrice) * 100)

export default function GradingResults({ onNavigate }: Props) {
  const [paymentTriggered, setPaymentTriggered] = useState(false)

  function handlePayment() {
    setPaymentTriggered(true)
    setTimeout(() => onNavigate('payment'), 400)
  }

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('grain-scan')}>
          ← Back
        </button>
        <div className="page-title">AI Analysis Results</div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-outline btn-sm">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 10v2h10v-2M7 2v7M4 6l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Export PDF
        </button>
        <button className="btn btn-outline btn-sm">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="4" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="10" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="10" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5.3 6.3l3.4-2M5.3 7.7l3.4 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Share
        </button>
      </div>

      <div className="results-page">
        {/* Hero result card */}
        <div className="results-hero animate-fade-up">
          <div className="results-hero-top">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div className="results-grade-circle">
                {result.grade}
              </div>
              <div>
                <div className="results-title">{result.grain}</div>
                <div className="results-subtitle">{result.gradeLabel} · {result.location}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 999, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                    {result.weight}
                  </span>
                  <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 999, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                    {result.scanDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="results-price-wrap">
              <div className="results-price-label">Recommended Price</div>
              <div className="results-price-main">
                ₦{result.price.toLocaleString()}
              </div>
              <div className="results-price-sub">per {result.weight}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginTop: 6 }}>
                <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.15)', color: '#34D399', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                  +{premium}% vs avg
                </span>
              </div>
            </div>
          </div>

          <div className="results-metrics-row">
            {[
              { label: 'Moisture', value: result.moisture, unit: '%', status: result.moisture < 13 ? 'Optimal' : 'High', ok: result.moisture < 13 },
              { label: 'Protein', value: result.protein, unit: '%', status: result.protein > 9 ? 'Good' : 'Fair', ok: result.protein > 9 },
              { label: 'Purity', value: result.purity, unit: '%', status: result.purity > 97 ? 'Excellent' : 'Good', ok: result.purity > 97 },
            ].map(m => (
              <div className="results-metric-item" key={m.label}>
                <div className="results-metric-label">{m.label}</div>
                <div className="results-metric-value">
                  {m.value}<span className="results-metric-unit">{m.unit}</span>
                </div>
                <div style={{ fontSize: 11, marginTop: 4, color: m.ok ? '#34D399' : '#FCD34D', fontWeight: 600 }}>
                  {m.status}
                </div>
              </div>
            ))}
          </div>

          {/* Confidence bar */}
          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>AI Confidence Score</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#34D399' }}>{result.confidence}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${result.confidence}%`, background: 'linear-gradient(90deg, #10B981, #34D399)', borderRadius: 99 }} />
            </div>
          </div>
        </div>

        {/* Defect Breakdown */}
        <div className="card defects-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="section-header" style={{ marginBottom: 20 }}>
            <div>
              <div className="section-heading">Defect Analysis</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                Total defects: <span style={{ fontWeight: 700, color: 'var(--navy)' }}>3.2%</span> — within Grade A threshold
              </div>
            </div>
            <span className="badge badge-green">Grade A</span>
          </div>

          {result.defects.map(d => (
            <div className="defect-row" key={d.name}>
              <div className="defect-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.barColor, flexShrink: 0 }} />
                  <span className="defect-name">{d.name}</span>
                </div>
                <span className="defect-pct" style={{ color: d.pct > 1.5 ? 'var(--red)' : d.pct > 0.7 ? 'var(--amber)' : 'var(--gray-500)' }}>
                  {d.pct}%
                </span>
              </div>
              <div className="defect-bar-track">
                <div
                  className="defect-bar"
                  style={{ width: `${(d.pct / 5) * 100}%`, background: d.barColor }}
                />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--green-50)', borderRadius: 'var(--radius)', border: '1px solid #A7F3D0', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--green)', fontSize: 16 }}>✓</span>
            <div style={{ fontSize: 13, color: '#065F46', lineHeight: 1.5 }}>
              <strong>Within Grade A limits.</strong> Total defect rate (3.2%) is below the 5% threshold for premium grading. Suitable for direct export.
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="card price-card animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div className="section-heading">Market Price Comparison</div>
            <span className="badge badge-sand">Kano Exchange · Live</span>
          </div>

          <div className="price-comparison">
            {[
              { label: 'Low Quality (C)', value: '₦48,200', height: 35, color: 'var(--gray-200)' },
              { label: 'Market Average (B)', value: '₦78,200', height: 58, color: 'var(--sky-100)' },
              { label: 'Your Grain (A)', value: `₦${result.price.toLocaleString()}`, height: 80, color: 'var(--sky)', highlight: true },
            ].map(b => (
              <div className="price-col" key={b.label}>
                <div className="price-bar-wrap">
                  <div
                    className="price-bar"
                    style={{
                      height: b.height,
                      background: b.highlight
                        ? 'linear-gradient(180deg, var(--sky) 0%, var(--sky-dark) 100%)'
                        : b.color,
                      boxShadow: b.highlight ? 'var(--shadow-sky)' : 'none',
                    }}
                  />
                </div>
                <div className="price-col-label" style={{ color: b.highlight ? 'var(--sky-dark)' : undefined }}>{b.label}</div>
                <div className="price-col-value" style={{ color: b.highlight ? 'var(--navy)' : 'var(--gray-500)' }}>{b.value}</div>
              </div>
            ))}
          </div>

          <div className="price-premium">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2l1.6 3.2L12 6l-2.5 2.4.6 3.4L7 10.3l-3.1 1.5.6-3.4L2 6l3.4-.8L7 2z" fill="currentColor" />
            </svg>
            You're earning <strong>₦{(result.price - result.avgPrice).toLocaleString()}</strong> more than market average
          </div>
        </div>

        {/* Action buttons */}
        <div className="results-actions animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <button
            className="btn btn-primary btn-lg"
            style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-800) 100%)', justifyContent: 'center' }}
            onClick={handlePayment}
            disabled={paymentTriggered}
          >
            {paymentTriggered ? (
              <>
                <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Preparing…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Generate Payment Link
              </>
            )}
          </button>

          <button
            className="btn btn-outline btn-lg"
            style={{ justifyContent: 'center' }}
            onClick={() => onNavigate('buyer-dashboard')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Browse Buyers
          </button>
        </div>

        {/* Re-scan option */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn btn-ghost text-sm"
            style={{ color: 'var(--gray-400)' }}
            onClick={() => onNavigate('grain-scan')}
          >
            ← Scan another batch
          </button>
        </div>
      </div>
    </div>
  )
}
