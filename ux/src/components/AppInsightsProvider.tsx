"use client";

import { useEffect } from "react";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

let appInsights: ApplicationInsights | null = null;

function getAppInsights(): ApplicationInsights | null {
  if (appInsights) return appInsights;

  const connectionString =
    process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING;
  if (!connectionString) return null;

  appInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableAutoRouteTracking: true,
    },
  });
  appInsights.loadAppInsights();
  appInsights.trackPageView();

  return appInsights;
}

export default function AppInsightsProvider() {
  useEffect(() => {
    getAppInsights();
  }, []);

  return null;
}
