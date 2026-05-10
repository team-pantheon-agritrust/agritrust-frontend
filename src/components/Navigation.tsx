import { useState, useEffect } from "react";

type Screen =
  | "landing"
  | "farmer-dashboard"
  | "grain-scan"
  | "scan-results"
  | "buyer-dashboard"
  | "payment";

interface Props {
  current: Screen;
  onNavigate: (s: Screen) => void;
}

export default function Navigation({ current, onNavigate }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isLanding = current === "landing";

  if (!isLanding) return null;

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-logo">
        <LogoMark />
        AgriTrust
      </div>

      <div className="nav-links">
        <button className="nav-link">Features</button>
        <button className="nav-link">For Farmers</button>
        <button className="nav-link">For Buyers</button>
        <button className="nav-link">Pricing</button>
        <button className="nav-link">About</button>
      </div>

      <div className="nav-actions">
        <button className="btn btn-ghost text-sm">Sign in</button>
        <button
          className="btn btn-primary text-sm"
          onClick={() => onNavigate("farmer-dashboard")}
        >
          Get started
        </button>
      </div>
    </nav>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="#0F172A" />
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
  );
}
