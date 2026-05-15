import { createContext, useContext, useState } from 'react'
import type { FarmerProfile, GradeAndScanResponse } from '../types'

interface AppContextValue {
  farmerProfile: FarmerProfile | null
  setFarmerProfile: (p: FarmerProfile) => void
  scanResult: GradeAndScanResponse | null
  setScanResult: (r: GradeAndScanResponse) => void
  transactionRef: string | null
  setTransactionRef: (ref: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function loadProfile(): FarmerProfile | null {
  try {
    const raw = localStorage.getItem('farmerProfile')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [farmerProfile, setFarmerProfileState] = useState<FarmerProfile | null>(loadProfile)
  const [scanResult, setScanResult] = useState<GradeAndScanResponse | null>(null)
  const [transactionRef, setTransactionRef] = useState<string | null>(null)

  function setFarmerProfile(p: FarmerProfile) {
    setFarmerProfileState(p)
    localStorage.setItem('farmerProfile', JSON.stringify(p))
  }

  return (
    <AppContext.Provider value={{ farmerProfile, setFarmerProfile, scanResult, setScanResult, transactionRef, setTransactionRef }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
