targetScope = 'resourceGroup'

param location string = resourceGroup().location
param registryName string
param environmentName string = 'tribal-kava-jobs-env'
param identityName string = 'tribal-kava-jobs-identity'
param keyVaultName string
param jobName string = 'tribal-kava-daily-job'
param imageName string = 'tribal-kava-daily'
param imageTag string
param schedule string = '0 11 * * *'
param githubRepository string = 'fckaemail-cyber/tribal-kava-lounge'
param githubBranch string = 'master'
param githubSecretName string = 'github-deploy-key-b64'

resource registry 'Microsoft.ContainerRegistry/registries@2023-07-01' existing = {
  name: registryName
}

resource environment 'Microsoft.App/managedEnvironments@2024-03-01' existing = {
  name: environmentName
}

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' existing = {
  name: identityName
}

resource vault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

resource job 'Microsoft.App/jobs@2024-03-01' = {
  name: jobName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identity.id}': {}
    }
  }
  properties: {
    environmentId: environment.id
    configuration: {
      triggerType: 'Schedule'
      replicaTimeout: 1800
      replicaRetryLimit: 0
      scheduleTriggerConfig: {
        cronExpression: schedule
        parallelism: 1
        replicaCompletionCount: 1
      }
      registries: [
        {
          server: registry.properties.loginServer
          identity: identity.id
        }
      ]
      secrets: [
        {
          name: 'github-deploy-key'
          keyVaultUrl: '${vault.properties.vaultUri}secrets/${githubSecretName}'
          identity: identity.id
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'daily-kava'
          image: '${registry.properties.loginServer}/${imageName}:${imageTag}'
          env: [
            {
              name: 'GITHUB_DEPLOY_KEY_B64'
              secretRef: 'github-deploy-key'
            }
            {
              name: 'GITHUB_REPOSITORY'
              value: githubRepository
            }
            {
              name: 'GITHUB_BRANCH'
              value: githubBranch
            }
          ]
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
    }
  }
}

output jobName string = job.name
output scheduleUtc string = schedule
output image string = '${registry.properties.loginServer}/${imageName}:${imageTag}'
