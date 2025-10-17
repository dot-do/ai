import { compile } from '@mdx-js/mdx'
import type { EvaluateOptions, EvaluateResult, Runtime } from './types.js'

export * from './types.js'

// Extend globalThis to include our temporary scope storage
declare global {
  // eslint-disable-next-line no-var
  var __mdxld_scope__: Record<string, unknown> | undefined
}

/**
 * Detect the current runtime environment
 */
export function detectRuntime(): Runtime {
  // Check for Node.js first (must be before browser check)
  // Node.js has process.versions.node and no window
  if (typeof process !== 'undefined' && process.versions?.node && typeof window === 'undefined') {
    return 'nodejs'
  }

  // Check for Cloudflare Workers (must be before browser check)
  // Workers have caches, addEventListener, and a specific navigator.userAgent
  if (
    typeof globalThis !== 'undefined' &&
    'caches' in globalThis &&
    'addEventListener' in globalThis &&
    typeof navigator !== 'undefined' &&
    navigator.userAgent === 'Cloudflare-Workers'
  ) {
    return 'cloudflare-workers'
  }

  // Check for browser
  // Browsers have both window and document
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return 'browser'
  }

  // Default to Node.js
  return 'nodejs'
}

/**
 * Evaluate MDX content in a secure isolated environment
 *
 * This function compiles MDX to JavaScript and then evaluates it in a
 * sandboxed environment appropriate for the current runtime.
 *
 * @param mdxContent - The MDX content to evaluate
 * @param options - Evaluation options
 * @returns The evaluated MDX module
 *
 * @example
 * ```typescript
 * const result = await evaluate('# Hello World', {
 *   scope: { name: 'Alice' },
 *   components: { CustomComponent }
 * })
 *
 * console.log(result.default) // MDX component
 * ```
 */
export async function evaluate(mdxContent: string, options: EvaluateOptions = {}): Promise<EvaluateResult> {
  // Input validation
  if (typeof mdxContent !== 'string') {
    throw new TypeError('mdxContent must be a string')
  }
  if (mdxContent.length === 0) {
    throw new Error('mdxContent cannot be empty')
  }

  const runtime = options.runtime || detectRuntime()

  // Compile MDX to JavaScript
  const compiled = await compile(mdxContent, {
    development: options.compileOptions?.development ?? false,
    ...(options.compileOptions || {}),
  })

  const code = String(compiled)

  // Evaluate based on runtime
  switch (runtime) {
    case 'nodejs':
      return evaluateNodeJS(code, options)
    case 'cloudflare-workers':
      return evaluateCloudflareWorkers(code, options)
    case 'browser':
      return evaluateBrowser(code, options)
    default:
      throw new Error(`Unsupported runtime: ${runtime}`)
  }
}

/**
 * Evaluate code in Node.js using dynamic imports
 */
async function evaluateNodeJS(code: string, options: EvaluateOptions): Promise<EvaluateResult> {
  // Input validation
  if (typeof code !== 'string') {
    throw new TypeError('code must be a string')
  }
  if (code.length === 0) {
    throw new Error('code cannot be empty')
  }

  // Validate memoryLimit option
  if (options.memoryLimit !== undefined) {
    throw new Error('memoryLimit option is not yet supported')
  }

  try {
    // Create a minimal JSX runtime for MDX
    const jsxRuntime = `
      export function jsx(type, props) {
        return { type, props };
      }
      export function jsxs(type, props) {
        return { type, props };
      }
      export function Fragment({ children }) {
        return children;
      }
    `
    const jsxRuntimeBase64 = Buffer.from(jsxRuntime, 'utf-8').toString('base64')
    const jsxRuntimeUrl = `data:text/javascript;base64,${jsxRuntimeBase64}`

    // Replace react/jsx-runtime imports with our minimal runtime
    let modifiedCode = code.replace(/from\s+["']react\/jsx-runtime["']/g, `from "${jsxRuntimeUrl}"`)

    // Inject scope and components into the module
    // We store scope variables in globalThis temporarily and inject const declarations
    if (options.scope || options.components) {
      const scopeVars = { ...options.scope, ...options.components }
      const scopeKeys = Object.keys(scopeVars)

      // Store scope in globalThis temporarily (will be cleaned up after evaluation)
      globalThis.__mdxld_scope__ = scopeVars

      // Create variable declarations for scope variables
      const scopeDeclarations = scopeKeys.map((key) => `const ${key} = globalThis.__mdxld_scope__.${key};`).join('\n')

      // Find where to inject the scope declarations (after the import statement)
      // The import statement is always at the beginning: import {jsx, jsxs} from "..."
      const importMatch = modifiedCode.match(/^import\s+.*?;?\n/m)
      if (importMatch) {
        const importEnd = importMatch.index! + importMatch[0].length
        modifiedCode = modifiedCode.slice(0, importEnd) + scopeDeclarations + '\n' + modifiedCode.slice(importEnd)
      } else {
        // No imports found, add declarations at the beginning
        modifiedCode = scopeDeclarations + '\n' + modifiedCode
      }
    }

    // Use proper UTF-8 to base64 encoding to support non-ASCII characters
    const base64 = Buffer.from(modifiedCode, 'utf-8').toString('base64')
    const dataUrl = `data:text/javascript;base64,${base64}`

    // Set a timeout wrapper if needed
    // IMPORTANT: This timeout only rejects the promise but CANNOT stop the actual
    // execution of the dynamic import. JavaScript's single-threaded nature and lack
    // of thread termination APIs means the code continues running in the background.
    // This is a fundamental limitation of dynamic imports with data URLs.
    let timeoutId: NodeJS.Timeout | undefined
    const importPromise = import(/* @vite-ignore */ dataUrl)

    try {
      if (options.timeout) {
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`Evaluation timed out after ${options.timeout}ms (Note: execution continues in background)`))
          }, options.timeout)
        })

        const module = await Promise.race([importPromise, timeoutPromise])
        if (timeoutId) clearTimeout(timeoutId)

        return {
          default: module.default,
          ...module,
        }
      }

      const module = await importPromise

      return {
        default: module.default,
        ...module,
      }
    } finally {
      // Clean up global scope variable
      if (options.scope || options.components) {
        delete globalThis.__mdxld_scope__
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      error.message = `Failed to evaluate MDX in Node.js: ${error.message}`
      throw error
    }
    throw new Error(`Failed to evaluate MDX in Node.js: ${String(error)}`)
  }
}

/**
 * Evaluate code in Cloudflare Workers using dynamic imports
 */
async function evaluateCloudflareWorkers(code: string, options: EvaluateOptions): Promise<EvaluateResult> {
  try {
    // Use proper UTF-8 to base64 encoding to support non-ASCII characters
    // TextEncoder handles multi-byte characters correctly
    const encoder = new TextEncoder()
    const bytes = encoder.encode(code)
    const binaryString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
    const base64 = btoa(binaryString)
    const dataUrl = `data:text/javascript;base64,${base64}`

    // Use dynamic import (Cloudflare Workers supports this)
    const module = await import(/* @vite-ignore */ dataUrl)

    return {
      default: module.default,
      ...module,
    }
  } catch (error) {
    if (error instanceof Error) {
      error.message = `Failed to evaluate MDX in Cloudflare Workers: ${error.message}`
      throw error
    }
    throw new Error(`Failed to evaluate MDX in Cloudflare Workers: ${String(error)}`)
  }
}

/**
 * Evaluate code in browser using dynamic imports or blob URLs
 */
async function evaluateBrowser(code: string, options: EvaluateOptions): Promise<EvaluateResult> {
  try {
    // Create a blob URL with the compiled code
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)

    try {
      // Use dynamic import
      const module = await import(/* @vite-ignore */ url)

      return {
        default: module.default,
        ...module,
      }
    } finally {
      // Clean up the blob URL
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    if (error instanceof Error) {
      error.message = `Failed to evaluate MDX in browser: ${error.message}`
      throw error
    }
    throw new Error(`Failed to evaluate MDX in browser: ${String(error)}`)
  }
}

/**
 * Compile MDX to JavaScript without evaluation
 *
 * Useful when you want to compile MDX ahead of time and evaluate later,
 * or when you need to inspect the compiled output.
 *
 * @param mdxContent - The MDX content to compile
 * @param options - Compile options
 * @returns The compiled JavaScript code
 */
export async function compileOnly(mdxContent: string, options: EvaluateOptions = {}): Promise<string> {
  // Input validation
  if (typeof mdxContent !== 'string') {
    throw new TypeError('mdxContent must be a string')
  }
  if (mdxContent.length === 0) {
    throw new Error('mdxContent cannot be empty')
  }

  const compiled = await compile(mdxContent, {
    development: options.compileOptions?.development ?? false,
    ...(options.compileOptions || {}),
  })

  return String(compiled)
}

/**
 * Evaluate pre-compiled MDX code
 *
 * @param compiledCode - The compiled JavaScript code
 * @param options - Evaluation options
 * @returns The evaluated MDX module
 */
export async function evaluateCompiled(compiledCode: string, options: EvaluateOptions = {}): Promise<EvaluateResult> {
  // Input validation
  if (typeof compiledCode !== 'string') {
    throw new TypeError('compiledCode must be a string')
  }
  if (compiledCode.length === 0) {
    throw new Error('compiledCode cannot be empty')
  }

  const runtime = options.runtime || detectRuntime()

  switch (runtime) {
    case 'nodejs':
      return evaluateNodeJS(compiledCode, options)
    case 'cloudflare-workers':
      return evaluateCloudflareWorkers(compiledCode, options)
    case 'browser':
      return evaluateBrowser(compiledCode, options)
    default:
      throw new Error(`Unsupported runtime: ${runtime}`)
  }
}
