import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  TriangleAlert,
} from "lucide-react";
import {
  demoUser,
  formatCurrency,
  transactions,
  type TransactionStatus,
} from "@/lib/mock-data";

const statusStyles: Record<
  TransactionStatus,
  { label: string; className: string; icon: typeof Check }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-[#fff5dc] text-[#8a5900]",
    icon: Clock3,
  },
  FAILED_AFTER_DEBIT: {
    label: "Failed after debit",
    className: "bg-[#fff0ed] text-[#a13a2b]",
    icon: TriangleAlert,
  },
  SUCCESSFUL: {
    label: "Successful",
    className: "bg-[#e8f7ee] text-[#176b3a]",
    icon: Check,
  },
  FAILED: {
    label: "Failed",
    className: "bg-[#fff0ed] text-[#a13a2b]",
    icon: TriangleAlert,
  },
};

export default function TransactionsPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between py-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg text-lg font-bold tracking-tight text-[#14211b]"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#0b6b4e] text-sm text-white">
              N
            </span>
            NIVARAN
          </Link>

          <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-medium text-[#375247]">
            Demo account
          </span>
        </header>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#526158] hover:text-[#0b6b4e]"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to problems
        </Link>

        <section className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0b6b4e]">
            Something went wrong
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Which payment needs help?
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-[#607067]">
            Select the matching payment. Nivaran will explain what happened
            and prepare the next step using simulated data.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-[#dce5de] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-[#14211b]">{demoUser.name}</p>
              <p className="mt-1 text-sm text-[#607067]">
                Account {demoUser.maskedAccount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-[#607067]">
                Simulated balance
              </p>
              <p className="mt-1 font-semibold text-[#14211b]">
                {formatCurrency(demoUser.balance)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold">Recent transactions</h2>
            <p className="text-sm text-[#607067]">Synthetic data</p>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => {
              const status = statusStyles[transaction.status];
              const StatusIcon = status.icon;

              return (
                <Link
                  key={transaction.id}
                  href={transaction.id === "NVN-48291" ? "/resolution/NVN-48291" : transaction.status === "FAILED" ? "/help?issue=failed" : "/help?issue=pending"}
                  className={`group block rounded-2xl border p-5 transition ${
                    transaction.featured
                      ? "border-[#0b6b4e] bg-[#f4fbf7] shadow-[0_10px_25px_rgba(11,107,78,0.08)]"
                      : "border-[#dce5de] bg-white hover:border-[#8fb9a7] hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`grid size-11 shrink-0 place-items-center rounded-full ${
                        transaction.featured
                          ? "bg-[#0b6b4e] text-white"
                          : "bg-[#eef3ef] text-[#0b6b4e]"
                      }`}
                    >
                      <span className="font-bold">₹</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="mt-1 font-medium text-[#375247]">
                            {transaction.recipient}
                          </p>
                        </div>

                        <ArrowRight
                          size={19}
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-[#607067] transition group-hover:translate-x-1 group-hover:text-[#0b6b4e]"
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-[#607067]">
                          {transaction.date}
                          {transaction.time ? ` · ${transaction.time}` : ""}
                        </span>
                        <span className="text-[#a5b0a9]">•</span>
                        <span>{transaction.method}</span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                        >
                          <StatusIcon size={13} aria-hidden="true" />
                          {status.label}
                        </span>
                      </div>

                      {transaction.featured && (
                        <p className="mt-4 text-sm font-medium text-[#0b6b4e]">
                          Recommended demo — ₹5,000 was debited, but the
                          payment failed.
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-12 border-t border-[#dce5de] py-6 text-center text-xs leading-5 text-[#607067]">
          Prototype using synthetic banking data. Not affiliated with any bank.
        </footer>
      </div>
    </main>
  );
}
