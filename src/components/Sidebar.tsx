import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

interface Props {
  mode: "farmer" | "buyer";
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export default function Sidebar({ mode, isOpen = false, onClose }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { farmerProfile } = useAppContext();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const farmerItems: NavItem[] = [
    { path: "/farmer", label: "Dashboard", icon: <DashIcon /> },
    { path: "/farmer/scan", label: "Scan Grain", icon: <ScanIcon /> },
    { path: "/farmer/results", label: "Results", icon: <ResultsIcon /> },
    { path: "/buyer/payment", label: "Payments", icon: <PayIcon /> },
  ];

  const buyerItems: NavItem[] = [
    { path: "/buyer", label: "Dashboard", icon: <DashIcon /> },
    { path: "/buyer/payment", label: "Escrow", icon: <PayIcon /> },
  ];

  const items = mode === "farmer" ? farmerItems : buyerItems;
  const current = location.pathname;

  const displayName = farmerProfile
    ? `${farmerProfile.firstName} ${farmerProfile.lastName}`
    : mode === "farmer"
      ? "Farmer"
      : "Buyer";

  const initials = farmerProfile
    ? `${farmerProfile.firstName[0] ?? ""}${farmerProfile.lastName[0] ?? ""}`.toUpperCase()
    : mode === "farmer"
      ? "F"
      : "B";

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-950/50 z-[90] transition-opacity md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`w-[248px] shrink-0 bg-slate-900 flex flex-col fixed top-0 left-0 h-screen z-[100] transform transition-transform duration-[220ms] md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
          <div
            className="flex items-center gap-[10px] cursor-pointer"
            onClick={() => handleNavigate("/")}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect
                width="28"
                height="28"
                rx="7"
                fill="rgba(255,255,255,0.1)"
              />
              <path
                d="M8 18C8 18 10 12 14 10C18 8 20 14 20 14"
                stroke="#0EA5E9"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="14" cy="17" r="3" fill="#EDE4D5" />
              <circle cx="14" cy="17" r="1.5" fill="#0EA5E9" />
            </svg>
            <div>
              <div className="text-base font-extrabold text-white tracking-[-0.04em]">
                AgriTrust
              </div>
              <div className="text-[10px] text-white/35 font-medium mt-[1px]">
                {mode === "farmer" ? "Farmer Portal" : "Buyer Portal"}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          <div className="text-[10px] font-bold tracking-[0.08em] text-white/25 uppercase px-3 mb-1 mt-1">
            Menu
          </div>
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex items-center gap-[10px] px-3 py-[10px] rounded-[10px] text-sm font-medium cursor-pointer border-0 w-full text-left transition-all duration-[220ms] ${
                current === item.path
                  ? "bg-sky-500/15 text-sky-400"
                  : "bg-transparent text-white/55 hover:bg-white/[0.07] hover:text-white/85"
              }`}
            >
              <span
                className={
                  current === item.path ? "opacity-100 flex" : "opacity-50 flex"
                }
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}

          <div className="border-t border-white/[0.06] mt-3 pt-3">
            <div className="text-[10px] font-bold tracking-[0.08em] text-white/25 uppercase px-3 mb-1">
              Switch
            </div>
            <button
              className="flex items-center gap-[10px] px-3 py-[10px] rounded-[10px] text-sm font-medium cursor-pointer border-0 w-full text-left bg-transparent text-white/55 transition-all duration-[220ms] hover:bg-white/[0.07] hover:text-white/85"
              onClick={() =>
                handleNavigate(mode === "farmer" ? "/buyer" : "/farmer")
              }
            >
              <span className="opacity-50 flex">
                <SwitchIcon />
              </span>
              {mode === "farmer" ? "Buyer View" : "Farmer View"}
            </button>
          </div>
        </nav>

        <div className="px-3 pb-5 pt-4 border-t border-white/[0.06]">
          <div
            className="flex items-center gap-[10px] p-[10px] px-3 cursor-pointer rounded-[10px] hover:bg-white/[0.05] transition-colors"
            onClick={() =>
              mode === "farmer" && handleNavigate("/farmer/profile")
            }
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white/85">
                {displayName}
              </div>
              <div className="text-[11px] text-white/35">
                {mode === "farmer" ? "Farmer" : "Buyer"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function DashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="1"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9"
        y="1"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="1"
        y="9"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9"
        y="9"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 8h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ResultsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 8l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="4"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}
function SwitchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 5h10M11 3l2 2-2 2M13 11H3M5 9l-2 2 2 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
