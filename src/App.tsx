import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

import { AppProvider } from './context/AppContext'
import Navigation from './components/Navigation'
import Sidebar from './components/Sidebar'
import LandingPage from './components/LandingPage'
import Onboarding from './components/Onboarding'
import FarmerDashboard from './components/FarmerDashboard'
import GrainScanning from './components/GrainScanning'
import GradingResults from './components/GradingResults'
import FarmerProfile from './components/FarmerProfile'
import BuyerDashboard from './components/BuyerDashboard'
import PaymentEscrow from './components/PaymentEscrow'
import DeliveryVerification from './components/DeliveryVerification'

const farmerPaths = ['/farmer', '/farmer/scan', '/farmer/results', '/farmer/profile']
const buyerPaths = ['/buyer', '/buyer/payment']
const dashboardPaths = [...farmerPaths, ...buyerPaths]

function AppShell() {
  const location = useLocation()
  const path = location.pathname
  const isDashboard = dashboardPaths.some(p => path === p || path.startsWith(p + '/'))
  const sidebarMode = buyerPaths.some(p => path === p || path.startsWith(p + '/')) ? 'buyer' : 'farmer'

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
          <Sidebar mode={sidebarMode} />
          <div className="ml-[248px] flex-1 min-w-0 bg-cream">
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
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  )
}
