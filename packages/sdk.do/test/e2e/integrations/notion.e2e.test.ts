/**
 * Notion Integration E2E Tests
 *
 * End-to-end tests for Notion API integration.
 * Tests cover pages, databases, blocks, users, comments, search, and webhooks.
 *
 * Prerequisites:
 * - NOTION_API_KEY or NOTION_TOKEN environment variable must be set (Internal Integration Token)
 * - NOTION_TEST_PAGE_ID environment variable (optional, parent page for test pages)
 * - Integration requires the following capabilities:
 *   - Read content
 *   - Update content
 *   - Insert content
 *   - Comment on pages
 *   - Read users
 *
 * Test Categories:
 * 1. Page Operations (6 tests)
 * 2. Database Operations (5 tests)
 * 3. Block Operations (5 tests)
 * 4. User Operations (2 tests)
 * 5. Comment Operations (2 tests)
 * 6. Search Operations (1 test)
 * 7. Webhook Handling (1 test)
 * 8. Error Handling (1 test)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'
import crypto from 'crypto'

describe('Notion Integration E2E Tests', () => {
  let runner: E2ETestRunner
  let createdPages: string[] = []
  let createdDatabases: string[] = []
  let createdBlocks: string[] = []
  let createdComments: string[] = []
  let parentPageId: string | undefined

  beforeEach(async () => {
    runner = new E2ETestRunner('notion')

    // Check for API key
    const apiKey = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN
    if (!apiKey) {
      throw new Error('NOTION_API_KEY or NOTION_TOKEN environment variable is required for Notion E2E tests')
    }

    // Get parent page ID (optional)
    parentPageId = process.env.NOTION_TEST_PAGE_ID

    // Reset tracking arrays
    createdPages = []
    createdDatabases = []
    createdBlocks = []
    createdComments = []
  })

  afterEach(async () => {
    const sdk = runner.getSDK()

    // Clean up comments (Notion doesn't support comment deletion via API)
    // Comments will remain but are harmless

    // Clean up blocks (individual blocks can't be deleted, they're removed with parent pages)

    // Clean up pages (archive them)
    for (const pageId of createdPages) {
      try {
        await sdk.api.notion.pages.update(pageId, {
          archived: true,
        })
      } catch (error) {
        console.warn(`Failed to archive page ${pageId}:`, error)
      }
    }

    // Clean up databases (archive them)
    for (const databaseId of createdDatabases) {
      try {
        await sdk.api.notion.databases.update(databaseId, {
          archived: true,
        })
      } catch (error) {
        console.warn(`Failed to archive database ${databaseId}:`, error)
      }
    }

    await runner.teardown()
  })

  // =============================================================================
  // 1. Page Operations (6 tests)
  // =============================================================================

  test(
    'should create page with title and content blocks',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `E2E Test Page - ${runner.testId}`

      // Create page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: `This is a test page created by E2E tests. Test ID: ${runner.testId}`,
                  },
                },
              ],
            },
          },
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [
                {
                  text: {
                    content: 'Test Section',
                  },
                },
              ],
            },
          },
        ],
      })

      expect(page).toBeDefined()
      expect(page.id).toBeTruthy()
      expect(page.object).toBe('page')
      expect(page.properties).toBeDefined()
      expect(page.properties.title).toBeDefined()
      expect(page.archived).toBe(false)

      // Track for cleanup
      createdPages.push(page.id)
    },
    getTimeout()
  )

  test(
    'should get page by ID',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `E2E Test Page for Retrieval - ${runner.testId}`

      // Create page first
      const created = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(created.id)

      // Retrieve page
      const retrieved = await sdk.api.notion.pages.retrieve(created.id)

      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(created.id)
      expect(retrieved.object).toBe('page')
      expect(retrieved.properties).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should update page properties',
    async () => {
      const sdk = runner.getSDK()
      const initialTitle = `Initial Title - ${runner.testId}`
      const updatedTitle = `Updated Title - ${runner.testId}`

      // Create page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: initialTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Update page
      const updated = await sdk.api.notion.pages.update(page.id, {
        properties: {
          title: {
            title: [
              {
                text: {
                  content: updatedTitle,
                },
              },
            ],
          },
        },
      })

      expect(updated).toBeDefined()
      expect(updated.id).toBe(page.id)
      expect(updated.properties.title.title[0].text.content).toBe(updatedTitle)
    },
    getTimeout()
  )

  test(
    'should archive page',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `Page to Archive - ${runner.testId}`

      // Create page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Archive page
      const archived = await sdk.api.notion.pages.update(page.id, {
        archived: true,
      })

      expect(archived).toBeDefined()
      expect(archived.id).toBe(page.id)
      expect(archived.archived).toBe(true)
    },
    getTimeout()
  )

  test(
    'should list pages in workspace',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `List Test Page - ${runner.testId}`

      // Create a test page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Wait for indexing
      await runner.wait(2000)

      // Search for the page
      const results = await sdk.api.notion.search.query({
        query: runner.testId,
        filter: {
          value: 'page',
          property: 'object',
        },
      })

      expect(results).toBeDefined()
      expect(results.results).toBeDefined()
      expect(Array.isArray(results.results)).toBe(true)

      // Find our test page
      const testPage = results.results.find((p: any) => p.id === page.id)
      expect(testPage).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should search pages by title',
    async () => {
      const sdk = runner.getSDK()
      const uniqueTitle = `Searchable Page ${runner.testId}`

      // Create page with unique title
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: uniqueTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Wait for indexing
      await runner.wait(2000)

      // Search by title
      const results = await sdk.api.notion.search.query({
        query: runner.testId,
        filter: {
          value: 'page',
          property: 'object',
        },
        sort: {
          direction: 'descending',
          timestamp: 'last_edited_time',
        },
      })

      expect(results).toBeDefined()
      expect(results.results.length).toBeGreaterThan(0)

      // Verify our page is in results
      const foundPage = results.results.find((p: any) => p.id === page.id)
      expect(foundPage).toBeDefined()
    },
    getTimeout()
  )

  // =============================================================================
  // 2. Database Operations (5 tests)
  // =============================================================================

  test(
    'should create database with properties',
    async () => {
      const sdk = runner.getSDK()
      const databaseTitle = `E2E Test Database - ${runner.testId}`

      // Create database
      const database = await sdk.api.notion.databases.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        title: [
          {
            text: {
              content: databaseTitle,
            },
          },
        ],
        properties: {
          Name: {
            title: {},
          },
          Status: {
            select: {
              options: [
                { name: 'Not started', color: 'red' },
                { name: 'In progress', color: 'yellow' },
                { name: 'Done', color: 'green' },
              ],
            },
          },
          Priority: {
            number: {
              format: 'number',
            },
          },
          'Due Date': {
            date: {},
          },
          Completed: {
            checkbox: {},
          },
        },
      })

      expect(database).toBeDefined()
      expect(database.id).toBeTruthy()
      expect(database.object).toBe('database')
      expect(database.title[0].text.content).toBe(databaseTitle)
      expect(database.properties).toBeDefined()
      expect(database.properties.Name).toBeDefined()
      expect(database.properties.Status).toBeDefined()
      expect(database.properties.Priority).toBeDefined()
      expect(database.properties['Due Date']).toBeDefined()
      expect(database.properties.Completed).toBeDefined()

      // Track for cleanup
      createdDatabases.push(database.id)
    },
    getTimeout()
  )

  test(
    'should get database by ID',
    async () => {
      const sdk = runner.getSDK()
      const databaseTitle = `Database for Retrieval - ${runner.testId}`

      // Create database
      const created = await sdk.api.notion.databases.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        title: [
          {
            text: {
              content: databaseTitle,
            },
          },
        ],
        properties: {
          Name: {
            title: {},
          },
        },
      })

      createdDatabases.push(created.id)

      // Retrieve database
      const retrieved = await sdk.api.notion.databases.retrieve(created.id)

      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(created.id)
      expect(retrieved.object).toBe('database')
      expect(retrieved.title[0].text.content).toBe(databaseTitle)
    },
    getTimeout()
  )

  test(
    'should update database properties',
    async () => {
      const sdk = runner.getSDK()
      const initialTitle = `Initial DB Title - ${runner.testId}`
      const updatedTitle = `Updated DB Title - ${runner.testId}`

      // Create database
      const database = await sdk.api.notion.databases.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        title: [
          {
            text: {
              content: initialTitle,
            },
          },
        ],
        properties: {
          Name: {
            title: {},
          },
        },
      })

      createdDatabases.push(database.id)

      // Update database
      const updated = await sdk.api.notion.databases.update(database.id, {
        title: [
          {
            text: {
              content: updatedTitle,
            },
          },
        ],
        properties: {
          Tags: {
            multi_select: {
              options: [
                { name: 'Important', color: 'red' },
                { name: 'Urgent', color: 'orange' },
              ],
            },
          },
        },
      })

      expect(updated).toBeDefined()
      expect(updated.id).toBe(database.id)
      expect(updated.title[0].text.content).toBe(updatedTitle)
      expect(updated.properties.Tags).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should query database with filters',
    async () => {
      const sdk = runner.getSDK()
      const databaseTitle = `Query Test Database - ${runner.testId}`

      // Create database
      const database = await sdk.api.notion.databases.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        title: [
          {
            text: {
              content: databaseTitle,
            },
          },
        ],
        properties: {
          Name: {
            title: {},
          },
          Priority: {
            number: {
              format: 'number',
            },
          },
        },
      })

      createdDatabases.push(database.id)

      // Create pages in database
      const page1 = await sdk.api.notion.pages.create({
        parent: { database_id: database.id },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: 'High Priority Task',
                },
              },
            ],
          },
          Priority: {
            number: 1,
          },
        },
      })

      const page2 = await sdk.api.notion.pages.create({
        parent: { database_id: database.id },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: 'Low Priority Task',
                },
              },
            ],
          },
          Priority: {
            number: 5,
          },
        },
      })

      createdPages.push(page1.id, page2.id)

      // Wait for indexing
      await runner.wait(1000)

      // Query database with filter
      const results = await sdk.api.notion.databases.query(database.id, {
        filter: {
          property: 'Priority',
          number: {
            less_than_or_equal_to: 2,
          },
        },
      })

      expect(results).toBeDefined()
      expect(results.results).toBeDefined()
      expect(Array.isArray(results.results)).toBe(true)
      expect(results.results.length).toBeGreaterThan(0)

      // Verify high priority page is in results
      const highPriorityPage = results.results.find((p: any) => p.id === page1.id)
      expect(highPriorityPage).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should create page in database with property values',
    async () => {
      const sdk = runner.getSDK()
      const databaseTitle = `Database with Page - ${runner.testId}`

      // Create database
      const database = await sdk.api.notion.databases.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        title: [
          {
            text: {
              content: databaseTitle,
            },
          },
        ],
        properties: {
          Name: {
            title: {},
          },
          Status: {
            select: {
              options: [
                { name: 'Active', color: 'green' },
                { name: 'Inactive', color: 'red' },
              ],
            },
          },
          Count: {
            number: {},
          },
          'Start Date': {
            date: {},
          },
          Verified: {
            checkbox: {},
          },
        },
      })

      createdDatabases.push(database.id)

      // Create page with all property types
      const page = await sdk.api.notion.pages.create({
        parent: { database_id: database.id },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: `Test Entry - ${runner.testId}`,
                },
              },
            ],
          },
          Status: {
            select: {
              name: 'Active',
            },
          },
          Count: {
            number: 42,
          },
          'Start Date': {
            date: {
              start: '2025-10-12',
            },
          },
          Verified: {
            checkbox: true,
          },
        },
      })

      expect(page).toBeDefined()
      expect(page.id).toBeTruthy()
      expect(page.properties.Name.title[0].text.content).toBe(`Test Entry - ${runner.testId}`)
      expect(page.properties.Status.select.name).toBe('Active')
      expect(page.properties.Count.number).toBe(42)
      expect(page.properties['Start Date'].date.start).toBe('2025-10-12')
      expect(page.properties.Verified.checkbox).toBe(true)

      createdPages.push(page.id)
    },
    getTimeout()
  )

  // =============================================================================
  // 3. Block Operations (5 tests)
  // =============================================================================

  test(
    'should append paragraph blocks to page',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `Block Test Page - ${runner.testId}`

      // Create page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Append paragraph blocks
      const result = await sdk.api.notion.blocks.children.append(page.id, {
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: 'First paragraph block',
                  },
                },
              ],
            },
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: 'Second paragraph block with ',
                  },
                },
                {
                  text: {
                    content: 'bold text',
                  },
                  annotations: {
                    bold: true,
                  },
                },
              ],
            },
          },
        ],
      })

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(result.results.length).toBe(2)
      expect(result.results[0].type).toBe('paragraph')
      expect(result.results[1].type).toBe('paragraph')

      // Track blocks
      result.results.forEach((block: any) => createdBlocks.push(block.id))
    },
    getTimeout()
  )

  test(
    'should append heading blocks (h1, h2, h3)',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `Heading Test Page - ${runner.testId}`

      // Create page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Append heading blocks
      const result = await sdk.api.notion.blocks.children.append(page.id, {
        children: [
          {
            object: 'block',
            type: 'heading_1',
            heading_1: {
              rich_text: [
                {
                  text: {
                    content: 'Heading 1',
                  },
                },
              ],
            },
          },
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [
                {
                  text: {
                    content: 'Heading 2',
                  },
                },
              ],
            },
          },
          {
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [
                {
                  text: {
                    content: 'Heading 3',
                  },
                },
              ],
            },
          },
        ],
      })

      expect(result).toBeDefined()
      expect(result.results.length).toBe(3)
      expect(result.results[0].type).toBe('heading_1')
      expect(result.results[1].type).toBe('heading_2')
      expect(result.results[2].type).toBe('heading_3')

      result.results.forEach((block: any) => createdBlocks.push(block.id))
    },
    getTimeout()
  )

  test(
    'should append to-do blocks with checkboxes',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `Todo Test Page - ${runner.testId}`

      // Create page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Append to-do blocks
      const result = await sdk.api.notion.blocks.children.append(page.id, {
        children: [
          {
            object: 'block',
            type: 'to_do',
            to_do: {
              rich_text: [
                {
                  text: {
                    content: 'Unchecked todo item',
                  },
                },
              ],
              checked: false,
            },
          },
          {
            object: 'block',
            type: 'to_do',
            to_do: {
              rich_text: [
                {
                  text: {
                    content: 'Checked todo item',
                  },
                },
              ],
              checked: true,
            },
          },
        ],
      })

      expect(result).toBeDefined()
      expect(result.results.length).toBe(2)
      expect(result.results[0].type).toBe('to_do')
      expect(result.results[0].to_do.checked).toBe(false)
      expect(result.results[1].type).toBe('to_do')
      expect(result.results[1].to_do.checked).toBe(true)

      result.results.forEach((block: any) => createdBlocks.push(block.id))
    },
    getTimeout()
  )

  test(
    'should append bullet list blocks',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `List Test Page - ${runner.testId}`

      // Create page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Append bullet list blocks
      const result = await sdk.api.notion.blocks.children.append(page.id, {
        children: [
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [
                {
                  text: {
                    content: 'First bullet point',
                  },
                },
              ],
            },
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [
                {
                  text: {
                    content: 'Second bullet point',
                  },
                },
              ],
            },
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [
                {
                  text: {
                    content: 'Third bullet point',
                  },
                },
              ],
            },
          },
        ],
      })

      expect(result).toBeDefined()
      expect(result.results.length).toBe(3)
      expect(result.results[0].type).toBe('bulleted_list_item')
      expect(result.results[1].type).toBe('bulleted_list_item')
      expect(result.results[2].type).toBe('bulleted_list_item')

      result.results.forEach((block: any) => createdBlocks.push(block.id))
    },
    getTimeout()
  )

  test(
    'should get block children',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `Children Test Page - ${runner.testId}`

      // Create page with children
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: 'Child block 1',
                  },
                },
              ],
            },
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: 'Child block 2',
                  },
                },
              ],
            },
          },
        ],
      })

      createdPages.push(page.id)

      // Get block children
      const children = await sdk.api.notion.blocks.children.list(page.id)

      expect(children).toBeDefined()
      expect(children.results).toBeDefined()
      expect(Array.isArray(children.results)).toBe(true)
      expect(children.results.length).toBeGreaterThanOrEqual(2)

      // Verify children are paragraph blocks
      const paragraphs = children.results.filter((block: any) => block.type === 'paragraph')
      expect(paragraphs.length).toBeGreaterThanOrEqual(2)

      children.results.forEach((block: any) => createdBlocks.push(block.id))
    },
    getTimeout()
  )

  // =============================================================================
  // 4. User Operations (2 tests)
  // =============================================================================

  test(
    'should get current user (bot)',
    async () => {
      const sdk = runner.getSDK()

      // Get bot user info
      const user = await sdk.api.notion.users.me()

      expect(user).toBeDefined()
      expect(user.id).toBeTruthy()
      expect(user.object).toBe('user')
      expect(user.type).toBe('bot')
      expect(user.bot).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should list all users',
    async () => {
      const sdk = runner.getSDK()

      // List users
      const result = await sdk.api.notion.users.list()

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)

      // Verify user structure
      const user = result.results[0]
      expect(user.id).toBeTruthy()
      expect(user.object).toBe('user')
      expect(user.type).toBeTruthy()
    },
    getTimeout()
  )

  // =============================================================================
  // 5. Comment Operations (2 tests)
  // =============================================================================

  test(
    'should create comment on page',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `Comment Test Page - ${runner.testId}`

      // Create page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Create comment
      const comment = await sdk.api.notion.comments.create({
        parent: { page_id: page.id },
        rich_text: [
          {
            text: {
              content: `E2E test comment - ${runner.testId}`,
            },
          },
        ],
      })

      expect(comment).toBeDefined()
      expect(comment.id).toBeTruthy()
      expect(comment.object).toBe('comment')
      expect(comment.parent.page_id).toBe(page.id)
      expect(comment.rich_text[0].text.content).toBe(`E2E test comment - ${runner.testId}`)

      createdComments.push(comment.id)
    },
    getTimeout()
  )

  test(
    'should get comments for page',
    async () => {
      const sdk = runner.getSDK()
      const pageTitle = `Page with Comments - ${runner.testId}`
      const commentText = `Test comment content - ${runner.testId}`

      // Create page
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageTitle,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Create comment
      const comment = await sdk.api.notion.comments.create({
        parent: { page_id: page.id },
        rich_text: [
          {
            text: {
              content: commentText,
            },
          },
        ],
      })

      createdComments.push(comment.id)

      // Get comments for page
      const result = await sdk.api.notion.comments.list({
        block_id: page.id,
      })

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)

      // Find our comment
      const ourComment = result.results.find((c: any) => c.id === comment.id)
      expect(ourComment).toBeDefined()
      expect(ourComment.rich_text[0].text.content).toBe(commentText)
    },
    getTimeout()
  )

  // =============================================================================
  // 6. Search Operations (1 test)
  // =============================================================================

  test(
    'should perform universal search across pages and databases',
    async () => {
      const sdk = runner.getSDK()
      const searchTerm = `Universal Search Test ${runner.testId}`

      // Create a page with the search term
      const page = await sdk.api.notion.pages.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: searchTerm,
                },
              },
            ],
          },
        },
      })

      createdPages.push(page.id)

      // Create a database with the search term
      const database = await sdk.api.notion.databases.create({
        parent: parentPageId ? { page_id: parentPageId } : { type: 'page_id', page_id: 'root' },
        title: [
          {
            text: {
              content: searchTerm,
            },
          },
        ],
        properties: {
          Name: {
            title: {},
          },
        },
      })

      createdDatabases.push(database.id)

      // Wait for indexing
      await runner.wait(3000)

      // Universal search (no filter)
      const results = await sdk.api.notion.search.query({
        query: runner.testId,
      })

      expect(results).toBeDefined()
      expect(results.results).toBeDefined()
      expect(Array.isArray(results.results)).toBe(true)
      expect(results.results.length).toBeGreaterThan(0)

      // Verify both page and database are in results
      const foundPage = results.results.find((r: any) => r.id === page.id && r.object === 'page')
      const foundDatabase = results.results.find((r: any) => r.id === database.id && r.object === 'database')

      expect(foundPage).toBeDefined()
      expect(foundDatabase).toBeDefined()
    },
    getTimeout()
  )

  // =============================================================================
  // 7. Webhook Handling (1 test)
  // =============================================================================

  test(
    'should verify webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Notion webhook secret
      const webhookSecret = process.env.NOTION_WEBHOOK_SECRET || 'test-webhook-secret'

      // Create test webhook payload
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const body = JSON.stringify({
        type: 'page',
        page: {
          id: 'test-page-id',
        },
      })

      // Generate valid signature (Notion uses HMAC SHA256)
      const signatureData = `v0:${timestamp}:${body}`
      const signature = 'v0=' + crypto.createHmac('sha256', webhookSecret).update(signatureData).digest('hex')

      // Verify signature
      const isValid = await sdk.api.notion.webhooks.verify({
        body,
        timestamp,
        signature,
        secret: webhookSecret,
      })

      expect(isValid).toBe(true)

      // Test with invalid signature
      const invalidSignature = 'v0=invalid_signature'
      const isInvalid = await sdk.api.notion.webhooks.verify({
        body,
        timestamp,
        signature: invalidSignature,
        secret: webhookSecret,
      })

      expect(isInvalid).toBe(false)
    },
    getTimeout()
  )

  // =============================================================================
  // 8. Error Handling (1 test)
  // =============================================================================

  test(
    'should handle various Notion API errors',
    async () => {
      const sdk = runner.getSDK()

      // Test 1: Unauthorized (invalid API key)
      try {
        await sdk.api.notion.withToken('secret_invalid_token').users.me()
        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.message.toLowerCase()).toMatch(/unauthorized|invalid|token/)
      }

      // Test 2: Not found (non-existent page)
      try {
        await sdk.api.notion.pages.retrieve('00000000-0000-0000-0000-000000000000')
        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.message.toLowerCase()).toMatch(/not found|does not exist/)
      }

      // Test 3: Rate limit (if applicable)
      // Notion rate limit: 3 requests per second
      // This test would require making many requests quickly

      // Test 4: Validation error (invalid request)
      try {
        await sdk.api.notion.pages.create({
          parent: { page_id: 'invalid-parent-id' },
          properties: {
            // Missing required title property
          },
        })
        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
      }
    },
    getTimeout()
  )
})
