/**
 * HTTP Client Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HTTPClient, createHTTPClient } from './http'

describe('HTTPClient', () => {
  let client: HTTPClient

  beforeEach(() => {
    client = new HTTPClient('https://apis.do', 'test-api-key')
  })

  describe('constructor', () => {
    it('should create client with default baseUrl', () => {
      const defaultClient = new HTTPClient()
      expect(defaultClient).toBeInstanceOf(HTTPClient)
    })

    it('should create client with custom baseUrl and apiKey', () => {
      expect(client).toBeInstanceOf(HTTPClient)
    })
  })

  describe('request methods', () => {
    it('should have get method', () => {
      expect(typeof client.get).toBe('function')
    })

    it('should have post method', () => {
      expect(typeof client.post).toBe('function')
    })

    it('should have put method', () => {
      expect(typeof client.put).toBe('function')
    })

    it('should have patch method', () => {
      expect(typeof client.patch).toBe('function')
    })

    it('should have delete method', () => {
      expect(typeof client.delete).toBe('function')
    })

    it('should have head method', () => {
      expect(typeof client.head).toBe('function')
    })

    it('should have options method', () => {
      expect(typeof client.options).toBe('function')
    })
  })

  describe('createHTTPClient', () => {
    it('should create client instance', () => {
      const factoryClient = createHTTPClient('https://apis.do', 'test-key')
      expect(factoryClient).toBeInstanceOf(HTTPClient)
    })
  })
})
