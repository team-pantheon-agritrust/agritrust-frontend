import { useState } from 'react'

type Screen = 'landing' | 'farmer-dashboard' | 'grain-scan' | 'scan-results' | 'buyer-dashboard' | 'payment'

interface Props {
  onNavigate: (s: Screen) => void
}

const result = {
  grain: 'Yellow Maize', location: 'Kano, Kano State, NG', weight: '500 kg',
  scanDate: '10 May 2025, 14:32', grade: 'A', gradeLabel: 'Premium Grade',
  confidence: 97.3, moisture: 12.4, protein: 9.8, purity: 98.2,
  price: 87500, avgPrice: 78200,
  defects: [
    { name: 'Mold / Fungal',   pct: 0.8, color: '#EF4444' },
    { name: 'Pest damage',     pct: 0.5, color: '#D97706' },
    { name: 'Foreign matter',  pct: 0.3, color: '#94A3B8' },
    { name: 'Broken kernels',  pct: 1.2, color: '#F59E0B' },
    { name: 'Discolouration',  pct: 0.4, color: '#6366F1' },
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
      {/* Header */}
      <div className="h-16 bg-white border-b border-slate-900/[0.06] flex items-center px-8 gap-4 sticky top-0 z-50">
        <button
          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          onClick={() => onNavigate('grain-scan')}
        >
          ← Back
        </button>
        <div className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">AI Analysis Results</div>
        <div className="flex-1" />
        <button className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10v2h10v-2M7 2v7M4 6l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Export PDF
        </button>
        <button className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="4" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="10" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="10" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5.3 6.3l3.4-2M5.3 7.7l3.4 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          Share
        </button>
      </div>

      <div className="max-w-[720px] mx-auto p-10 px-8">
        {/* Hero result */}
        <div className="rounded-[28px] p-8 text-white mb-6 relative overflow-hidden animate-fade-up"
          style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E293B 100%)' }}>
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(14,165,233,0.15) 0%,transparent 70%)' }}
          />
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-[14px]">
              <div className="w-[72px] h-[72px] rounded-full border-[3px] border-white/20 flex items-center justify-center text-[32px] font-black tracking-[-0.02em] text-white bg-white/10 backdrop-blur shrink-0">
                {result.grade}
              </div>
              <div>
                <div className="text-2xl font-extrabold tracking-[-0.03em] mb-1">{result.grain}</div>
                <div className="text-sm text-white/50">{result.gradeLabel} · {result.location}</div>
                <div className="flex gap-2 mt-[10px]">
                  {[result.weight, result.scanDate].map(tag => (
                    <span key={tag} className="px-[10px] py-[3px] bg-white/10 rounded-full text-[11px] font-semibold text-white/60">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/40 font-medium">Recommended Price</div>
              <div className="text-[32px] font-extrabold tracking-[-0.04em] text-white leading-none">₦{result.price.toLocaleString()}</div>
              <div className="text-xs text-white/40 mt-0.5">per {result.weight}</div>
              <div className="flex items-center gap-[5px] justify-end mt-[6px]">
                <span className="text-[11px] bg-emerald-500/15 text-[#34D399] px-2 py-[2px] rounded-full font-bold">+{premium}% vs avg</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Moisture', value: result.moisture, unit: '%', status: result.moisture < 13 ? 'Optimal' : 'High', ok: result.moisture < 13 },
              { label: 'Protein',  value: result.protein,  unit: '%', status: result.protein > 9   ? 'Good' : 'Fair',    ok: result.protein > 9 },
              { label: 'Purity',   value: result.purity,   unit: '%', status: result.purity > 97   ? 'Excellent' : 'Good', ok: result.purity > 97 },
            ].map(m => (
              <div key={m.label} className="bg-white/[0.07] border border-white/10 rounded-[10px] p-[14px]">
                <div className="text-[11px] text-white/40 font-medium mb-[6px]">{m.label}</div>
                <div className="text-xl font-bold text-white tracking-[-0.02em]">
                  {m.value}<span className="text-[11px] text-white/40">{m.unit}</span>
                </div>
                <div className="text-[11px] mt-1 font-semibold" style={{ color: m.ok ? '#34D399' : '#FCD34D' }}>{m.status}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 px-4 bg-white/[0.06] rounded-[10px] border border-white/[0.08]">
            <div className="flex justify-between mb-2 items-center">
              <span className="text-xs text-white/45 font-medium">AI Confidence Score</span>
              <span className="text-sm font-bold text-[#34D399]">{result.confidence}%</span>
            </div>
            <div className="h-[6px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${result.confidence}%`, background: 'linear-gradient(90deg,#10B981,#34D399)' }} />
            </div>
          </div>
        </div>

        {/* Defect breakdown */}
        <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-6 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-base font-bold tracking-[-0.02em] text-slate-900">Defect Analysis</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Total defects: <span className="font-bold text-slate-900">3.2%</span> — within Grade A threshold
              </div>
            </div>
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">Grade A</span>
          </div>

          {result.defects.map(d => (
            <div key={d.name} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-[10px] h-[10px] rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-sm font-medium text-slate-900">{d.name}</span>
                </div>
                <span className="text-[13px] font-bold" style={{ color: d.pct > 1.5 ? '#EF4444' : d.pct > 0.7 ? '#D97706' : '#64748B' }}>{d.pct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-[width] duration-[1000ms]" style={{ width: `${(d.pct / 5) * 100}%`, background: d.color }} />
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 px-[14px] bg-emerald-50 rounded-[10px] border border-[#A7F3D0] flex gap-[10px] items-start">
            <span className="text-emerald-500 text-base">✓</span>
            <div className="text-[13px] text-emerald-900 leading-[1.5]">
              <strong>Within Grade A limits.</strong> Total defect rate (3.2%) is below the 5% threshold for premium grading. Suitable for direct export.
            </div>
          </div>
        </div>

        {/* Price comparison */}
        <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-6 mb-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-bold tracking-[-0.02em] text-slate-900">Market Price Comparison</div>
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-sand text-slate-600">Kano Exchange · Live</span>
          </div>

          <div className="flex items-end gap-4 p-5 bg-slate-50 rounded-[10px] border border-slate-100">
            {[
              { label: 'Low Quality (C)',    value: '₦48,200',                     height: 35, color: '#E2E8F0', highlight: false },
              { label: 'Market Average (B)', value: '₦78,200',                     height: 58, color: '#E0F2FE', highlight: false },
              { label: 'Your Grain (A)',     value: `₦${result.price.toLocaleString()}`, height: 80, color: '#0EA5E9', highlight: true },
            ].map(b => (
              <div key={b.label} className="flex-1 text-center">
                <div className="flex items-end justify-center h-20 mb-2">
                  <div className="w-9 rounded-t-[4px]"
                    style={{
                      height: b.height,
                      background: b.highlight ? 'linear-gradient(180deg,#0EA5E9 0%,#0284C7 100%)' : b.color,
                      boxShadow: b.highlight ? '0 4px 14px rgba(14,165,233,0.25)' : 'none',
                    }}
                  />
                </div>
                <div className="text-xs font-medium mb-1" style={{ color: b.highlight ? '#0284C7' : '#94A3B8' }}>{b.label}</div>
                <div className="text-base font-bold tracking-[-0.02em]" style={{ color: b.highlight ? '#0F172A' : '#64748B' }}>{b.value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-[6px] px-4 py-2 bg-emerald-50 border border-[#A7F3D0] rounded-full text-[13px] font-bold text-emerald-700 mt-4">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2l1.6 3.2L12 6l-2.5 2.4.6 3.4L7 10.3l-3.1 1.5.6-3.4L2 6l3.4-.8L7 2z" fill="currentColor" /></svg>
            You're earning <strong>₦{(result.price - result.avgPrice).toLocaleString()}</strong> more than market average
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <button
            className="inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 text-white cursor-pointer transition-all duration-[220ms] shadow-sm hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E293B 100%)' }}
            onClick={handlePayment}
            disabled={paymentTriggered}
          >
            {paymentTriggered ? (
              <><div className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />Preparing…</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M1 7h14" stroke="currentColor" strokeWidth="1.5" /></svg>Generate Payment Link</>
            )}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
            onClick={() => onNavigate('buyer-dashboard')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Browse Buyers
          </button>
        </div>

        <div className="flex justify-center">
          <button
            className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-400 cursor-pointer transition-all duration-[220ms] hover:text-slate-600"
            onClick={() => onNavigate('grain-scan')}
          >
            ← Scan another batch
          </button>
        </div>
      </div>
    </div>
  )
}
