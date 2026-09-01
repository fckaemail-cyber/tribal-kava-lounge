@description('Existing Application Insights component name')
param applicationInsightsName string = 'tribal-kava-insights'

@description('Stable workbook resource identifier')
param workbookName string = 'bab50ab8-bac9-44cf-a8b9-ce83dfc41335'

resource insights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: applicationInsightsName
}

var workbookSource = loadJsonContent('conversion-workbook.json')
var workbookData = union(workbookSource, {
  fallbackResourceIds: [insights.id]
})

resource conversionWorkbook 'Microsoft.Insights/workbooks@2023-06-01' = {
  name: workbookName
  location: resourceGroup().location
  kind: 'shared'
  properties: {
    category: 'workbook'
    displayName: 'Tribal Kava Conversion Dashboard'
    description: 'Order, directions, call, VIP, event, and drink-finder conversion reporting.'
    serializedData: string(workbookData)
    sourceId: insights.id
    version: 'Notebook/1.0'
  }
  tags: {
    app: 'tribal-kava-lounge'
    purpose: 'conversion-reporting'
  }
}

output workbookResourceId string = conversionWorkbook.id
