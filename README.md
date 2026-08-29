# <p align="center">🏛️ <b>NIVARAN · निवारण</b></p>

<p align="center">
  <b>Banking problems, resolved. Turn confusing digital payment failures into clear, guided resolution journeys.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

---

## 📌 The Challenge (The "Anxious Moment")

Digital payments in India operate at a massive scale, but when transactions fail, users are left in the dark with vague system errors like *"Transaction failed"* or *"Unable to process request"*. 

This creates immediate anxiety: **Was my money debited? Should I retry? Who do I call?** Retrying blindly often leads to double debits, and explaining technical errors to support staff requires repeating the same story multiple times.

**Nivaran bridges the gap between raw, cryptic backend log data and human reassurance.**

---

## ⚡ Problem & Solution Matrix

| The Moment | Current Pain Point | Nivaran's Resolution |
| :--- | :--- | :--- |
| **Transaction Failure** | Vague system codes; user retries immediately, causing duplicate charges. | Prominent warning: **"⚠️ Don't try the payment again yet"** based on real-time log checks. |
| **Log Diagnosis** | Vague error screens; no plain English explanation of the server issue. | OpenAI parses mock log tables to deliver calm, context-specific explanations. |
| **Filing a Complaint** | Filling long forms; repeating the transfer details to support agents. | **Auto-packaged grievance tickets** enclosing system metadata and editable statements. |
| **Authentication Locks** | Lockouts with no instructions on how to reset MPIN or TPIN safely. | Polished diagnostic checklists detailing secure manual recovery procedures. |

---

## ⚙️ AI Safety & Isolation Boundary

To comply with strict security standards, Nivaran enforces a **one-way read-only boundary** separating the AI model from the financial transactional layers.

```
┌────────────────────────────────┐
│   Mock Banking Engine (Logs)   │  ◄── (Source of Truth in Memory)
└───────────────┬────────────────┘
                │
                ▼ (Structured Context Only)
┌────────────────────────────────┐
│      OpenAI GPT-4o-mini        │  ◄── (Strict Schema / JSON Mode)
└───────────────┬────────────────┘
                │
                ▼ (Calming Human Explanation)
┌────────────────────────────────┐
│     Citizen Interface UI       │  ◄── (Zero Write Access to PINs/OTPs)
└────────────────────────────────┘
```

> [!IMPORTANT]
> **Safety Guardrails**: 
> * The LLM has **NO write access** to bank accounts. It cannot move money, change balances, reset PINs, or trigger transactions.
> * Banners are integrated across the UI to remind users: *"Never share an OTP, password, PIN, or CVV. Nivaran will never ask for them."*
> * All data and logins utilized in this prototype are completely synthetic.

---

## 🛠️ Resilient Offline Fallback

Nivaran is built for real-world resilience (slow mobile networks or API outages):
1. **Explanation Fallback**: If the OpenAI completions endpoint fails, Nivaran immediately serves pre-templated diagnostic statements mapped to the status code.
2. **Natural Language Fallback**: A local keyword/regex parser processes text searches on the homepage, routing common inputs (e.g. "debit", "tpin", "sms") to correct guides without requiring server-side API roundtrips.

---

## 🚀 The 2-Minute Reviewer Walkthrough

Reviewers can experience the complete citizen journey from start to finish:

* **0:00 - 0:30 (Frictionless Start)**: Tap **Try Demo** on the hero card. This immediately launches the hero journey for Yash Sharma's failed transaction.
* **0:30 - 1:00 (Diagnostic Check)**: Inspect the failed ₹5,000 transfer to Rahul Sharma. Review the log diagnostic status cards (Authentication, Account, Processing, Service) and read the custom AI explanation.
* **1:00 - 1:30 (Package Grievance)**: Click **Start Resolution**, verify the auto-populated metadata, customize the statement description, and generate Case ID `NVR-2026-48291`.
* **1:30 - 2:00 (Simulated Outcome)**: Toggle the final state (choose between **Simulated Refund** or **Simulated Credit**) and resolve the case to see how the system closes the tracking ticket.
* **Extra Credit**: Return to the homepage and search *"my TPIN isn't working"* or *"session expired"* to test the natural language diagnosis routing.

---

## 💻 Local Setup & Development

Create a `.env.local` file in the root of the `nivaran` folder:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Run the development server:
```bash
cd nivaran
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
