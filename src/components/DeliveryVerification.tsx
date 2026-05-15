import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { verifyDelivery } from '../api/squad'
import type { VerifyDeliveryResponse } from '../types'

export default function DeliveryVerification() {
  const navigate = useNavigate()
  const { transactionRef } = useAppContext()

  const [txRef, setTxRef] = useState(transactionRef ?? '')
  const [deliveryGrade, setDeliveryGrade] = useState('A')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyDeliveryResponse | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!txRef.trim()) {
      setError('Transaction reference is required.')
      return
    }

    setLoading(true)
    try {
      const res = await verifyDelivery(txRef.trim(), deliveryGrade)
      setResult(res)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Verification failed. Please check the transaction reference and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900 mb-2">Verify Delivery</h1>
          <p className="text-sm text-slate-500">Confirm grain delivery and release escrow funds to the farmer.</p>
        </div>

        {result ? (
          <ResultCard result={result} onReset={() => setResult(null)} onDashboard={() => navigate('/buyer')} />
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-900/[0.06] rounded-[24px] shadow-sm p-7 flex flex-col gap-5">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-[6px]">
                Transaction reference <span className="text-sky-500">*</span>
              </label>
              <input
                type="text"
                value={txRef}
                onChange={e => setTxRef(e.target.value)}
                placeholder="GT_..."
                className="w-full px-[14px] py-[10px] text-sm text-slate-900 bg-white border-[1.5px] border-slate-200 rounded-[10px] outline-none transition focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] placeholder:text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-3">Delivery grade observed</label>
              <div className="grid grid-cols-4 gap-3">
                {['A', 'B', 'C', 'D'].map(g => (
                  <label
                    key={g}
                    className={`flex items-center justify-center py-3 rounded-[10px] border-[1.5px] cursor-pointer font-bold text-lg transition-all duration-200 ${
                      deliveryGrade === g
                        ? 'border-sky-500 bg-sky-50 text-sky-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="grade"
                      value={g}
                      checked={deliveryGrade === g}
                      onChange={() => setDeliveryGrade(g)}
                      className="sr-only"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[10px] text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-[14px] bg-slate-900 text-white text-[15px] font-semibold rounded-[14px] border-0 cursor-pointer transition-all duration-[220ms] hover:bg-slate-800 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</>
              ) : 'Verify Delivery'}
            </button>

            <button
              type="button"
              className="text-center text-sm text-slate-400 border-0 bg-transparent cursor-pointer hover:text-slate-600 transition-colors"
              onClick={() => navigate('/buyer')}
            >
              ← Back to dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function ResultCard({ result, onReset, onDashboard }: { result: VerifyDeliveryResponse; onReset: () => void; onDashboard: () => void }) {
  const isReleased = result.outcome === 'RELEASED'

  return (
    <div className="bg-white border border-slate-900/[0.06] rounded-[24px] shadow-sm p-7 text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 ${
        isReleased ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-amber-50 border-2 border-amber-200'
      }`}>
        {isReleased ? '✓' : '⚠'}
      </div>

      <div className={`text-xl font-extrabold tracking-[-0.03em] mb-2 ${isReleased ? 'text-emerald-700' : 'text-amber-700'}`}>
        {isReleased ? 'Payment Released' : 'Quality Mismatch'}
      </div>

      <p className={`text-sm leading-[1.6] mb-6 ${isReleased ? 'text-emerald-600' : 'text-amber-600'}`}>
        {result.message}
      </p>

      {result.disbursementId && (
        <div className="mb-5 px-4 py-3 bg-slate-50 rounded-[10px] text-[13px] text-slate-500">
          Disbursement ID: <span className="font-mono font-semibold text-slate-900">{result.disbursementId}</span>
        </div>
      )}

      <div className="flex gap-3">
        {!isReleased && (
          <button
            className="flex-1 py-[12px] rounded-[12px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 text-[14px] font-semibold cursor-pointer transition-all hover:bg-slate-50"
            onClick={onReset}
          >
            Try again
          </button>
        )}
        <button
          className="flex-1 py-[12px] rounded-[12px] bg-slate-900 text-white text-[14px] font-semibold border-0 cursor-pointer transition-all hover:bg-slate-800"
          onClick={onDashboard}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}
