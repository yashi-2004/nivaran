"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Landmark,
  Lock,
  TimerReset,
  ShieldAlert,
  ArrowRight,
  History
} from "lucide-react";
import { formatCurrency, demoUser } from "@/lib/mock-data";

type Issue = "failed" | "pending" | "login" | "otp" | "card";
type SubIssue = "mpin" | "tpin" | "blocked" | "none";

interface IssueDetails {
  eyebrow: string;
  title: string;
  description: string;
}

const issueCopy: Record<Issue, IssueDetails> = {
  failed: {
    eyebrow: "Payment Failed",
    title: "This payment did not go through.",
    description: "In this simulated case, ₹3,200 to Priya Mehta was not debited from your account. It is safe to check the recipient details and retry once verified."
  },
  pending: {
    eyebrow: "Payment Pending",
    title: "Pending means the bank is awaiting confirmation.",
    description: "A pending payment is not yet completed, but money has likely left your account. Avoid retrying immediately to prevent double debits."
  },
  login: {
    eyebrow: "Login Diagnosis",
    title: "This looks like an app issue, not your credentials.",
    description: "Based on the simulated system status logs below, your account profile is normal but the app server is responding slowly."
  },
  otp: {
    eyebrow: "OTP Assistance",
    title: "Checking why your verification SMS is not arriving.",
    description: "OTP delays are usually network or carrier-related. Check standard phone settings before attempting resets."
  },
  card: {
    eyebrow: "Card Transaction Issue",
    title: "Let&apos;s check basic card settings.",
    description: "Cards are often declined due to expired dates, domestic transaction limits, or international toggle blocks."
  }
};

const subIssueCopy: Record<Exclude<SubIssue, "none">, IssueDetails> = {
  mpin: {
    eyebrow: "MPIN Lockout",
    title: "MPIN repeatedly failed or locked.",
    description: "Your Mobile PIN controls app access. Vague errors often mask a temporary security lockout triggered by multiple incorrect entries."
  },
  tpin: {
    eyebrow: "TPIN Authentication Failure",
    title: "TPIN verification failed at final step.",
    description: "Your Transaction PIN verifies transfers. If the TPIN fails, your funds are safe, but transfers will remain disabled."
  },
  blocked: {
    eyebrow: "Account Restricted",
    title: "Security lock or restricted profile status.",
    description: "The banking backend has placed a security hold on the account. This occurs due to unusual transactions or login patterns."
  }
};

function HelpContent() {
  const searchParams = useSearchParams();
  const requestedIssue = searchParams.get("issue");
  const requestedSub = searchParams.get("sub") || "none";

  const issue: Issue = ["failed", "pending", "login", "otp", "card"].includes(requestedIssue as string)
    ? (requestedIssue as Issue)
    : "failed";

  const subIssue = ["mpin", "tpin", "blocked", "none"].includes(requestedSub)
    ? (requestedSub as SubIssue)
    : "none";

  const [otpChecks, setOtpChecks] = useState<string[]>([]);
  const [symptom, setSymptom] = useState(
    subIssue === "mpin"
      ? "three incorrect attempts"
      : subIssue === "tpin"
        ? "payment declined at tpin"
        : subIssue === "blocked"
          ? "unusual login warning"
          : "keeps returning to login"
  );

  const toggleOtpCheck = (check: string) => {
    setOtpChecks((current) =>
      current.includes(check) ? current.filter((item) => item !== check) : [...current, check]
    );
  };

  // Get active titles & descriptions based on sub-issue overrides
  const activeCopy = subIssue !== "none" ? subIssueCopy[subIssue] : issueCopy[issue];

  return (
    <main className="min-h-screen bg-[#fafcfb] text-[#14211b] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
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
          <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold text-[#375247]">
            Synthetic Demo
          </span>
        </header>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#526158] hover:text-[#0b6b4e] transition"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to problems
        </Link>

        {/* Main Info Section */}
        <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0b6b4e] bg-[#e8f7ee] px-2.5 py-1 rounded">
            {activeCopy.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {activeCopy.title}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#526158]">
            {activeCopy.description}
          </p>
        </section>

        {/* Dynamic Details block */}

        {/* FAILED PAYMENT */}
        {issue === "failed" && subIssue === "none" && (
          <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4 pb-5 border-b border-[#eef2f0]">
              <div className="grid size-11 place-items-center rounded-full bg-[#fff0ed] text-[#a13a2b] shrink-0 border border-[#f0c9c1]">
                <CircleAlert size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#14211b]">{formatCurrency(3200)}</p>
                <p className="text-sm font-bold text-[#526158]">To: Priya Mehta</p>
                <p className="mt-1 text-xs text-[#78867e]">
                  Status: <span className="font-bold text-[#a13a2b]">Failed</span> · IMPS · No money debited
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#e8f7ee] border border-[#b9d8c8] p-5">
              <h3 className="font-bold text-[#176b3a]">Recommended next step</h3>
              <p className="mt-1.5 text-xs text-[#607067]">
                Since the money was not deducted from your account, this transaction is safe.
              </p>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#375247]">
                <li>• Verify if Priya Mehta&apos;s account details (IFSC / Account number) are correct.</li>
                <li>• Ensure your daily transfer limits are not exceeded.</li>
                <li>• It is safe to re-initiate the payment once recipient details are checked.</li>
              </ul>
            </div>
          </section>
        )}

        {/* PENDING PAYMENT */}
        {issue === "pending" && subIssue === "none" && (
          <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4 pb-5 border-b border-[#eef2f0]">
              <div className="grid size-11 place-items-center rounded-full bg-[#fff5dc] text-[#8a5900] shrink-0 border border-[#f0dfc1]">
                <TimerReset size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#14211b]">{formatCurrency(5000)}</p>
                <p className="text-sm font-bold text-[#526158]">To: Rahul Sharma</p>
                <p className="mt-1 text-xs text-[#78867e]">
                  Status: <span className="font-bold text-[#8a5900]">Pending</span> · IMPS · Money debited
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#fff6f4] border border-[#f5deda] p-5">
              <h3 className="font-bold text-[#8c2e20]">⚠️ Don&apos;t try the payment again yet.</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#7c3d35]">
                Your transaction is currently undergoing automated clearing. Retrying could make you pay Rahul twice.
              </p>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#526158]">
                <li>• Wait for 30 minutes to let the bank systems complete reconciliation.</li>
                <li>• Check your SMS alerts for auto-reversal notification.</li>
                <li>• If unresolved, use the <Link href="/resolution/NVN-48291" className="underline font-bold text-[#0b6b4e]">Resolution Center</Link> to log a tracking ID.</li>
              </ul>
            </div>
          </section>
        )}

        {/* MPIN ISSUE */}
        {subIssue === "mpin" && (
          <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold">Simulated lock status</h2>
            
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-red-100 bg-[#fff0ed]/40 p-4">
                <p className="text-xs text-[#78867e] font-semibold uppercase">Authentication Lock</p>
                <p className="mt-2 text-lg font-bold text-[#a13a2b]">⚠️ Locked temporarily</p>
                <p className="text-xs text-[#78867e] mt-1">Retry cooldown: 24 hours</p>
              </div>
              <div className="rounded-2xl border border-[#b9d8c8] bg-white p-4">
                <p className="text-xs text-[#78867e] font-semibold uppercase">Account Profile</p>
                <p className="mt-2 text-lg font-bold text-[#176b3a]">🟢 Normal / Active</p>
                <p className="text-xs text-[#78867e] mt-1">Funds are completely safe</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#fff5dc] border border-[#f0dfc1] p-5">
              <h3 className="font-bold text-[#8a5900] flex items-center gap-1.5">
                <KeyRound size={16} /> MPIN Recovery walkthrough
              </h3>
              <p className="mt-1.5 text-xs text-[#526158]">
                To restore access safely without calling support:
              </p>
              <ol className="mt-3 space-y-2 text-xs text-[#526158] list-decimal pl-4">
                <li>Open your official bank app and tap <strong>&ldquo;Forgot MPIN&rdquo;</strong>.</li>
                <li>Enter the last 6 digits of your active Debit Card plus its expiration date.</li>
                <li>Submit the temporary OTP sent to your registered mobile phone.</li>
                <li>Set a new, secure 4-digit or 6-digit MPIN.</li>
              </ol>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-[#a13a2b]">
              🔒 Nivaran never resets your MPIN. Never share your MPIN, passwords, or OTPs.
            </div>
          </section>
        )}

        {/* TPIN ISSUE */}
        {subIssue === "tpin" && (
          <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold">TPIN safety checklist</h2>
            <p className="text-sm text-[#607067] mt-1">Ensure device and setting checks before resetting.</p>

            <div className="mt-5 space-y-3">
              {[
                { title: "I am using my primary registered mobile device", desc: "TPIN authentication binds to device hardware IDs." },
                { title: "My mobile data / Wi-Fi connection is stable", desc: "Downtime during TPIN check results in lockouts." },
                { title: "My Debit card is active", desc: "A blocked debit card prevents self-service TPIN resets." }
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-2xl border border-[#e8ece9] hover:border-[#b9d8c8] transition">
                  <p className="font-bold text-sm text-[#14211b] flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-[#0b6b4e]" /> {item.title}
                  </p>
                  <p className="text-xs text-[#607067] mt-1 pl-5">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#eef3ef] border border-[#dce5de] p-5">
              <h3 className="font-bold text-[#0b6b4e] flex items-center gap-1.5">
                How to reset your TPIN safely:
              </h3>
              <ol className="mt-3 space-y-2 text-xs leading-relaxed text-[#526158] list-decimal pl-4">
                <li>Log in to your official internet banking or mobile banking portal.</li>
                <li>Go to <strong>Settings &rarr; Security Controls &rarr; Reset Transaction PIN</strong>.</li>
                <li>Select authentication method (Debit Card verification or OTP challenge).</li>
                <li>Enter and confirm your new transaction PIN.</li>
              </ol>
            </div>
          </section>
        )}

        {/* ACCOUNT BLOCKED / RESTRICTED */}
        {subIssue === "blocked" && (
          <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded">
              Security Restriction Details
            </span>

            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/50 p-5">
              <h3 className="font-bold text-[#a13a2b] flex items-center gap-1.5">
                <ShieldAlert size={18} /> Why is the account restricted?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#526158]">
                Banks restrict profiles due to suspected security risks: e.g. logins on unfamiliar devices, bulk transfers to new recipients, or multiple OTP failures.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#dce5de] p-4 bg-white">
                <p className="text-xs text-[#78867e] font-semibold">Account Status</p>
                <p className="mt-2 text-base font-bold text-red-600">🔴 Hold / Restricted</p>
                <p className="text-xs text-[#78867e] mt-1">Debit operations blocked</p>
              </div>
              <div className="rounded-2xl border border-[#dce5de] p-4 bg-white">
                <p className="text-xs text-[#78867e] font-semibold">Funds Protection</p>
                <p className="mt-2 text-base font-bold text-[#176b3a]">🟢 Secured</p>
                <p className="text-xs text-[#78867e] mt-1">Balance cannot be removed</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#fff5dc] border border-[#f0dfc1] p-5">
              <h3 className="font-bold text-[#8a5900]">Recommended safe actions</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#526158]">
                <li>• **Do not repeatedly submit logins.** This flags your IP address at security firewalls.</li>
                <li>• Check your registered email inbox for security alerts from your bank.</li>
                <li>• Keep your registered customer ID and Aadhaar/PAN details ready for verified support.</li>
                <li>• **Visit the nearest branch** if you suspect credential compromise, or call the official bank phone line.</li>
              </ul>
            </div>
          </section>
        )}

        {/* LOGIN & SERVICE OUTAGE */}
        {issue === "login" && subIssue === "none" && (
          <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold">Is it me or the bank?</h2>
            <p className="text-sm text-[#607067] mt-1">
              Comparing your account diagnostics with simulated system health metrics.
            </p>

            <fieldset className="mt-6">
              <legend className="text-xs font-bold text-[#526158] uppercase">Select symptom seen:</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {["keeps returning to login", "session expired repeatedly", "temporary account lock", "application crash"].map(
                  (sym) => (
                    <button
                      key={sym}
                      type="button"
                      aria-pressed={symptom === sym}
                      onClick={() => setSymptom(sym)}
                      className={`min-h-10 rounded-full border px-4 text-xs font-semibold transition cursor-pointer ${
                        symptom === sym
                          ? "border-[#0b6b4e] bg-[#e8f7ee] text-[#0b6b4e] shadow-sm"
                          : "border-[#dce5de] bg-white text-[#526158] hover:border-[#8fb9a7]"
                      }`}
                    >
                      {sym}
                    </button>
                  )
                )}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { name: "Your account profile", status: "Normal / Active", ok: true },
                { name: "Bank authentication server", status: "Operational", ok: true },
                { name: "Mobile app backend API", status: "Simulated degraded service", ok: false },
                { name: "Web banking portal", status: "Available", ok: true }
              ].map((item) => (
                <div key={item.name} className="rounded-2xl border border-[#e8ece9] p-4 bg-white">
                  <p className="text-xs text-[#78867e] font-semibold">{item.name}</p>
                  <p className={`mt-2 text-sm font-bold ${item.ok ? "text-[#176b3a]" : "text-[#8a5900]"}`}>
                    {item.ok ? "●" : "⚠️"} {item.status}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#fff5dc] border border-[#f0dfc1] p-5">
              <h3 className="font-bold text-[#8a5900]">Recommended next step</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#526158]">
                For <span className="font-bold">&ldquo;{symptom}&rdquo;</span>, the diagnostic table indicates the issue is on the mobile app backend server, not your credentials.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[#526158]">
                <li>• **Avoid retrying app login.** You could lock yourself out of active banking.</li>
                <li>• Try accessing services using the bank&apos;s Web Banking portal instead.</li>
                <li>• Wait 15-30 minutes for automated backend service recovery.</li>
              </ul>
            </div>
          </section>
        )}

        {/* OTP ISSUES */}
        {issue === "otp" && subIssue === "none" && (
          <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold">OTP diagnosis checklist</h2>
            <p className="text-sm text-[#607067] mt-1">Select the checks you have completed:</p>

            <div className="mt-5 space-y-3">
              {[
                "My registered mobile SIM is active and has network signals",
                "I can receive normal SMS messages from other senders",
                "My device is not on Do Not Disturb (DND) / SMS filter settings",
                "I have not recently ported or changed my mobile SIM (carrier lockdown)"
              ].map((check) => (
                <label
                  key={check}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#dce5de] hover:border-[#b9d8c8] px-4 text-xs font-semibold text-[#526158] transition"
                >
                  <input
                    type="checkbox"
                    checked={otpChecks.includes(check)}
                    onChange={() => toggleOtpCheck(check)}
                    className="size-4 accent-[#0b6b4e] cursor-pointer"
                  />
                  {check}
                </label>
              ))}
            </div>

            {otpChecks.length === 4 ? (
              <div className="mt-6 rounded-2xl bg-[#e8f7ee] border border-[#b9d8c8] p-5 animate-fadeIn">
                <h3 className="font-bold text-[#176b3a]">Checks complete!</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#375247]">
                  If signals and filters are correct, the delay is due to the bank&apos;s OTP delivery gateway. Avoid repeated code requests to prevent SMS blocks. Wait 5 minutes before trying again.
                </p>
              </div>
            ) : (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-[#a13a2b]">
                🔒 Safety reminder: Nivaran will never ask for your OTP. Do not write or share OTP codes.
              </div>
            )}
          </section>
        )}

        {/* CARD ISSUES */}
        {issue === "card" && subIssue === "none" && (
          <section className="mt-6 rounded-3xl border border-[#dce5de] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#eef2f0] pb-4">
              <CreditCard className="text-[#0b6b4e]" size={22} aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold">Before contacting support</h2>
                <p className="text-xs text-[#607067]">Check simple configurations that decline cards.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs leading-relaxed text-[#526158]">
              <div className="flex gap-2">
                <span className="font-bold text-[#0b6b4e]">1. Expiry Check:</span>
                <span>Confirm card expiration month and year printed on the front.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#0b6b4e]">2. Transaction Toggles:</span>
                <span>Many banks default-block online (CNP) or international transactions. Toggle these active inside your official mobile app setting.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#0b6b4e]">3. Dynamic Limits:</span>
                <span>Verify that your domestic online transaction threshold is set higher than the purchase amount.</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#eef3ef] border border-[#dce5de] p-5">
              <p className="text-xs leading-relaxed text-[#526158]">
                💡 Cards declined due to security algorithms are cleared by calling the number on the back of your card. Never share your card PIN or CVV.
              </p>
            </div>
          </section>
        )}

        {/* General Disclaimer */}
        <section className="mt-6 rounded-2xl bg-[#eef3ef] border border-[#dce5de] p-5">
          <div className="flex gap-3">
            <CheckCircle2 size={20} className="shrink-0 text-[#0b6b4e] mt-0.5" />
            <p className="text-xs leading-relaxed text-[#526158]">
              This is a prototype using synthetic banking data. Nivaran operates as an explanatory resolution layer; it does not connect to real financial systems or execute transactions.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-[#dce5de] py-6 text-center text-xs leading-5 text-[#607067] flex flex-col gap-1.5">
          <p>निवाण (Nivaran) — Prototype using synthetic banking data. Not affiliated with any bank.</p>
          <p className="text-[#a0aca3]">All advice and check scenarios represent simulated demo actions.</p>
        </footer>
      </div>
    </main>
  );
}

export default function HelpPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fafcfb] px-4 py-5 sm:px-6 sm:py-8 flex items-center justify-center">
          <div className="text-sm font-bold text-[#607067] animate-pulse">
            Loading diagnostics...
          </div>
        </main>
      }
    >
      <HelpContent />
    </Suspense>
  );
}
