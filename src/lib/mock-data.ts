export type TransactionStatus =
  | "FAILED_AFTER_DEBIT"
  | "PENDING"
  | "SUCCESSFUL"
  | "FAILED";

export type Transaction = {
  id: string;
  amount: number;
  recipient: string;
  date: string;
  time?: string;
  status: TransactionStatus;
  method: "IMPS" | "UPI" | "Bill payment";
  accountDebited: boolean;
  featured?: boolean;
};

export const demoUser = {
  name: "Aarav Sharma",
  maskedAccount: "XXXX 4821",
  balance: 72430,
};

export const transactions: Transaction[] = [
  {
    id: "NVN-48291",
    amount: 5000,
    recipient: "Rahul Sharma",
    date: "Today",
    time: "4:18 PM",
    status: "FAILED_AFTER_DEBIT",
    method: "IMPS",
    accountDebited: true,
    featured: true,
  },
  {
    id: "NVN-48276",
    amount: 1240,
    recipient: "Amazon",
    date: "Today",
    time: "2:05 PM",
    status: "SUCCESSFUL",
    method: "UPI",
    accountDebited: true,
  },
  {
    id: "NVN-48254",
    amount: 850,
    recipient: "Electricity Bill",
    date: "Yesterday",
    status: "SUCCESSFUL",
    method: "Bill payment",
    accountDebited: true,
  },
  {
    id: "NVN-48233",
    amount: 3200,
    recipient: "Priya Mehta",
    date: "Monday",
    time: "11:42 AM",
    status: "FAILED",
    method: "IMPS",
    accountDebited: false,
  },
];

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
