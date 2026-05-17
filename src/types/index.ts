export interface FarmerProfile {
  firstName: string
  lastName: string
  phone: string
  email?: string
  bankCode?: string
  accountNumber?: string
}

export interface GradeAndScanPayload {
  farmer: FarmerProfile
  grainType: string
  quantity: number
  imageBase64: string
  gps?: { lat: number; lng: number }
  weatherData?: { humidity: number; temperature: number }
}

export interface AIBreakdown {
  model_score: number
  anomaly_score: number
  defect_assessment: string
  dark_blobs_detected: number
  moisture_assessment: string
}

export interface AIResult {
  grade: string
  confidence: number
  defects: string[]
  aiScore: number
  reasoning: string
  breakdown: AIBreakdown
}

export interface PriceInfo {
  unitPrice: string
  quantity: string
  totalAmount: string
  source: string
}

export interface PaymentDetails {
  bank: string
  accountNumber: string
  instructions: string
}

export interface GradeAndScanResponse {
  status: string
  ai: AIResult
  scanId: string
  transactionRef: string
  transactionId: string
  priceInfo: PriceInfo
  paymentDetails: PaymentDetails
}

export interface TrustScoreResponse {
  status: string
  phone: string
  trustScore: number
  grade: string
  totalTrades: number
  honestTrades: number
  platformFeePercent: number
}

export interface VerifyDeliveryPayload {
  txRef: string
  deliveryGrade: string
}

export interface VerifyDeliveryResponse {
  status: string
  outcome: string
  disbursementId?: string
  message: string
}

export interface InitiateSalePayload {
  farmer: FarmerProfile
  grainType: string
  quantity: number
  grade: string
}

export interface ApiError {
  status: 'error'
  message: string
}

// Virtual account creation
export interface CreateVirtualAccountPayload {
  customer_identifier: string
  first_name: string
  last_name: string
  mobile_num: string
  email: string
  bvn: string
  dob: string
  address: string
  gender: '1' | '2'
  beneficiary_account?: string
}

export interface CreateVirtualAccountResponse {
  status: string
  data: {
    virtual_account_number: string
    bank_code: string
    first_name: string
    last_name: string
    customer_identifier: string
    beneficiary_account: string | null
    created_at: string
  }
}

// Payment status
export type EscrowStatus = 'awaiting_payment' | 'funds_received' | 'approved' | 'released' | 'failed'

export interface PaymentStatusResponse {
  status: EscrowStatus
  amountPaid?: number
  paidAt?: string
  txRef: string
}

// Transfer
export interface InitiateTransferPayload {
  txRef: string
  farmerAccountNumber: string
  farmerBankCode: string
  farmerAccountName: string
  amount: number
  remark?: string
}

export interface InitiateTransferResponse {
  status: string
  message: string
  data?: {
    transaction_reference: string
    response_description: string
    nip_transaction_reference: string
    amount: string
  }
}
