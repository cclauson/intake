param acrName string
param aksName string
param logAnalyticsWorkspaceName string
param applicationInsightsName string
param postgresServerName string
@secure()
param postgresAdminPassword string

module monitoring 'modules/monitoring.bicep' = {
  name: 'monitoringDeployment'
  params: {
    logAnalyticsWorkspaceName: logAnalyticsWorkspaceName
    applicationInsightsName: applicationInsightsName
  }
}

module acr 'modules/acr.bicep' = {
  name: 'acrDeployment'
  params: {
    acrName: acrName
  }
}

module aks 'modules/aks.bicep' = {
  name: 'aksDeployment'
  params: {
    aksName: aksName
    acrId: acr.outputs.acrId
    logAnalyticsWorkspaceId: monitoring.outputs.logAnalyticsWorkspaceId
  }
}

module postgresql 'modules/postgresql.bicep' = {
  name: 'postgresqlDeployment'
  params: {
    serverName: postgresServerName
    adminPassword: postgresAdminPassword
  }
}

output acrLoginServer string = acr.outputs.acrLoginServer
output aksName string = aks.outputs.aksName
