import { createContext, useContext, useState } from 'react'
import type { FarmerProfile, GradeAndScanResponse } from '../types'

export type TransactionStatus = 'PENDING' | 'PAID' | 'RELEASED' | 'DISPUTED' | 'REFUNDED'

interface AppContextValue {
  farmerProfile: FarmerProfile | null
  setFarmerProfile: (p: FarmerProfile) => void
  scanResult: GradeAndScanResponse | null
  setScanResult: (r: GradeAndScanResponse) => void
  transactionRef: string | null
  setTransactionRef: (ref: string) => void
  transactionStatus: TransactionStatus | null
  setTransactionStatus: (s: TransactionStatus) => void
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
  const [scanResult, setScanResultState] = useState<GradeAndScanResponse | null>(null)
  const [transactionRef, setTransactionRef] = useState<string | null>(null)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null)

  function setFarmerProfile(p: FarmerProfile) {
    setFarmerProfileState(p)
    localStorage.setItem('farmerProfile', JSON.stringify(p))
  }

  function setScanResult(r: GradeAndScanResponse) {
    setScanResultState(r)
    setTransactionStatus('PENDING')
  }

  return (
    <AppContext.Provider value={{
      farmerProfile, setFarmerProfile,
      scanResult, setScanResult,
      transactionRef, setTransactionRef,
      transactionStatus, setTransactionStatus,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
