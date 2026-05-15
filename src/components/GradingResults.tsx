import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function formatDefectName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function GradingResults() {
  const navigate = useNavigate();
  const { scanResult, setTransactionRef } = useAppContext();
  const [paymentTriggered, setPaymentTriggered] = useState(false);

  if (!scanResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-lg font-semibold text-slate-900">
          No scan result found
        </div>
        <p className="text-sm text-slate-400">
          Please complete a grain scan first.
        </p>
        <button
          className="inline-flex items-center justify-center gap-2 py-[10px] px-5 text-[14px] font-semibold rounded-[10px] border-0 bg-sky-500 text-white cursor-pointer hover:bg-sky-600 transition-colors"
          onClick={() => navigate("/farmer/scan")}
        >
          Scan Grain
        </button>
      </div>
    );
  }

  const { ai, priceInfo, paymentDetails, transactionRef } = scanResult;

  const gradeColors: Record<string, string> = {
    A: "#10B981",
    B: "#0EA5E9",
    C: "#D97706",
    D: "#EF4444",
  };
  const gradeColor = gradeColors[ai.grade] ?? "#64748B";

  function handlePayment() {
    setPaymentTriggered(true);
    setTransactionRef(transactionRef);
    setTimeout(() => navigate("/buyer/payment"), 400);
  }

  return (
    <div>
      <div className="bg-white border-b border-slate-900/[0.06] flex flex-col sm:flex-row sm:items-center px-4 sm:px-8 gap-3 sticky top-0 z-50">
        <button
          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          onClick={() => navigate("/farmer/scan")}
        >
          ← Back
        </button>
        <div className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.01em] text-slate-900">
          AI Assessment Results
        </div>
        <div className="flex-1" />
        <span className="inline-flex items-center mb-2 gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 self-start sm:self-auto">
          Grade {ai.grade}
        </span>
      </div>

      <div className="max-w-[720px] mx-auto p-4 sm:p-8 sm:px-8">
        {/* Hero card */}
        <div
          className="rounded-[28px] p-5 sm:p-8 text-white mb-6 relative overflow-hidden animate-fade-up"
          style={{
            background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)",
          }}
        >
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-6">
            <div className="flex items-start gap-[14px]">
              <div
                className="w-[72px] h-[72px] rounded-full border-[3px] border-white/20 flex items-center justify-center text-[32px] font-black tracking-[-0.02em] text-white bg-white/10 backdrop-blur shrink-0"
                style={{ borderColor: gradeColor + "60" }}
              >
                {ai.grade}
              </div>
              <div>
                <div className="text-[22px] sm:text-2xl font-extrabold tracking-[-0.03em] mb-1">
                  AI Assessment
                </div>
                <div className="text-sm text-white/50">
                  Grade {ai.grade} · {ai.breakdown.defect_assessment} Defects ·{" "}
                  {ai.breakdown.moisture_assessment} Moisture
                </div>
                <div className="flex flex-wrap gap-2 mt-[10px]">
                  <span className="px-[10px] py-[3px] bg-white/10 rounded-full text-[11px] font-semibold text-white/60">
                    {priceInfo.quantity}
                  </span>
                  <span className="px-[10px] py-[3px] bg-white/10 rounded-full text-[11px] font-semibold text-white/60">
                    Score: {ai.aiScore}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-white/40 font-medium">
                Total Amount
              </div>
              <div className="text-[28px] sm:text-[32px] font-extrabold tracking-[-0.04em] text-white leading-none">
                {priceInfo.totalAmount}
              </div>
              <div className="text-xs text-white/40 mt-0.5">
                {priceInfo.unitPrice} / kg · {priceInfo.source}
              </div>
            </div>
          </div>

          {/* AI confidence */}
          <div className="p-3 px-4 bg-white/[0.06] rounded-[10px] border border-white/[0.08] mb-4">
            <div className="flex justify-between mb-2 items-center">
              <span className="text-xs text-white/45 font-medium">
                AI Confidence
              </span>
              <span className="text-sm font-bold text-[#34D399]">
                {ai.confidence}%
              </span>
            </div>
            <div className="h-[6px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${ai.confidence}%`,
                  background: "linear-gradient(90deg,#10B981,#34D399)",
                }}
              />
            </div>
          </div>

          {/* Reasoning */}
          {ai.reasoning && (
            <div className="p-3 px-4 bg-white/[0.04] rounded-[10px] border border-white/[0.06]">
              <div className="text-[11px] text-white/35 font-medium mb-1 uppercase tracking-[0.05em]">
                AI Reasoning
              </div>
              <p className="text-[13px] text-white/60 leading-[1.55]">
                {ai.reasoning}
              </p>
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div
          className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-6 mb-6 animate-fade-up"
          style={{ animationDelay: "0.08s" }}
        >
          <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-4">
            AI Assessment Breakdown
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { label: "Model Score", value: String(ai.breakdown.model_score) },
              {
                label: "Anomaly Score",
                value: String(ai.breakdown.anomaly_score),
              },
              {
                label: "Defect Assessment",
                value: ai.breakdown.defect_assessment,
              },
              { label: "Moisture", value: ai.breakdown.moisture_assessment },
              {
                label: "Dark Blobs",
                value: String(ai.breakdown.dark_blobs_detected),
              },
              { label: "AI Score", value: String(ai.aiScore) },
            ].map((b) => (
              <div key={b.label} className="p-3 bg-slate-50 rounded-[10px]">
                <div className="text-[11px] text-slate-400 font-medium mb-1">
                  {b.label}
                </div>
                <div className="text-[15px] font-bold text-slate-900">
                  {b.value}
                </div>
              </div>
            ))}
          </div>

          {ai.defects && ai.defects.length > 0 && (
            <div>
              <div className="text-[13px] font-semibold text-slate-900 mb-2">
                Detected Defects
              </div>
              <div className="flex flex-wrap gap-2">
                {ai.defects.map((d) => (
                  <span
                    key={d}
                    className="px-[10px] py-[3px] bg-red-50 border border-red-100 rounded-full text-[12px] font-semibold text-red-600"
                  >
                    {formatDefectName(d)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(!ai.defects || ai.defects.length === 0) && (
            <div className="p-3 px-[14px] bg-emerald-50 rounded-[10px] border border-[#A7F3D0] flex gap-[10px] items-start">
              <span className="text-emerald-500 text-base">✓</span>
              <div className="text-[13px] text-emerald-900 leading-[1.5]">
                <strong>No defects detected.</strong> Grain sample passed all
                quality checks.
              </div>
            </div>
          )}
        </div>

        {/* Payment details */}
        <div
          className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-6 mb-6 animate-fade-up"
          style={{ animationDelay: "0.12s" }}
        >
          <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-4">
            Payment Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-slate-50 rounded-[10px]">
              <div className="text-[11px] text-slate-400 font-medium mb-1">
                Bank
              </div>
              <div className="text-[14px] font-bold text-slate-900">
                {paymentDetails.bank}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-[10px]">
              <div className="text-[11px] text-slate-400 font-medium mb-1">
                Account Number
              </div>
              <div className="text-[14px] font-bold text-slate-900 font-mono">
                {paymentDetails.accountNumber}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-[10px] col-span-2">
              <div className="text-[11px] text-slate-400 font-medium mb-1">
                Instructions
              </div>
              <div className="text-[14px] font-semibold text-slate-900">
                {paymentDetails.instructions}
              </div>
            </div>
          </div>

          <div className="p-3 px-4 bg-sky-50 border border-sky-100 rounded-[10px] text-[13px] text-sky-800">
            Transaction Ref:{" "}
            <span className="font-mono font-bold text-sky-900">
              {transactionRef}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 animate-fade-up"
          style={{ animationDelay: "0.16s" }}
        >
          <button
            className="inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 text-white cursor-pointer transition-all duration-[220ms] shadow-sm hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{
              background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)",
            }}
            onClick={handlePayment}
            disabled={paymentTriggered}
          >
            {paymentTriggered ? (
              <>
                <div className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />
                Preparing…
              </>
            ) : (
              <>Proceed to Payment</>
            )}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
            onClick={() => navigate("/buyer")}
          >
            Browse Buyers
          </button>
        </div>

        <div className="flex justify-center">
          <button
            className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-400 cursor-pointer transition-all duration-[220ms] hover:text-slate-600"
            onClick={() => navigate("/farmer/scan")}
          >
            ← Scan another batch
          </button>
        </div>
      </div>
    </div>
  );
}
