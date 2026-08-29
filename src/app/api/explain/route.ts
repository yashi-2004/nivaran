import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  fallbackExplanation,
  type Explanation,
  type ResolutionStatus,
} from "@/lib/explanation";

export const runtime = "nodejs";

const statuses = [
  "failed_after_debit",
  "case_created",
  "under_review",
  "resolved",
] as const;

const explanationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagnosis: { type: "string" },
    plainExplanation: { type: "string" },
    recommendedAction: { type: "string" },
    avoid: {
      type: "array",
      items: { type: "string" },
    },
    nextSteps: {
      type: "array",
      items: { type: "string" },
    },
    tone: { type: "string", enum: ["calm"] },
  },
  required: [
    "diagnosis",
    "plainExplanation",
    "recommendedAction",
    "avoid",
    "nextSteps",
    "tone",
  ],
};

export async function POST(request: Request) {
  const { status, question } = (await request.json()) as {
    status?: ResolutionStatus;
    question?: string;
  };

  if (!status || !statuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid demo status." },
      { status: 400 },
    );
  }

  if (question && question.length > 240) {
    return NextResponse.json(
      { error: "Question is too long." },
      { status: 400 },
    );
  }

  const fallback = fallbackExplanation(status);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ explanation: fallback, source: "fallback" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const configuredModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const targetModel = configuredModel === "gpt-5.4" ? "gpt-4o-mini" : configuredModel;

    const response = await openai.chat.completions.create({
      model: targetModel,
      messages: [
        {
          role: "system",
          content: "You are Nivaran's AI Explanation Engine. Explain only supplied synthetic banking data in plain, calm English. Never claim to contact a bank, access live systems, move money, authenticate anyone, or guarantee timelines. Never request credentials, OTPs, PINs, card details, Aadhaar, or PAN. AI explains the simulated state; it never controls it.",
        },
        {
          role: "user",
          content: JSON.stringify({
            prototype: true,
            transactionId: "NVN-48291",
            amount: 5000,
            recipient: "Rahul Sharma",
            method: "IMPS",
            issueType: "DEBITED_TRANSACTION_FAILED",
            accountDebited: true,
            authenticationStatus: "SUCCESS",
            accountStatus: "ACTIVE",
            serviceStatus: "DEGRADED",
            recipientConfirmed: status === "resolved",
            simulatedStatus: status,
            userQuestion:
              question || "Explain the current simulated transaction status.",
          }),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "nivaran_explanation",
          strict: true,
          schema: explanationSchema,
        },
      },
    });

    const outputText = response.choices[0]?.message?.content;
    if (!outputText) {
      throw new Error("Empty response from AI");
    }

    const explanation = JSON.parse(outputText) as Explanation;

    return NextResponse.json({ explanation, source: "ai" });
  } catch (error) {
    console.error("AI Explanation error:", error);
    return NextResponse.json({ explanation: fallback, source: "fallback" });
  }
}
