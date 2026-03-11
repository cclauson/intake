"use client";

import { useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { apiTokenRequest, loginRequest } from "./authConfig";

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
        if (e instanceof InteractionRequiredAuthError) {
          await instance.acquireTokenRedirect({
            ...loginRequest,
            account,
          });
          // redirect will navigate away; this line won't execute
          throw e;
        }
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
