import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { getTrustScore } from '../api/squad'
import type { TrustScoreResponse } from '../types'

const CIRCUMFERENCE = 2 * Math.PI * 52

const gradeColors: Record<string, string> = {
  BRONZE:   '#CD7F32',
  SILVER:   '#94A3B8',
  GOLD:     '#D97706',
  PLATINUM: '#E0185B',
}

export default function FarmerProfile() {
  const navigate = useNavigate()
  const { farmerProfile } = useAppContext()

  const [data, setData] = useState<TrustScoreResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [gaugeAnimated, setGaugeAnimated] = useState(false)

  useEffect(() => {
    if (!farmerProfile?.phone) {
      setLoading(false)
      setError('No farmer profile found. Please complete onboarding first.')
      return
    }

    getTrustScore(farmerProfile.phone)
      .then(res => {
        setData(res)
        setTimeout(() => setGaugeAnimated(true), 200)
      })
      .catch(() => setError('Failed to load trust score. Please try again.'))
      .finally(() => setLoading(false))
  }, [farmerProfile])

  const score = data?.trustScore ?? 0
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
  const honestRate = data ? Math.round((data.honestTrades / Math.max(data.totalTrades, 1)) * 100) : 0
  const gradeColor = data ? (gradeColors[data.grade] ?? '#64748B') : '#64748B'

  return (
    <div>
      <div className="h-16 bg-white border-b border-slate-900/[0.06] flex items-center px-8 gap-4 sticky top-0 z-50">
        <button
          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          onClick={() => navigate('/farmer')}
        >
          ← Back
        </button>
        <div className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">Farmer Profile</div>
        <div className="flex-1" />
        {data && (
          <span
            className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-bold rounded-full"
            style={{ background: gradeColor + '15', color: gradeColor }}
          >
            {data.grade}
          </span>
        )}
      </div>

      <div className="max-w-[560px] mx-auto p-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-[#E0185B] rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="px-5 py-4 bg-red-50 border border-red-200 rounded-[14px] text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {data && !loading && (
          <>
            {/* Profile header */}
            <div className="bg-white border border-slate-900/[0.06] rounded-[24px] shadow-sm p-7 mb-5 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4C1D] to-[#9B0063] flex items-center justify-center text-xl font-bold text-white mb-3">
                {farmerProfile?.firstName?.[0]}{farmerProfile?.lastName?.[0]}
              </div>
              <div className="text-lg font-bold text-slate-900 tracking-[-0.02em]">
                {farmerProfile?.firstName} {farmerProfile?.lastName}
              </div>
              <div className="text-sm text-slate-400 mt-0.5">{farmerProfile?.phone}</div>
            </div>

            {/* Trust gauge */}
            <div className="bg-white border border-slate-900/[0.06] rounded-[24px] shadow-sm p-7 mb-5 flex flex-col items-center">
              <div className="text-[12px] font-bold tracking-[0.05em] uppercase text-slate-400 mb-4">Trust Score</div>

              <svg width="180" height="180" viewBox="0 0 120 120" className="overflow-visible">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="url(#profileGaugeGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={gaugeAnimated ? offset : CIRCUMFERENCE}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
                <defs>
                  <linearGradient id="profileGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={gradeColor} />
                    <stop offset="100%" stopColor={gradeColor + 'CC'} />
                  </linearGradient>
                </defs>
                <text x="60" y="56" textAnchor="middle" style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.04em', fill: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
                  {score}
                </text>
                <text x="60" y="70" textAnchor="middle" style={{ fontSize: 12, fill: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
                  of 100
                </text>
              </svg>

              <div
                className="mt-2 px-4 py-[6px] rounded-full text-sm font-bold"
                style={{ background: gradeColor + '15', color: gradeColor }}
              >
                {data.grade} TIER
              </div>

              <p className="text-xs text-slate-400 text-center mt-3 max-w-[280px] leading-[1.6]">
                Higher trust score = lower platform fees. Keep trading honestly to improve your tier.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <StatBox label="Total Trades" value={String(data.totalTrades)} sub="All time" />
              <StatBox label="Honest Trades" value={String(data.honestTrades)} sub={`${honestRate}% honesty rate`} color="#10B981" />
              <StatBox label="Platform Fee" value={`${data.platformFeePercent}%`} sub="Per transaction" />
              <StatBox label="Honesty Rate" value={`${honestRate}%`} sub="Quality consistency" color={honestRate >= 90 ? '#10B981' : '#D97706'} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="bg-white border border-slate-900/[0.06] rounded-[20px] p-5">
      <div className="text-[11px] font-medium tracking-[0.04em] uppercase text-slate-400 mb-2">{label}</div>
      <div className="text-[28px] font-bold tracking-[-0.03em] leading-none mb-1" style={{ color: color ?? '#0F172A' }}>{value}</div>
      <div className="text-[11px] text-slate-400">{sub}</div>
    </div>
  )
}
