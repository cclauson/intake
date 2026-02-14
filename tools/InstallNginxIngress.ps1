param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup,

    [Parameter(Mandatory=$true)]
    [string]$AksName
)

Write-Host "Getting AKS credentials..."
az aks get-credentials --resource-group $ResourceGroup --name $AksName --overwrite-existing

Write-Host "Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/cloud/deploy.yaml

Write-Host "Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx `
    --for=condition=ready pod `
    --selector=app.kubernetes.io/component=controller `
    --timeout=120s

Write-Host "Fetching Ingress external IP..."
$maxRetries = 12
$retryCount = 0
$externalIp = $null

while ($retryCount -lt $maxRetries -and -not $externalIp) {
    $externalIp = kubectl get svc ingress-nginx-controller `
        --namespace ingress-nginx `
        -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null

    if (-not $externalIp) {
        $retryCount++
        Write-Host "Waiting for external IP (attempt $retryCount/$maxRetries)..."
        Start-Sleep -Seconds 10
    }
}

if ($externalIp) {
    Write-Host "NGINX Ingress Controller external IP: $externalIp"
} else {
    Write-Warning "External IP not yet available. Check with: kubectl get svc -n ingress-nginx"
}
