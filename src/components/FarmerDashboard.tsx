import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getTrustScore } from "../api/squad";
import type { TrustScoreResponse } from "../types";

const CIRCUMFERENCE = 2 * Math.PI * 52;

const GRAIN_EMOJI: Record<string, string> = {
  Maize: "🌽",
  Rice: "🍚",
  Sorghum: "🌾",
};

const GRADE_COLOR: Record<string, string> = {
  A: "#10B981",
  B: "#E0185B",
  C: "#D97706",
  D: "#EF4444",
};

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { farmerProfile, scanResult, transactionRef, transactionStatus } =
    useAppContext();

  const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
    PENDING: { text: "Awaiting payment", cls: "bg-amber-50 text-amber-600" },
    PAID: { text: "Payment received", cls: "bg-[#fdf0f5] text-[#E0185B]" },
    RELEASED: { text: "Funds released", cls: "bg-emerald-50 text-emerald-700" },
    DISPUTED: { text: "Disputed", cls: "bg-red-50 text-red-600" },
    REFUNDED: { text: "Refunded", cls: "bg-slate-100 text-slate-500" },
  };
  const statusLabel = transactionStatus
    ? STATUS_LABEL[transactionStatus]
    : null;

  const [trustData, setTrustData] = useState<TrustScoreResponse | null>(null);
  const [gaugeAnimated, setGaugeAnimated] = useState(false);
  const [trustLoading, setTrustLoading] = useState(false);

  useEffect(() => {
    if (!farmerProfile?.phone) return;
    setTrustLoading(true);
    getTrustScore(farmerProfile.phone)
      .then((res) => {
        setTrustData(res);
        setTimeout(() => setGaugeAnimated(true), 200);
      })
      .catch(() => setTimeout(() => setGaugeAnimated(true), 200))
      .finally(() => setTrustLoading(false));
  }, [farmerProfile]);

  const trustScore = trustData?.trustScore ?? 0;
  const offset = CIRCUMFERENCE - (trustScore / 100) * CIRCUMFERENCE;

  return (
    <div>
      <div className="bg-white border-b border-slate-900/[0.06] flex flex-col sm:flex-row sm:items-center p-4 sm:px-8 gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3 flex-1 py-3 sm:py-0">
          <div className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.01em] text-slate-900">
            {farmerProfile
              ? `Welcome, ${farmerProfile.firstName}`
              : "Farmer Dashboard"}
          </div>
        </div>
        <div className="flex items-center gap-3 pb-3 sm:pb-0">
          <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-slate-100 text-slate-500">
            <span className="w-[6px] h-[6px] rounded-full bg-current opacity-70" />
            Online
          </span>
          <button
            className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-[#E0185B] text-white cursor-pointer transition-all duration-[220ms]  hover:bg-[#c8144f] hover:-translate-y-px"
            onClick={() => navigate("/farmer/scan")}
          >
            <CameraIcon /> Scan New Grain
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-[1200px]">
        {/* Stat cards — all from real trust score API */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Trust Score"
            value={trustLoading ? "—" : trustScore ? `${trustScore}` : "—"}
            delta={trustData ? `${trustData.grade} tier` : "Loading…"}
            up={trustScore >= 70}
            iconBg="bg-[#fdf0f5]"
            iconColor="text-[#E0185B]"
            icon={<ShieldIcon />}
          />
          <StatCard
            label="Total Trades"
            value={
              trustLoading ? "—" : trustData ? `${trustData.totalTrades}` : "0"
            }
            delta={
              trustData ? `${trustData.honestTrades} honest` : "No trades yet"
            }
            up={(trustData?.honestTrades ?? 0) > 0}
            iconBg="bg-slate-100"
            iconColor="text-slate-500"
            icon={<MoneyIcon />}
          />
          <StatCard
            label="Honest Trades"
            value={
              trustLoading ? "—" : trustData ? `${trustData.honestTrades}` : "0"
            }
            delta={
              trustData && trustData.totalTrades > 0
                ? `${Math.round((trustData.honestTrades / trustData.totalTrades) * 100)}% success rate`
                : "No trades yet"
            }
            up={(trustData?.honestTrades ?? 0) > 0}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            icon={<ScanCountIcon />}
          />
          <StatCard
            label="Platform Fee"
            value={
              trustLoading
                ? "—"
                : trustData
                  ? `${trustData.platformFeePercent}%`
                  : "3%"
            }
            delta={
              trustData
                ? trustData.platformFeePercent <= 2
                  ? "Reduced — high trust"
                  : "Standard rate"
                : "Loading…"
            }
            up={trustData ? trustData.platformFeePercent <= 2 : false}
            iconBg="bg-[#fdf0f5]"
            iconColor="text-[#E0185B]"
            icon={<GradeIcon />}
          />
        </div>

        <div className="grid gap-6 items-start lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            {/* Recent Grain Scans — session scan from context */}
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden">
              <div className="px-5 pt-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div>
                    <div className="text-base font-bold tracking-[-0.02em] text-slate-900">
                      Recent Grain Scans
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      This session
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-[#E0185B] cursor-pointer transition-all duration-[220ms] hover:bg-slate-100"
                    onClick={() => navigate("/farmer/scan")}
                  >
                    New scan →
                  </button>
                </div>
              </div>
              <div className="px-2 pb-2">
                {scanResult ? (
                  <div
                    className="flex flex-col sm:flex-row sm:items-center gap-[12px] px-4 py-[14px] rounded-[10px] cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
                    onClick={() => navigate("/farmer/results")}
                  >
                    <div className="w-10 h-10 rounded-[10px] bg-sand flex items-center justify-center shrink-0 text-lg">
                      {GRAIN_EMOJI[
                        scanResult.priceInfo?.quantity?.split(" ")[1]
                      ] ?? "🌾"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 tracking-[-0.01em]">
                        {scanResult.priceInfo.quantity} · AI Assessment
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Ref: {scanResult.transactionRef} ·{" "}
                        {scanResult.priceInfo.source}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="text-right">
                        <div
                          className="text-[13px] font-bold"
                          style={{
                            color:
                              GRADE_COLOR[scanResult.ai.grade] ?? "#64748b",
                          }}
                        >
                          Grade {scanResult.ai.grade}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {scanResult.ai.confidence}% confidence
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="text-[13px] font-semibold text-slate-900">
                          {scanResult.priceInfo.totalAmount}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {scanResult.priceInfo.unitPrice}/kg
                        </div>
                      </div>
                      <ChevronIcon />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-10 px-4 text-center">
                    <div className="text-sm font-semibold text-slate-900">
                      No scans yet
                    </div>
                    <div className="text-xs text-slate-400">
                      Scan your first grain batch to see results here
                    </div>
                    <button
                      className="mt-1 inline-flex items-center gap-2 py-[8px] px-5 text-[13px] font-semibold rounded-[10px] border-0 bg-[#E0185B] text-white cursor-pointer hover:bg-[#c8144f] transition-colors"
                      onClick={() => navigate("/farmer/scan")}
                    >
                      Start scanning
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Current transaction / payment status */}
            {transactionRef && scanResult && (
              <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-base font-bold tracking-[-0.02em] text-slate-900">
                    Current Escrow
                  </div>
                  {statusLabel && (
                    <span
                      className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[11px] font-semibold rounded-full ${statusLabel.cls}`}
                    >
                      {statusLabel.text}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-xs text-slate-400">
                      Transaction Ref
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-700">
                      {transactionRef}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-xs text-slate-400">Amount</span>
                    <span className="text-sm font-bold text-slate-900">
                      {scanResult.priceInfo.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-xs text-slate-400">Bank</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {scanResult.paymentDetails.bank}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-slate-400">Account</span>
                    <span className="text-xs font-mono font-semibold text-slate-700">
                      {scanResult.paymentDetails.accountNumber}
                    </span>
                  </div>
                </div>
                <div className="mt-4 px-3 py-2 bg-[#fdf0f5] rounded-[8px] text-xs text-[#a01040]">
                  {scanResult.paymentDetails.instructions}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <button
              className="w-full px-6 py-4 border-0 rounded-[20px] text-[15px] font-bold text-white cursor-pointer flex items-center justify-center gap-[10px] transition-all duration-[220ms] shadow-md hover:-translate-y-0.5 hover:shadow-xl tracking-[-0.01em]"
              style={{
                background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)",
              }}
              onClick={() => navigate("/farmer/scan")}
            >
              <div className="w-[10px] h-[10px] rounded-full bg-[#E0185B] shrink-0 animate-pulse-ring" />
              <span>Scan New Grain</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="opacity-60"
              >
                <path
                  d="M3 9h12M9 3l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Trust Score gauge — real API */}
            <div
              className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden flex flex-col items-center p-7 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/farmer/profile")}
            >
              <div className="text-[12px] font-bold tracking-[0.05em] uppercase text-slate-400 mb-1">
                Trust Score
              </div>
              {trustData && (
                <div className="text-[11px] text-[#E0185B] font-semibold mb-2">
                  {trustData.grade} TIER
                </div>
              )}
              <svg
                width="160"
                height="160"
                viewBox="0 0 120 120"
                className="overflow-visible"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={gaugeAnimated ? offset : CIRCUMFERENCE}
                  transform="rotate(-90 60 60)"
                  style={{
                    transition:
                      "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                <defs>
                  <linearGradient
                    id="gaugeGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#FF4C1D" />
                    <stop offset="100%" stopColor="#9B0063" />
                  </linearGradient>
                </defs>
                <text
                  x="60"
                  y="56"
                  textAnchor="middle"
                  style={{
                    fontSize: 38,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    fill: "#0F172A",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {trustScore || "—"}
                </text>
                <text
                  x="60"
                  y="70"
                  textAnchor="middle"
                  style={{
                    fontSize: 12,
                    fill: "#94A3B8",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {trustScore ? "of 100" : trustLoading ? "loading" : "no data"}
                </text>
              </svg>

              {trustData ? (
                <div className="flex gap-2 mt-2 w-full">
                  <div className="flex-1 text-center">
                    <div className="text-[15px] font-bold text-slate-900 tracking-[-0.02em]">
                      {trustData.totalTrades}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Trades
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-[15px] font-bold text-slate-900 tracking-[-0.02em]">
                      {trustData.honestTrades}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Honest
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-[15px] font-bold text-slate-900 tracking-[-0.02em]">
                      {trustData.platformFeePercent}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Fee</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 mt-3">
                  {trustLoading
                    ? "Fetching trust data…"
                    : "Complete your profile to see score"}
                </div>
              )}

              <div className="text-[11px] text-[#E0185B] font-semibold mt-3">
                View full profile →
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
              <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-[14px]">
                Quick Actions
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="w-full text-left flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border-0 bg-transparent"
                  onClick={() => navigate("/farmer/scan")}
                >
                  <span className="w-7 h-7 rounded-[8px] bg-[#fdf0f5] text-[#E0185B] flex items-center justify-center shrink-0">
                    <CameraIcon />
                  </span>
                  Scan grain
                </button>
                {scanResult && (
                  <button
                    className="w-full text-left flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border-0 bg-transparent"
                    onClick={() => navigate("/farmer/results")}
                  >
                    <span className="w-7 h-7 rounded-[8px] bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2 7h10M7 2l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    View last scan results
                  </button>
                )}
                <button
                  className="w-full text-left flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border-0 bg-transparent"
                  onClick={() => navigate("/farmer/profile")}
                >
                  <span className="w-7 h-7 rounded-[8px] bg-[#fdf0f5] text-[#E0185B] flex items-center justify-center shrink-0">
                    <ShieldIcon />
                  </span>
                  Trust profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!farmerProfile && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-xl flex items-center gap-3">
          <span>Complete your profile to unlock all features</span>
          <button
            className="bg-[#E0185B] text-white px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer hover:bg-[#c8144f] transition-colors"
            onClick={() => navigate("/onboarding")}
          >
            Set up →
          </button>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  up?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  label,
  value,
  delta,
  up,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="p-6 bg-white border border-slate-900/[0.06] rounded-[20px]">
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-medium tracking-[0.04em] uppercase text-slate-400">
          {label}
        </div>
        <div
          className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
      <div className="text-[28px] font-bold tracking-[-0.03em] text-slate-900 leading-none mb-[6px]">
        {value}
      </div>
      <div
        className="text-xs font-medium flex items-center gap-1 text-slate-400"
      >
        {up && <span>↑</span>}
        {delta}
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5l5 2v4c0 3-2.2 5.2-5 6-2.8-.8-5-3-5-6v-4l5-2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MoneyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 5v6M6 7h3a1 1 0 010 2H6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ScanCountIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M5 3.5L8 2l3 1.5v4L8 9 5 7.5v-4zM8 9v5M5.5 12h5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function GradeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L8 1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="text-slate-300 shrink-0"
    >
      <path
        d="M5 10l4-3-4-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 4.5A1.5 1.5 0 012.5 3h.77l.74-1h5l.74 1h.77A1.5 1.5 0 0113 4.5v6A1.5 1.5 0 0111.5 12h-9A1.5 1.5 0 011 10.5v-6z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="7" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
