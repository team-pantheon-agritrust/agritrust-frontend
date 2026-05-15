import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getTrustScore } from "../api/squad";
import type { TrustScoreResponse } from "../types";

const CIRCUMFERENCE = 2 * Math.PI * 52;

const scans = [
  {
    id: 1,
    emoji: "🌽",
    name: "Yellow Maize",
    date: "2 hours ago",
    location: "Kano, NG",
    grade: "A",
    gradeColor: "#10B981",
    price: "₦87,500",
    volume: "500 kg",
  },
  {
    id: 2,
    emoji: "🌾",
    name: "Wheat — Hard Red",
    date: "Yesterday",
    location: "Kaduna, NG",
    grade: "B",
    gradeColor: "#0EA5E9",
    price: "₦64,200",
    volume: "320 kg",
  },
  {
    id: 3,
    emoji: "🫘",
    name: "Soybean",
    date: "3 days ago",
    location: "Plateau, NG",
    grade: "A",
    gradeColor: "#10B981",
    price: "₦112,000",
    volume: "800 kg",
  },
  {
    id: 4,
    emoji: "🌾",
    name: "Sorghum",
    date: "5 days ago",
    location: "Borno, NG",
    grade: "C",
    gradeColor: "#D97706",
    price: "₦38,400",
    volume: "240 kg",
  },
];

const earnings = [42, 65, 38, 87, 54, 72, 91, 60, 77, 88, 55, 94];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { farmerProfile } = useAppContext();

  const [trustData, setTrustData] = useState<TrustScoreResponse | null>(null);
  const [gaugeAnimated, setGaugeAnimated] = useState(false);

  useEffect(() => {
    if (!farmerProfile?.phone) return;

    getTrustScore(farmerProfile.phone)
      .then((res) => {
        setTrustData(res);
        setTimeout(() => setGaugeAnimated(true), 200);
      })
      .catch(() => setTimeout(() => setGaugeAnimated(true), 200));
  }, [farmerProfile]);

  const trustScore = trustData?.trustScore ?? 0;
  const offset = CIRCUMFERENCE - (trustScore / 100) * CIRCUMFERENCE;
  const displayName = farmerProfile
    ? `${farmerProfile.firstName} ${farmerProfile.lastName}`
    : "Farmer";

  return (
    <div>
      <div className="bg-white border-b border-slate-900/[0.06] flex flex-col sm:flex-row sm:items-center px-4 sm:px-8 gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3 flex-1 py-3 sm:py-0">
          <div className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.01em] text-slate-900">
            {farmerProfile
              ? `Welcome, ${farmerProfile.firstName}`
              : "Farmer Dashboard"}
          </div>
        </div>
        <div className="flex items-center gap-3 pb-3 sm:pb-0">
          <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
            <span className="w-[6px] h-[6px] rounded-full bg-current opacity-70" />
            Online
          </span>
          <button
            className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-sky-500 text-white cursor-pointer transition-all duration-[220ms] shadow-sky hover:bg-sky-600 hover:-translate-y-px"
            onClick={() => navigate("/farmer/scan")}
          >
            <CameraIcon /> Scan New Grain
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-[1200px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Active Listings"
            value="7"
            delta="+2 this week"
            up
            iconBg="bg-sky-50"
            iconColor="text-sky-500"
            icon={<ListingIcon />}
          />
          <StatCard
            label="Earnings This Month"
            value="₦302K"
            delta="+18.4%"
            up
            iconBg="bg-emerald-50"
            iconColor="text-emerald-500"
            icon={<MoneyIcon />}
          />
          <StatCard
            label="Total Scans"
            value="48"
            delta="4 pending"
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            icon={<ScanCountIcon />}
          />
          <StatCard
            label="Avg Grade"
            value="A–"
            delta="Top 12%"
            up
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            icon={<GradeIcon />}
          />
        </div>

        <div className="grid gap-6 items-start lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-base font-bold tracking-[-0.02em] text-slate-900">
                    Monthly Earnings
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Last 12 months
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-slate-900 tracking-[-0.03em]">
                    ₦3.6M
                  </div>
                  <div className="text-xs text-emerald-500 font-semibold flex items-center gap-1 justify-end">
                    <span>↑</span> 24.1% YoY
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-[6px] h-20 mt-4">
                {earnings.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t-[4px] min-h-[4px] transition-all duration-300"
                      style={{
                        height: `${(v / 100) * 72}px`,
                        background:
                          i === earnings.length - 1
                            ? "linear-gradient(180deg,#0EA5E9 0%,#0284C7 100%)"
                            : i === earnings.length - 2
                              ? "#E0F2FE"
                              : "#F1F5F9",
                      }}
                    />
                    <div className="text-[10px] text-slate-400">
                      {
                        [
                          "J",
                          "F",
                          "M",
                          "A",
                          "M",
                          "J",
                          "J",
                          "A",
                          "S",
                          "O",
                          "N",
                          "D",
                        ][i]
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden">
              <div className="px-5 pt-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div className="text-base font-bold tracking-[-0.02em] text-slate-900">
                    Recent Grain Scans
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-sky-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100"
                    onClick={() => navigate("/farmer/scan")}
                  >
                    New scan →
                  </button>
                </div>
              </div>
              <div className="px-2 pb-2">
                {scans.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-[12px] px-4 py-[14px] rounded-[10px] cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
                    onClick={() => navigate("/farmer/results")}
                  >
                    <div className="w-10 h-10 rounded-[10px] bg-sand flex items-center justify-center shrink-0 text-lg">
                      {s.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 tracking-[-0.01em]">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {s.date} · {s.location} · {s.volume}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="text-right">
                        <div
                          className="text-[13px] font-bold"
                          style={{ color: s.gradeColor }}
                        >
                          Grade {s.grade}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Offered
                        </div>
                      </div>
                      <div className="text-right min-w-[72px]">
                        <div className="text-[13px] font-semibold text-slate-900">
                          {s.price}
                        </div>
                      </div>
                      <ChevronIcon />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <button
              className="w-full px-6 py-4 border-0 rounded-[20px] text-[15px] font-bold text-white cursor-pointer flex items-center justify-center gap-[10px] transition-all duration-[220ms] shadow-md hover:-translate-y-0.5 hover:shadow-xl tracking-[-0.01em]"
              style={{
                background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)",
              }}
              onClick={() => navigate("/farmer/scan")}
            >
              <div className="w-[10px] h-[10px] rounded-full bg-sky-500 shrink-0 animate-pulse-ring" />
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

            {/* Trust Score */}
            <div
              className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden flex flex-col items-center p-7 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/farmer/profile")}
            >
              <div className="text-[12px] font-bold tracking-[0.05em] uppercase text-slate-400 mb-1">
                Trust Score
              </div>
              {trustData && (
                <div className="text-[11px] text-sky-500 font-semibold mb-2">
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
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#38BDF8" />
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
                  {trustScore ? "of 100" : "loading"}
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
                <div className="flex gap-2 mt-2 w-full">
                  {[
                    { label: "Quality", pct: 92 },
                    { label: "Delivery", pct: 85 },
                    { label: "Response", pct: 78 },
                  ].map((m) => (
                    <div key={m.label} className="flex-1 text-center">
                      <div className="text-[15px] font-bold text-slate-900 tracking-[-0.02em]">
                        {m.pct}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[11px] text-sky-500 font-semibold mt-3">
                View full profile →
              </div>
            </div>

            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
              <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-[14px]">
                Active Offers
              </div>
              {[
                {
                  buyer: "Lagos Grain Co.",
                  amount: "₦87,500",
                  items: "Maize · 500kg",
                  status: "Accepted",
                  statusColor: "#10B981",
                },
                {
                  buyer: "Northgate Foods",
                  amount: "₦112,000",
                  items: "Soybean · 800kg",
                  status: "Pending",
                  statusColor: "#D97706",
                },
              ].map((o) => (
                <div
                  key={o.buyer}
                  className="py-3 border-b border-slate-50 last:border-b-0"
                >
                  <div className="flex justify-between mb-1">
                    <div className="text-[13px] font-semibold text-slate-900">
                      {o.buyer}
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {o.amount}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xs text-slate-400">{o.items}</div>
                    <div
                      className="text-[11px] font-semibold"
                      style={{ color: o.statusColor }}
                    >
                      {o.status}
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50 hover:border-slate-300 w-full mt-[14px]"
                onClick={() => navigate("/buyer/payment")}
              >
                View all payments
              </button>
            </div>
          </div>
        </div>
      </div>

      {!farmerProfile && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-xl flex items-center gap-3">
          <span>Complete your profile to unlock all features</span>
          <button
            className="bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer hover:bg-sky-400 transition-colors"
            onClick={() => navigate("/onboarding")}
          >
            Set up →
          </button>
        </div>
      )}

      <div className="sr-only">{displayName}</div>
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
        className={`text-xs font-medium flex items-center gap-1 ${up ? "text-emerald-500" : "text-slate-400"}`}
      >
        {up && <span>↑</span>}
        {delta}
      </div>
    </div>
  );
}

function ListingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 4h10M3 8h7M3 12h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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
        d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2M4 8h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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
