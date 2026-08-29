export function fallbackDiagnose(description: string) {
  const desc = description.toLowerCase();

  if (
    desc.includes("debit") ||
    desc.includes("deduct") ||
    desc.includes("rahul") ||
    desc.includes("5000") ||
    desc.includes("48291")
  ) {
    return {
      category: "DEBITED_TRANSACTION_FAILED",
      explanation: "Nivaran detected a payment of ₹5,000 to Rahul Sharma that failed after your account was debited.",
      matchingTransactionId: "NVN-48291"
    };
  }

  if (
    desc.includes("priya") ||
    desc.includes("3200") ||
    (desc.includes("failed") && (desc.includes("send") || desc.includes("pay")))
  ) {
    return {
      category: "FAILED_TRANSACTION_NO_DEBIT",
      explanation: "Nivaran detected a failed payment of ₹3,200 to Priya Mehta where no money was debited.",
      matchingTransactionId: "NVN-48233"
    };
  }

  if (desc.includes("pending") || desc.includes("wait")) {
    return {
      category: "PENDING_TRANSACTION",
      explanation: "Nivaran detected a pending payment state. You should monitor the transaction before retrying.",
      matchingTransactionId: "none"
    };
  }

  if (desc.includes("mpin")) {
    return {
      category: "MPIN_AUTHENTICATION_FAILURE",
      explanation: "Nivaran detected an MPIN authentication failure or lock.",
      matchingTransactionId: "none"
    };
  }

  if (desc.includes("tpin") || desc.includes("transaction pin")) {
    return {
      category: "TPIN_AUTHENTICATION_FAILURE",
      explanation: "Nivaran detected a TPIN (transaction PIN) authentication error.",
      matchingTransactionId: "none"
    };
  }

  if (desc.includes("otp") || desc.includes("sms") || desc.includes("code")) {
    return {
      category: "OTP_NOT_ARRIVING",
      explanation: "Nivaran detected that security OTP messages are not arriving.",
      matchingTransactionId: "none"
    };
  }

  if (desc.includes("card") || desc.includes("debit card") || desc.includes("atm")) {
    return {
      category: "CARD_ISSUE",
      explanation: "Nivaran detected a card transaction issue or domestic/international restriction.",
      matchingTransactionId: "none"
    };
  }

  if (
    desc.includes("login") ||
    desc.includes("app") ||
    desc.includes("crash") ||
    desc.includes("service") ||
    desc.includes("server") ||
    desc.includes("down")
  ) {
    return {
      category: "SERVICE_OUTAGE",
      explanation: "Nivaran detected a potential server-side or mobile application degradation.",
      matchingTransactionId: "none"
    };
  }

  if (
    desc.includes("block") ||
    desc.includes("security") ||
    desc.includes("lock") ||
    desc.includes("restrict")
  ) {
    return {
      category: "ACCOUNT_BLOCKED",
      explanation: "Nivaran detected a security restriction or account lock.",
      matchingTransactionId: "none"
    };
  }

  return {
    category: "UNKNOWN",
    explanation: "Nivaran could not confidently categorize the issue. Try using our step-by-step diagnostic wizard.",
    matchingTransactionId: "none"
  };
}
