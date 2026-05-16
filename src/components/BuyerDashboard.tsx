import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const GRADE_COLOR: Record<string, string> = {
  A: "#10B981",
  B: "#E0185B",
  C: "#D97706",
  D: "#EF4444",
};

const GRAIN_EMOJI: Record<string, string> = {
  Maize: "🌽",
  Rice: "🍚",
  Sorghum: "🌾",
};

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  PENDING: { text: "Pending payment", cls: "bg-amber-50 text-amber-600" },
  PAID: { text: "Payment received", cls: "bg-[#fdf0f5] text-[#E0185B]" },
  RELEASED: { text: "Funds released", cls: "bg-emerald-50 text-emerald-700" },
  DISPUTED: { text: "Disputed", cls: "bg-red-50 text-red-600" },
  REFUNDED: { text: "Refunded", cls: "bg-slate-100 text-slate-500" },
};

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { scanResult, transactionRef, transactionStatus } = useAppContext();

  const hasActiveTx = !!(scanResult && transactionRef && transactionStatus);
  const statusLabel = transactionStatus
    ? STATUS_LABEL[transactionStatus]
    : null;

  return (
    <div>
      <div className="bg-white border-b border-slate-900/[0.06] flex flex-col sm:flex-row sm:items-center p-4 sm:px-8 gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3 flex-1 py-3 sm:py-0">
          <div className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.01em] text-slate-900">
            Buyer Dashboard
          </div>
        </div>
        <div className="flex items-center gap-3 pb-3 sm:pb-0">
          <button
            className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
            onClick={() => navigate("/verify")}
          >
            Verify Delivery
          </button>
          {hasActiveTx && (
            <button
              className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-[#E0185B] text-white cursor-pointer transition-all duration-[220ms]  hover:bg-[#c8144f] hover:-translate-y-px"
              onClick={() => navigate("/buyer/payment")}
            >
              View Payment
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-[1200px]">
        {/* Stat cards — derived from active transaction context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-6 bg-white border border-slate-900/[0.06] rounded-[20px]">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs font-medium tracking-[0.04em] uppercase text-slate-400">
                Active Offers
              </div>
              <div className="w-2 h-2 rounded-full mt-[3px] bg-amber-400" />
            </div>
            <div className="text-[28px] font-bold tracking-[-0.03em] text-slate-900 leading-none mb-[6px]">
              {hasActiveTx ? "1" : "0"}
            </div>
            <div className="text-xs font-medium text-slate-400">
              {hasActiveTx && statusLabel
                ? statusLabel.text
                : "No active offers"}
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-900/[0.06] rounded-[20px]">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs font-medium tracking-[0.04em] uppercase text-slate-400">
                In Escrow
              </div>
              <div className="w-2 h-2 rounded-full mt-[3px] bg-[#E0185B]" />
            </div>
            <div className="text-[28px] font-bold tracking-[-0.03em] text-slate-900 leading-none mb-[6px]">
              {hasActiveTx ? scanResult!.priceInfo.totalAmount : "—"}
            </div>
            <div className="text-xs font-medium text-slate-400">
              {hasActiveTx ? "1 transaction pending" : "No escrow active"}
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-900/[0.06] rounded-[20px]">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs font-medium tracking-[0.04em] uppercase text-slate-400">
                AI Grade
              </div>
              <div
                className="w-2 h-2 rounded-full mt-[3px]"
                style={{
                  background: scanResult
                    ? (GRADE_COLOR[scanResult.ai.grade] ?? "#94a3b8")
                    : "#94a3b8",
                }}
              />
            </div>
            <div className="text-[28px] font-bold tracking-[-0.03em] text-slate-900 leading-none mb-[6px]">
              {scanResult ? `Grade ${scanResult.ai.grade}` : "—"}
            </div>
            <div className="text-xs font-medium text-slate-400">
              {scanResult
                ? `${scanResult.ai.confidence}% confidence`
                : "No scan yet"}
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-900/[0.06] rounded-[20px]">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs font-medium tracking-[0.04em] uppercase text-slate-400">
                AI Score
              </div>
              <div className="w-2 h-2 rounded-full mt-[3px] bg-[#E0185B]" />
            </div>
            <div className="text-[28px] font-bold tracking-[-0.03em] text-slate-900 leading-none mb-[6px]">
              {scanResult ? scanResult.ai.aiScore.toFixed(1) : "—"}
            </div>
            <div className="text-xs font-medium text-slate-400">
              {scanResult ? scanResult.ai.reasoning : "No analysis yet"}
            </div>
          </div>
        </div>

        <div className="grid gap-6 items-start lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            {/* Current available offer from context */}
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden">
              <div className="px-5 pt-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div>
                    <div className="text-base font-bold tracking-[-0.02em] text-slate-900">
                      Available Grain
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      AI-verified offers
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-2 pb-2">
                {scanResult ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-[10px] bg-slate-50">
                    <div className="w-11 h-11 rounded-[10px] bg-white border border-slate-100 flex items-center justify-center text-xl shrink-0 shadow-sm">
                      {GRAIN_EMOJI[
                        scanResult.priceInfo.quantity?.split(" ")[1]
                      ] ?? "🌾"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 tracking-[-0.01em]">
                        {scanResult.priceInfo.quantity}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Ref: {scanResult.transactionRef} ·{" "}
                        {scanResult.priceInfo.source}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="w-full sm:w-auto">
                        <div className="flex flex-wrap gap-[6px] mb-1 sm:justify-end">
                          <span
                            className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[11px] font-semibold rounded-full"
                            style={{
                              background:
                                (GRADE_COLOR[scanResult.ai.grade] ??
                                  "#94a3b8") + "18",
                              color:
                                GRADE_COLOR[scanResult.ai.grade] ?? "#64748b",
                            }}
                          >
                            Grade {scanResult.ai.grade}
                          </span>
                          <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[11px] font-semibold rounded-full bg-amber-100 text-amber-600">
                            Pending Payment
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end items-center">
                          <div className="text-xs text-slate-400">
                            {scanResult.priceInfo.unitPrice}/kg
                          </div>
                          <div className="text-[15px] font-bold text-slate-900">
                            {scanResult.priceInfo.totalAmount}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-[6px] shrink-0">
                        <button
                          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-xs font-semibold rounded-[6px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
                          onClick={() => navigate("/farmer/results")}
                        >
                          Details
                        </button>
                        <button
                          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-xs font-semibold rounded-[6px] border-0 bg-[#E0185B] text-white cursor-pointer transition-all duration-[220ms] hover:bg-[#c8144f]"
                          onClick={() => navigate("/buyer/payment")}
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-10 px-4 text-center">
                    <div className="text-sm font-semibold text-slate-900">
                      No offers available
                    </div>
                    <div className="text-xs text-slate-400">
                      Grain offers appear here once a farmer completes an AI
                      scan
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      Have a transaction reference?{" "}
                      <button
                        className="text-[#E0185B] font-semibold border-0 bg-transparent cursor-pointer p-0"
                        onClick={() => navigate("/verify")}
                      >
                        Verify delivery →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI quality breakdown when scan exists */}
            {scanResult && (
              <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
                <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-4">
                  AI Quality Breakdown
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Model Score",
                      value: scanResult.ai.breakdown.model_score.toFixed(1),
                    },
                    {
                      label: "Anomaly Score",
                      value: scanResult.ai.breakdown.anomaly_score.toFixed(1),
                    },
                    {
                      label: "Defect Assessment",
                      value: scanResult.ai.breakdown.defect_assessment,
                    },
                    {
                      label: "Moisture",
                      value: scanResult.ai.breakdown.moisture_assessment,
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="bg-slate-50 rounded-[10px] p-3"
                    >
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.04em] mb-1">
                        {m.label}
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
                {scanResult.ai.defects.length > 0 && (
                  <div className="mt-3 px-3 py-2 bg-red-50 rounded-[8px]">
                    <div className="text-[11px] font-semibold text-red-600 mb-1">
                      Defects Detected
                    </div>
                    <div className="text-xs text-red-700">
                      {scanResult.ai.defects.join(", ")}
                    </div>
                  </div>
                )}
                {scanResult.ai.defects.length === 0 && (
                  <div className="mt-3 px-3 py-2 bg-emerald-50 rounded-[8px]">
                    <div className="text-xs text-emerald-700 font-semibold">
                      No defects detected — clean sample
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {/* Active escrow from context */}
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
              <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-4">
                Escrow Status
              </div>
              {hasActiveTx ? (
                <>
                  <div
                    className="py-[14px] cursor-pointer"
                    onClick={() => navigate("/buyer/payment")}
                  >
                    <div className="flex justify-between mb-1">
                      <div className="text-[11px] font-bold text-slate-400 tracking-[0.04em] font-mono">
                        {transactionRef}
                      </div>
                      <div className="text-[15px] font-bold text-slate-900">
                        {scanResult!.priceInfo.totalAmount}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      {scanResult!.priceInfo.quantity}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-[6px] bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full w-[25%]"
                          style={{
                            background:
                              "linear-gradient(90deg,#FF4C1D,#9B0063)",
                          }}
                        />
                      </div>
                      <div className="text-xs font-semibold text-[#E0185B]">
                        25%
                      </div>
                    </div>
                    {statusLabel && (
                      <div
                        className="text-[11px] mt-1 font-semibold"
                        style={{ color: "inherit" }}
                      >
                        <span
                          className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-semibold ${statusLabel.cls}`}
                        >
                          {statusLabel.text}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50 w-full mt-2"
                    onClick={() => navigate("/buyer/payment")}
                  >
                    Manage Escrow →
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <div className="text-sm font-semibold text-slate-900">
                    No active escrow
                  </div>
                  <div className="text-xs text-slate-400">
                    Escrow activates once you make a payment
                  </div>
                </div>
              )}
            </div>

            {/* Payment instructions if active */}
            {hasActiveTx && (
              <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
                <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-3">
                  Payment Instructions
                </div>
                <div className="flex flex-col gap-2 text-[13px]">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Bank</span>
                    <span className="font-semibold text-slate-900">
                      {scanResult!.paymentDetails.bank}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Account</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {scanResult!.paymentDetails.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Amount</span>
                    <span className="font-bold text-slate-900">
                      {scanResult!.priceInfo.totalAmount}
                    </span>
                  </div>
                </div>
                <div className="mt-3 px-3 py-2 bg-[#fdf0f5] rounded-[8px] text-xs text-[#a01040]">
                  {scanResult!.paymentDetails.instructions}
                </div>
                <div className="mt-3 px-3 py-2 bg-slate-50 rounded-[8px] text-xs text-slate-500">
                  Funds are securely held until delivery is verified.
                </div>
              </div>
            )}

            <button
              className="w-full py-3 rounded-[14px] bg-slate-900 text-white text-[14px] font-semibold border-0 cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => navigate("/verify")}
            >
              Verify a Delivery →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
