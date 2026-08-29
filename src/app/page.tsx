"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeIndianRupee,
  CreditCard,
  KeyRound,
  Landmark,
  Smartphone,
  TimerReset,
  CheckCircle2,
  CircleAlert,
  Search,
  Sparkles,
  HelpCircle,
  Lock,
  History,
  AlertCircle
} from "lucide-react";
import { demoUser, formatCurrency } from "@/lib/mock-data";
import { fallbackDiagnose } from "@/lib/diagnose-utils";

const problems = [
  {
    title: "Money was deducted",
    description: "The money left your account, but the recipient hasn't received it.",
    icon: BadgeIndianRupee,
    action: "wizard",
    initialGoal: "send_money",
    initialDeducted: "yes",
    featured: true
  },
  {
    title: "Payment failed",
    description: "Understand whether you should retry or wait.",
    icon: CircleAlert,
    action: "wizard",
    initialGoal: "send_money",
    initialDeducted: "no"
  },
  {
    title: "Payment is pending",
    description: "See what pending means and if the money is safe.",
    icon: TimerReset,
    action: "wizard",
    initialGoal: "send_money",
    initialDeducted: "not_sure"
  },
  {
    title: "MPIN / TPIN isn't working",
    description: "Guides for blocked PINs or authentication errors.",
    icon: KeyRound,
    action: "wizard",
    initialGoal: "pin_auth"
  },
  {
    title: "My account is blocked",
    description: "Understand security restrictions or account lockouts.",
    icon: Lock,
    action: "wizard",
    initialGoal: "account_blocked"
  },
  {
    title: "Banking service isn't working",
    description: "Diagnose server-side downtime and app outages.",
    icon: Landmark,
    action: "wizard",
    initialGoal: "service_outage"
  }
];

export default function Home() {
  const router = useRouter();

  // Natural Language Input State
  const [nlQuery, setNlQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [diagnosisSource, setDiagnosisSource] = useState<"ai" | "fallback" | null>(null);

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardAnswers, setWizardAnswers] = useState({
    goal: "",
    outcome: "",
    deducted: "",
    history: ""
  });

  // Handle Natural Language Analysis
  async function handleNlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nlQuery.trim()) return;

    setIsLoading(true);
    setDiagnosisResult(null);
    setDiagnosisSource(null);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: nlQuery })
      });

      if (!res.ok) throw new Error("Diagnosis API failed");

      const data = await res.json();
      setDiagnosisResult(data.result);
      setDiagnosisSource(data.source);
    } catch (err) {
      console.error(err);
      // Run deterministic local classification fallback
      const fallbackResult = fallbackDiagnose(nlQuery);
      setDiagnosisResult(fallbackResult);
      setDiagnosisSource("fallback");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Wizard selection
  function handleWizardSelect(field: string, value: string) {
    const updatedAnswers = { ...wizardAnswers, [field]: value };
    setWizardAnswers(updatedAnswers);

    if (field === "goal") {
      if (value === "send_money") {
        setWizardStep(2); // Ask what went wrong
      } else if (value === "pin_auth") {
        // Direct route for PIN issues
        setWizardAnswers((prev) => ({ ...prev, outcome: "pin_fail" }));
        setWizardStep(4);
      } else if (value === "service_outage") {
        router.push("/help?issue=login");
      } else if (value === "otp_issue") {
        router.push("/help?issue=otp");
      } else if (value === "card_issue") {
        router.push("/help?issue=card");
      } else if (value === "account_blocked") {
        // Blocked account
        router.push("/help?issue=login&sub=blocked");
      } else {
        setWizardStep(2);
      }
    } else if (field === "outcome") {
      if (wizardAnswers.goal === "send_money") {
        if (value === "pending") {
          router.push("/help?issue=pending");
        } else {
          setWizardStep(3); // Ask if debited
        }
      } else if (wizardAnswers.goal === "pin_auth") {
        if (value === "mpin") {
          router.push("/help?issue=login&sub=mpin");
        } else {
          router.push("/help?issue=login&sub=tpin");
        }
      } else {
        router.push("/help?issue=failed");
      }
    } else if (field === "deducted") {
      setWizardStep(4); // Ask if in history
    } else if (field === "history") {
      // Evaluate result
      evaluateWizard(updatedAnswers);
    }
  }

  function evaluateWizard(answers: typeof wizardAnswers) {
    if (answers.goal === "send_money") {
      if (answers.deducted === "yes" && answers.history === "yes") {
        router.push("/resolution/NVN-48291"); // Hero transaction
      } else if (answers.deducted === "no") {
        router.push("/help?issue=failed"); // Priya Mehta ₹3,200 (failed, no debit)
      } else {
        // Pending or not sure
        router.push("/help?issue=pending");
      }
    } else {
      router.push("/help?issue=failed");
    }
  }

  function startWizardWithDefaults(goal: string, deducted?: string) {
    setIsWizardOpen(true);
    setWizardAnswers({
      goal: goal,
      outcome: goal === "send_money" ? "failed" : "",
      deducted: deducted || "",
      history: ""
    });

    if (goal === "send_money") {
      if (deducted) {
        setWizardStep(4); // Skip to history check
      } else {
        setWizardStep(2); // What went wrong
      }
    } else if (goal === "pin_auth") {
      setWizardStep(2); // Ask MPIN or TPIN
    } else if (goal === "service_outage") {
      router.push("/help?issue=login");
    } else if (goal === "account_blocked") {
      router.push("/help?issue=login&sub=blocked");
    } else {
      setWizardStep(1);
    }
  }

  function getResultLink(category: string, txId: string) {
    if (category === "DEBITED_TRANSACTION_FAILED" || txId === "NVN-48291") {
      return "/resolution/NVN-48291";
    }
    if (category === "FAILED_TRANSACTION_NO_DEBIT" || txId === "NVN-48233") {
      return "/help?issue=failed";
    }
    if (category === "PENDING_TRANSACTION") {
      return "/help?issue=pending";
    }
    if (category === "MPIN_AUTHENTICATION_FAILURE") {
      return "/help?issue=login&sub=mpin";
    }
    if (category === "TPIN_AUTHENTICATION_FAILURE") {
      return "/help?issue=login&sub=tpin";
    }
    if (category === "OTP_NOT_ARRIVING") {
      return "/help?issue=otp";
    }
    if (category === "CARD_ISSUE") {
      return "/help?issue=card";
    }
    if (category === "SERVICE_OUTAGE") {
      return "/help?issue=login";
    }
    if (category === "ACCOUNT_BLOCKED") {
      return "/help?issue=login&sub=blocked";
    }
    return "/transactions";
  }

  return (
    <main className="min-h-screen bg-[#fafcfb] text-[#14211b] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Banner */}
        <header className="flex items-center justify-between border-b border-[#e8ece9] pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg text-xl font-bold tracking-tight text-[#0b6b4e]"
            aria-label="Nivaran home"
          >
            <span className="grid size-10 place-items-center rounded-2xl bg-[#0b6b4e] text-lg font-bold text-white shadow-md">
              नि
            </span>
            NIVARAN
          </Link>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#e8f7ee] border border-[#b9d8c8] px-3 py-1 text-xs font-semibold text-[#0b6b4e]">
              Prototype State Machine
            </span>
            <span className="hidden rounded-full bg-[#f0f4f1] px-3 py-1 text-xs font-medium text-[#526158] sm:inline">
              Synthetic Banking
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#e8f7ee] border border-[#b9d8c8] px-3 py-1 text-sm font-semibold text-[#176b3a]">
              <Sparkles size={14} className="text-[#0b6b4e]" /> Banking problems, resolved.
            </p>

            <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-[#14211b] sm:text-6xl leading-[1.1]">
              Don&apos;t just see an error. <br />
              <span className="text-[#0b6b4e]">Help us resolve it.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#526158]">
              Vague errors block transactions and force you to visit branches. Nivaran checks synthetic banking logs, identifies issues, and walks you through digital resolution in plain, clear language.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => router.push("/resolution/NVN-48291")}
                className="min-h-12 inline-flex items-center gap-2 rounded-xl bg-[#0b6b4e] px-6 py-3 font-semibold text-white shadow-lg shadow-[#0b6b4e]/20 transition hover:bg-[#07513b] hover:translate-y-[-1px]"
              >
                Try Demo <ArrowRight size={18} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsWizardOpen(true);
                  setWizardStep(1);
                  setWizardAnswers({ goal: "", outcome: "", deducted: "", history: "" });
                  const wizardElem = document.getElementById("wizard-playground");
                  if (wizardElem) {
                    wizardElem.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="min-h-12 inline-flex items-center gap-2 rounded-xl border border-[#b9d8c8] bg-white px-5 py-3 font-semibold text-[#0b6b4e] transition hover:bg-[#e8f7ee]"
              >
                Guided Diagnose
              </button>
            </div>

            <p className="mt-4 text-xs text-[#78867e]">
              No real accounts or cards. Standard simulated sandbox data.
            </p>
          </div>

          {/* Quick Demo Panel */}
          <aside className="rounded-3xl border border-[#dce5de] bg-white p-6 shadow-xl shadow-[#14211b]/03 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#e8f7ee] rounded-full translate-x-8 -translate-y-8 blur-2xl"></div>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#eef3ef] text-[#0b6b4e]">
              <Landmark size={22} aria-hidden="true" />
            </div>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#607067]">
              Interactive Hero Case
            </h3>

            <div className="mt-3 p-4 rounded-2xl bg-[#f4fbf7] border border-[#d2e8dc]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0b6b4e] bg-[#e8f7ee] px-2 py-0.5 rounded">IMPS Transfer</span>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">Failed after debit</span>
              </div>
              <p className="mt-3 text-2xl font-black text-[#14211b]">₹5,000</p>
              <p className="text-sm font-medium text-[#526158]">To: Rahul Sharma</p>
              <div className="mt-3 flex items-center justify-between text-xs text-[#78867e] border-t border-[#d2e8dc]/60 pt-2.5">
                <span>Account: XXXX 4821</span>
                <span>ID: NVN-48291</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#526158]">
              Your account shows that ₹5,000 was debited, but the banking system returned <strong>“Unable to process transaction”</strong>. What should you do?
            </p>

            <Link
              href="/resolution/NVN-48291"
              className="mt-5 w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b6b4e] text-sm font-bold text-white transition hover:bg-[#07513b]"
            >
              Start Hero Journey Resolution <ArrowRight size={16} />
            </Link>
          </aside>
        </section>

        {/* Natural Language Diagnostic Input */}
        <section className="mt-6 scroll-mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 shadow-md sm:p-8">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b6b4e] inline-flex items-center gap-1">
              <Sparkles size={13} /> Natural-Language Diagnosis
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Describe your problem in plain words</h2>
            <p className="mt-1 text-sm text-[#607067]">
              Describe the error, debit, pin failure, or crash. Nivaran AI will classify the category and find next steps.
            </p>
          </div>

          <form onSubmit={handleNlSubmit} className="relative flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-[#78867e]" size={18} />
              <input
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder="e.g. I tried paying Rahul 5000 and it failed, but money got debited from my account."
                className="w-full min-h-12 rounded-xl border border-[#b9d8c8] bg-white pl-11 pr-4 text-base text-[#14211b] outline-none transition focus:border-[#0b6b4e] focus:ring-1 focus:ring-[#0b6b4e]"
                maxLength={400}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !nlQuery.trim()}
              className="min-h-12 rounded-xl bg-[#0b6b4e] px-6 font-semibold text-white shadow-md shadow-[#0b6b4e]/10 transition hover:bg-[#07513b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Analyzing...
                </>
              ) : (
                "Analyze Issue"
              )}
            </button>
          </form>

          {/* AI diagnosis output */}
          {diagnosisResult && (
            <div className="mt-6 rounded-2xl border border-[#0b6b4e]/20 bg-[#f4fbf7] p-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0b6b4e] bg-[#e8f7ee] px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} /> {diagnosisSource === "ai" ? "AI Classified Issue" : "Local Diagnostic Match"}
                </span>
                <span className="text-xs text-[#78867e]">Category: {diagnosisResult.category}</span>
              </div>
              <p className="mt-4 font-bold text-lg text-[#14211b]">
                {diagnosisResult.category === "DEBITED_TRANSACTION_FAILED"
                  ? "Debited Failure Found"
                  : diagnosisResult.category === "FAILED_TRANSACTION_NO_DEBIT"
                    ? "Failed Payment (No Debit)"
                    : diagnosisResult.category === "PENDING_TRANSACTION"
                      ? "Pending Transaction"
                      : diagnosisResult.category === "MPIN_AUTHENTICATION_FAILURE"
                        ? "MPIN Authentication Issue"
                        : diagnosisResult.category === "TPIN_AUTHENTICATION_FAILURE"
                          ? "TPIN Transaction PIN Issue"
                          : diagnosisResult.category === "OTP_NOT_ARRIVING"
                            ? "OTP Message Not Arriving"
                            : diagnosisResult.category === "CARD_ISSUE"
                              ? "Card Setup Issue"
                              : diagnosisResult.category === "ACCOUNT_BLOCKED"
                                ? "Account Restriction"
                                : diagnosisResult.category === "SERVICE_OUTAGE"
                                  ? "Banking Service Outage"
                                  : "General Query"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#526158]">
                {diagnosisResult.explanation}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 items-center justify-between border-t border-[#e8ece9] pt-4">
                <div className="text-xs text-[#78867e]">
                  {diagnosisResult.matchingTransactionId && diagnosisResult.matchingTransactionId !== "none" ? (
                    <span className="inline-flex items-center gap-1">
                      <History size={13} /> Linked to Transaction: <strong>{diagnosisResult.matchingTransactionId}</strong>
                    </span>
                  ) : (
                    <span>No transaction link required for this category.</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => router.push(getResultLink(diagnosisResult.category, diagnosisResult.matchingTransactionId))}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#0b6b4e] px-4 text-xs font-bold text-white transition hover:bg-[#07513b]"
                >
                  Start Guided Resolution <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Quick suggestions */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-[#607067]">Try describing:</span>
            {[
              "Rahul failed transaction 5000 money debited",
              "TPIN locked",
              "OTP not coming on SMS",
              "session expired error on app"
            ].map((suggest) => (
              <button
                key={suggest}
                type="button"
                onClick={() => {
                  setNlQuery(suggest);
                }}
                className="text-xs bg-[#f0f4f1] text-[#375247] px-2.5 py-1 rounded-full hover:bg-[#e8f7ee] hover:text-[#0b6b4e] transition"
              >
                &ldquo;{suggest}&rdquo;
              </button>
            ))}
          </div>
        </section>

        {/* Guided Wizard & Problem Grid Playground */}
        <section id="wizard-playground" className="mt-10 scroll-mt-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b6b4e]">
                Step-by-step resolve
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Select your situation</h2>
              <p className="mt-1 text-sm text-[#607067]">
                Choose the statement closest to your experience, or use the wizard.
              </p>
            </div>
            {isWizardOpen && (
              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="text-sm font-semibold text-red-600 hover:text-red-800"
              >
                Close Wizard & View Grid
              </button>
            )}
          </div>

          {/* Wizard Interface */}
          {isWizardOpen ? (
            <div className="rounded-3xl border border-[#0b6b4e] bg-[#f4fbf7] p-6 shadow-md transition-all animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#d2e8dc] pb-3 mb-5">
                <span className="text-xs font-bold uppercase text-[#0b6b4e] tracking-wider">
                  Nivaran Guided Diagnostic Wizard (Step {wizardStep} of 4)
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <span
                      key={s}
                      className={`size-2.5 rounded-full ${s <= wizardStep ? "bg-[#0b6b4e]" : "bg-[#d2e8dc]"}`}
                    ></span>
                  ))}
                </div>
              </div>

              {/* Wizard Step 1: Goal */}
              {wizardStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold">What were you trying to do?</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { label: "Send or transfer money", val: "send_money" },
                      { label: "Login / authentication (MPIN/TPIN)", val: "pin_auth" },
                      { label: "Access banking app or check server", val: "service_outage" },
                      { label: "Verify OTP code status", val: "otp_issue" },
                      { label: "Use card or update settings", val: "card_issue" },
                      { label: "My account is restricted", val: "account_blocked" }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleWizardSelect("goal", opt.val)}
                        className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 text-left font-semibold text-[#14211b] hover:bg-[#e8f7ee] hover:border-[#0b6b4e] transition"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wizard Step 2: What happened */}
              {wizardStep === 2 && (
                <div>
                  <h3 className="text-xl font-bold">What went wrong?</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {wizardAnswers.goal === "send_money" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleWizardSelect("outcome", "failed")}
                          className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 text-left font-semibold hover:bg-[#e8f7ee] hover:border-[#0b6b4e] transition"
                        >
                          Transaction failed with error
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWizardSelect("outcome", "pending")}
                          className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 text-left font-semibold hover:bg-[#e8f7ee] hover:border-[#0b6b4e] transition"
                        >
                          Payment is marked as Pending
                        </button>
                      </>
                    ) : wizardAnswers.goal === "pin_auth" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleWizardSelect("outcome", "mpin")}
                          className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 text-left font-semibold hover:bg-[#e8f7ee] hover:border-[#0b6b4e] transition"
                        >
                          MPIN verification fails / locked
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWizardSelect("outcome", "tpin")}
                          className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 text-left font-semibold hover:bg-[#e8f7ee] hover:border-[#0b6b4e] transition"
                        >
                          TPIN authentication failing
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleWizardSelect("outcome", "unknown")}
                          className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 text-left font-semibold hover:bg-[#e8f7ee] hover:border-[#0b6b4e] transition"
                        >
                          General operation error
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="mt-6 text-sm font-semibold text-[#526158] hover:text-[#0b6b4e]"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {/* Wizard Step 3: Was money debited */}
              {wizardStep === 3 && (
                <div>
                  <h3 className="text-xl font-bold">Was money deducted/debited from your bank account?</h3>
                  <p className="mt-1 text-sm text-[#607067]">
                    Please verify your SMS alerts or banking statement if possible.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => handleWizardSelect("deducted", "yes")}
                      className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 font-semibold text-[#a13a2b] hover:bg-[#fff0ed] hover:border-red-600 transition"
                    >
                      ⚠️ Yes, it was debited
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWizardSelect("deducted", "no")}
                      className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 font-semibold text-[#176b3a] hover:bg-[#e8f7ee] hover:border-[#0b6b4e] transition"
                    >
                      No, not debited
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWizardSelect("deducted", "not_sure")}
                      className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 font-semibold text-[#607067] hover:bg-gray-50 transition"
                    >
                      I am not sure
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="mt-6 text-sm font-semibold text-[#526158] hover:text-[#0b6b4e]"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {/* Wizard Step 4: Can you see in transaction history */}
              {wizardStep === 4 && (
                <div>
                  <h3 className="text-xl font-bold">Can you see the transaction in your recent transactions list?</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => handleWizardSelect("history", "yes")}
                      className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 font-semibold hover:bg-[#e8f7ee] hover:border-[#0b6b4e] transition"
                    >
                      Yes, it is visible
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWizardSelect("history", "no")}
                      className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 font-semibold hover:bg-[#e8f7ee] hover:border-[#0b6b4e] transition"
                    >
                      No, not visible
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWizardSelect("history", "not_sure")}
                      className="min-h-12 rounded-xl border border-[#b9d8c8] bg-white p-3 font-semibold hover:bg-gray-50 transition"
                    >
                      Not sure
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="mt-6 text-sm font-semibold text-[#526158] hover:text-[#0b6b4e]"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Grid Layout of Problems */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((problem) => {
                const Icon = problem.icon;

                return (
                  <button
                    key={problem.title}
                    type="button"
                    onClick={() => {
                      if (problem.action === "wizard") {
                        startWizardWithDefaults(problem.initialGoal, problem.initialDeducted);
                        const wizardElem = document.getElementById("wizard-playground");
                        if (wizardElem) {
                          wizardElem.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                    className={`group text-left min-h-44 rounded-2xl border p-5 transition focus:outline-none cursor-pointer ${
                      problem.featured
                        ? "border-[#0b6b4e] bg-[#0b6b4e] text-white shadow-lg shadow-[#0b6b4e]/15 hover:bg-[#07513b]"
                        : "border-[#dce5de] bg-white text-[#14211b] hover:border-[#8fb9a7] hover:shadow-md"
                    }`}
                  >
                    <Icon
                      size={24}
                      aria-hidden="true"
                      className={problem.featured ? "text-[#d8f2e5]" : "text-[#0b6b4e]"}
                    />

                    <div className="mt-6 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">{problem.title}</h3>
                        <p
                          className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                            problem.featured ? "text-[#d8f2e5]/90" : "text-[#607067]"
                          }`}
                        >
                          {problem.description}
                        </p>
                      </div>

                      <ArrowRight
                        size={18}
                        aria-hidden="true"
                        className="mt-1 shrink-0 transition group-hover:translate-x-1"
                      />
                    </div>
                  </button>
                );
              })}

              {/* Something Else Trigger */}
              <button
                type="button"
                onClick={() => {
                  setIsWizardOpen(true);
                  setWizardStep(1);
                  setWizardAnswers({ goal: "", outcome: "", deducted: "", history: "" });
                  const wizardElem = document.getElementById("wizard-playground");
                  if (wizardElem) {
                    wizardElem.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group text-left min-h-44 rounded-2xl border border-[#dce5de] bg-white text-[#14211b] hover:border-[#8fb9a7] hover:shadow-md p-5 transition focus:outline-none cursor-pointer"
              >
                <HelpCircle size={24} aria-hidden="true" className="text-[#0b6b4e]" />
                <div className="mt-6 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">❓ Something else</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#607067]">
                      Diagnose other failures with minimum questions.
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="mt-1 shrink-0 transition group-hover:translate-x-1"
                  />
                </div>
              </button>
            </div>
          )}
        </section>

        {/* Demo Account Box */}
        <section className="mt-10 rounded-2xl border border-[#e8ece9] bg-[#f8faf9] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#607067]">Active Demo Session</p>
              <h4 className="font-semibold mt-1 text-[#14211b]">{demoUser.name}</h4>
              <p className="text-xs text-[#78867e]">Card Number: **** **** **** 4821</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#78867e]">Simulated Account Balance</p>
              <p className="text-xl font-bold text-[#0b6b4e]">{formatCurrency(demoUser.balance)}</p>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-[#e8ece9] py-8 text-center text-xs leading-5 text-[#607067] flex flex-col gap-2">
          <p>निवाण (Nivaran) — Prototype using synthetic banking data. Not affiliated with any real financial institution.</p>
          <p className="text-[#9daaa2]">All outcomes, transactions, and state resolutions are simulated demo states.</p>
        </footer>
      </div>
    </main>
  );
}
