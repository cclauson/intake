param zoneName string

resource dnsZone 'Microsoft.Network/dnsZones@2023-07-01-preview' = {
  name: zoneName
  location: 'global'
}

resource googleVerification 'Microsoft.Network/dnsZones/TXT@2023-07-01-preview' = {
  parent: dnsZone
  name: 'app'
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          'google-site-verification=dsgrPfLkrNqwEhAKtn7hjzSwRVA-eHJ174xy0XFOpZM'
        ]
      }
    ]
  }
}

output nameServers array = dnsZone.properties.nameServers
