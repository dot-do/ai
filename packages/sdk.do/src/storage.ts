/**
 * Storage Service for SDK.do
 *
 * Provides R2 object storage operations including upload, download, multipart uploads,
 * and pre-signed URLs. Integrates with workers/storage for distributed file storage.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Upload a file
 * const result = await $.storage.upload('documents/report.pdf', fileData, {
 *   contentType: 'application/pdf',
 *   metadata: { author: 'John Doe' }
 * })
 *
 * // Download a file
 * const file = await $.storage.download('documents/report.pdf')
 *
 * // Multipart upload for large files
 * const upload = await $.storage.multipart.start('videos/large.mp4')
 * await $.storage.multipart.uploadPart(upload, 1, chunk1)
 * await $.storage.multipart.complete(upload, [part1, part2])
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface UploadOptions {
  /**
   * Content type (MIME type)
   */
  contentType?: string

  /**
   * Cache control header
   */
  cacheControl?: string

  /**
   * Custom metadata
   */
  metadata?: Record<string, string>

  /**
   * Content encoding
   */
  contentEncoding?: string

  /**
   * Content language
   */
  contentLanguage?: string
}

export interface UploadResponse {
  /**
   * Object key
   */
  key: string

  /**
   * Object size in bytes
   */
  size: number

  /**
   * ETag
   */
  etag: string

  /**
   * Upload timestamp
   */
  uploadedAt: string

  /**
   * Public URL (if configured)
   */
  url?: string
}

export interface DownloadResponse {
  /**
   * Object data
   */
  data: ArrayBuffer

  /**
   * Content type
   */
  contentType: string

  /**
   * Object size
   */
  size: number

  /**
   * ETag
   */
  etag: string

  /**
   * Custom metadata
   */
  metadata?: Record<string, string>

  /**
   * Last modified timestamp
   */
  lastModified: string
}

export interface MultipartUpload {
  /**
   * Upload ID
   */
  uploadId: string

  /**
   * Object key
   */
  key: string

  /**
   * Upload started at
   */
  startedAt: string
}

export interface Part {
  /**
   * Part number (1-indexed)
   */
  partNumber: number

  /**
   * ETag from part upload
   */
  etag: string
}

export interface PartResponse {
  /**
   * Part number
   */
  partNumber: number

  /**
   * ETag
   */
  etag: string

  /**
   * Part size
   */
  size: number
}

export interface UrlOptions {
  /**
   * Expiration time in seconds
   */
  expiresIn?: number

  /**
   * Response content type override
   */
  responseContentType?: string

  /**
   * Response content disposition override
   */
  responseContentDisposition?: string
}

export interface ObjectMetadata {
  /**
   * Object key
   */
  key: string

  /**
   * Object size in bytes
   */
  size: number

  /**
   * ETag
   */
  etag: string

  /**
   * Content type
   */
  contentType?: string

  /**
   * Custom metadata
   */
  metadata?: Record<string, string>

  /**
   * Last modified timestamp
   */
  lastModified: string

  /**
   * Upload timestamp
   */
  uploadedAt: string
}

export interface ListOptions {
  /**
   * Key prefix to filter
   */
  prefix?: string

  /**
   * Maximum results
   */
  limit?: number

  /**
   * Pagination cursor
   */
  cursor?: string

  /**
   * Delimiter for directory-like listing
   */
  delimiter?: string
}

export interface ObjectList {
  /**
   * List of objects
   */
  objects: Array<{
    key: string
    size: number
    etag: string
    lastModified: string
  }>

  /**
   * Common prefixes (directories)
   */
  prefixes?: string[]

  /**
   * Next cursor for pagination
   */
  nextCursor?: string

  /**
   * Whether there are more results
   */
  hasMore: boolean

  /**
   * Total count (approximate)
   */
  total?: number
}

// ============================================================================
// STORAGE SERVICE
// ============================================================================

export class StorageService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://storage.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {}

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Upload a file to storage
   *
   * @param key - Object key (path)
   * @param file - File data (File, Blob, or ArrayBuffer)
   * @param options - Upload options
   * @returns Upload response with metadata
   *
   * @example
   * ```typescript
   * // Upload from File
   * const result = await $.storage.upload('images/photo.jpg', file, {
   *   contentType: 'image/jpeg',
   *   metadata: { author: 'John' }
   * })
   *
   * // Upload from ArrayBuffer
   * const buffer = await fetch('https://example.com/file.pdf').then(r => r.arrayBuffer())
   * await $.storage.upload('documents/file.pdf', buffer, {
   *   contentType: 'application/pdf'
   * })
   * ```
   */
  async upload(key: string, file: File | Blob | ArrayBuffer, options: UploadOptions = {}): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('key', key)

    if (file instanceof ArrayBuffer) {
      formData.append('file', new Blob([file]))
    } else {
      formData.append('file', file)
    }

    if (options.contentType) formData.append('contentType', options.contentType)
    if (options.cacheControl) formData.append('cacheControl', options.cacheControl)
    if (options.contentEncoding) formData.append('contentEncoding', options.contentEncoding)
    if (options.contentLanguage) formData.append('contentLanguage', options.contentLanguage)
    if (options.metadata) formData.append('metadata', JSON.stringify(options.metadata))

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to upload file: ${error}`)
    }

    return response.json()
  }

  /**
   * Download a file from storage
   *
   * @param key - Object key (path)
   * @returns Download response with data and metadata
   *
   * @example
   * ```typescript
   * const file = await $.storage.download('images/photo.jpg')
   * console.log('Size:', file.size, 'bytes')
   * console.log('Type:', file.contentType)
   *
   * // Convert to Blob for display
   * const blob = new Blob([file.data], { type: file.contentType })
   * const url = URL.createObjectURL(blob)
   * ```
   */
  async download(key: string): Promise<DownloadResponse> {
    const response = await fetch(`${this.baseUrl}/download/${encodeURIComponent(key)}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Object not found: ${key}`)
      }
      const error = await response.text()
      throw new Error(`Failed to download file: ${error}`)
    }

    const data = await response.arrayBuffer()
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream'
    const size = parseInt(response.headers.get('Content-Length') || '0', 10)
    const etag = response.headers.get('ETag') || ''
    const lastModified = response.headers.get('Last-Modified') || new Date().toISOString()

    // Parse custom metadata from headers
    const metadata: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      if (key.startsWith('x-amz-meta-')) {
        metadata[key.slice(11)] = value
      }
    })

    return {
      data,
      contentType,
      size,
      etag,
      metadata,
      lastModified,
    }
  }

  /**
   * Delete a file from storage
   *
   * @param key - Object key (path)
   * @returns True if deleted
   *
   * @example
   * ```typescript
   * await $.storage.delete('images/old-photo.jpg')
   * ```
   */
  async delete(key: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/delete/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (response.status === 404) {
      return false
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete file: ${error}`)
    }

    return true
  }

  /**
   * Multipart upload operations for large files
   */
  readonly multipart = {
    /**
     * Start a multipart upload
     *
     * @param key - Object key (path)
     * @param options - Upload options
     * @returns Multipart upload handle
     *
     * @example
     * ```typescript
     * const upload = await $.storage.multipart.start('videos/large.mp4', {
     *   contentType: 'video/mp4'
     * })
     * console.log('Upload ID:', upload.uploadId)
     * ```
     */
    start: async (key: string, options: UploadOptions = {}): Promise<MultipartUpload> => {
      const response = await fetch(`${this.baseUrl}/multipart/start`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          ...options,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to start multipart upload: ${error}`)
      }

      return response.json()
    },

    /**
     * Upload a part
     *
     * @param upload - Multipart upload handle
     * @param partNumber - Part number (1-indexed)
     * @param data - Part data
     * @returns Part response with ETag
     *
     * @example
     * ```typescript
     * const upload = await $.storage.multipart.start('large-file.zip')
     *
     * // Upload parts (5MB-5GB each)
     * const part1 = await $.storage.multipart.uploadPart(upload, 1, chunk1)
     * const part2 = await $.storage.multipart.uploadPart(upload, 2, chunk2)
     * ```
     */
    uploadPart: async (upload: MultipartUpload, partNumber: number, data: ArrayBuffer): Promise<PartResponse> => {
      const response = await fetch(`${this.baseUrl}/multipart/upload-part`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/octet-stream',
          'X-Upload-Id': upload.uploadId,
          'X-Part-Number': partNumber.toString(),
        },
        body: data,
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to upload part ${partNumber}: ${error}`)
      }

      return response.json()
    },

    /**
     * Complete a multipart upload
     *
     * @param upload - Multipart upload handle
     * @param parts - Array of uploaded parts
     * @returns Upload response
     *
     * @example
     * ```typescript
     * const upload = await $.storage.multipart.start('large-file.zip')
     * const part1 = await $.storage.multipart.uploadPart(upload, 1, chunk1)
     * const part2 = await $.storage.multipart.uploadPart(upload, 2, chunk2)
     *
     * const result = await $.storage.multipart.complete(upload, [part1, part2])
     * console.log('Upload complete:', result.key)
     * ```
     */
    complete: async (upload: MultipartUpload, parts: Part[]): Promise<UploadResponse> => {
      const response = await fetch(`${this.baseUrl}/multipart/complete`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadId: upload.uploadId,
          key: upload.key,
          parts,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to complete multipart upload: ${error}`)
      }

      return response.json()
    },

    /**
     * Abort a multipart upload
     *
     * @param upload - Multipart upload handle
     *
     * @example
     * ```typescript
     * const upload = await $.storage.multipart.start('file.zip')
     * // ... upload failed
     * await $.storage.multipart.abort(upload)
     * ```
     */
    abort: async (upload: MultipartUpload): Promise<void> => {
      const response = await fetch(`${this.baseUrl}/multipart/abort`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadId: upload.uploadId,
          key: upload.key,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to abort multipart upload: ${error}`)
      }
    },
  }

  /**
   * Get a pre-signed URL for direct upload/download
   *
   * @param key - Object key (path)
   * @param options - URL options
   * @returns Pre-signed URL
   *
   * @example
   * ```typescript
   * // Generate download URL (1 hour expiration)
   * const downloadUrl = await $.storage.url('documents/report.pdf', {
   *   expiresIn: 3600
   * })
   *
   * // Generate upload URL with content type
   * const uploadUrl = await $.storage.url('uploads/new-file.pdf', {
   *   expiresIn: 300,
   *   responseContentType: 'application/pdf'
   * })
   * ```
   */
  async url(key: string, options: UrlOptions = {}): Promise<string> {
    const params = new URLSearchParams()
    params.set('key', key)
    if (options.expiresIn) params.set('expiresIn', options.expiresIn.toString())
    if (options.responseContentType) params.set('responseContentType', options.responseContentType)
    if (options.responseContentDisposition) params.set('responseContentDisposition', options.responseContentDisposition)

    const response = await fetch(`${this.baseUrl}/presigned-url?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate pre-signed URL: ${error}`)
    }

    const result = await response.json()
    return result.url
  }

  /**
   * Get object metadata without downloading
   *
   * @param key - Object key (path)
   * @returns Object metadata
   *
   * @example
   * ```typescript
   * const metadata = await $.storage.metadata('images/photo.jpg')
   * console.log('Size:', metadata.size)
   * console.log('ETag:', metadata.etag)
   * console.log('Uploaded:', metadata.uploadedAt)
   * ```
   */
  async metadata(key: string): Promise<ObjectMetadata> {
    const response = await fetch(`${this.baseUrl}/metadata/${encodeURIComponent(key)}`, {
      headers: this.getHeaders(),
    })

    if (response.status === 404) {
      throw new Error(`Object not found: ${key}`)
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get metadata: ${error}`)
    }

    return response.json()
  }

  /**
   * List objects in storage
   *
   * @param options - List options
   * @returns Object list with pagination
   *
   * @example
   * ```typescript
   * // List all objects
   * const list = await $.storage.list()
   *
   * // List with prefix (directory-like)
   * const images = await $.storage.list({
   *   prefix: 'images/',
   *   limit: 100
   * })
   *
   * // Paginate through results
   * let cursor = undefined
   * do {
   *   const page = await $.storage.list({ cursor, limit: 1000 })
   *   console.log(`Found ${page.objects.length} objects`)
   *   cursor = page.nextCursor
   * } while (cursor)
   * ```
   */
  async list(options: ListOptions = {}): Promise<ObjectList> {
    const params = new URLSearchParams()
    if (options.prefix) params.set('prefix', options.prefix)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.cursor) params.set('cursor', options.cursor)
    if (options.delimiter) params.set('delimiter', options.delimiter)

    const response = await fetch(`${this.baseUrl}/list?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list objects: ${error}`)
    }

    return response.json()
  }

  /**
   * Copy an object to a new key
   *
   * @param sourceKey - Source object key
   * @param destKey - Destination object key
   * @returns Upload response for copied object
   *
   * @example
   * ```typescript
   * await $.storage.copy('images/original.jpg', 'images/backup.jpg')
   * ```
   */
  async copy(sourceKey: string, destKey: string): Promise<UploadResponse> {
    const response = await fetch(`${this.baseUrl}/copy`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceKey,
        destKey,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to copy object: ${error}`)
    }

    return response.json()
  }
}

/**
 * Create storage service instance
 */
export function createStorageService(baseUrl?: string, apiKey?: string): StorageService {
  return new StorageService(baseUrl, apiKey)
}

/**
 * Default storage service instance
 */
export const storage = createStorageService()
