import { useNavigate } from "react-router-dom";

const offers = [
  {
    id: 1,
    emoji: "🌽",
    name: "Yellow Maize",
    farmer: "Aminu Yusuf · Kano",
    grade: "A",
    price: "₦87,500",
    volume: "500 kg",
    status: "Verified",
    statusCls: "bg-emerald-50 text-emerald-700",
    age: "2h ago",
  },
  {
    id: 2,
    emoji: "🫘",
    name: "Soybean",
    farmer: "Emmanuel Obi · Plateau",
    grade: "A",
    price: "₦112,000",
    volume: "800 kg",
    status: "Pending",
    statusCls: "bg-amber-100 text-amber-600",
    age: "5h ago",
  },
  {
    id: 3,
    emoji: "🌾",
    name: "Hard Red Wheat",
    farmer: "Hauwa Bello · Kaduna",
    grade: "B",
    price: "₦64,200",
    volume: "320 kg",
    status: "Verified",
    statusCls: "bg-emerald-50 text-emerald-700",
    age: "1d ago",
  },
  {
    id: 4,
    emoji: "🌾",
    name: "White Sorghum",
    farmer: "Daniel Lawan · Borno",
    grade: "B",
    price: "₦52,800",
    volume: "400 kg",
    status: "In Transit",
    statusCls: "bg-sky-100 text-sky-600",
    age: "2d ago",
  },
  {
    id: 5,
    emoji: "🍚",
    name: "Paddy Rice",
    farmer: "Fatima Usman · Kebbi",
    grade: "A",
    price: "₦138,000",
    volume: "1,000 kg",
    status: "Pending",
    statusCls: "bg-amber-100 text-amber-600",
    age: "3d ago",
  },
];

const escrowItems = [
  {
    id: "ESC-4821",
    grain: "Yellow Maize · 500 kg",
    amount: "₦87,500",
    condition: "Delivery confirmation",
    pct: 75,
  },
  {
    id: "ESC-4735",
    grain: "Soybean · 800 kg",
    amount: "₦112,000",
    condition: "Quality verification",
    pct: 40,
  },
];

const availableGrains = Array.from(new Set(offers.map(offer => offer.name)))

export default function BuyerDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-white border-b border-slate-900/[0.06] flex flex-col sm:flex-row sm:items-center px-4 sm:px-8 gap-3 sticky top-0 z-50">
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
          <button className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-sky-500 text-white cursor-pointer transition-all duration-[220ms] shadow-sky hover:bg-sky-600 hover:-translate-y-px">
            <PlusIcon /> New Order
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-[1200px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Pending Offers",
              value: "3",
              sub: "2 require action",
              dot: "#D97706",
            },
            {
              label: "In Escrow",
              value: "₦199K",
              sub: "2 transactions",
              dot: "#0EA5E9",
            },
            {
              label: "Delivered (YTD)",
              value: "18",
              sub: "14.2 tonnes total",
              dot: "#10B981",
            },
            {
              label: "Avg Quality Score",
              value: "91.4",
              sub: "A-grade average",
              dot: "#7C3AED",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="p-6 bg-white border border-slate-900/[0.06] rounded-[20px]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-xs font-medium tracking-[0.04em] uppercase text-slate-400">
                  {s.label}
                </div>
                <div
                  className="w-2 h-2 rounded-full mt-[3px]"
                  style={{ background: s.dot }}
                />
              </div>
              <div className="text-[28px] font-bold tracking-[-0.03em] text-slate-900 leading-none mb-[6px]">
                {s.value}
              </div>
              <div className="text-xs font-medium text-slate-400">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 items-start lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden">
              <div className="px-5 pt-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div className="text-base font-bold tracking-[-0.02em] text-slate-900">
                    Incoming Offers
                  </div>
                  <div className="flex gap-[6px] flex-wrap">
                    {["All", "Verified", "Pending", "In Transit"].map((f) => (
                      <button
                        key={f}
                        className={`px-3 py-1 rounded-full border border-slate-200 text-xs font-semibold cursor-pointer transition-all ${
                          f === "All"
                            ? "text-slate-900 bg-slate-100"
                            : "text-slate-400 bg-transparent hover:bg-slate-50"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-2 pb-2">
                {offers.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-[10px] cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
                    onClick={() => navigate("/farmer/results")}
                  >
                    <div className="w-11 h-11 rounded-[10px] bg-sand flex items-center justify-center text-xl shrink-0">
                      {o.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 tracking-[-0.01em]">
                        {o.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {o.farmer} · {o.age}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="w-full sm:w-auto">
                        <div className="flex flex-wrap gap-[6px] mb-1 sm:justify-end">
                          <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[11px] font-semibold rounded-full bg-slate-100 text-slate-600">
                            Grade {o.grade}
                          </span>
                          <span
                            className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[11px] font-semibold rounded-full ${o.statusCls}`}
                          >
                            {o.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end items-center">
                          <div className="text-xs text-slate-400">
                            {o.volume}
                          </div>
                          <div className="text-[15px] font-bold text-slate-900">
                            {o.price}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-[6px] shrink-0">
                        <button
                          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-xs font-semibold rounded-[6px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/farmer/results");
                          }}
                        >
                          View
                        </button>
                        <button
                          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-xs font-semibold rounded-[6px] border-0 bg-sky-500 text-white cursor-pointer transition-all duration-[220ms] hover:bg-sky-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/buyer/payment");
                          }}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden">
              <div
                className="h-40 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,#e8f4f8 0%,#d4e8f0 100%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(14,165,233,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.08) 1px,transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d="M 60 80 Q 140 40 220 70 Q 300 100 360 60"
                    stroke="#0EA5E9"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="6 4"
                    opacity="0.6"
                  />
                  <circle cx="60" cy="80" r="4" fill="#0EA5E9" />
                  <circle cx="360" cy="60" r="4" fill="#10B981" />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] flex flex-col items-center">
                  <div className="w-[14px] h-[14px] rounded-full bg-sky-500 border-2 border-white shadow-[0_0_0_4px_rgba(14,165,233,0.2)] animate-pulse-ring" />
                  <div className="w-0.5 h-3 bg-sky-500" />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[11px] font-semibold rounded-full bg-sky-100 text-sky-600">
                    <span className="w-[6px] h-[6px] rounded-full bg-current animate-pulse-ring" />
                    Live tracking
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700">
                    GPS Verified
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm font-bold text-slate-900 mb-2">
                  Active Delivery · ESC-4821
                </div>
                <div className="flex items-center gap-2 text-[13px] text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                  <span className="text-xs">Kano Farm Gate</span>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: "linear-gradient(90deg,#0EA5E9,#10B981)",
                    }}
                  />
                  <span className="text-xs text-emerald-500 font-semibold">
                    Lagos Warehouse
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                </div>
                <div className="mt-[10px] flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-400">ETA</div>
                    <div className="text-sm font-bold text-slate-900">
                      Tomorrow, 11:30 AM
                    </div>
                  </div>
                  <div className="w-[120px] h-[6px] bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "68%",
                        background: "linear-gradient(90deg,#0EA5E9,#10B981)",
                      }}
                    />
                  </div>
                  <div className="text-[13px] font-bold text-sky-500">68%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
              <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-4">
                Escrow Accounts
              </div>
              {escrowItems.map((e) => (
                <div
                  key={e.id}
                  className="py-[14px] border-b border-slate-50 last:border-b-0 cursor-pointer"
                  onClick={() => navigate("/buyer/payment")}
                >
                  <div className="flex justify-between mb-1">
                    <div className="text-[11px] font-bold text-slate-400 tracking-[0.04em]">
                      {e.id}
                    </div>
                    <div className="text-[15px] font-bold text-slate-900">
                      {e.amount}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">{e.grain}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-[6px] bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${e.pct}%`,
                          background: "linear-gradient(90deg,#0EA5E9,#10B981)",
                        }}
                      />
                    </div>
                    <div className="text-xs font-semibold text-sky-500">
                      {e.pct}%
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Waiting: {e.condition}
                  </div>
                </div>
              ))}
              <button
                className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50 w-full mt-[14px]"
                onClick={() => navigate("/buyer/payment")}
              >
                Manage Escrow →
              </button>
            </div>

            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
              <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-3">
                Find Grain
              </div>
              <input
                className="w-full px-[14px] py-[10px] text-sm text-slate-900 bg-white border-[1.5px] border-slate-200 rounded-[10px] outline-none transition focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] placeholder:text-slate-400 mb-3"
                placeholder="Search grain type, location…"
              />
              <div className="flex flex-col gap-2">
                {availableGrains.map((g) => (
                  <div
                    key={g}
                    className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-[10px] cursor-pointer text-[13px] font-medium text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <span>{g}</span>
                    <span className="text-[11px] text-slate-400">
                      {Math.floor(Math.random() * 20 + 5)} listings →
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm overflow-hidden p-5">
              <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-[14px]">
                Purchased Quality Mix
              </div>
              {[
                { grade: "A", pct: 62, color: "#10B981" },
                { grade: "B", pct: 30, color: "#0EA5E9" },
                { grade: "C", pct: 8, color: "#D97706" },
              ].map((g) => (
                <div
                  key={g.grade}
                  className="flex items-center gap-[10px] mb-[10px] last:mb-0"
                >
                  <div
                    className="w-6 h-6 rounded-[6px] flex items-center justify-center text-[11px] font-extrabold shrink-0"
                    style={{
                      background: g.color + "15",
                      border: `1px solid ${g.color}30`,
                      color: g.color,
                    }}
                  >
                    {g.grade}
                  </div>
                  <div className="flex-1 h-[6px] bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${g.pct}%`, background: g.color }}
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-900 min-w-[28px]">
                    {g.pct}%
                  </div>
                </div>
              ))}
            </div>

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

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 2v10M2 7h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
