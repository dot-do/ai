/**
 * Basic usage examples for Composio client
 */

import { ComposioClient } from '../src/index.js'

async function main() {
  // Initialize client with API key
  const client = new ComposioClient({
    apiKey: process.env.COMPOSIO_API_KEY,
    maxRetries: 3,
    retryDelay: 1000,
  })

  console.log('=== Composio Client Examples ===\n')

  // Example 1: List all apps
  console.log('1. Listing available apps...')
  try {
    const apps = await client.listApps({ pageSize: 10 })
    console.log(`Found ${apps.pageInfo.total} apps`)
    apps.items.slice(0, 5).forEach((app) => {
      console.log(`  - ${app.name} (${app.key})`)
    })
    console.log()
  } catch (error) {
    console.error('Error listing apps:', error)
  }

  // Example 2: Search for specific apps
  console.log('2. Searching for calendar apps...')
  try {
    const calendarApps = await client.listApps({ search: 'calendar' })
    console.log(`Found ${calendarApps.items.length} calendar apps`)
    calendarApps.items.forEach((app) => {
      console.log(`  - ${app.name}`)
    })
    console.log()
  } catch (error) {
    console.error('Error searching apps:', error)
  }

  // Example 3: Get specific app
  console.log('3. Getting GitHub app details...')
  try {
    const github = await client.getApp('github')
    console.log(`App: ${github.name}`)
    console.log(`Description: ${github.description}`)
    console.log(`Categories: ${github.categories.join(', ')}`)
    console.log(`Auth: ${github.auth_schemes.join(', ')}`)
    console.log()
  } catch (error) {
    console.error('Error getting app:', error)
  }

  // Example 4: List actions for an app
  console.log('4. Listing GitHub actions...')
  try {
    const actions = await client.listActions({ appName: 'github' })
    console.log(`Found ${actions.length} GitHub actions`)
    actions.slice(0, 5).forEach((action) => {
      console.log(`  - ${action.name}: ${action.description}`)
    })
    console.log()
  } catch (error) {
    console.error('Error listing actions:', error)
  }

  // Example 5: List triggers
  console.log('5. Listing Slack triggers...')
  try {
    const triggers = await client.listTriggers({ appName: 'slack' })
    console.log(`Found ${triggers.length} Slack triggers`)
    triggers.slice(0, 3).forEach((trigger) => {
      console.log(`  - ${trigger.name}: ${trigger.description}`)
    })
    console.log()
  } catch (error) {
    console.error('Error listing triggers:', error)
  }

  // Example 6: Execute action (requires authenticated user)
  console.log('6. Example: Execute action (requires user authentication)...')
  console.log(`
    // Execute GitHub action
    const result = await client.executeAction({
      actionName: 'GITHUB_CREATE_ISSUE',
      userId: 'user-123',
      params: {
        title: 'Bug: Login not working',
        body: 'Users are unable to login...',
        owner: 'myorg',
        repo: 'myapp',
        labels: ['bug', 'urgent']
      }
    })
    console.log('Issue created:', result.url)
  `)
  console.log()

  // Example 7: Setup trigger (requires authenticated user)
  console.log('7. Example: Setup trigger (requires user authentication)...')
  console.log(`
    // Setup Slack message trigger
    const trigger = await client.setupTrigger({
      userId: 'user-123',
      triggerName: 'SLACK_RECEIVE_MESSAGE',
      config: {
        channelId: 'C01234567',
        keywords: ['help', 'support']
      }
    })
    console.log('Trigger setup:', trigger.id)
  `)
  console.log()

  // Example 8: Initiate OAuth connection (requires user interaction)
  console.log('8. Example: Initiate OAuth connection (requires user interaction)...')
  console.log(`
    // Initiate GitHub OAuth
    const connection = await client.initiateConnection({
      userId: 'user-123',
      authConfigId: 'github_oauth_config',
      redirectUrl: 'https://myapp.com/auth/callback'
    })
    // Redirect user to connection.redirectUrl
    console.log('OAuth URL:', connection.redirectUrl)
  `)
  console.log()

  // Example 9: Error handling
  console.log('9. Error handling example...')
  try {
    await client.getApp('nonexistent-app')
  } catch (error: any) {
    console.log(`Error caught: ${error.name}`)
    console.log(`Error code: ${error.code}`)
    console.log(`Error message: ${error.message}`)
    if (error.statusCode) {
      console.log(`HTTP status: ${error.statusCode}`)
    }
  }
  console.log()

  console.log('=== Examples Complete ===')
}

// Run examples
main().catch(console.error)
