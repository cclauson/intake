import type { Metadata } from "next";
import "./globals.css";
import AppInsightsProvider from "../components/AppInsightsProvider";

export const metadata: Metadata = {
  title: "vnext-ux",
  description: "VNext UX Service",
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
