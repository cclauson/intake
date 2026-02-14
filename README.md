# vnext-k8s-azure

An Express.js application deployed to Azure Kubernetes Service (AKS) using Infrastructure as Code (IaC) with Bicep templates and GitHub Actions.

## Architecture

- **Backend**: Express.js + TypeScript
- **Container Runtime**: Azure Kubernetes Service (AKS)
- **Container Registry**: Azure Container Registry (ACR)
- **Ingress**: NGINX Ingress Controller
- **IaC**: Bicep templates
- **CI/CD**: GitHub Actions

## Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [GitHub CLI](https://cli.github.com/)
- [Docker](https://www.docker.com/) (for local container testing)
- [kubectl](https://kubernetes.io/docs/tasks/tools/) (for Kubernetes management)
- Azure subscription with appropriate permissions

## Local Development

```bash
cd app
npm install
npm run dev
```

Opens http://localhost:3000. Returns `{"message":"Hello World"}`.

### Local Docker Testing

```bash
cd app
docker build -t vnext-app .
docker run -p 3000:3000 vnext-app
```

## GitHub Actions Workflows

### Azure Template Deployment

**File**: `.github/workflows/azure-template-deployment.yml`
**Trigger**: Manual (`workflow_dispatch`)

Deploys Azure infrastructure:
- Resource Group
- Azure Container Registry (ACR)
- Azure Kubernetes Service (AKS) with ACR pull permissions
- NGINX Ingress Controller
- Application namespace

### Azure App Deployment

**File**: `.github/workflows/azure-deploy-app.yml`
**Trigger**: Manual (`workflow_dispatch`)

Builds and deploys the application:
- Builds Docker image from `app/`
- Pushes to ACR
- Deploys Kubernetes manifests to AKS
- Waits for rollout completion

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

### Setting Variables/Secrets

```bash
# Variables
gh variable set AZURE_RESOURCE_GROUP --body "VNextK8s"
gh variable set AZURE_LOCATION --body "centralus"

# Secrets (you'll be prompted for values)
gh secret set AZURE_DEPLOY_CLIENT_ID
gh secret set AZURE_DEPLOY_CLIENT_SECRET
gh secret set AZURE_DEPLOY_SUBSCRIPTION_ID
gh secret set AZURE_DEPLOY_TENANT_ID
```

## Project Structure

```
vnext-k8s-azure/
├── .github/
│   ├── actions/
│   │   ├── azure-login/          # Reusable Azure authentication
│   │   └── create-unique-names/  # Deterministic resource naming
│   └── workflows/
│       ├── azure-template-deployment.yml  # Infrastructure deployment
│       └── azure-deploy-app.yml           # Application deployment
├── app/                          # Express.js application
│   ├── src/
│   │   └── index.ts              # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .dockerignore
├── k8s/                          # Kubernetes manifests
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── templates/                    # Bicep IaC templates
│   ├── resourceGroup.bicep
│   ├── azure-resources.bicep
│   └── modules/
│       ├── acr.bicep
│       └── aks.bicep
└── tools/                        # Utility scripts
    ├── ArmUniqueStringGenerator.ps1
    └── InstallNginxIngress.ps1
```

## Deployment

### Initial Setup

1. Configure GitHub secrets and variables (see Configuration section)

2. Deploy infrastructure:
   - Go to Actions > "Azure Template Deployment" > Run workflow

3. Deploy the application:
   - Go to Actions > "Azure App Deployment" > Run workflow

4. Get the ingress external IP:
   ```bash
   az aks get-credentials --resource-group <your-rg> --name <aks-name>
   kubectl get svc -n ingress-nginx
   ```

5. Test: `curl http://<EXTERNAL-IP>/`
