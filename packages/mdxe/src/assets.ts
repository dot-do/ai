/**
 * Static Asset Bundling for Workers for Platforms
 * Scans, validates, and prepares static assets for deployment
 */

import { readdirSync, statSync, readFileSync } from 'fs'
import { join, relative, extname } from 'path'
import { createHash } from 'crypto'

export interface AssetFile {
  path: string // Relative path from asset directory
  absolutePath: string // Absolute file system path
  size: number
  hash: string // SHA-256 hash for cache busting
  mimeType: string
}

export interface AssetManifest {
  files: AssetFile[]
  totalSize: number
  totalFiles: number
  directory: string
}

/**
 * MIME type mapping for common file extensions
 */
const MIME_TYPES: Record<string, string> = {
  // Web
  '.html': 'text/html',
  '.htm': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.md': 'text/markdown',

  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',

  // Fonts
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',

  // Media
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',

  // Documents
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',

  // Manifest
  '.webmanifest': 'application/manifest+json'
}

/**
 * Get MIME type for file extension
 */
function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

/**
 * Calculate SHA-256 hash of file content
 */
function calculateHash(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex').substring(0, 16)
}

/**
 * Recursively scan directory for asset files
 */
function scanDirectory(directory: string, baseDir: string = directory): AssetFile[] {
  const assets: AssetFile[] = []
  const entries = readdirSync(directory)

  for (const entry of entries) {
    const absolutePath = join(directory, entry)
    const stat = statSync(absolutePath)

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      assets.push(...scanDirectory(absolutePath, baseDir))
    } else if (stat.isFile()) {
      // Read file and calculate hash
      const content = readFileSync(absolutePath)
      const relativePath = relative(baseDir, absolutePath)
      const hash = calculateHash(content)

      assets.push({
        path: relativePath.replace(/\\/g, '/'), // Normalize to forward slashes
        absolutePath,
        size: stat.size,
        hash,
        mimeType: getMimeType(relativePath)
      })
    }
  }

  return assets
}

/**
 * Bundle static assets from a directory
 *
 * @param directory - Absolute path to assets directory
 * @returns Asset manifest with file metadata
 */
export function bundleAssets(directory: string): AssetManifest {
  try {
    // Validate directory exists
    const stat = statSync(directory)
    if (!stat.isDirectory()) {
      throw new Error(`Path is not a directory: ${directory}`)
    }

    // Scan directory for assets
    const files = scanDirectory(directory)

    // Calculate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    return {
      files,
      totalSize,
      totalFiles: files.length,
      directory
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Assets directory not found: ${directory}`)
    }
    throw error
  }
}

/**
 * Validate asset manifest against Workers for Platforms limits
 *
 * Limits (as of 2025):
 * - Max 100,000 files per worker version
 * - Max 25 MB per file
 * - Max 500 MB total
 */
export function validateManifest(manifest: AssetManifest): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check file count limit (100,000 files)
  if (manifest.totalFiles > 100000) {
    errors.push(`Too many files: ${manifest.totalFiles} (max: 100,000)`)
  }

  // Check total size limit (500 MB)
  const maxTotalSize = 500 * 1024 * 1024
  if (manifest.totalSize > maxTotalSize) {
    errors.push(
      `Total size too large: ${(manifest.totalSize / 1024 / 1024).toFixed(2)} MB (max: 500 MB)`
    )
  }

  // Check individual file size limit (25 MB)
  const maxFileSize = 25 * 1024 * 1024
  const oversizedFiles = manifest.files.filter((file) => file.size > maxFileSize)
  if (oversizedFiles.length > 0) {
    for (const file of oversizedFiles.slice(0, 5)) {
      // Show first 5 oversized files
      errors.push(
        `File too large: ${file.path} (${(file.size / 1024 / 1024).toFixed(2)} MB, max: 25 MB)`
      )
    }
    if (oversizedFiles.length > 5) {
      errors.push(`... and ${oversizedFiles.length - 5} more oversized files`)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Generate asset routing rules for wrangler config
 *
 * Returns patterns for files that should be served as static assets
 */
export function generateAssetRoutes(manifest: AssetManifest): string[] {
  const extensions = new Set<string>()

  // Collect unique file extensions
  for (const file of manifest.files) {
    const ext = extname(file.path)
    if (ext) {
      extensions.add(ext)
    }
  }

  // Generate route patterns
  return Array.from(extensions).map((ext) => `*${ext}`)
}

/**
 * Print asset manifest summary
 */
export function printManifestSummary(manifest: AssetManifest): void {
  console.log(`\nAsset Manifest Summary:`)
  console.log(`  Directory: ${manifest.directory}`)
  console.log(`  Total Files: ${manifest.totalFiles.toLocaleString()}`)
  console.log(
    `  Total Size: ${(manifest.totalSize / 1024 / 1024).toFixed(2)} MB (${manifest.totalSize.toLocaleString()} bytes)`
  )

  // Group files by type
  const byType: Record<string, number> = {}
  for (const file of manifest.files) {
    const ext = extname(file.path) || '.no-extension'
    byType[ext] = (byType[ext] || 0) + 1
  }

  console.log(`\n  Files by Type:`)
  const sortedTypes = Object.entries(byType).sort(([, a], [, b]) => b - a)
  for (const [ext, count] of sortedTypes.slice(0, 10)) {
    console.log(`    ${ext.padEnd(15)} ${count.toLocaleString()}`)
  }

  if (sortedTypes.length > 10) {
    console.log(`    ... and ${sortedTypes.length - 10} more types`)
  }
}
