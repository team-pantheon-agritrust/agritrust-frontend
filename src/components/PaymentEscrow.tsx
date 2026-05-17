import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { checkPaymentStatus, verifyDelivery, simulatePayment } from "../api/squad";
import type { EscrowStatus } from "../types";

const POLL_INTERVAL_MS = 10_000;

const STATUS_CONFIG: Record<
  EscrowStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  awaiting_payment: {
    label: "Awaiting Payment",
    color: "#92400e",
    bg: "#fef3c7",
    icon: "⏳",
  },
  funds_received: {
    label: "Funds Received",
    color: "#065f46",
    bg: "#d1fae5",
    icon: "✓",
  },
  approved: {
    label: "Releasing Funds…",
    color: "#1e40af",
    bg: "#dbeafe",
    icon: "↗",
  },
  released: {
    label: "Payment Released",
    color: "#065f46",
    bg: "#d1fae5",
    icon: "✓✓",
  },
  failed: {
    label: "Transfer Failed",
    color: "#991b1b",
    bg: "#fee2e2",
    icon: "✕",
  },
};

export default function PaymentEscrow() {
  const navigate = useNavigate();
  const { scanResult, transactionRef, setTransactionStatus } = useAppContext();

  const paymentDetails = scanResult?.paymentDetails;
  const priceInfo = scanResult?.priceInfo;
  const txRef = transactionRef ?? scanResult?.transactionRef ?? "";

  const [escrowStatus, setEscrowStatus] =
    useState<EscrowStatus>("awaiting_payment");
  const [paidAt, setPaidAt] = useState<string | null>(null);
  const [releaseError, setReleaseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulateError, setSimulateError] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const poll = useCallback(async () => {
    if (!txRef) return;
    try {
      const res = await checkPaymentStatus(txRef);
      if (res.status !== "awaiting_payment") {
        setEscrowStatus(res.status);
        if (res.paidAt) setPaidAt(res.paidAt);
        stopPolling();
      }
    } catch {
      // swallow polling errors silently
    }
  }, [txRef, stopPolling]);

  useEffect(() => {
    if (!txRef || escrowStatus !== "awaiting_payment") return;
    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return stopPolling;
  }, [txRef, escrowStatus, poll, stopPolling]);

  async function handleSimulate() {
    if (!paymentDetails?.accountNumber || !priceInfo) return;
    setIsSimulating(true);
    setSimulateError(null);
    try {
      // totalAmount is formatted like "₦12,500.00" — extract numeric naira value
      const naira = parseFloat(priceInfo.totalAmount.replace(/[^0-9.]/g, ""));
      await simulatePayment(paymentDetails.accountNumber, naira);
      // Optimistically advance — polling can't reliably detect it because
      // the backend's customer_identifier may differ from our txRef
      stopPolling();
      setEscrowStatus("funds_received");
      setPaidAt(new Date().toISOString());
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Simulate failed — check console";
      console.error("[simulate]", err);
      setSimulateError(msg);
    } finally {
      setIsSimulating(false);
    }
  }

  async function handleRelease() {
    if (!txRef) return;
    setIsReleasing(true);
    setReleaseError(null);
    setEscrowStatus("approved");
    try {
      const res = await verifyDelivery(txRef, "approved");
      if (res.status === "success" || res.outcome === "released") {
        setEscrowStatus("released");
        setTransactionStatus("RELEASED");
      } else {
        throw new Error(res.message ?? "Release failed");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Release failed";
      setReleaseError(msg);
      setEscrowStatus("funds_received");
    } finally {
      setIsReleasing(false);
    }
  }

  function copyText(value: string, setter?: (v: boolean) => void) {
    navigator.clipboard.writeText(value);
    if (setter) {
      setter(true);
      setTimeout(() => setter(false), 2000);
    }
  }

  const statusCfg = STATUS_CONFIG[escrowStatus];

  return (
    <div>
      {/* Header */}
      <div className="h-16 bg-white border-b border-slate-900/[0.06] flex items-center px-8 gap-4 sticky top-0 z-50">
        <button
          className="inline-flex items-center justify-center gap-2 py-[7px] px-[14px] text-[13px] font-semibold rounded-[6px] border-0 bg-transparent text-slate-500 cursor-pointer transition-all duration-[220ms] hover:bg-slate-100 hover:text-slate-900"
          onClick={() => navigate("/buyer")}
        >
          ← Back
        </button>
        <div className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">
          Escrow & Payment
        </div>
        <div className="flex-1" />
        {/* Live status pill */}
        <div
          className="inline-flex items-center gap-[6px] py-1 px-3 rounded-full text-[12px] font-semibold"
          style={{ background: statusCfg.bg, color: statusCfg.color }}
        >
          <span>{statusCfg.icon}</span>
          {statusCfg.label}
          {escrowStatus === "awaiting_payment" && (
            <span className="inline-block w-[6px] h-[6px] rounded-full bg-amber-500 animate-pulse ml-1" />
          )}
        </div>
      </div>

      <div className="max-w-[560px] mx-auto p-10 px-8">
        {/* Hero */}
        <div
          className="rounded-[28px] p-8 text-center mb-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#0F172A 0%,#0a2240 100%)",
          }}
        >
          {priceInfo ? (
            <>
              <div className="text-xs text-white/40 font-medium mb-2 tracking-[0.05em] uppercase">
                Amount to Transfer
              </div>
              <div className="text-[52px] font-black tracking-[-0.05em] text-white leading-none mb-2">
                {priceInfo.totalAmount}
              </div>
              <div className="text-[13px] text-white/40">
                {priceInfo.quantity} · {priceInfo.unitPrice} per kg
              </div>
            </>
          ) : (
            <div className="text-white/50 py-4">
              No payment data available. Complete a scan first.
            </div>
          )}

          <div
            className="mt-5 p-3 px-4 rounded-[10px] border border-white/[0.08]"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <p className="text-[13px] text-white/55 leading-[1.5]">
              Funds are held in escrow until delivery is approved. The farmer
              receives payment only after release is confirmed.
            </p>
          </div>
        </div>

        {/* Escrow flow steps */}
        <EscrowSteps current={escrowStatus} />

        {/* Payment instructions — shown only while awaiting */}
        {paymentDetails && escrowStatus === "awaiting_payment" && (
          <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm p-6 mb-5">
            <div className="text-base font-bold tracking-[-0.02em] text-slate-900 mb-4">
              Payment Instructions
            </div>
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-slate-50 rounded-[10px]">
                <div className="text-[11px] text-slate-400 font-medium">Bank</div>
                <div className="text-[14px] font-bold text-slate-900">
                  {paymentDetails.bank}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-[10px]">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Virtual Account Number
                  </div>
                  <div className="text-[16px] font-bold text-slate-900 font-mono tracking-[0.05em]">
                    {paymentDetails.accountNumber}
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyText(paymentDetails.accountNumber, setCopied)
                  }
                  className="inline-flex items-center gap-[6px] py-[6px] px-3 text-[12px] font-semibold rounded-[8px] bg-transparent border-[1.5px] border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-[10px]">
                <div className="text-[11px] text-slate-400 font-medium mb-1">
                  Instructions
                </div>
                <div className="text-[14px] font-semibold text-slate-900">
                  {paymentDetails.instructions}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Funds received — approve & release */}
        {escrowStatus === "funds_received" && (
          <div className="bg-white border border-emerald-200 rounded-[20px] shadow-sm p-6 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-600 text-xl">✓</span>
              <div className="text-base font-bold text-slate-900">
                Payment Confirmed
              </div>
            </div>
            {paidAt && (
              <p className="text-[12px] text-slate-500 mb-4">
                Received at {new Date(paidAt).toLocaleString()}
              </p>
            )}
            <p className="text-[13px] text-slate-600 mb-5 leading-[1.6]">
              The buyer's funds are held in escrow. Once delivery is confirmed,
              click below to release payment to the farmer's account.
            </p>
            {releaseError && (
              <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-[10px] p-3 mb-4">
                {releaseError}
              </div>
            )}
            <button
              onClick={handleRelease}
              disabled={isReleasing}
              className="w-full inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 bg-emerald-600 text-white cursor-pointer transition-all duration-[220ms] hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Approve & Release to Farmer
            </button>
          </div>
        )}

        {/* Released success card */}
        {escrowStatus === "released" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-[20px] p-6 mb-5 text-center">
            <div className="text-4xl mb-3">✓</div>
            <div className="text-[16px] font-bold text-emerald-800 mb-1">
              Payment Released
            </div>
            <p className="text-[13px] text-emerald-700 leading-[1.6]">
              Funds have been transferred to the farmer's bank account
              successfully.
            </p>
          </div>
        )}

        {/* Failed card */}
        {escrowStatus === "failed" && (
          <div className="bg-red-50 border border-red-200 rounded-[20px] p-6 mb-5 text-center">
            <div className="text-4xl mb-3">✕</div>
            <div className="text-[16px] font-bold text-red-800 mb-1">
              Transfer Failed
            </div>
            <p className="text-[13px] text-red-700 leading-[1.6]">
              The transfer to the farmer could not be completed. Please contact
              support with your transaction reference.
            </p>
          </div>
        )}

        {/* Waiting notice — only while polling */}
        {escrowStatus === "awaiting_payment" && (
          <div className="mb-6 flex flex-col gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-[14px] p-4 flex gap-3 items-start">
              <span className="text-amber-500 text-base shrink-0 animate-pulse">
                ⏳
              </span>
              <div>
                <div className="text-[13px] font-bold text-amber-800 mb-1">
                  Waiting for payment confirmation
                </div>
                <p className="text-[12px] text-amber-700 leading-[1.5]">
                  This page checks automatically every 10 seconds. After
                  transferring, leave it open and we'll detect your payment.
                </p>
              </div>
            </div>

            {/* Sandbox-only simulate button */}
            {import.meta.env.DEV && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="w-full inline-flex items-center justify-center gap-2 py-[10px] px-4 text-[13px] font-semibold rounded-[12px] border-[1.5px] border-dashed border-violet-300 bg-violet-50 text-violet-700 cursor-pointer hover:bg-violet-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSimulating ? "Simulating…" : "Simulate Payment (sandbox only)"}
                </button>
                {simulateError && (
                  <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] p-2 font-mono break-all">
                    {simulateError}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Transaction reference */}
        {txRef && (
          <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm p-5 mb-5">
            <div className="text-[13px] font-semibold text-slate-900 mb-2">
              Transaction Reference
            </div>
            <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-[10px]">
              <span className="font-mono text-[13px] font-bold text-slate-900 break-all">
                {txRef}
              </span>
              <button
                onClick={() => copyText(txRef)}
                className="inline-flex items-center gap-[6px] py-[6px] px-3 text-[12px] font-semibold rounded-[8px] bg-transparent border-[1.5px] border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] bg-transparent text-slate-900 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-[220ms] hover:bg-slate-50"
            onClick={() => navigate("/buyer")}
          >
            Back to Dashboard
          </button>
          {escrowStatus === "released" && (
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 py-[14px] px-7 text-[15px] font-semibold rounded-[14px] border-0 bg-[#E0185B] text-white cursor-pointer transition-all duration-[220ms] hover:bg-[#c8144f]"
              onClick={() => navigate("/buyer")}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EscrowSteps({ current }: { current: EscrowStatus }) {
  const steps: { key: EscrowStatus; label: string }[] = [
    { key: "awaiting_payment", label: "Buyer Pays" },
    { key: "funds_received", label: "Funds in Escrow" },
    { key: "approved", label: "Delivery Approved" },
    { key: "released", label: "Farmer Paid" },
  ];

  const order: EscrowStatus[] = [
    "awaiting_payment",
    "funds_received",
    "approved",
    "released",
  ];
  const currentIdx = order.indexOf(current === "failed" ? "approved" : current);

  return (
    <div className="bg-white border border-slate-900/[0.06] rounded-[20px] shadow-sm p-5 mb-5">
      <div className="flex items-center justify-between gap-1">
        {steps.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors"
                  style={{
                    background: done
                      ? "#059669"
                      : active
                      ? "#0F172A"
                      : "#f1f5f9",
                    color: done || active ? "#fff" : "#94a3b8",
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>
                <div
                  className="text-[10px] font-semibold text-center leading-tight"
                  style={{
                    color: done
                      ? "#059669"
                      : active
                      ? "#0F172A"
                      : "#94a3b8",
                  }}
                >
                  {step.label}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="flex-1 h-[2px] mx-1 mb-4 rounded-full transition-colors"
                  style={{ background: done ? "#059669" : "#e2e8f0" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
