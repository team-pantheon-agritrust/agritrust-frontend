import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export default function PaymentEscrow() {
  const navigate = useNavigate()
  const { scanResult, transactionRef } = useAppContext()
  const [copied, setCopied] = useState(false)

  const paymentDetails = scanResult?.paymentDetails
  const priceInfo = scanResult?.priceInfo
  const txRef = transactionRef ?? scanResult?.transactionRef

  function copyAccountNumber() {
    if (!paymentDetails?.accountNumber) return
    navigator.clipboard.writeText(paymentDetails.accountNumber).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      <div className="h-16 bg-white border-b border-slate-900/[0.06] flex items-center px-8 gap-4 sticky top-0 z-50">
        <button
          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          onClick={() => navigate('/buyer')}
        >
          ← Back
        </button>
        <div className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">Escrow & Payment</div>
        <div className="flex-1" />
      </div>

      <div className="max-w-[560px] mx-auto p-10 px-8">
        {/* Hero */}
        <div className="rounded-[28px] p-8 text-center mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0F172A 0%,#0a2240 100%)' }}>
          <div className="absolute -top-[100px] -right-[80px] w-[300px] h-[300px] pointer-events-none"/>

          {priceInfo ? (
            <>
              <div className="text-xs text-white/40 font-medium mb-2 tracking-[0.05em] uppercase">Amount to Transfer</div>
              <div className="text-[52px] font-black tracking-[-0.05em] text-white leading-none mb-2">
                {priceInfo.totalAmount}
              </div>
              <div className="text-[13px] text-white/40">{priceInfo.quantity} · {priceInfo.unitPrice} per kg</div>
            </>
          ) : (
            <div className="text-white/50 py-4">No payment data available. Complete a scan first.</div>
          )}

          <div className="mt-5 p-3 px-4 rounded-[10px] border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <p className="text-[13px] text-white/55 leading-[1.5]">
              Funds are securely held until delivery is verified. Payment will be released to the farmer automatically upon confirmation.
            </p>
          </div>
        </div>

        {paymentDetails && (
          <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-6 mb-5">
            <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-4">Payment Instructions</div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-[10px]">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Bank</div>
                  <div className="text-[14px] font-bold text-slate-900">{paymentDetails.bank}</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-[10px]">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Account Number</div>
                  <div className="text-[16px] font-bold text-slate-900 font-mono tracking-[0.05em]">{paymentDetails.accountNumber}</div>
                </div>
                <button
                  onClick={copyAccountNumber}
                  className="inline-flex items-center gap-[6px] py-[6px] px-3 text-[12px] font-semibold rounded-[8px] bg-transparent border-[1.5px] border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-[10px]">
                <div className="text-[11px] text-slate-400 font-medium mb-1">Instructions</div>
                <div className="text-[14px] font-semibold text-slate-900">{paymentDetails.instructions}</div>
              </div>
            </div>
          </div>
        )}

        {txRef && (
          <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5 mb-5">
            <div className="text-[13px] font-semibold text-slate-900 mb-2">Transaction Reference</div>
            <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-[10px]">
              <span className="font-mono text-[13px] font-bold text-slate-900 break-all">{txRef}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(txRef) }}
                className="inline-flex items-center gap-[6px] py-[6px] px-3 text-[12px] font-semibold rounded-[8px] bg-transparent border-[1.5px] border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-[14px] p-4 flex gap-3 items-start mb-6">
          <span className="text-amber-500 text-base shrink-0">⏳</span>
          <div>
            <div className="text-[13px] font-bold text-amber-800 mb-1">Waiting for payment confirmation</div>
            <p className="text-[12px] text-amber-700 leading-[1.5]">
              After transferring, the farmer will be notified and delivery tracking begins. Use the transaction reference above to verify delivery.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
            onClick={() => navigate('/buyer')}
          >
            Back to Dashboard
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 bg-sky-500 text-white cursor-pointer transition-all duration-[220ms] shadow-sky hover:bg-sky-600"
            onClick={() => navigate('/verify')}
          >
            Verify Delivery
          </button>
        </div>
      </div>
    </div>
  )
}
