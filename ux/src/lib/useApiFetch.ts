"use client";

import { useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { BrowserAuthError } from "@azure/msal-browser";
import { apiTokenRequest, loginRequest } from "./authConfig";

// Shared promise so concurrent callers don't each trigger a redirect
let redirectInFlight: Promise<void> | null = null;

export function useApiFetch() {
  const { instance } = useMsal();

  const apiFetch = useCallback(
    async <T>(path: string, init?: RequestInit): Promise<T> => {
      const account = instance.getActiveAccount();
      if (!account) throw new Error("No active account");

      let accessToken: string;
      try {
        const response = await instance.acquireTokenSilent({
          ...apiTokenRequest,
          account,
        });
        accessToken = response.accessToken;
      } catch (e) {
        // Any silent token failure should fall back to interactive redirect.
        // Deduplicate: if a redirect is already in flight, wait for it.
        if (!redirectInFlight) {
          redirectInFlight = instance
            .acquireTokenRedirect({ ...loginRequest, account })
            .finally(() => { redirectInFlight = null; });
        }
        await redirectInFlight;
        // redirect will navigate away; this line won't execute
        throw e;
      }

      const res = await fetch(path, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      return res.json();
    },
    [instance]
  );

  return { apiFetch };
}
