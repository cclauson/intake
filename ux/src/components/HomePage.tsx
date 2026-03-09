"use client";

import { useEffect, useState } from "react";
import {
  PublicClientApplication,
  EventType,
  AuthenticationResult,
  InteractionStatus,
} from "@azure/msal-browser";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { msalConfig, loginRequest, isAuthConfigured } from "../lib/authConfig";
import DashboardShell from "./dashboard/DashboardShell";
import MealList from "./dashboard/MealList";
import MetricsSection from "./dashboard/MetricsSection";

function LandingPage({ onSignIn }: { onSignIn?: () => void }) {
  return (
    <main className="min-h-screen bg-white">
      <header className="max-w-5xl mx-auto px-6 pt-8">
        <span className="text-xl font-semibold text-accent-700 tracking-tight">
          Intake
        </span>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
          Track nutrition through conversation
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
          Tell Claude what you ate. It logs the nutrition data automatically via
          MCP, and you review everything here.
        </p>
        {onSignIn ? (
          <button
            onClick={onSignIn}
            className="inline-block px-6 py-3 text-sm font-medium text-white bg-accent-600 rounded-lg hover:bg-accent-700 transition-colors"
          >
            Sign in
          </button>
        ) : (
          <span className="inline-block px-6 py-3 text-sm font-medium text-white bg-accent-600 rounded-lg">
            Sign in
          </span>
        )}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-32">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-8">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="text-sm font-medium text-accent-600 mb-2">01</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tell Claude what you ate
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Describe your meals in natural language. No forms, no barcode
              scanning.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-accent-600 mb-2">02</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI logs the data
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Claude uses MCP tools to look up nutrition info and save your meal
              with full macro breakdowns.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-accent-600 mb-2">03</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Review your dashboard
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              See daily totals, meal history, and tracked metrics at a glance.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <p className="text-center text-xs text-gray-400">
          Powered by Model Context Protocol
        </p>
      </footer>
    </main>
  );
}

function DashboardContent() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Today
        </h1>
        <p className="text-sm text-gray-400 mt-1">{today}</p>
      </div>

      <MealList />

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Metrics</h2>
        <MetricsSection />
      </div>
    </DashboardShell>
  );
}

function AuthSwitch() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (inProgress !== InteractionStatus.None) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Signing in...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <DashboardContent />;
  }

  return (
    <LandingPage
      onSignIn={() => instance.loginRedirect(loginRequest)}
    />
  );
}

export default function HomePage() {
  const [msalInstance, setMsalInstance] =
    useState<PublicClientApplication | null>(null);

  useEffect(() => {
    if (!isAuthConfigured()) return;

    const instance = new PublicClientApplication(msalConfig);
    instance.initialize().then(() => {
      instance.handleRedirectPromise().then((response: AuthenticationResult | null) => {
        if (response) {
          instance.setActiveAccount(response.account);
        } else {
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) {
            instance.setActiveAccount(accounts[0]);
          }
        }
        setMsalInstance(instance);
      });

      instance.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
          const payload = event.payload as AuthenticationResult;
          instance.setActiveAccount(payload.account);
        }
      });
    });
  }, []);

  if (!isAuthConfigured() || !msalInstance) {
    return <LandingPage />;
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AuthSwitch />
    </MsalProvider>
  );
}
