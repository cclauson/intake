export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
      const appInsights = require("applicationinsights");
      appInsights
        .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .start();
    }
  }
}
