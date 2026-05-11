import { useState } from 'react'

type Screen = 'landing' | 'farmer-dashboard' | 'grain-scan' | 'scan-results' | 'buyer-dashboard' | 'payment'

interface Props {
  onNavigate: (s: Screen) => void
}

const tx = {
  id: 'ESC-4821', grain: 'Yellow Maize', weight: '500 kg', grade: 'A',
  farmer: 'Aminu Yusuf', farmerLocation: 'Kano, NG',
  buyer: 'Chioma Okafor', buyerCompany: 'Lagos Grain Co.',
  amount: 87500, created: '10 May 2025', expected: '12 May 2025',
}

const conditions = [
  { id: 1, label: 'Payment received from buyer',      detail: 'Confirmed via bank transfer',                    met: true },
  { id: 2, label: 'AI quality verified (Grade A)',    detail: 'Confidence: 97.3% · 10 May 2025',               met: true },
  { id: 3, label: 'Grain dispatched from farm',       detail: 'GPS confirmed · 11 May 2025, 08:14',            met: true },
  { id: 4, label: 'Delivery confirmed at warehouse',  detail: 'Awaiting GPS arrival confirmation',             met: false },
  { id: 5, label: 'Buyer inspection sign-off',        detail: 'Pending delivery first',                        met: false },
]

const metCount = conditions.filter(c => c.met).length
const releaseReady = metCount === conditions.length

export default function PaymentEscrow({ onNavigate }: Props) {
  const [releasing, setReleasing] = useState(false)
  const [released, setReleased] = useState(false)

  function handleRelease() {
    setReleasing(true)
    setTimeout(() => { setReleasing(false); setReleased(true) }, 2000)
  }

  return (
    <div>
      {/* Header */}
      <div className="h-16 bg-white border-b border-slate-900/[0.06] flex items-center px-8 gap-4 sticky top-0 z-50">
        <button
          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          onClick={() => onNavigate('buyer-dashboard')}
        >
          ← Back
        </button>
        <div className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">Escrow & Payment</div>
        <div className="flex-1" />
        <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-amber-100 text-amber-600">
          <span className="w-[6px] h-[6px] rounded-full bg-current" />
          In Escrow
        </span>
      </div>

      <div className="max-w-[560px] mx-auto p-10 px-8">
        {/* Escrow hero */}
        {released ? (
          <div className="rounded-[28px] p-8 text-center mb-6" style={{ background: 'linear-gradient(135deg,#065F46 0%,#059669 100%)' }}>
            <div className="text-[48px] mb-3">✓</div>
            <div className="text-2xl font-extrabold text-white tracking-[-0.03em] mb-[6px]">Payment Released!</div>
            <div className="text-sm text-white/60">₦{tx.amount.toLocaleString()} transferred to {tx.farmer}</div>
          </div>
        ) : (
          <div className="rounded-[28px] p-8 text-center mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0F172A 0%,#0a2240 100%)' }}>
            <div className="absolute -top-[100px] -right-[80px] w-[300px] h-[300px] pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(14,165,233,0.1) 0%,transparent 70%)' }}
            />
            <div className="text-xs text-white/40 font-medium mb-2 tracking-[0.05em] uppercase">Escrowed Amount</div>
            <div className="text-[52px] font-black tracking-[-0.05em] text-white leading-none mb-2">
              ₦{tx.amount.toLocaleString()}
            </div>
            <div className="text-[13px] text-white/40">{tx.grain} · {tx.weight} · Grade {tx.grade}</div>

            <div className="w-12 h-12 rounded-[10px] border border-sky-500/25 flex items-center justify-center mx-auto mt-5 text-sky-500"
              style={{ background: 'rgba(14,165,233,0.15)' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="10" width="16" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M7 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="11" cy="15.5" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <div className="mt-5 p-3 px-4 rounded-[10px] border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-white/40">Release progress</span>
                <span className="text-xs font-bold text-[#34D399]">{metCount}/{conditions.length} conditions</span>
              </div>
              <div className="h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-[width] duration-[800ms]"
                  style={{ width: `${(metCount / conditions.length) * 100}%`, background: 'linear-gradient(90deg,#0EA5E9,#10B981)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Parties */}
        <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5 mb-5">
          <div className="flex items-center">
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white mx-auto mb-2"
                style={{ background: 'linear-gradient(135deg,#0EA5E9,#0284C7)' }}>AY</div>
              <div className="text-[13px] font-bold text-slate-900">{tx.farmer}</div>
              <div className="text-[11px] text-slate-400">Farmer · {tx.farmerLocation}</div>
            </div>

            <div className="flex-[2] flex items-center gap-0 px-2">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#E0F2FE,#E2E8F0)' }} />
              <div className="px-3 py-[6px] bg-slate-900 rounded-full flex items-center gap-[5px]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="4" width="10" height="7" rx="1.5" stroke="white" strokeWidth="1.2" />
                  <path d="M1 6h10" stroke="white" strokeWidth="1.2" />
                  <circle cx="3.5" cy="8.5" r="0.8" fill="white" />
                </svg>
                <span className="text-[10px] font-bold text-white tracking-[0.04em]">ESCROW</span>
              </div>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#E2E8F0,#E0F2FE)' }} />
            </div>

            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white mx-auto mb-2"
                style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>CO</div>
              <div className="text-[13px] font-bold text-slate-900">{tx.buyer}</div>
              <div className="text-[11px] text-slate-400">Buyer · {tx.buyerCompany}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
            {[{ label: 'Transaction ID', value: tx.id },{ label: 'Created', value: tx.created },{ label: 'Expected', value: tx.expected }].map(d => (
              <div key={d.label} className="text-center">
                <div className="text-[11px] text-slate-400 font-medium">{d.label}</div>
                <div className="text-[13px] font-bold text-slate-900 mt-0.5">{d.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Release conditions */}
        <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden mb-5">
          <div className="px-5 pt-5 pb-0">
            <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-1">Release Conditions</div>
            <div className="text-[13px] text-slate-400">All conditions must be met before funds are released</div>
          </div>
          <div className="px-5 pb-5 pt-3">
            {conditions.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-b-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                  c.met ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {c.met ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">{c.label}</div>
                  <div className="text-xs text-slate-400">{c.detail}</div>
                </div>
                {c.met && (
                  <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700">Done</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5 mb-5">
          <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-4">Transaction Timeline</div>
          <div className="flex flex-col">
            {[
              { icon: '₦',  label: 'Payment deposited to escrow', desc: `₦${tx.amount.toLocaleString()} received · ${tx.created}`, state: 'done' },
              { icon: '🔬', label: 'AI quality verification',     desc: 'Grade A confirmed · 97.3% confidence', state: 'done' },
              { icon: '🚚', label: 'Grain dispatched',            desc: 'GPS tracking active · En route to Lagos', state: 'done' },
              { icon: '📦', label: 'Delivery to warehouse',       desc: 'ETA: Tomorrow, 11:30 AM', state: 'pending' },
              { icon: '✓',  label: 'Funds released to farmer',   desc: 'Automatic upon all conditions met', state: 'locked' },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 py-5 border-b border-slate-100 last:border-b-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base ${
                  s.state === 'done'    ? 'bg-emerald-50 text-emerald-500 border border-[#A7F3D0]' :
                  s.state === 'pending' ? 'bg-sky-50 text-sky-500 border border-sky-100' :
                  'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {s.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 mb-[3px]">{s.label}</div>
                  <div className="text-[13px] text-slate-400">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Release button */}
        {!released && (
          <button
            className="w-full py-[18px] border-0 rounded-[20px] text-base font-bold text-white cursor-pointer transition-all duration-[220ms] tracking-[-0.01em] mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg,#10B981 0%,#059669 100%)',
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
            }}
            disabled={!releaseReady || releasing}
            onClick={handleRelease}
          >
            {releasing ? (
              <span className="flex items-center gap-[10px] justify-center">
                <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />
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
          <div className="flex gap-3 mt-6">
            <button
              className="inline-flex items-center justify-center gap-2 flex-1 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
              onClick={() => onNavigate('buyer-dashboard')}
            >
              Back to Dashboard
            </button>
            <button className="inline-flex items-center justify-center gap-2 flex-1 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 bg-sky-500 text-white cursor-pointer transition-all duration-[220ms] shadow-sky hover:bg-sky-600">
              Download Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
