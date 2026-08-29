# 🇮🇳 NIVARAN (निवारण) — Banking Problems, Resolved.

Nivaran is a digital resolution layer built for the anxious, frustrating moments of digital-banking failures. 

When a transaction fails, a login gets blocked, or an OTP doesn't arrive, traditional banking apps display vague errors like *"Transaction failed"* or *"Unable to process request"* and direct users to call support or visit a branch. **Nivaran turns these confusing errors into a clear, guided digital resolution journey.**

> **⚠️ Prototype Notice:** This system operates using 100% synthetic banking data. It is not affiliated with, sponsored by, or connected to any real financial institution or public service (such as NPCI, BHIM, or UPI).

---

## 1. The Core Problem

Digital payments in India operate at massive scale, but when transactions fail, users are left in the dark with major anxieties:
* *Was my money deducted?*
* *Should I retry or will I get charged twice?*
* *Is my PIN blocked or is the bank server down?*
* *How do I explain this problem to customer support?*

Nivaran bridges the gap between raw, technical system logs and plain-language guidance.

---

## 2. The Product Promise

Nivaran implements the following end-to-end resolution journey:

```
[System Error Occurs] 
       ↓
[Nivaran Diagnoses Log Context]
       ↓
[AI Explanation of Root Cause] 
       ↓
[Self-Help Checklist & Actions to Avoid] (e.g. "Don't retry yet!")
       ↓
[Auto-Packaged Resolution Request] (No repeating stories to agents)
       ↓
[Simulated Case Tracking ID]
       ↓
[Deterministic Simulated Resolution] (Reversal or Credit Outcome)
```

---

## 3. The Hero Journey (Demo Guide)

To test the application as a **Hackathon Judge**, follow this exact workflow:

1. **0–10 seconds (Understand)**: Open the homepage. Read the core premise and view the Quick Demo panel.
2. **10–30 seconds (Frictionless Start)**: Click **Try Demo** on the hero card OR select **Money was deducted** in the wizard. Either option immediately redirects you to the diagnosed transaction page.
3. **30–60 seconds (Diagnosis)**: Inspect the ₹5,000 failed transfer to Rahul Sharma. Review the high-contrast alert: **⚠️ Don't try the payment again yet**, followed by the AI Explanation of why the IMPS processing layer failed after debiting your balance.
4. **60–90 seconds (Create Resolution)**: Click **Start Resolution**. Review the automatically prepared resolution request containing the transaction ID, date, and status. Edit the description statement, and click **Create Resolution Request** to generate Case ID `NVR-2026-48291`.
5. **90–120 seconds (Track & Resolve)**: Toggle the simulated final state (choose between **Simulated Refund** or **Simulated Credit**) and click **Resolve Demo Case** to see the deterministic final outcome.

---

## 4. Technical Architecture & AI Safety

Nivaran enforces a **strict unidirectional flow** between the simulated banking data layer and the LLM interpretative layer to guarantee transaction safety.

### AI Safety Isolation Boundary

```
[Synthetic Banking Logs] (Source of truth)
        │
        ▼ (Structured Context Only)
[OpenAI Chat Completions API] (gpt-4o-mini + JSON Schema)
        │
        ▼ (Natural Language Interpretation)
[User Interface Guidance] ( Calming, readable explanations )
```

* **The Mock Banking Engine** (defined in [`mock-data.ts`](file:///Users/yashi/Desktop/nivaran/nivaran/src/lib/mock-data.ts)) contains all balances, transaction logs, and account statuses. It is the absolute source of truth.
* **The OpenAI Integration** (defined in [`api/explain/route.ts`](file:///Users/yashi/Desktop/nivaran/nivaran/src/app/api/explain/route.ts) and [`api/diagnose/route.ts`](file:///Users/yashi/Desktop/nivaran/nivaran/src/app/api/diagnose/route.ts)) performs only **interpretation, classification, and explanation generation**.
* **AI Restrictions**: The AI has **NO access** to write actions. It cannot move money, change balances, reset PINs, generate OTPs, or validate credentials. All database updates are handled deterministically in client/server code.
* **Security Guardrails**: Nivaran explicitly prevents users from inputting sensitive details. Banners warn: *"Never share an OTP, password, PIN, CVV, or Aadhaar."*

### Deterministic Fallback Engine
If the OpenAI API key is missing or the endpoint times out, Nivaran automatically falls back to:
1. **Explanation Fallback**: Pre-templated context-aware status logs to explain current resolution progress.
2. **Diagnosis Fallback**: A local keyword/regex-based classifier that maps common search terms (e.g. "debit", "tpin", "sms", "lock") to correct help pages.

The application is guaranteed **never to break** due to an AI API failure.

---

## 5. Deployment Guide

The app is built to run server-side or deploy instantly to Vercel/Netlify.

### Environment Setup
Create a `.env.local` file in the `nivaran` subfolder:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

### Local Development
```bash
cd nivaran
npm install
npm run dev
```
Navigate to `http://localhost:3000`.

---

## 6. Simulated Limitations

For the purposes of this hackathon prototype:
1. All account balances (Aarav Sharma - `XXXX 4821` - `₹72,430`) are simulated and reside in memory.
2. No real API requests are routed to UPI, IMPS, NPCI, or partner banks.
3. MPIN/TPIN guides walk users through safe, manual official bank recovery flows without storing or resetting actual secrets.
