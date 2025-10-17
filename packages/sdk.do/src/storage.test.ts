/**
 * Tests for Storage Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { StorageService, createStorageService } from './storage'
import type { UploadResponse, DownloadResponse, MultipartUpload, PartResponse, ObjectMetadata, ObjectList, CopyResponse } from './storage'

describe('StorageService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: StorageService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    service = new StorageService('https://test.storage.do', 'test-api-key')
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new StorageService()
      expect(defaultService).toBeInstanceOf(StorageService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(StorageService)
    })
  })

  describe('upload()', () => {
    test('uploads a file', async () => {
      const mockResponse: UploadResponse = {
        key: 'test-file.txt',
        size: 1024,
        contentType: 'text/plain',
        etag: 'abc123',
        url: 'https://storage.do/test-file.txt',
        uploadedAt: '2025-10-12T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' })
      const result = await service.upload('test-file.txt', file)

      expect(mockFetch).toHaveBeenCalledWith('https://test.storage.do/upload', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        body: expect.any(FormData),
      })

      expect(result.key).toBe('test-file.txt')
      expect(result.size).toBe(1024)
    })

    test('uploads with metadata', async () => {
      const mockResponse: UploadResponse = {
        key: 'test.pdf',
        size: 2048,
        contentType: 'application/pdf',
        etag: 'def456',
        url: 'https://storage.do/test.pdf',
        uploadedAt: '2025-10-12T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const file = new Blob(['PDF content'], { type: 'application/pdf' })
      const result = await service.upload('test.pdf', file, {
        contentType: 'application/pdf',
        metadata: { author: 'John Doe', version: '1.0' },
      })

      expect(result.key).toBe('test.pdf')
    })

    test('throws error on upload failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid file',
      })

      const file = new File(['test'], 'test.txt')
      await expect(service.upload('test.txt', file)).rejects.toThrow('Failed to upload file: Invalid file')
    })
  })

  describe('download()', () => {
    test('downloads a file', async () => {
      const arrayBuffer = new ArrayBuffer(11)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => arrayBuffer,
        headers: new Headers({
          'Content-Type': 'text/plain',
          'Content-Length': '11',
          ETag: 'abc123',
          'Last-Modified': '2025-10-12T00:00:00Z',
        }),
      })

      const result = await service.download('test-file.txt')

      expect(mockFetch).toHaveBeenCalledWith('https://test.storage.do/download/test-file.txt', {
        headers: {
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.data).toBe(arrayBuffer)
      expect(result.contentType).toBe('text/plain')
      expect(result.size).toBe(11)
      expect(result.etag).toBe('abc123')
    })

    test('throws error on 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not found',
      })

      await expect(service.download('missing.txt')).rejects.toThrow('Object not found: missing.txt')
    })

    test('throws error on other failures', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Server error',
      })

      await expect(service.download('test.txt')).rejects.toThrow('Failed to download file: Server error')
    })
  })

  describe('delete()', () => {
    test('deletes a file', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      })

      const result = await service.delete('test-file.txt')

      expect(mockFetch).toHaveBeenCalledWith('https://test.storage.do/delete/test-file.txt', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result).toBe(true)
    })

    test('returns false on 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not found',
      })

      const result = await service.delete('missing.txt')
      expect(result).toBe(false)
    })

    test('throws error on other failures', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Server error',
      })

      await expect(service.delete('test.txt')).rejects.toThrow('Failed to delete file: Server error')
    })
  })

  describe('multipart operations', () => {
    describe('multipart.start()', () => {
      test('starts multipart upload', async () => {
        const mockResponse: MultipartUpload = {
          key: 'large-file.zip',
          uploadId: 'upload-123',
          createdAt: '2025-10-12T00:00:00Z',
        }

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        })

        const result = await service.multipart.start('large-file.zip', {
          contentType: 'application/zip',
        })

        expect(result.uploadId).toBe('upload-123')
        expect(result.key).toBe('large-file.zip')
      })
    })

    describe('multipart.uploadPart()', () => {
      test('uploads a part', async () => {
        const mockResponse: PartResponse = {
          partNumber: 1,
          etag: 'part-etag-1',
          size: 5242880,
        }

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        })

        const upload: MultipartUpload = {
          key: 'large-file.zip',
          uploadId: 'upload-123',
          createdAt: '2025-10-12T00:00:00Z',
        }

        const data = new ArrayBuffer(5242880) // 5MB
        const result = await service.multipart.uploadPart(upload, 1, data)

        expect(result.partNumber).toBe(1)
        expect(result.etag).toBe('part-etag-1')
        expect(result.size).toBe(5242880)
      })
    })

    describe('multipart.complete()', () => {
      test('completes multipart upload', async () => {
        const mockResponse: UploadResponse = {
          key: 'large-file.zip',
          size: 10485760,
          contentType: 'application/zip',
          etag: 'final-etag',
          url: 'https://storage.do/large-file.zip',
          uploadedAt: '2025-10-12T00:00:00Z',
        }

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        })

        const upload: MultipartUpload = {
          key: 'large-file.zip',
          uploadId: 'upload-123',
          createdAt: '2025-10-12T00:00:00Z',
        }

        const parts = [
          { partNumber: 1, etag: 'part-etag-1' },
          { partNumber: 2, etag: 'part-etag-2' },
        ]

        const result = await service.multipart.complete(upload, parts)

        expect(result.key).toBe('large-file.zip')
        expect(result.size).toBe(10485760)
      })
    })

    describe('multipart.abort()', () => {
      test('aborts multipart upload', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })

        const upload: MultipartUpload = {
          key: 'large-file.zip',
          uploadId: 'upload-123',
          createdAt: '2025-10-12T00:00:00Z',
        }

        await service.multipart.abort(upload)

        expect(mockFetch).toHaveBeenCalledWith('https://test.storage.do/multipart/abort', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-api-key',
          },
          body: JSON.stringify({ uploadId: upload.uploadId, key: upload.key }),
        })
      })
    })
  })

  describe('url()', () => {
    test('generates pre-signed URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: 'https://storage.do/signed-url?token=xyz' }),
      })

      const url = await service.url('test-file.txt', { expiresIn: 3600 })

      expect(url).toBe('https://storage.do/signed-url?token=xyz')
    })

    test('throws error on URL generation failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid key',
      })

      await expect(service.url('invalid-key')).rejects.toThrow('Failed to generate pre-signed URL: Invalid key')
    })
  })

  describe('metadata()', () => {
    test('retrieves object metadata', async () => {
      const mockMetadata: ObjectMetadata = {
        key: 'test-file.txt',
        size: 1024,
        contentType: 'text/plain',
        etag: 'abc123',
        createdAt: '2025-10-12T00:00:00Z',
        modifiedAt: '2025-10-12T00:00:00Z',
        metadata: { author: 'John Doe' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetadata,
      })

      const result = await service.metadata('test-file.txt')

      expect(result.key).toBe('test-file.txt')
      expect(result.size).toBe(1024)
      expect(result.metadata?.author).toBe('John Doe')
    })
  })

  describe('list()', () => {
    test('lists objects', async () => {
      const mockList: ObjectList = {
        objects: [
          {
            key: 'file1.txt',
            size: 1024,
            contentType: 'text/plain',
            etag: 'abc1',
            createdAt: '2025-10-12T00:00:00Z',
            modifiedAt: '2025-10-12T00:00:00Z',
          },
          {
            key: 'file2.txt',
            size: 2048,
            contentType: 'text/plain',
            etag: 'abc2',
            createdAt: '2025-10-12T00:00:00Z',
            modifiedAt: '2025-10-12T00:00:00Z',
          },
        ],
        total: 2,
        hasMore: false,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockList,
      })

      const result = await service.list({ prefix: 'files/', limit: 100 })

      expect(result.objects).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.hasMore).toBe(false)
    })
  })

  describe('copy()', () => {
    test('copies an object', async () => {
      const mockResponse: CopyResponse = {
        sourceKey: 'original.txt',
        destinationKey: 'copy.txt',
        size: 1024,
        contentType: 'text/plain',
        etag: 'new-etag',
        copiedAt: '2025-10-12T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.copy('original.txt', 'copy.txt')

      expect(result.sourceKey).toBe('original.txt')
      expect(result.destinationKey).toBe('copy.txt')
      expect(result.size).toBe(1024)
    })
  })

  describe('createStorageService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createStorageService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(StorageService)
    })
  })
})
