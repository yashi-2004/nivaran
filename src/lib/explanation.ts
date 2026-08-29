export type ResolutionStatus =
  | "failed_after_debit"
  | "case_created"
  | "under_review"
  | "resolved";

export type Explanation = {
  diagnosis: string;
  plainExplanation: string;
  recommendedAction: string;
  avoid: string[];
  nextSteps: string[];
  tone: "calm";
};

export function fallbackExplanation(status: ResolutionStatus): Explanation {
  if (status === "resolved") {
    return {
      diagnosis: "Issue resolved — simulated outcome",
      plainExplanation:
        "In this simulated outcome, the transaction could not be completed and ₹5,000 was returned to the account.",
      recommendedAction: "No further action is needed for this demo case.",
      avoid: ["Do not treat this as a real refund confirmation."],
      nextSteps: ["Keep the case ID for your records."],
      tone: "calm",
    };
  }

  if (status === "under_review") {
    return {
      diagnosis: "Bank-side investigation in progress",
      plainExplanation:
        "The simulated transaction details are being reviewed. You do not need to submit the same request again.",
      recommendedAction: "Track this case and avoid retrying the payment while it is under review.",
      avoid: ["Do not create duplicate resolution requests."],
      nextSteps: ["Keep transaction ID NVN-48291 and case ID NVR-2026-48291."],
      tone: "calm",
    };
  }

  if (status === "case_created") {
    return {
      diagnosis: "Resolution request created",
      plainExplanation:
        "Your simulated issue has been packaged with the transaction details, so you do not need to explain the problem again.",
      recommendedAction: "Track the case while the simulated investigation begins.",
      avoid: ["Do not retry the original payment yet."],
      nextSteps: ["Use case ID NVR-2026-48291 to track the resolution."],
      tone: "calm",
    };
  }

  return {
    diagnosis: "Transaction processing issue",
    plainExplanation:
      "Your account shows that ₹5,000 was debited, but the transaction was not successfully completed. The recipient has not been confirmed as credited.",
    recommendedAction: "Do not make this payment again yet. Start a resolution request instead.",
    avoid: ["Do not retry the same payment while the original transaction is unresolved."],
    nextSteps: ["Keep transaction ID NVN-48291.", "Review the prepared resolution request."],
    tone: "calm",
  };
}
