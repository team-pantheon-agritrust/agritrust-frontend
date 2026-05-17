import axios from 'axios'
import type {
  CreateVirtualAccountPayload,
  CreateVirtualAccountResponse,
  EscrowStatus,
  PaymentStatusResponse,
  InitiateTransferPayload,
  InitiateTransferResponse,
} from '../types'

// During dev: requests go through Vite proxy (/squad-proxy → sandbox-api-d.squadco.com)
// In production: swap baseURL to your backend proxy or Squad's live URL
const BASE =
  import.meta.env.DEV
    ? '/squad-proxy'
    : 'https://sandbox-api-d.squadco.com'

const squadClient = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
})

squadClient.interceptors.request.use((config) => {
  const key = import.meta.env.VITE_SQUAD_SECRET_KEY
  if (key) config.headers.Authorization = `Bearer ${key}`
  return config
})

// ── Virtual Account ──────────────────────────────────────────────────────────

export async function createVirtualAccount(
  payload: CreateVirtualAccountPayload,
): Promise<CreateVirtualAccountResponse> {
  const res = await squadClient.post<CreateVirtualAccountResponse>(
    '/virtual-account',
    payload,
  )
  return res.data
}

export async function getVirtualAccount(
  customerIdentifier: string,
): Promise<CreateVirtualAccountResponse> {
  const res = await squadClient.get<CreateVirtualAccountResponse>(
    `/virtual-account/${customerIdentifier}`,
  )
  return res.data
}

// ── Payment Status ───────────────────────────────────────────────────────────

interface SquadTransaction {
  transaction_amount: number
  transaction_status: string
  transaction_date: string
  customer_identifier: string
}

interface SquadTransactionsResponse {
  success: boolean
  data: {
    count: number
    rows: SquadTransaction[]
  }
}

/**
 * Maps Squad virtual account transaction history to our EscrowStatus.
 * Squad has no single "is-paid" endpoint — we query transaction rows instead.
 */
export async function checkPaymentStatus(
  txRef: string,
): Promise<PaymentStatusResponse> {
  const res = await squadClient.get<SquadTransactionsResponse>(
    `/virtual-account/customer/transactions/${txRef}`,
  )

  const rows = res.data?.data?.rows ?? []
  const completed = rows.find(
    (t) => t.transaction_status?.toLowerCase() === 'complete' ||
           t.transaction_status?.toLowerCase() === 'successful',
  )

  const status: EscrowStatus = completed ? 'funds_received' : 'awaiting_payment'

  return {
    status,
    txRef,
    amountPaid: completed ? completed.transaction_amount : undefined,
    paidAt: completed ? completed.transaction_date : undefined,
  }
}

// ── Transfer (Payout) ─────────────────────────────────────────────────────

export interface AccountLookupResult {
  account_name: string
  account_number: string
}

export async function lookupAccount(
  bankCode: string,
  accountNumber: string,
): Promise<AccountLookupResult> {
  const res = await squadClient.post<{ data: AccountLookupResult }>(
    '/payout/account/lookup',
    { bank_code: bankCode, account_number: accountNumber },
  )
  return res.data.data
}

export async function initiateTransfer(
  payload: InitiateTransferPayload,
): Promise<InitiateTransferResponse> {
  // Squad requires the account to be looked up before transfer
  const verified = await lookupAccount(
    payload.farmerBankCode,
    payload.farmerAccountNumber,
  )

  const res = await squadClient.post<InitiateTransferResponse>('/payout/transfer', {
    transaction_reference: `${payload.txRef}_PAYOUT`,
    amount: String(payload.amount),
    bank_code: payload.farmerBankCode,
    account_number: payload.farmerAccountNumber,
    account_name: verified.account_name,
    currency_id: 'NGN',
    remark: payload.remark ?? `Escrow release for ${payload.txRef}`,
  })

  return res.data
}

export async function requeryTransfer(
  transactionReference: string,
): Promise<InitiateTransferResponse> {
  const res = await squadClient.post<InitiateTransferResponse>(
    '/payout/requery',
    { transaction_reference: transactionReference },
  )
  return res.data
}

// ── Sandbox only ─────────────────────────────────────────────────────────────

/** Simulates a payment hitting a virtual account. Only works in sandbox.
 *  amount is in Naira (e.g. 5000 = ₦5,000). Squad expects it as a string. */
export async function simulatePayment(
  virtualAccountNumber: string,
  amountNaira: number,
): Promise<void> {
  await squadClient.post('/virtual-account/simulate/payment', {
    virtual_account_number: virtualAccountNumber,
    amount: String(amountNaira),
  })
}
