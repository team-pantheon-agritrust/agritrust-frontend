type Screen =
  | "landing"
  | "farmer-dashboard"
  | "grain-scan"
  | "scan-results"
  | "buyer-dashboard"
  | "payment";

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  current: Screen;
  onNavigate: (s: Screen) => void;
  mode: "farmer" | "buyer";
}

export default function Sidebar({ current, onNavigate, mode }: Props) {
  const farmerItems: NavItem[] = [
    { id: "farmer-dashboard", label: "Dashboard", icon: <DashIcon /> },
    { id: "grain-scan", label: "Scan Grain", icon: <ScanIcon /> },
    { id: "scan-results", label: "Results", icon: <ResultsIcon /> },
    { id: "payment", label: "Payments", icon: <PayIcon /> },
  ];

  const buyerItems: NavItem[] = [
    { id: "buyer-dashboard", label: "Dashboard", icon: <DashIcon /> },
    { id: "payment", label: "Escrow", icon: <PayIcon /> },
  ];

  const items = mode === "farmer" ? farmerItems : buyerItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => onNavigate("landing")}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="rgba(255,255,255,0.1)" />
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
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.04em",
              }}
            >
              AgriTrust
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                fontWeight: 500,
                marginTop: 1,
              }}
            >
              {mode === "farmer" ? "Farmer Portal" : "Buyer Portal"}
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            padding: "4px 12px",
            marginBottom: 4,
          }}
        >
          Menu
        </div>
        {items.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item${current === item.id ? " active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span
              style={{
                opacity: current === item.id ? 1 : 0.5,
                display: "flex",
              }}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            margin: "12px 0 12px",
            paddingTop: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              padding: "0 12px",
              marginBottom: 4,
            }}
          >
            Switch
          </div>
          <button
            className="sidebar-nav-item"
            onClick={() =>
              onNavigate(
                mode === "farmer" ? "buyer-dashboard" : "farmer-dashboard",
              )
            }
          >
            <span style={{ opacity: 0.5, display: "flex" }}>
              <SwitchIcon />
            </span>
            {mode === "farmer" ? "Buyer View" : "Farmer View"}
          </button>
          <button
            className="sidebar-nav-item"
            onClick={() => onNavigate("landing")}
          >
            <span style={{ opacity: 0.5, display: "flex" }}>
              <HomeIcon />
            </span>
            Landing Page
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0EA5E9, #0284C7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {mode === "farmer" ? "AY" : "CO"}
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {mode === "farmer" ? "Aminu Yusuf" : "Chioma Okafor"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              {mode === "farmer" ? "Verified Farmer" : "Premium Buyer"}
            </div>
          </div>
        </div>
      </div>
    </aside>
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
function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 7l6-5 6 5v7a1 1 0 01-1 1H3a1 1 0 01-1-1V7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 14V10h4v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
