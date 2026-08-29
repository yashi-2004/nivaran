import OpenAI from "openai";
import { NextResponse } from "next/server";
import { fallbackDiagnose } from "@/lib/diagnose-utils";

export const runtime = "nodejs";

const diagnosisSchema = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: [
        "DEBITED_TRANSACTION_FAILED",
        "FAILED_TRANSACTION_NO_DEBIT",
        "PENDING_TRANSACTION",
        "MPIN_AUTHENTICATION_FAILURE",
        "TPIN_AUTHENTICATION_FAILURE",
        "SERVICE_OUTAGE",
        "CARD_ISSUE",
        "OTP_NOT_ARRIVING",
        "ACCOUNT_BLOCKED",
        "UNKNOWN"
      ]
    },
    explanation: { type: "string" },
    matchingTransactionId: { type: "string" }
  },
  required: ["category", "explanation", "matchingTransactionId"],
  additionalProperties: false
};

export async function POST(request: Request) {
  let requestText = "";
  try {
    const body = (await request.json()) as { description?: string };
    const description = body.description;

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Missing or invalid description." }, { status: 400 });
    }

    const cleanDescription = description.trim();
    requestText = cleanDescription;
    if (cleanDescription.length > 500) {
      return NextResponse.json({ error: "Description is too long." }, { status: 400 });
    }

    const fallback = fallbackDiagnose(cleanDescription);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ result: fallback, source: "fallback" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const configuredModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const targetModel = configuredModel === "gpt-5.4" ? "gpt-4o-mini" : configuredModel;

    const response = await openai.chat.completions.create({
      model: targetModel,
      messages: [
        {
          role: "system",
          content: `You are Nivaran's AI Diagnosis Engine.
Classify the user's natural language description of their banking problem into one of the following issue categories:
- DEBITED_TRANSACTION_FAILED: Payment to Rahul Sharma (₹5,000) or general payment failed but money got debited.
- FAILED_TRANSACTION_NO_DEBIT: Payment failed but money was not debited (e.g. Priya Mehta ₹3,200).
- PENDING_TRANSACTION: Payment is pending/in-progress.
- MPIN_AUTHENTICATION_FAILURE: MPIN (Mobile PIN) isn't working, locked, or multiple failures.
- TPIN_AUTHENTICATION_FAILURE: TPIN (Transaction PIN) isn't working, locked, or failing.
- SERVICE_OUTAGE: App is crashing, logging out, session expired, server down, or banking service degraded.
- CARD_ISSUE: Card declined, expired, or online transaction blocked.
- OTP_NOT_ARRIVING: OTP/SMS verification code not arriving.
- ACCOUNT_BLOCKED: Account blocked, frozen, or security lockouts.
- UNKNOWN: Could not classify.

Provide a brief, supportive, plain-language explanation of what Nivaran detected.
Determine if it matches a synthetic transaction ID:
- If DEBITED_TRANSACTION_FAILED: matchingTransactionId is "NVN-48291"
- If FAILED_TRANSACTION_NO_DEBIT: matchingTransactionId is "NVN-48233"
- Else: matchingTransactionId is "none"

AI diagnosis explains synthetic banking state; it never performs real financial actions or resets pins.`
        },
        {
          role: "user",
          content: `User description: "${cleanDescription}"`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "nivaran_diagnosis",
          strict: true,
          schema: diagnosisSchema
        }
      }
    });

    const outputText = response.choices[0]?.message?.content;
    if (!outputText) {
      throw new Error("Empty response from OpenAI");
    }

    const result = JSON.parse(outputText);
    return NextResponse.json({ result, source: "ai" });
  } catch (error) {
    console.error("AI Diagnosis error:", error);
    // Graceful fallback
    return NextResponse.json({
      result: fallbackDiagnose(requestText),
      source: "fallback"
    });
  }
}
