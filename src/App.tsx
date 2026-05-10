import { useState } from 'react'
import './App.css'

import Navigation from './components/Navigation'
import Sidebar from './components/Sidebar'
import LandingPage from './components/LandingPage'
import FarmerDashboard from './components/FarmerDashboard'
import GrainScanning from './components/GrainScanning'
import GradingResults from './components/GradingResults'
import BuyerDashboard from './components/BuyerDashboard'
import PaymentEscrow from './components/PaymentEscrow'

type Screen = 'landing' | 'farmer-dashboard' | 'grain-scan' | 'scan-results' | 'buyer-dashboard' | 'payment'

const farmerScreens: Screen[] = ['farmer-dashboard', 'grain-scan', 'scan-results']
const buyerScreens: Screen[] = ['buyer-dashboard', 'payment']
const dashboardScreens: Screen[] = [...farmerScreens, ...buyerScreens]

function getSidebarMode(screen: Screen): 'farmer' | 'buyer' {
  return buyerScreens.includes(screen) ? 'buyer' : 'farmer'
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')

  const isDashboard = dashboardScreens.includes(screen)
  const sidebarMode = getSidebarMode(screen)

  function navigate(s: Screen) {
    setScreen(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Landing nav (fixed, only on landing) */}
      <Navigation current={screen} onNavigate={navigate} />

      {screen === 'landing' && (
        <LandingPage onNavigate={navigate} />
      )}

      {isDashboard && (
        <div className="sidebar-layout">
          <Sidebar current={screen} onNavigate={navigate} mode={sidebarMode} />
          <div className="sidebar-content">
            {screen === 'farmer-dashboard' && <FarmerDashboard onNavigate={navigate} />}
            {screen === 'grain-scan'        && <GrainScanning onNavigate={navigate} />}
            {screen === 'scan-results'      && <GradingResults onNavigate={navigate} />}
            {screen === 'buyer-dashboard'   && <BuyerDashboard onNavigate={navigate} />}
            {screen === 'payment'           && <PaymentEscrow onNavigate={navigate} />}
          </div>
        </div>
      )}
    </>
  )
}
