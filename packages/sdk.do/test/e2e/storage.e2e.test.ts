/**
 * Storage Service E2E Tests
 *
 * Comprehensive end-to-end tests for the R2 storage service (workers/storage).
 * Tests cover upload, download, multipart uploads, pre-signed URLs, metadata,
 * listing, copy/move operations, and error handling.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'

describe('Storage Service E2E Tests', () => {
  let runner: E2ETestRunner

  beforeEach(() => {
    runner = new E2ETestRunner('storage')
  })

  afterEach(async () => {
    await runner.teardown()
  })

  test(
    'should upload and download files',
    async () => {
      const key = runner.createStorageKey('test-file', 'txt')
      const sdk = runner.getSDK()

      const content = 'Hello, World! This is a test file.'
      const blob = new Blob([content], { type: 'text/plain' })

      // Upload
      const uploadResult = await sdk.storage.upload(key, blob, {
        contentType: 'text/plain',
        metadata: { testId: runner.testId },
      })

      expect(uploadResult.key).toBe(key)
      expect(uploadResult.size).toBeGreaterThan(0)
      expect(uploadResult.etag).toBeDefined()
      expect(uploadResult.uploadedAt).toBeDefined()

      // Download
      const downloadResult = await sdk.storage.download(key)

      expect(downloadResult.size).toBe(uploadResult.size)
      expect(downloadResult.contentType).toBe('text/plain')
      expect(downloadResult.etag).toBe(uploadResult.etag)

      // Verify content
      const downloadedContent = new TextDecoder().decode(downloadResult.data)
      expect(downloadedContent).toBe(content)
    },
    getTimeout()
  )

  test(
    'should handle different file types',
    async () => {
      const sdk = runner.getSDK()

      // JSON file
      const jsonKey = runner.createStorageKey('data', 'json')
      const jsonData = { name: 'test', value: 123 }
      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' })
      await sdk.storage.upload(jsonKey, jsonBlob, { contentType: 'application/json' })

      // Binary file
      const binaryKey = runner.createStorageKey('binary', 'bin')
      const binaryData = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0xff])
      await sdk.storage.upload(binaryKey, binaryData.buffer, { contentType: 'application/octet-stream' })

      // Download and verify
      const jsonResult = await sdk.storage.download(jsonKey)
      const jsonContent = JSON.parse(new TextDecoder().decode(jsonResult.data))
      expect(jsonContent).toEqual(jsonData)

      const binaryResult = await sdk.storage.download(binaryKey)
      const binaryBytes = new Uint8Array(binaryResult.data)
      expect(Array.from(binaryBytes)).toEqual([0x00, 0x01, 0x02, 0x03, 0xff])
    },
    getTimeout()
  )

  test(
    'should delete files',
    async () => {
      const key = runner.createStorageKey('to-delete', 'txt')
      const sdk = runner.getSDK()

      // Upload
      const blob = new Blob(['delete me'], { type: 'text/plain' })
      await sdk.storage.upload(key, blob)

      // Verify exists
      const exists = await sdk.storage.metadata(key)
      expect(exists.key).toBe(key)

      // Delete
      const deleted = await sdk.storage.delete(key)
      expect(deleted).toBe(true)

      // Verify deleted
      await expect(sdk.storage.download(key)).rejects.toThrow()
    },
    getTimeout()
  )

  test(
    'should handle multipart upload for large files',
    async () => {
      const key = runner.createStorageKey('large-file', 'bin')
      const sdk = runner.getSDK()

      // Create 3 parts of 6MB each (minimum part size is 5MB)
      const partSize = 6 * 1024 * 1024
      const part1 = new ArrayBuffer(partSize)
      const part2 = new ArrayBuffer(partSize)
      const part3 = new ArrayBuffer(partSize)

      // Fill with recognizable patterns
      new Uint8Array(part1).fill(0x01)
      new Uint8Array(part2).fill(0x02)
      new Uint8Array(part3).fill(0x03)

      // Start multipart upload
      const upload = await sdk.storage.multipart.start(key, {
        contentType: 'application/octet-stream',
      })

      expect(upload.uploadId).toBeDefined()
      expect(upload.key).toBe(key)
      expect(upload.startedAt).toBeDefined()

      // Upload parts
      const partResponse1 = await sdk.storage.multipart.uploadPart(upload, 1, part1)
      const partResponse2 = await sdk.storage.multipart.uploadPart(upload, 2, part2)
      const partResponse3 = await sdk.storage.multipart.uploadPart(upload, 3, part3)

      expect(partResponse1.partNumber).toBe(1)
      expect(partResponse1.etag).toBeDefined()
      expect(partResponse2.partNumber).toBe(2)
      expect(partResponse2.etag).toBeDefined()
      expect(partResponse3.partNumber).toBe(3)
      expect(partResponse3.etag).toBeDefined()

      // Complete upload
      const result = await sdk.storage.multipart.complete(upload, [
        { partNumber: 1, etag: partResponse1.etag },
        { partNumber: 2, etag: partResponse2.etag },
        { partNumber: 3, etag: partResponse3.etag },
      ])

      expect(result.key).toBe(key)
      expect(result.size).toBe(partSize * 3)

      // Verify file exists
      const metadata = await sdk.storage.metadata(key)
      expect(metadata.size).toBe(partSize * 3)
    },
    getTimeout()
  )

  test(
    'should abort multipart upload',
    async () => {
      const key = runner.createStorageKey('aborted', 'bin')
      const sdk = runner.getSDK()

      // Start multipart upload
      const upload = await sdk.storage.multipart.start(key)

      // Upload one part
      const part = new ArrayBuffer(6 * 1024 * 1024)
      await sdk.storage.multipart.uploadPart(upload, 1, part)

      // Abort upload
      await sdk.storage.multipart.abort(upload)

      // Verify file doesn't exist
      await expect(sdk.storage.metadata(key)).rejects.toThrow()
    },
    getTimeout()
  )

  test(
    'should generate public URL',
    async () => {
      const key = runner.createStorageKey('public', 'txt')
      const sdk = runner.getSDK()

      const blob = new Blob(['public content'], { type: 'text/plain' })
      const uploadResult = await sdk.storage.upload(key, blob)

      // URL should be in upload result
      if (uploadResult.url) {
        expect(uploadResult.url).toContain(key)
        expect(uploadResult.url).toMatch(/^https?:\/\//)
      }
    },
    getTimeout()
  )

  test(
    'should generate signed URL',
    async () => {
      const key = runner.createStorageKey('signed', 'txt')
      const sdk = runner.getSDK()

      const blob = new Blob(['signed content'], { type: 'text/plain' })
      await sdk.storage.upload(key, blob)

      // Generate signed URL (1 hour expiration)
      const signedUrl = await sdk.storage.url(key, {
        expiresIn: 3600,
      })

      expect(signedUrl).toBeDefined()
      expect(signedUrl).toContain(key)
      expect(signedUrl).toMatch(/^https?:\/\//)

      // URL should work for download
      const response = await fetch(signedUrl)
      expect(response.ok).toBe(true)
      const content = await response.text()
      expect(content).toBe('signed content')
    },
    getTimeout()
  )

  test(
    'should get file metadata',
    async () => {
      const key = runner.createStorageKey('metadata-test', 'txt')
      const sdk = runner.getSDK()

      const blob = new Blob(['metadata test'], { type: 'text/plain' })
      const uploadResult = await sdk.storage.upload(key, blob, {
        contentType: 'text/plain',
        metadata: {
          author: 'test-suite',
          version: '1.0',
        },
      })

      // Get metadata
      const metadata = await sdk.storage.metadata(key)

      expect(metadata.key).toBe(key)
      expect(metadata.size).toBe(uploadResult.size)
      expect(metadata.etag).toBe(uploadResult.etag)
      expect(metadata.contentType).toBe('text/plain')
      expect(metadata.lastModified).toBeDefined()
      expect(metadata.uploadedAt).toBeDefined()

      // Custom metadata
      if (metadata.metadata) {
        expect(metadata.metadata.author).toBe('test-suite')
        expect(metadata.metadata.version).toBe('1.0')
      }
    },
    getTimeout()
  )

  test(
    'should list objects with prefix',
    async () => {
      const sdk = runner.getSDK()
      const prefix = `test/${runner.testId}/list-test`

      // Upload multiple files
      const keys = [`${prefix}/file1.txt`, `${prefix}/file2.txt`, `${prefix}/file3.txt`, `${prefix}/nested/file4.txt`]

      for (const key of keys) {
        const blob = new Blob([`content-${key}`], { type: 'text/plain' })
        await sdk.storage.upload(key, blob)

        // Register cleanup
        runner.registerCleanup(async () => {
          await sdk.storage.delete(key).catch(() => {})
        })
      }

      // List with prefix
      const list = await sdk.storage.list({
        prefix,
        limit: 100,
      })

      expect(list.objects.length).toBeGreaterThanOrEqual(4)

      const listedKeys = list.objects.map((obj) => obj.key)
      for (const key of keys) {
        expect(listedKeys).toContain(key)
      }
    },
    getTimeout()
  )

  test(
    'should paginate list results',
    async () => {
      const sdk = runner.getSDK()
      const prefix = `test/${runner.testId}/pagination`

      // Upload 5 files
      const keys: string[] = []
      for (let i = 1; i <= 5; i++) {
        const key = `${prefix}/file${i}.txt`
        keys.push(key)
        const blob = new Blob([`content ${i}`], { type: 'text/plain' })
        await sdk.storage.upload(key, blob)

        runner.registerCleanup(async () => {
          await sdk.storage.delete(key).catch(() => {})
        })
      }

      // List with pagination (2 items per page)
      const page1 = await sdk.storage.list({
        prefix,
        limit: 2,
      })

      expect(page1.objects.length).toBeLessThanOrEqual(2)

      if (page1.hasMore && page1.nextCursor) {
        const page2 = await sdk.storage.list({
          prefix,
          limit: 2,
          cursor: page1.nextCursor,
        })

        expect(page2.objects.length).toBeGreaterThan(0)
      }
    },
    getTimeout()
  )

  test(
    'should copy objects',
    async () => {
      const sdk = runner.getSDK()

      const sourceKey = runner.createStorageKey('source', 'txt')
      const destKey = runner.createStorageKey('destination', 'txt')

      // Upload source file
      const content = 'Copy me!'
      const blob = new Blob([content], { type: 'text/plain' })
      await sdk.storage.upload(sourceKey, blob)

      // Copy
      const copyResult = await sdk.storage.copy(sourceKey, destKey)

      expect(copyResult.key).toBe(destKey)
      expect(copyResult.size).toBeGreaterThan(0)

      // Verify both files exist
      const sourceExists = await sdk.storage.metadata(sourceKey)
      const destExists = await sdk.storage.metadata(destKey)

      expect(sourceExists.key).toBe(sourceKey)
      expect(destExists.key).toBe(destKey)
      expect(destExists.size).toBe(sourceExists.size)

      // Verify content is identical
      const destDownload = await sdk.storage.download(destKey)
      const destContent = new TextDecoder().decode(destDownload.data)
      expect(destContent).toBe(content)
    },
    getTimeout()
  )

  test(
    'should handle upload with cache control',
    async () => {
      const key = runner.createStorageKey('cached', 'txt')
      const sdk = runner.getSDK()

      const blob = new Blob(['cached content'], { type: 'text/plain' })
      await sdk.storage.upload(key, blob, {
        contentType: 'text/plain',
        cacheControl: 'public, max-age=3600',
      })

      const metadata = await sdk.storage.metadata(key)
      expect(metadata.key).toBe(key)
    },
    getTimeout()
  )

  test(
    'should handle upload with content encoding',
    async () => {
      const key = runner.createStorageKey('encoded', 'txt')
      const sdk = runner.getSDK()

      const blob = new Blob(['encoded content'], { type: 'text/plain' })
      await sdk.storage.upload(key, blob, {
        contentType: 'text/plain',
        contentEncoding: 'gzip',
      })

      const metadata = await sdk.storage.metadata(key)
      expect(metadata.key).toBe(key)
    },
    getTimeout()
  )

  test(
    'should handle error when downloading non-existent file',
    async () => {
      const key = runner.createStorageKey('does-not-exist', 'txt')
      const sdk = runner.getSDK()

      await expect(sdk.storage.download(key)).rejects.toThrow(/not found/i)
    },
    getTimeout()
  )

  test(
    'should handle error when getting metadata for non-existent file',
    async () => {
      const key = runner.createStorageKey('no-metadata', 'txt')
      const sdk = runner.getSDK()

      await expect(sdk.storage.metadata(key)).rejects.toThrow(/not found/i)
    },
    getTimeout()
  )

  test(
    'should return false when deleting non-existent file',
    async () => {
      const key = runner.createStorageKey('never-existed', 'txt')
      const sdk = runner.getSDK()

      const deleted = await sdk.storage.delete(key)
      expect(deleted).toBe(false)
    },
    getTimeout()
  )

  test(
    'should handle large metadata objects',
    async () => {
      const key = runner.createStorageKey('large-metadata', 'txt')
      const sdk = runner.getSDK()

      const largeMetadata: Record<string, string> = {}
      for (let i = 0; i < 50; i++) {
        largeMetadata[`field${i}`] = `value${i}`
      }

      const blob = new Blob(['test'], { type: 'text/plain' })
      await sdk.storage.upload(key, blob, {
        metadata: largeMetadata,
      })

      const metadata = await sdk.storage.metadata(key)
      expect(metadata.key).toBe(key)
    },
    getTimeout()
  )

  test(
    'should handle special characters in filenames',
    async () => {
      const sdk = runner.getSDK()

      // Note: Some special characters may need encoding
      const specialKey = `test/${runner.testId}/file with spaces & special (chars).txt`

      const blob = new Blob(['special chars test'], { type: 'text/plain' })
      const uploadResult = await sdk.storage.upload(specialKey, blob)

      runner.registerCleanup(async () => {
        await sdk.storage.delete(specialKey).catch(() => {})
      })

      expect(uploadResult.key).toBe(specialKey)

      // Download to verify
      const downloadResult = await sdk.storage.download(specialKey)
      const content = new TextDecoder().decode(downloadResult.data)
      expect(content).toBe('special chars test')
    },
    getTimeout()
  )
})
