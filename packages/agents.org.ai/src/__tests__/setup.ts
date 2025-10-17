/**
 * Test setup for pdm agent integration tests
 *
 * This file provides common setup, fixtures, and utilities for testing
 * the pdm agent with GitHub and Vapi integrations.
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

/**
 * Mock GitHub API client
 * In Phase 2, this will be replaced with actual GitHub API mocks
 */
export const mockGitHub = {
  repos: {
    get: async (repo: string) => ({ data: { default_branch: 'main' } }),
    listCommits: async (repo: string, options: any) => ({ data: [] }),
  },
  issues: {
    get: async (repo: string, issue_number: number) => ({
      data: {
        number: issue_number,
        title: 'Test issue',
        state: 'open',
        labels: [],
        user: { login: 'testuser' },
      },
    }),
    create: async (repo: string, options: any) => ({ data: { number: 1 } }),
    createComment: async (repo: string, issue_number: number, body: string) => ({ data: { id: 1 } }),
  },
  pulls: {
    get: async (repo: string, pull_number: number) => ({
      data: {
        number: pull_number,
        title: 'Test PR',
        state: 'open',
        labels: [],
        user: { login: 'testuser' },
        head: { sha: 'abc123' },
        mergeable: true,
      },
    }),
    merge: async (repo: string, pull_number: number, options: any) => ({ data: { merged: true } }),
  },
  checks: {
    listForRef: async (repo: string, ref: string) => ({
      data: {
        check_runs: [{ status: 'completed', conclusion: 'success' }],
      },
    }),
  },
}

/**
 * Mock Vapi API client
 * In Phase 2, this will be replaced with actual Vapi API mocks
 */
export const mockVapi = {
  sms: {
    send: async (to: string, message: string) => ({ success: true, id: 'sms_123' }),
  },
  call: {
    create: async (options: any) => ({ success: true, id: 'call_123' }),
  },
  email: {
    send: async (to: string, subject: string, body: string) => ({ success: true, id: 'email_123' }),
  },
}

/**
 * Test fixtures for common scenarios
 */
export const fixtures = {
  // Ready-to-merge PR
  readyPR: {
    number: 100,
    author: 'testuser',
    title: 'feat: add new feature',
    files: ['src/feature.ts', 'src/__tests__/feature.test.ts', 'README.md'],
    labels: ['feature', 'has-tests'],
    ciPassing: true,
    codeReviewComplete: true,
    testsIncluded: true,
    documentationUpdated: true,
    noUnresolvedComments: true,
    alignedWithRoadmap: true,
  },

  // PR needing attention
  blockedPR: {
    number: 101,
    author: 'testuser',
    title: 'feat: incomplete feature',
    files: ['src/feature.ts'],
    labels: ['feature'],
    ciPassing: false,
    codeReviewComplete: false,
    testsIncluded: false,
    documentationUpdated: false,
    noUnresolvedComments: false,
    alignedWithRoadmap: true,
  },

  // Breaking change PR (requires human review)
  breakingPR: {
    number: 102,
    author: 'testuser',
    title: 'feat!: BREAKING change to API',
    files: ['src/api.ts', 'src/__tests__/api.test.ts'],
    labels: ['breaking-change'],
    ciPassing: true,
    codeReviewComplete: true,
    testsIncluded: true,
    documentationUpdated: true,
    noUnresolvedComments: true,
    alignedWithRoadmap: true,
  },

  // Auto-merge eligible PR (docs only)
  docsPR: {
    number: 103,
    author: 'testuser',
    title: 'docs: update readme',
    files: ['README.md', 'docs/guide.mdx'],
    labels: ['documentation'],
    ciPassing: true,
    codeReviewComplete: true,
    testsIncluded: true,
    documentationUpdated: true,
    noUnresolvedComments: true,
    alignedWithRoadmap: true,
  },

  // Critical issue
  criticalIssue: {
    number: 200,
    author: 'testuser',
    title: 'Production outage: API not responding',
    body: 'Users are unable to access the API...',
    labels: ['P0', 'production', 'critical'],
  },

  // Feature request needing clarification
  unclearIssue: {
    number: 201,
    author: 'testuser',
    title: 'Add new feature',
    body: 'Please add feature X',
    labels: ['feature'],
  },
}

/**
 * Environment variable setup for tests
 */
export function setupTestEnv() {
  process.env.GITHUB_REPO_URL = 'https://github.com/test/repo'
  process.env.GITHUB_REVIEW_OWNER = 'testreviewer'
  process.env.GITHUB_TOKEN = 'test_token'
  process.env.OPENAI_API_KEY = 'test_openai_key'
  process.env.OPENAI_MODEL = 'gpt-5'
  process.env.VAPI_API_KEY = 'test_vapi_key'
  process.env.VAPI_PHONE_NUMBER = '+15555551234'
}

/**
 * Clean up test environment
 */
export function cleanupTestEnv() {
  delete process.env.GITHUB_REPO_URL
  delete process.env.GITHUB_REVIEW_OWNER
  delete process.env.GITHUB_TOKEN
  delete process.env.OPENAI_API_KEY
  delete process.env.OPENAI_MODEL
  delete process.env.VAPI_API_KEY
  delete process.env.VAPI_PHONE_NUMBER
}

/**
 * Global test hooks
 */
beforeAll(() => {
  setupTestEnv()
})

afterAll(() => {
  cleanupTestEnv()
})

/**
 * Reset mocks before each test
 */
beforeEach(() => {
  // Reset any stateful mocks here
})

afterEach(() => {
  // Clean up after each test
})
