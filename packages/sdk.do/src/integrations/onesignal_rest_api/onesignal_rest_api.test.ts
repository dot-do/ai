/**
 * Onesignal rest api Integration Tests
 *
 * Auto-generated E2E tests for Onesignal rest api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/onesignal_rest_api
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { OnesignalRestApiClient } from './client.js'

describe('Onesignal rest api Integration', () => {
  let client: OnesignalRestApiClient
  const testResources: any[] = []

  beforeAll(() => {
    // Initialize client
    client = new OnesignalRestApiClient({
      apiKey: process.env.ONESIGNAL_REST_API_API_KEY || '',
    })
  })

  describe('Basic Action Execution', () => {
    it('Test basic action execution', async () => {})
  })

  describe('Action Resource', () => {
    it('should undefined Action', async () => {})
  })
})
