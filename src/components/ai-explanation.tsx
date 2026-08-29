"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  fallbackExplanation,
  type Explanation,
  type ResolutionStatus,
} from "@/lib/explanation";

const suggestedQuestions = [
  "Why hasn't Rahul received it?",
  "Should I pay again?",
  "What does pending mean?",
];

export function AiExplanation({ status }: { status: ResolutionStatus }) {
  const [explanation, setExplanation] = useState<Explanation>(
    fallbackExplanation(status),
  );
  const [source, setSource] = useState<"ai" | "fallback">("fallback");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const loadExplanation = useCallback(
    async (userQuestion?: string) => {
      setLoading(true);

      try {
        const response = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, question: userQuestion }),
        });

        if (!response.ok) {
          throw new Error("Explanation service unavailable");
        }

        const data = await response.json();

        if (data.explanation) {
          setExplanation(data.explanation);
          setSource(data.source);
        } else {
          throw new Error("Explanation unavailable");
        }
      } catch {
        setExplanation(fallbackExplanation(status));
        setSource("fallback");
      } finally {
        setLoading(false);
      }
    },
    [status],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadExplanation();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadExplanation]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanQuestion = question.trim();
    if (cleanQuestion) {
      void loadExplanation(cleanQuestion);
    }
  }

  return (
    <section className="mt-7 rounded-2xl border border-[#dce5de] bg-[#f7fbf8] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[#0b6b4e]">
          AI Explanation Engine
        </p>
        <span className="text-xs text-[#607067]">
          {loading
            ? "Updating explanation…"
            : source === "ai"
              ? "Generated from synthetic data"
              : "Demo fallback"}
        </span>
      </div>

      <p className="mt-3 font-semibold text-[#14211b]">
        {explanation.diagnosis}
      </p>
      <p className="mt-2 leading-7 text-[#526158]">
        {explanation.plainExplanation}
      </p>

      <div className="mt-4 rounded-xl bg-white p-4">
        <p className="text-sm font-semibold text-[#14211b]">
          Recommended action
        </p>
        <p className="mt-1 text-sm leading-6 text-[#526158]">
          {explanation.recommendedAction}
        </p>
      </div>

      <div className="mt-5 border-t border-[#dce5de] pt-5">
        <p className="text-sm font-semibold text-[#14211b]">
          Ask about this simulated transaction
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((suggestedQuestion) => (
            <button
              key={suggestedQuestion}
              type="button"
              onClick={() => {
                setQuestion(suggestedQuestion);
                void loadExplanation(suggestedQuestion);
              }}
              className="min-h-10 rounded-full border border-[#b9d8c8] bg-white px-3 text-sm font-medium text-[#0b6b4e] hover:bg-[#e8f7ee]"
            >
              {suggestedQuestion}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={240}
            placeholder="Ask a question about this demo payment"
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#b9d8c8] bg-white px-3 text-sm text-[#14211b] placeholder:text-[#78867e]"
            aria-label="Ask about this simulated payment"
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="min-h-11 rounded-xl bg-[#0b6b4e] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ask
          </button>
        </form>

        <p className="mt-3 text-xs leading-5 text-[#607067]">
          Never share an OTP, password, PIN, card number, Aadhaar, or PAN.
        </p>
      </div>
    </section>
  );
}
