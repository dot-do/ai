/**
 * opengraph-edge - Generate Open Graph images from JSX
 *
 * Uses Satori to convert JSX to SVG, then resvg-wasm to convert SVG to PNG.
 * Optimized for Cloudflare Workers edge runtime.
 */

import satori, { init as initSatori } from 'satori/wasm'
import type { SatoriOptions } from 'satori'
import { initWasm as initResvg, Resvg } from '@resvg/resvg-wasm'
import type { ReactElement } from 'react'

// Track initialization state
let satoriInitialized = false
let resvgInitialized = false

/**
 * Initialize Satori with yoga WASM
 * Must be called once before using generateOGImage
 */
export async function initSatoriWasm(yogaWasmUrl?: string): Promise<void> {
  if (satoriInitialized) return

  const yogaUrl = yogaWasmUrl || 'https://cdn.jsdelivr.net/npm/yoga-wasm-web@0.3.3/dist/yoga.wasm'
  const yogaWasm = await fetch(yogaUrl).then((res) => res.arrayBuffer())

  // @ts-ignore - Satori's init function accepts ArrayBuffer but types may be strict
  await initSatori(yogaWasm)
  satoriInitialized = true
}

/**
 * Initialize resvg WASM
 * Must be called once before using generateOGImage
 */
export async function initResvgWasm(resvgWasmUrl?: string): Promise<void> {
  if (resvgInitialized) return

  const resvgUrl = resvgWasmUrl || 'https://cdn.jsdelivr.net/npm/@resvg/resvg-wasm@2.6.2/index_bg.wasm'
  const resvgWasm = await fetch(resvgUrl).then((res) => res.arrayBuffer())

  // @ts-ignore - resvg-wasm init accepts ArrayBuffer
  await initResvg(resvgWasm)
  resvgInitialized = true
}

/**
 * Initialize both Satori and resvg WASM modules
 * Call this once during worker initialization
 */
export async function init(options?: {
  yogaWasmUrl?: string
  resvgWasmUrl?: string
}): Promise<void> {
  await Promise.all([
    initSatoriWasm(options?.yogaWasmUrl),
    initResvgWasm(options?.resvgWasmUrl),
  ])
}

/**
 * Font configuration for Satori
 */
export interface FontConfig {
  name: string
  data: ArrayBuffer
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  style?: 'normal' | 'italic'
}

/**
 * Options for generating OG images
 */
export interface OGImageOptions {
  width?: number
  height?: number
  fonts?: FontConfig[]
  // Allow any other Satori options
  [key: string]: any
}

/**
 * Generate PNG image from JSX
 *
 * @param jsx - React/JSX element to render
 * @param options - Satori options (width, height, fonts, etc.)
 * @returns PNG image as Uint8Array
 */
export async function generateOGImage(
  jsx: ReactElement,
  options: OGImageOptions = {}
): Promise<Uint8Array> {
  if (!satoriInitialized || !resvgInitialized) {
    throw new Error('WASM modules not initialized. Call init() first.')
  }

  const {
    width = 1200,
    height = 630,
    fonts = [],
    ...satoriOptions
  } = options

  // Convert JSX to SVG using Satori
  const svg = await satori(jsx, {
    width,
    height,
    fonts,
    ...satoriOptions,
  })

  // Convert SVG to PNG using resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  })

  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  return pngBuffer
}

/**
 * Generate PNG Response for Cloudflare Workers
 *
 * @param jsx - React/JSX element to render
 * @param options - Satori options
 * @returns Response with PNG image
 */
export async function generateOGImageResponse(
  jsx: ReactElement,
  options: OGImageOptions = {}
): Promise<Response> {
  const pngBuffer = await generateOGImage(jsx, options)

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

/**
 * Helper to fetch and cache fonts
 * Useful for Cloudflare Workers with Cache API
 */
export async function fetchFont(
  url: string,
  cacheKey?: string
): Promise<ArrayBuffer> {
  // Try cache first if available (Cloudflare Workers)
  // @ts-ignore - caches API is available in Workers but not in Node types
  if (typeof globalThis.caches !== 'undefined' && cacheKey) {
    // @ts-ignore - caches API
    const cache = await globalThis.caches.open('opengraph-fonts')
    const cached = await cache.match(cacheKey)

    if (cached) {
      return await cached.arrayBuffer()
    }

    // Fetch and cache
    const response = await fetch(url)
    const clone = response.clone()

    // Don't await cache.put - let it happen in background
    cache.put(cacheKey, clone)

    return await response.arrayBuffer()
  }

  // No cache available, just fetch
  return await fetch(url).then((res) => res.arrayBuffer())
}

// Re-export types
export type { SatoriOptions }
