import { useState } from 'react'

type Screen = 'landing' | 'farmer-dashboard' | 'grain-scan' | 'scan-results' | 'buyer-dashboard' | 'payment'

interface Props {
  onNavigate: (s: Screen) => void
}

const tx = {
  id: 'ESC-4821',
  grain: 'Yellow Maize',
  weight: '500 kg',
  grade: 'A',
  farmer: 'Aminu Yusuf',
  farmerLocation: 'Kano, NG',
  buyer: 'Chioma Okafor',
  buyerCompany: 'Lagos Grain Co.',
  amount: 87500,
  created: '10 May 2025',
  expected: '12 May 2025',
}

const conditions = [
  { id: 1, label: 'Payment received from buyer', detail: 'Confirmed via bank transfer', met: true },
  { id: 2, label: 'AI quality verified (Grade A)', detail: 'Confidence: 97.3% · 10 May 2025', met: true },
  { id: 3, label: 'Grain dispatched from farm', detail: 'GPS confirmed · 11 May 2025, 08:14', met: true },
  { id: 4, label: 'Delivery confirmed at warehouse', detail: 'Awaiting GPS arrival confirmation', met: false },
  { id: 5, label: 'Buyer inspection sign-off', detail: 'Pending delivery first', met: false },
]

const metCount = conditions.filter(c => c.met).length
const releaseReady = metCount === conditions.length

export default function PaymentEscrow({ onNavigate }: Props) {
  const [releasing, setReleasing] = useState(false)
  const [released, setReleased] = useState(false)

  function handleRelease() {
    setReleasing(true)
    setTimeout(() => {
      setReleasing(false)
      setReleased(true)
    }, 2000)
  }

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('buyer-dashboard')}>
          ← Back
        </button>
        <div className="page-title">Escrow & Payment</div>
        <div style={{ flex: 1 }} />
        <span className="badge badge-amber">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
          In Escrow
        </span>
      </div>

      <div className="payment-page">
        {/* Escrow hero */}
        {released ? (
          <div style={{
            background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: 32,
            textAlign: 'center',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 6 }}>
              Payment Released!
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              ₦{tx.amount.toLocaleString()} transferred to {tx.farmer}
            </div>
          </div>
        ) : (
          <div className="escrow-hero">
            <div style={{ position: 'absolute', top: -100, right: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div className="escrow-amount-label">Escrowed Amount</div>
            <div className="escrow-amount">₦{tx.amount.toLocaleString()}</div>
            <div className="escrow-sub">{tx.grain} · {tx.weight} · Grade {tx.grade}</div>

            <div className="escrow-lock-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="10" width="16" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M7 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="11" cy="15.5" r="1.5" fill="currentColor" />
              </svg>
            </div>

            {/* Progress band */}
            <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Release progress</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>{metCount}/{conditions.length} conditions</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(metCount / conditions.length) * 100}%`, background: 'linear-gradient(90deg, #0EA5E9, #10B981)', borderRadius: 99, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          </div>
        )}

        {/* Parties */}
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 auto 8px' }}>AY</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{tx.farmer}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Farmer · {tx.farmerLocation}</div>
            </div>

            <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 0, padding: '0 8px' }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--sky-100), var(--gray-200))' }} />
              <div style={{ padding: '6px 12px', background: 'var(--navy)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="4" width="10" height="7" rx="1.5" stroke="white" strokeWidth="1.2" />
                  <path d="M1 6h10" stroke="white" strokeWidth="1.2" />
                  <circle cx="3.5" cy="8.5" r="0.8" fill="white" />
                </svg>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>ESCROW</span>
              </div>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--gray-200), var(--sky-100))' }} />
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 auto 8px' }}>CO</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{tx.buyer}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Buyer · {tx.buyerCompany}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
            {[
              { label: 'Transaction ID', value: tx.id },
              { label: 'Created', value: tx.created },
              { label: 'Expected', value: tx.expected },
            ].map(d => (
              <div key={d.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 500 }}>{d.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginTop: 2 }}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Release conditions */}
        <div className="card conditions-card">
          <div style={{ padding: '20px 20px 0' }}>
            <div className="section-heading" style={{ marginBottom: 4 }}>Release Conditions</div>
            <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>All conditions must be met before funds are released</div>
          </div>
          <div style={{ padding: '12px 20px 20px' }}>
            {conditions.map((c, i) => (
              <div className="condition-item" key={c.id}>
                <div className={`condition-check ${c.met ? 'met' : 'unmet'}`}>
                  {c.met ? '✓' : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="condition-text">{c.label}</div>
                  <div className="condition-sub">{c.detail}</div>
                </div>
                {c.met && (
                  <span className="badge badge-green" style={{ fontSize: 11 }}>Done</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment steps timeline */}
        <div className="card" style={{ padding: '20px 20px 8px', marginTop: 20 }}>
          <div className="section-heading" style={{ marginBottom: 16 }}>Transaction Timeline</div>
          <div className="payment-steps">
            {[
              { icon: '₦', label: 'Payment deposited to escrow', desc: `₦${tx.amount.toLocaleString()} received · ${tx.created}`, state: 'done' as const },
              { icon: '🔬', label: 'AI quality verification', desc: 'Grade A confirmed · 97.3% confidence', state: 'done' as const },
              { icon: '🚚', label: 'Grain dispatched', desc: 'GPS tracking active · En route to Lagos', state: 'done' as const },
              { icon: '📦', label: 'Delivery to warehouse', desc: 'ETA: Tomorrow, 11:30 AM', state: 'pending' as const },
              { icon: '✓', label: 'Funds released to farmer', desc: 'Automatic upon all conditions met', state: 'locked' as const },
            ].map((s, i) => (
              <div className="payment-step" key={i}>
                <div className={`payment-step-icon ${s.state}`}>
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                </div>
                <div className="payment-step-content">
                  <div className="payment-step-title">{s.label}</div>
                  <div className="payment-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Release button */}
        {!released && (
          <button
            className="release-btn"
            disabled={!releaseReady || releasing}
            onClick={handleRelease}
          >
            {releasing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Processing release…
              </span>
            ) : !releaseReady ? (
              `🔒  ${conditions.length - metCount} conditions remaining`
            ) : (
              '🔓  Release Funds to Farmer'
            )}
          </button>
        )}

        {released && (
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-outline btn-lg flex-1" onClick={() => onNavigate('buyer-dashboard')}>
              Back to Dashboard
            </button>
            <button className="btn btn-sky btn-lg flex-1">
              Download Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
