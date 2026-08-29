import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nivaran — Banking problems, resolved.",
  description:
    "A synthetic digital-banking problem resolution prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}