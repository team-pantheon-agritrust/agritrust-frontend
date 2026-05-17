import client from './client'
import type {
  GradeAndScanPayload,
  GradeAndScanResponse,
  TrustScoreResponse,
  VerifyDeliveryResponse,
  InitiateSalePayload,
} from '../types'

// Direct Squad API calls (virtual account, payment status, transfer)
export {
  createVirtualAccount,
  getVirtualAccount,
  checkPaymentStatus,
  initiateTransfer,
  lookupAccount,
  requeryTransfer,
  simulatePayment,
} from './squadDirect'

export async function gradeAndScan(payload: GradeAndScanPayload): Promise<GradeAndScanResponse> {
  const res = await client.post<GradeAndScanResponse>('/grade-and-scan', payload)
  return res.data
}

export async function verifyDelivery(txRef: string, deliveryGrade: string): Promise<VerifyDeliveryResponse> {
  const res = await client.post<VerifyDeliveryResponse>('/verify-delivery', { txRef, deliveryGrade })
  return res.data
}

export async function getTrustScore(phone: string): Promise<TrustScoreResponse> {
  const res = await client.get<TrustScoreResponse>(`/farmer/${phone}/trust-score`)
  return res.data
}

export async function initiateSale(payload: InitiateSalePayload): Promise<unknown> {
  const res = await client.post('/initiate-sale', payload)
  return res.data
}

