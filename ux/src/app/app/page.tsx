"use client";

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import MsalAuthWrapper from "../../components/MsalAuthWrapper";

function AppContent() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated || accounts.length === 0) {
    return null;
  }

  const account = accounts[0];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Nutrition Tracking</h1>
          <button
            onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: "/" })}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign out
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome</h2>
          <div className="space-y-2 text-gray-700">
            {account.name && <p><span className="font-medium">Name:</span> {account.name}</p>}
            {account.username && <p><span className="font-medium">Email:</span> {account.username}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AppPage() {
  return (
    <MsalAuthWrapper>
      <AppContent />
    </MsalAuthWrapper>
  );
}
