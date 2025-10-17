/**
 * The odds api Integration Tests
 *
 * Auto-generated E2E tests for The odds api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/the_odds_api
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { TheOddsApiClient } from './client.js'

describe('The odds api Integration', () => {
  let client: TheOddsApiClient
  const testResources: any[] = []

  beforeAll(() => {
    // Initialize client
    client = new TheOddsApiClient({
      apiKey: process.env.THE_ODDS_API_API_KEY || '',
    })
  })

  describe('Basic Action Execution', () => {
    it('Test basic action execution', async () => {})
  })

  describe('Action Resource', () => {
    it('should undefined Action', async () => {})
  })
})
