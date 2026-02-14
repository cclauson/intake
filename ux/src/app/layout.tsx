import type { Metadata } from "next";
import "./globals.css";
import AppInsightsProvider from "../components/AppInsightsProvider";

export const metadata: Metadata = {
  title: "Nutrition Tracking",
  description: "Track your meals, monitor your nutrients, and build healthier habits.",
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
