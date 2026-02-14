@description('The name of the Front Door endpoint to create. This must be globally unique.')
param endpointName string

@description('The custom domain name to associate with your Front Door endpoint.')
param customDomainName string

@description('The NGINX ingress external IP address to use as the origin.')
param originHostName string

var frontDoorSkuName = 'Standard_AzureFrontDoor'

module frontDoor 'modules/front-door.bicep' = {
  name: 'front-door'
  params: {
    skuName: frontDoorSkuName
    endpointName: endpointName
    originHostName: originHostName
    customDomainName: customDomainName
  }
}

output frontDoorEndpointHostName string = frontDoor.outputs.frontDoorEndpointHostName
