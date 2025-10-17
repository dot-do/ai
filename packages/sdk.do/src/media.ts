/**
 * Media Service for SDK.do
 *
 * Provides methods for uploading, managing, and transforming media files.
 * Integrates with the media API worker for file storage in R2.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Upload a file
 * const file = await $.media.upload(fileBlob, {
 *   alt: 'Product image',
 *   folder: 'products'
 * })
 *
 * // Get file
 * const media = await $.media.get(file.id)
 *
 * // List files
 * const { files } = await $.media.list({ folder: 'products' })
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface MediaFile {
  id: string
  key: string
  filename: string
  size: number
  mimeType: string
  uploaded: string
  customMetadata?: Record<string, string>
  url: string
  isImage: boolean
  alt?: string
  title?: string
  description?: string
  tags?: string[]
  folder?: string
}

export interface UploadOptions {
  /**
   * Alt text for accessibility
   */
  alt?: string

  /**
   * Display title
   */
  title?: string

  /**
   * Description
   */
  description?: string

  /**
   * Tags for categorization
   */
  tags?: string[]

  /**
   * Folder/directory path
   */
  folder?: string

  /**
   * Custom metadata key-value pairs
   */
  customMetadata?: Record<string, string>
}

export interface ListMediaOptions {
  /**
   * Filter by folder
   */
  folder?: string

  /**
   * Filter by MIME type
   */
  mimeType?: string

  /**
   * Page number (1-based)
   * @default 1
   */
  page?: number

  /**
   * Items per page
   * @default 50
   */
  limit?: number

  /**
   * Cursor for pagination
   */
  cursor?: string
}

export interface ListMediaResponse {
  files: MediaFile[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
    cursor?: string
  }
}

export interface UpdateMediaOptions {
  alt?: string
  title?: string
  description?: string
  tags?: string[]
  folder?: string
}

export interface TransformImageOptions {
  /**
   * Target width in pixels
   */
  width?: number

  /**
   * Target height in pixels
   */
  height?: number

  /**
   * Resize fit mode
   * @default 'contain'
   */
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside'

  /**
   * Output format
   */
  format?: 'jpeg' | 'png' | 'webp' | 'avif'

  /**
   * JPEG/WebP quality (1-100)
   * @default 80
   */
  quality?: number
}

// ============================================================================
// MEDIA SERVICE
// ============================================================================

export class MediaService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://api.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(includeContentType = true): HeadersInit {
    const headers: HeadersInit = {}

    if (includeContentType) {
      headers['Content-Type'] = 'application/json'
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Upload a file
   *
   * @param file - File to upload (Blob, File, or ArrayBuffer)
   * @param options - Upload options
   * @returns Uploaded file information
   *
   * @example
   * ```typescript
   * const file = await $.media.upload(imageBlob, {
   *   alt: 'Product photo',
   *   folder: 'products',
   *   tags: ['electronics', 'featured']
   * })
   * ```
   */
  async upload(file: Blob | File | ArrayBuffer, options: UploadOptions = {}): Promise<MediaFile> {
    const formData = new FormData()

    // Add file
    if (file instanceof Blob || file instanceof File) {
      formData.append('file', file)
    } else {
      // ArrayBuffer
      formData.append('file', new Blob([file]))
    }

    // Add metadata
    if (options.alt) formData.append('alt', options.alt)
    if (options.title) formData.append('title', options.title)
    if (options.description) formData.append('description', options.description)
    if (options.folder) formData.append('folder', options.folder)
    if (options.tags) formData.append('tags', JSON.stringify(options.tags))
    if (options.customMetadata) formData.append('customMetadata', JSON.stringify(options.customMetadata))

    const response = await fetch(`${this.baseUrl}/v1/media/upload`, {
      method: 'POST',
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Media upload failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Upload multiple files
   *
   * @param files - Array of files to upload
   * @param options - Upload options (applied to all files)
   * @returns Array of uploaded file information
   */
  async uploadMultiple(files: (Blob | File | ArrayBuffer)[], options: UploadOptions = {}): Promise<MediaFile[]> {
    const uploads = files.map((file) => this.upload(file, options))
    return Promise.all(uploads)
  }

  /**
   * Get a file by ID
   *
   * @param id - File ID or key
   * @returns File information
   */
  async get(id: string): Promise<MediaFile> {
    const response = await fetch(`${this.baseUrl}/v1/media/${id}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get media: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * List media files
   *
   * @param options - List options
   * @returns Paginated list of files
   *
   * @example
   * ```typescript
   * const { files, pagination } = await $.media.list({
   *   folder: 'products',
   *   limit: 20
   * })
   * ```
   */
  async list(options: ListMediaOptions = {}): Promise<ListMediaResponse> {
    const params = new URLSearchParams()

    if (options.folder) params.set('folder', options.folder)
    if (options.mimeType) params.set('mimeType', options.mimeType)
    if (options.page) params.set('page', options.page.toString())
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.cursor) params.set('cursor', options.cursor)

    const response = await fetch(`${this.baseUrl}/v1/media?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to list media: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Update media metadata
   *
   * @param id - File ID or key
   * @param updates - Fields to update
   * @returns Updated file information
   */
  async update(id: string, updates: UpdateMediaOptions): Promise<MediaFile> {
    const response = await fetch(`${this.baseUrl}/v1/media/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`Failed to update media: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Delete a file
   *
   * @param id - File ID or key
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/media/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete media: ${response.statusText}`)
    }
  }

  /**
   * Get download URL for a file
   *
   * @param id - File ID or key
   * @returns Download URL
   */
  getDownloadUrl(id: string): string {
    return `${this.baseUrl}/v1/media/file/${id}`
  }

  /**
   * Get transformed image URL
   *
   * @param id - Image ID or key
   * @param options - Transform options
   * @returns Transformed image URL
   *
   * @example
   * ```typescript
   * const thumbnailUrl = $.media.getImageUrl(imageId, {
   *   width: 300,
   *   height: 300,
   *   fit: 'cover',
   *   format: 'webp'
   * })
   * ```
   */
  getImageUrl(id: string, options: TransformImageOptions = {}): string {
    const params = new URLSearchParams()

    if (options.width) params.set('width', options.width.toString())
    if (options.height) params.set('height', options.height.toString())
    if (options.fit) params.set('fit', options.fit)
    if (options.format) params.set('format', options.format)
    if (options.quality) params.set('quality', options.quality.toString())

    return `${this.baseUrl}/v1/media/image/${id}?${params}`
  }

  /**
   * Download a file as Blob
   *
   * @param id - File ID or key
   * @returns File blob
   */
  async download(id: string): Promise<Blob> {
    const response = await fetch(this.getDownloadUrl(id), {
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      throw new Error(`Failed to download media: ${response.statusText}`)
    }

    return response.blob()
  }

  /**
   * Get media statistics
   *
   * @returns Media usage statistics
   */
  async getStats(): Promise<{
    totalFiles: number
    totalSize: number
    byFolder: Record<string, { count: number; size: number }>
    byMimeType: Record<string, { count: number; size: number }>
  }> {
    const response = await fetch(`${this.baseUrl}/v1/media/stats`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get media stats: ${response.statusText}`)
    }

    return response.json()
  }
}

/**
 * Create media service instance
 */
export function createMediaService(baseUrl?: string, apiKey?: string): MediaService {
  return new MediaService(baseUrl, apiKey)
}

/**
 * Default media service instance
 */
export const media = createMediaService()
