import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import { AppProvider } from "./context/AppContext";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import FarmerDashboard from "./components/FarmerDashboard";
import GrainScanning from "./components/GrainScanning";
import GradingResults from "./components/GradingResults";
import FarmerProfile from "./components/FarmerProfile";
import BuyerDashboard from "./components/BuyerDashboard";
import PaymentEscrow from "./components/PaymentEscrow";
import DeliveryVerification from "./components/DeliveryVerification";

const farmerPaths = [
  "/farmer",
  "/farmer/scan",
  "/farmer/results",
  "/farmer/profile",
];
const buyerPaths = ["/buyer", "/buyer/payment"];
const dashboardPaths = [...farmerPaths, ...buyerPaths];

function AppShell() {
  const location = useLocation();
  const path = location.pathname;
  const isDashboard = dashboardPaths.some(
    (p) => path === p || path.startsWith(p + "/"),
  );
  const sidebarMode = buyerPaths.some(
    (p) => path === p || path.startsWith(p + "/"),
  )
    ? "buyer"
    : "farmer";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navigation />
      {!isDashboard && (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/verify" element={<DeliveryVerification />} />
        </Routes>
      )}
      {isDashboard && (
        <div className="flex min-h-screen">
          <Sidebar
            mode={sidebarMode}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <div className="flex-1 min-w-0 bg-cream md:ml-[248px]">
            <div className="md:hidden sticky top-0 z-[80] bg-cream/95 backdrop-blur-[14px] border-b border-slate-200">
              <div className="h-14 px-4 flex items-center gap-3">
                <button
                  className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-slate-200 bg-white text-slate-700"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <HamburgerIcon />
                </button>
                <div className="text-sm font-semibold text-slate-900">
                  {sidebarMode === "farmer" ? "Farmer Portal" : "Buyer Portal"}
                </div>
              </div>
            </div>
            <Routes>
              <Route path="/farmer" element={<FarmerDashboard />} />
              <Route path="/farmer/scan" element={<GrainScanning />} />
              <Route path="/farmer/results" element={<GradingResults />} />
              <Route path="/farmer/profile" element={<FarmerProfile />} />
              <Route path="/buyer" element={<BuyerDashboard />} />
              <Route path="/buyer/payment" element={<PaymentEscrow />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 6h14M3 10h14M3 14h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
