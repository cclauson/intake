import type { Metadata } from "next";
import "./globals.css";
import AppInsightsProvider from "../components/AppInsightsProvider";

export const metadata: Metadata = {
  title: "Intake",
  description: "Track nutrition through conversation.",
  verification: {
    google: "S8OqtikQPY8UCnYxUL1hhp0g5a1k7rBx4q7B9OTcIEo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppInsightsProvider />
        {children}
      </body>
    </html>
  );
}
