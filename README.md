# Intake

A nutrition tracking application with an MCP server, deployed to Azure Container Apps.

## Architecture

- **API**: Express.js + TypeScript, Prisma ORM (PostgreSQL), MCP server
- **UX**: Next.js 15, React 19, MSAL authentication, Tailwind CSS
- **Auth**: Entra External ID (CIAM) with OAuth 2.0 proxy for MCP clients
- **Infrastructure**: Azure Container Apps, Front Door, PostgreSQL Flexible Server, Application Insights
- **IaC**: Bicep templates
- **CI/CD**: GitHub Actions

## Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [GitHub CLI](https://cli.github.com/)
- [Docker](https://www.docker.com/) (for local container testing)
- Azure subscription with appropriate permissions

## Local Development

### API

```bash
cd api
npm install
npx prisma generate
npm run dev
```

Runs at http://localhost:3000. Key endpoints:
- `/api` — service info
- `/api/items` — CRUD operations
- `/api/mcp` — MCP transport (requires Entra config)
- `/health` — health check

### UX

```bash
cd ux
npm install
npm run dev
```

Runs at http://localhost:3001.

## Project Structure

```
intake/
├── .github/
│   ├── actions/
│   │   ├── azure-login/              # Reusable Azure authentication
│   │   └── create-unique-names/      # Deterministic resource naming
│   └── workflows/
│       ├── azure-template-deployment.yml  # Infrastructure deployment
│       └── azure-deploy-app.yml           # Application deployment
├── api/                              # Express.js API + MCP server
│   ├── src/
│   │   ├── index.ts                  # Server entry point & routes
│   │   ├── mcp.ts                    # MCP server (nutrition tracking tools)
│   │   ├── telemetry.ts              # Application Insights
│   │   └── auth/
│   │       └── entra-proxy.ts        # OAuth 2.0 JWT validation
│   ├── prisma/
│   │   └── schema.prisma             # Data models (Item, Metric, MetricEntry)
│   ├── Dockerfile
│   └── package.json
├── ux/                               # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── app/page.tsx          # Authenticated app page
│   │   │   └── health/route.ts       # Health check
│   │   ├── components/
│   │   │   ├── AppInsightsProvider.tsx
│   │   │   └── MsalAuthWrapper.tsx   # MSAL auth context
│   │   └── lib/
│   │       └── authConfig.ts         # MSAL configuration
│   ├── Dockerfile
│   └── package.json
├── templates/                        # Bicep IaC templates
│   ├── resourceGroup.bicep
│   ├── azure-resources.bicep
│   ├── front-door-resources.bicep
│   └── modules/
│       ├── acr.bicep                 # Azure Container Registry
│       ├── container-app.bicep       # Container Apps
│       ├── dns-zone.bicep            # DNS zone
│       ├── front-door.bicep          # Front Door CDN/WAF
│       ├── monitoring.bicep          # Log Analytics + App Insights
│       └── postgresql.bicep          # PostgreSQL Flexible Server
└── tools/                            # Utility scripts
    ├── ArmUniqueStringGenerator.ps1
    ├── SetAfdDnsValidation.ps1
    └── SetupExternalIdTenant.ps1
```

## GitHub Actions Workflows

### Azure Template Deployment

**File**: `.github/workflows/azure-template-deployment.yml`
**Trigger**: Manual (`workflow_dispatch`)

Deploys Azure infrastructure: resource group, Container Registry, Container Apps environment, PostgreSQL, Front Door, DNS, and monitoring.

### Azure App Deployment

**File**: `.github/workflows/azure-deploy-app.yml`
**Trigger**: Manual (`workflow_dispatch`)

Builds Docker images for API and UX, pushes to ACR, and deploys to Container Apps.

## Configuration

### GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AZURE_DEPLOY_CLIENT_ID` | Service principal client ID |
| `AZURE_DEPLOY_CLIENT_SECRET` | Service principal client secret |
| `AZURE_DEPLOY_SUBSCRIPTION_ID` | Azure subscription ID |
| `AZURE_DEPLOY_TENANT_ID` | Azure AD tenant ID |

### GitHub Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_RESOURCE_GROUP` | Azure resource group name | `VNextK8s` |
| `AZURE_LOCATION` | Azure region | `centralus` |

## Deployment

1. Configure GitHub secrets and variables (see Configuration section)
2. Deploy infrastructure: Actions > "Azure Template Deployment" > Run workflow
3. Deploy the application: Actions > "Azure App Deployment" > Run workflow
