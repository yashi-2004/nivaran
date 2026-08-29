"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Copy,
  FileText,
  Landmark,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { AiExplanation } from "@/components/ai-explanation";
import type { ResolutionStatus } from "@/lib/explanation";
import { formatCurrency, demoUser } from "@/lib/mock-data";

const initialStatement =
  "I attempted a ₹5,000 transfer to Rahul Sharma. The amount was debited from my account, but the transaction was not completed.";

interface DiagnosticItem {
  name: string;
  value: string;
  colors: string;
  icon: React.ComponentType<any>;
}

const diagnostics: DiagnosticItem[] = [
  {
    name: "Authentication",
    value: "Completed",
    colors: "bg-[#e8f7ee] text-[#176b3a] border border-[#b9d8c8]",
    icon: ShieldCheck
  },
  {
    name: "Account status",
    value: "Active",
    colors: "bg-[#e8f7ee] text-[#176b3a] border border-[#b9d8c8]",
    icon: CheckCircle2
  },
  {
    name: "Transaction processing",
    value: "Failed",
    colors: "bg-[#fff0ed] text-[#a13a2b] border border-[#f0c9c1]",
    icon: CircleAlert
  },
  {
    name: "Banking service",
    value: "Simulated service issue",
    colors: "bg-[#fff5dc] text-[#8a5900] border border-[#f0dfc1]",
    icon: Landmark
  }
];

export default function ResolutionPage() {
  const [status, setStatus] = useState<ResolutionStatus>("failed_after_debit");
  const [statement, setStatement] = useState(initialStatement);
  const [copied, setCopied] = useState(false);
  const [outcomeType, setOutcomeType] = useState<"refunded" | "completed">("refunded");
  const [isPending, startTransition] = useTransition();
  const [isLoadingTransition, setIsLoadingTransition] = useState(false);

  const isCaseCreated =
    status === "case_created" || status === "under_review" || status === "resolved";

  async function copyCaseId() {
    try {
      await navigator.clipboard.writeText("NVR-2026-48291");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  // Simulate banking network delays to show high-quality loading spinner
  function handleTransition(nextStatus: ResolutionStatus) {
    setIsLoadingTransition(true);
    window.setTimeout(() => {
      startTransition(() => {
        setStatus(nextStatus);
        setIsLoadingTransition(false);
      });
    }, 800);
  }

  function resetDemo() {
    setStatus("failed_after_debit");
    setStatement(initialStatement);
  }

  return (
    <main className="min-h-screen bg-[#fafcfb] text-[#14211b] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#e8ece9] pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg text-xl font-bold tracking-tight text-[#0b6b4e]"
          >
            <span className="grid size-10 place-items-center rounded-2xl bg-[#0b6b4e] text-lg font-bold text-white shadow-md">
              नि
            </span>
            NIVARAN
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold text-[#375247]">
              Synthetic Case Mode
            </span>
            {(status === "resolved" || status === "under_review") && (
              <button
                type="button"
                onClick={resetDemo}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#dce5de] hover:bg-[#e8f7ee] text-xs font-bold text-[#526158] hover:text-[#0b6b4e] px-3 py-1.5 transition"
              >
                <RotateCcw size={12} /> Reset Demo
              </button>
            )}
          </div>
        </header>

        {/* Back Link */}
        <Link
          href="/transactions"
          className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#526158] hover:text-[#0b6b4e] transition"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to transactions
        </Link>

        {/* Loading Overlay for State Transition */}
        {isLoadingTransition && (
          <div className="fixed inset-0 z-50 bg-[#fafcfb]/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <RefreshCw className="animate-spin text-[#0b6b4e] mb-3" size={32} />
            <p className="text-sm font-bold text-[#375247]">Updating synthetic banking state...</p>
          </div>
        )}

        {/* STAGE 1: Transaction Failure (Deducted but failed) */}
        {!isCaseCreated && (
          <div className="space-y-6">
            <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#eef2f0] pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#a13a2b] bg-[#fff0ed] px-2.5 py-1 rounded">
                    Payment Issue Identified
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] mt-3">
                    ₹5,000 payment
                  </h1>
                  <p className="mt-1 text-base font-semibold text-[#526158]">
                    Recipient: <span className="text-[#14211b]">Rahul Sharma</span> · Today, 4:18 PM
                  </p>
                  <p className="mt-2 text-xs text-[#78867e]">
                    Synthetic Transaction ID:{" "}
                    <code className="rounded bg-[#eef3ef] px-1.5 py-0.5 font-bold text-[#14211b]">
                      NVN-48291
                    </code>
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-[#fff0ed] border border-[#f0c9c1] px-3.5 py-1.5 text-sm font-bold text-[#a13a2b]">
                    Failed after debit
                  </span>
                </div>
              </div>

              {/* What this means */}
              <div className="mt-6 rounded-2xl bg-[#fff6f4] border border-[#f5deda] p-5">
                <h2 className="text-lg font-bold text-[#8c2e20] flex items-center gap-2">
                  <CircleAlert size={20} /> What this means
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#7c3d35]">
                  Your account shows that ₹5,000 was debited, but the transaction did not successfully complete. The recipient bank has not confirmed the credit.
                </p>
                <div className="mt-5 flex gap-3 border-t border-[#f0c9c1] pt-4">
                  <CircleAlert className="shrink-0 text-[#a13a2b] mt-0.5" size={18} aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-sm text-[#14211b]">⚠️ Don&apos;t try the payment again yet.</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#526158]">
                      The original transaction still needs to be resolved. Retrying immediately could cause a duplicate debit or complicate recovery.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Explanation Injection */}
              <AiExplanation status={status} />
            </section>

            {/* Diagnosis Indicators */}
            <section className="rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b6b4e] bg-[#e8f7ee] px-2.5 py-1 rounded">
                Diagnostic Analysis
              </span>
              <h2 className="mt-3 text-2xl font-bold">What could be causing this?</h2>
              <p className="mt-1 text-sm text-[#607067]">
                Nivaran cross-references transaction status logs against the banking services status table.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {diagnostics.map((diag) => {
                  const StatusIcon = diag.icon;
                  return (
                    <div
                      key={diag.name}
                      className="rounded-2xl border border-[#e8ece9] p-4 flex flex-col justify-between min-h-[110px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#526158]">{diag.name}</span>
                        <StatusIcon size={18} className="text-[#0b6b4e]" aria-hidden="true" />
                      </div>
                      <p className={`mt-3 inline-flex self-start rounded-full px-2.5 py-0.5 text-xs font-bold ${diag.colors}`}>
                        {diag.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl bg-[#eef3ef] border border-[#dce5de] p-4 text-sm text-[#375247]">
                <span>
                  🔴 <strong>Transaction Processing Failure:</strong> The local simulator indicates a degraded service response between banks. This represents simulated system metadata, not live bank networks.
                </span>
              </div>
            </section>

            {/* CTAs */}
            <section className="rounded-3xl bg-[#14211b] p-6 text-white sm:p-8 shadow-md">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#a7d9c2]">
                Action Recommendation
              </span>
              <h2 className="mt-2 text-2xl font-bold">What are your next steps?</h2>

              <div className="mt-5 grid gap-6 sm:grid-cols-2 border-b border-white/10 pb-6">
                <div>
                  <h3 className="font-bold text-[#a7d9c2] flex items-center gap-1.5">
                    ✓ You can do this yourself
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#e3ece6]/90">
                    <li>• Check transaction status inside history</li>
                    <li>• Keep transaction ID <code className="bg-white/10 px-1 py-0.5 rounded font-mono">NVN-48291</code></li>
                    <li>• Avoid retrying the transfer to Rahul Sharma</li>
                    <li>• Review recipient details for accuracy</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-red-300 flex items-center gap-1.5">
                    → Bank action may be required
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#e3ece6]/90">
                    <li>• Transaction investigation at processing layer</li>
                    <li>• Auto-reversal trigger for failed settlement</li>
                    <li>• Safe service correction check</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-[#a7d9c2]/80 max-w-md">
                  Nivaran will structure this diagnostic report so you don&apos;t have to explain the logs again to support.
                </p>
                <button
                  type="button"
                  onClick={() => handleTransition("case_created")}
                  className="min-h-12 rounded-xl bg-white px-6 py-3 font-semibold text-[#14211b] transition hover:bg-[#e8f7ee] cursor-pointer flex items-center gap-1.5"
                >
                  Start Resolution <ArrowRight size={16} />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* STAGE 2: Resolution Case review & Creation */}
        {status === "case_created" && (
          <div className="space-y-6 animate-fadeIn">
            <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b6b4e] bg-[#e8f7ee] px-2.5 py-1 rounded">
                Resolution Package
              </span>
              <h1 className="text-3xl font-extrabold mt-3">Let&apos;s resolve this</h1>
              <p className="mt-2 text-sm text-[#526158]">
                Nivaran auto-packages system log metadata with the transaction details. This eliminates repeating descriptions to support teams.
              </p>
            </section>

            <section className="rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#eef2f0] pb-4">
                <FileText className="text-[#0b6b4e]" size={22} aria-hidden="true" />
                <div>
                  <h2 className="text-xl font-bold">Review resolution request</h2>
                  <p className="text-xs text-[#607067]">Check details before generating synthetic case ID.</p>
                </div>
              </div>

              <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold text-[#607067] uppercase tracking-wide">Transaction Amount</dt>
                  <dd className="mt-1 font-semibold text-lg">₹5,000</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-[#607067] uppercase tracking-wide">Recipient</dt>
                  <dd className="mt-1 font-semibold text-lg">Rahul Sharma</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-[#607067] uppercase tracking-wide">Transaction ID</dt>
                  <dd className="mt-1 font-mono font-bold text-sm bg-[#eef3ef] px-1.5 py-0.5 rounded inline-block">
                    NVN-48291
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-[#607067] uppercase tracking-wide">Detected Issue</dt>
                  <dd className="mt-1 font-semibold text-[#a13a2b]">Transaction processing failure (debit pending)</dd>
                </div>
              </dl>

              <div className="mt-6">
                <label className="block text-sm font-bold text-[#14211b]" htmlFor="user-statement">
                  Describe what happened (editable statement)
                </label>
                <textarea
                  id="user-statement"
                  value={statement}
                  onChange={(event) => setStatement(event.target.value)}
                  maxLength={500}
                  className="mt-2 min-h-24 w-full rounded-xl border border-[#b9d8c8] bg-white p-3.5 text-sm text-[#14211b] focus:border-[#0b6b4e] focus:ring-1 focus:ring-[#0b6b4e] outline-none leading-relaxed"
                />
              </div>

              <div className="mt-6 border-t border-[#eef2f0] pt-5 flex items-center justify-between flex-wrap gap-4">
                <p className="text-xs text-[#78867e]">
                  🔒 No PINs, card CVVs, or bank logins are packaged. Only transaction metadata is collected.
                </p>
                <button
                  type="button"
                  onClick={() => handleTransition("under_review")}
                  className="min-h-12 rounded-xl bg-[#0b6b4e] px-6 py-3 font-semibold text-white hover:bg-[#07513b] transition flex items-center gap-1.5"
                >
                  Create Resolution Request <ArrowRight size={16} />
                </button>
              </div>
            </section>

            <AiExplanation status={status} />
          </div>
        )}

        {/* STAGE 3 & 4: Tracker & Outcome */}
        {(status === "under_review" || status === "resolved") && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Status */}
            <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b6b4e] bg-[#e8f7ee] px-2.5 py-1 rounded">
                Case Management
              </span>
              <h1 className="text-3xl font-extrabold mt-3">
                {status === "resolved" ? "✅ Resolution complete" : "⏳ Case is being checked"}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 bg-[#eef3ef] border border-[#dce5de] p-3 rounded-2xl">
                <span className="text-xs font-bold text-[#526158] uppercase">Case ID</span>
                <code className="rounded bg-white px-2.5 py-1 text-sm font-bold text-[#0b6b4e]">
                  NVR-2026-48291
                </code>
                <button
                  type="button"
                  onClick={copyCaseId}
                  className="inline-flex min-h-8 items-center gap-1 rounded bg-[#0b6b4e] text-white hover:bg-[#07513b] px-3.5 text-xs font-bold transition ml-auto"
                >
                  <Copy size={12} aria-hidden="true" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {status === "resolved" ? (
                <div className="mt-6 rounded-2xl bg-[#e8f7ee] border border-[#b9d8c8] p-5">
                  <h3 className="font-bold text-[#176b3a] flex items-center gap-1.5">
                    <Sparkles size={18} /> Simulated Demo Outcome: {outcomeType === "refunded" ? "Amount Returned" : "Payment Confirmed"}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#375247]">
                    {outcomeType === "refunded"
                      ? "In this simulated outcome, ₹5,000 was reversed back to Yash Sharma's account (XXXX 4821). Balance updated successfully."
                      : "In this simulated outcome, the payment was resolved forward. Rahul Sharma received ₹5,000 successfully."}
                  </p>
                  <p className="mt-3 text-xs font-medium text-[#78867e] border-t border-[#b9d8c8] pt-2">
                    💡 <strong>Safety note:</strong> This represents a demonstration state machine. No real money transfer or refund occurred.
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-[#526158]">
                  Your request was sent. The simulator is currently performing a diagnostic check on the transaction records.
                </p>
              )}
            </section>

            {/* Tracker list */}
            <section className="rounded-3xl bg-[#14211b] p-6 text-white sm:p-8 shadow-md">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <ClipboardCheck className="text-[#a7d9c2]" size={22} aria-hidden="true" />
                <div>
                  <h2 className="text-xl font-bold">Resolution tracker</h2>
                  <p className="text-xs text-[#a7d9c2]/80">Track the lifecycle of case NVR-2026-48291</p>
                </div>
              </div>

              <ol className="mt-6 space-y-6 relative pl-3">
                <div className="absolute left-6 top-3 bottom-3 w-[1px] bg-white/20"></div>
                {[
                  {
                    title: "Problem identified",
                    complete: true,
                    desc: "Simulated logs confirmed debit without recipient credit."
                  },
                  {
                    title: "Transaction details collected",
                    complete: true,
                    desc: "System metadata (ID NVN-48291, amount ₹5,000) collected."
                  },
                  {
                    title: "Resolution request created",
                    complete: true,
                    desc: "Package submitted with user statement."
                  },
                  {
                    title: "Bank-side investigation",
                    complete: status === "under_review" || status === "resolved",
                    desc: "The transaction is being cross-referenced between partner networks."
                  },
                  {
                    title: "Resolution",
                    complete: status === "resolved",
                    desc: status === "resolved" ? "Simulated resolution is finalized." : "Pending outcome."
                  },
                  {
                    title: "Closed",
                    complete: status === "resolved",
                    desc: status === "resolved" ? "Simulated demo transaction completed." : "Awaiting validation."
                  }
                ].map((step, idx) => (
                  <li key={step.title} className="flex gap-4 relative z-10">
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        step.complete
                          ? "bg-[#a7d9c2] text-[#14211b] shadow-md shadow-[#a7d9c2]/10"
                          : "border border-white/30 bg-[#14211b] text-white/50"
                      }`}
                    >
                      {step.complete ? <Check size={14} aria-hidden="true" /> : idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-sm sm:text-base">{step.title}</p>
                      <p className="mt-1 text-xs text-[#e3ece6]/80 leading-relaxed">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Progress control */}
              {status !== "resolved" && (
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <label className="text-sm font-semibold block">Choose simulated final state:</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOutcomeType("refunded")}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                          outcomeType === "refunded"
                            ? "bg-white text-[#14211b] border-white"
                            : "bg-transparent text-white border-white/30 hover:border-white"
                        }`}
                      >
                        🔄 Simulated Refund (Amount Returned)
                      </button>
                      <button
                        type="button"
                        onClick={() => setOutcomeType("completed")}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                          outcomeType === "completed"
                            ? "bg-white text-[#14211b] border-white"
                            : "bg-transparent text-white border-white/30 hover:border-white"
                        }`}
                      >
                        ✓ Simulated Credit (Payment Confirmed)
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTransition("resolved")}
                    className="min-h-12 rounded-xl bg-white px-6 py-3 font-semibold text-[#14211b] hover:bg-[#e8f7ee] transition flex items-center justify-center gap-1.5 self-start cursor-pointer"
                  >
                    Resolve Demo Case <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </section>

            <AiExplanation status={status} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-[#dce5de] py-6 text-center text-xs leading-5 text-[#607067] flex flex-col gap-1.5">
          <p>निवारण (Nivaran) — Prototype using synthetic banking data. Not affiliated with any real bank.</p>
          <p className="text-[#a0aca3]">All processes and status modifications represent simulated user interface logic.</p>
        </footer>
      </div>
    </main>
  );
}
