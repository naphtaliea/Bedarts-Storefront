import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bedarts Cold Supplies",
  description: "Fresh, always in season. Order online for delivery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
