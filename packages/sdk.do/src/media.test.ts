/**
 * Tests for Media Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { MediaService, createMediaService } from './media'
import type { MediaFile, ListMediaResponse, UpdateMediaOptions } from './media'

describe('MediaService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: MediaService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    service = new MediaService('https://test.media.do', 'test-api-key')
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new MediaService()
      expect(defaultService).toBeInstanceOf(MediaService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(MediaService)
    })
  })

  describe('upload()', () => {
    test('uploads a file (Blob)', async () => {
      const mockFile: MediaFile = {
        id: 'media_123',
        key: 'uploads/test.jpg',
        filename: 'test.jpg',
        size: 1024,
        mimeType: 'image/jpeg',
        uploaded: '2025-10-11T16:00:00Z',
        url: 'https://cdn.test.do/uploads/test.jpg',
        isImage: true,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFile,
      })

      const blob = new Blob(['test content'], { type: 'image/jpeg' })
      const result = await service.upload(blob)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.media.do/v1/media/upload',
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer test-api-key' },
        })
      )

      const formData = mockFetch.mock.calls[0][1].body
      expect(formData).toBeInstanceOf(FormData)

      expect(result.id).toBe('media_123')
      expect(result.filename).toBe('test.jpg')
    })

    test('uploads a file with metadata options', async () => {
      const mockFile: MediaFile = {
        id: 'media_456',
        key: 'products/phone.jpg',
        filename: 'phone.jpg',
        size: 2048,
        mimeType: 'image/jpeg',
        uploaded: '2025-10-11T16:00:00Z',
        url: 'https://cdn.test.do/products/phone.jpg',
        isImage: true,
        alt: 'Product photo',
        title: 'iPhone 15',
        description: 'Latest iPhone model',
        tags: ['electronics', 'featured'],
        folder: 'products',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFile,
      })

      const blob = new Blob(['test content'], { type: 'image/jpeg' })
      const result = await service.upload(blob, {
        alt: 'Product photo',
        title: 'iPhone 15',
        description: 'Latest iPhone model',
        tags: ['electronics', 'featured'],
        folder: 'products',
      })

      expect(result.alt).toBe('Product photo')
      expect(result.tags).toEqual(['electronics', 'featured'])
      expect(result.folder).toBe('products')
    })

    test('uploads an ArrayBuffer', async () => {
      const mockFile: MediaFile = {
        id: 'media_789',
        key: 'uploads/data.bin',
        filename: 'data.bin',
        size: 512,
        mimeType: 'application/octet-stream',
        uploaded: '2025-10-11T16:00:00Z',
        url: 'https://cdn.test.do/uploads/data.bin',
        isImage: false,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFile,
      })

      const buffer = new ArrayBuffer(512)
      const result = await service.upload(buffer)

      expect(result.id).toBe('media_789')
      expect(result.isImage).toBe(false)
    })

    test('throws error on upload failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid file type',
      })

      const blob = new Blob(['test'], { type: 'text/plain' })
      await expect(service.upload(blob)).rejects.toThrow('Media upload failed: Invalid file type')
    })
  })

  describe('uploadMultiple()', () => {
    test('uploads multiple files in parallel', async () => {
      const mockFiles: MediaFile[] = [
        {
          id: 'media_1',
          key: 'uploads/file1.jpg',
          filename: 'file1.jpg',
          size: 1024,
          mimeType: 'image/jpeg',
          uploaded: '2025-10-11T16:00:00Z',
          url: 'https://cdn.test.do/uploads/file1.jpg',
          isImage: true,
        },
        {
          id: 'media_2',
          key: 'uploads/file2.jpg',
          filename: 'file2.jpg',
          size: 2048,
          mimeType: 'image/jpeg',
          uploaded: '2025-10-11T16:00:00Z',
          url: 'https://cdn.test.do/uploads/file2.jpg',
          isImage: true,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFiles[0],
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFiles[1],
      })

      const blob1 = new Blob(['content1'], { type: 'image/jpeg' })
      const blob2 = new Blob(['content2'], { type: 'image/jpeg' })

      const result = await service.uploadMultiple([blob1, blob2])

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('media_1')
      expect(result[1].id).toBe('media_2')
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('get()', () => {
    test('retrieves a file by ID', async () => {
      const mockFile: MediaFile = {
        id: 'media_123',
        key: 'uploads/test.jpg',
        filename: 'test.jpg',
        size: 1024,
        mimeType: 'image/jpeg',
        uploaded: '2025-10-11T16:00:00Z',
        url: 'https://cdn.test.do/uploads/test.jpg',
        isImage: true,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFile,
      })

      const result = await service.get('media_123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.media.do/v1/media/media_123', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.id).toBe('media_123')
      expect(result.filename).toBe('test.jpg')
    })

    test('throws error when file not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(service.get('nonexistent')).rejects.toThrow('Failed to get media: Not Found')
    })
  })

  describe('list()', () => {
    test('lists all media files', async () => {
      const mockResponse: ListMediaResponse = {
        files: [
          {
            id: 'media_1',
            key: 'uploads/file1.jpg',
            filename: 'file1.jpg',
            size: 1024,
            mimeType: 'image/jpeg',
            uploaded: '2025-10-11T16:00:00Z',
            url: 'https://cdn.test.do/uploads/file1.jpg',
            isImage: true,
          },
          {
            id: 'media_2',
            key: 'uploads/file2.jpg',
            filename: 'file2.jpg',
            size: 2048,
            mimeType: 'image/jpeg',
            uploaded: '2025-10-11T16:00:00Z',
            url: 'https://cdn.test.do/uploads/file2.jpg',
            isImage: true,
          },
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 2,
          hasMore: false,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.list()

      expect(mockFetch).toHaveBeenCalledWith('https://test.media.do/v1/media?', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.files).toHaveLength(2)
      expect(result.pagination.total).toBe(2)
    })

    test('lists media with folder filter', async () => {
      const mockResponse: ListMediaResponse = {
        files: [],
        pagination: { page: 1, limit: 50, total: 0, hasMore: false },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.list({ folder: 'products' })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('folder=products')
    })

    test('lists media with MIME type filter', async () => {
      const mockResponse: ListMediaResponse = {
        files: [],
        pagination: { page: 1, limit: 50, total: 0, hasMore: false },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.list({ mimeType: 'image/jpeg' })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('mimeType=image%2Fjpeg')
    })

    test('lists media with pagination', async () => {
      const mockResponse: ListMediaResponse = {
        files: [],
        pagination: { page: 2, limit: 20, total: 100, hasMore: true },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.list({ page: 2, limit: 20 })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('page=2')
      expect(callUrl).toContain('limit=20')
    })

    test('lists media with cursor pagination', async () => {
      const mockResponse: ListMediaResponse = {
        files: [],
        pagination: { page: 1, limit: 50, total: 0, hasMore: false, cursor: 'next_cursor' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.list({ cursor: 'cursor_123' })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('cursor=cursor_123')
    })

    test('throws error on list failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.list()).rejects.toThrow('Failed to list media: Internal Server Error')
    })
  })

  describe('update()', () => {
    test('updates media metadata', async () => {
      const mockFile: MediaFile = {
        id: 'media_123',
        key: 'uploads/test.jpg',
        filename: 'test.jpg',
        size: 1024,
        mimeType: 'image/jpeg',
        uploaded: '2025-10-11T16:00:00Z',
        url: 'https://cdn.test.do/uploads/test.jpg',
        isImage: true,
        alt: 'Updated alt text',
        title: 'Updated title',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFile,
      })

      const updates: UpdateMediaOptions = {
        alt: 'Updated alt text',
        title: 'Updated title',
      }

      const result = await service.update('media_123', updates)

      expect(mockFetch).toHaveBeenCalledWith('https://test.media.do/v1/media/media_123', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify(updates),
      })

      expect(result.alt).toBe('Updated alt text')
      expect(result.title).toBe('Updated title')
    })

    test('throws error on update failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(service.update('nonexistent', { alt: 'test' })).rejects.toThrow('Failed to update media: Not Found')
    })
  })

  describe('delete()', () => {
    test('deletes a file', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      })

      await service.delete('media_123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.media.do/v1/media/media_123', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })
    })

    test('throws error on delete failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(service.delete('nonexistent')).rejects.toThrow('Failed to delete media: Not Found')
    })
  })

  describe('getDownloadUrl()', () => {
    test('generates download URL', () => {
      const url = service.getDownloadUrl('media_123')

      expect(url).toBe('https://test.media.do/v1/media/file/media_123')
    })
  })

  describe('getImageUrl()', () => {
    test('generates image URL without transforms', () => {
      const url = service.getImageUrl('media_123')

      expect(url).toBe('https://test.media.do/v1/media/image/media_123?')
    })

    test('generates image URL with width and height', () => {
      const url = service.getImageUrl('media_123', {
        width: 300,
        height: 200,
      })

      expect(url).toContain('width=300')
      expect(url).toContain('height=200')
    })

    test('generates image URL with fit mode', () => {
      const url = service.getImageUrl('media_123', {
        width: 300,
        height: 300,
        fit: 'cover',
      })

      expect(url).toContain('fit=cover')
    })

    test('generates image URL with format conversion', () => {
      const url = service.getImageUrl('media_123', {
        format: 'webp',
        quality: 85,
      })

      expect(url).toContain('format=webp')
      expect(url).toContain('quality=85')
    })

    test('generates thumbnail URL', () => {
      const url = service.getImageUrl('media_123', {
        width: 150,
        height: 150,
        fit: 'cover',
        format: 'webp',
        quality: 80,
      })

      expect(url).toContain('width=150')
      expect(url).toContain('height=150')
      expect(url).toContain('fit=cover')
      expect(url).toContain('format=webp')
      expect(url).toContain('quality=80')
    })
  })

  describe('download()', () => {
    test('downloads a file as Blob', async () => {
      const mockBlob = new Blob(['file content'], { type: 'image/jpeg' })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      })

      const result = await service.download('media_123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.media.do/v1/media/file/media_123', {
        headers: { Authorization: 'Bearer test-api-key' },
      })

      expect(result).toBeInstanceOf(Blob)
    })

    test('throws error on download failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(service.download('nonexistent')).rejects.toThrow('Failed to download media: Not Found')
    })
  })

  describe('getStats()', () => {
    test('retrieves media statistics', async () => {
      const mockStats = {
        totalFiles: 150,
        totalSize: 1024000000,
        byFolder: {
          uploads: { count: 80, size: 512000000 },
          products: { count: 50, size: 384000000 },
          avatars: { count: 20, size: 128000000 },
        },
        byMimeType: {
          'image/jpeg': { count: 100, size: 768000000 },
          'image/png': { count: 30, size: 192000000 },
          'application/pdf': { count: 20, size: 64000000 },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

      const result = await service.getStats()

      expect(mockFetch).toHaveBeenCalledWith('https://test.media.do/v1/media/stats', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.totalFiles).toBe(150)
      expect(result.totalSize).toBe(1024000000)
      expect(result.byFolder.uploads.count).toBe(80)
      expect(result.byMimeType['image/jpeg'].count).toBe(100)
    })

    test('throws error on stats failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.getStats()).rejects.toThrow('Failed to get media stats: Internal Server Error')
    })
  })

  describe('createMediaService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createMediaService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(MediaService)
    })
  })
})
