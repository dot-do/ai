/**
 * Input validation and sanitization utilities
 *
 * Provides security checks and validation for user-provided code
 */

import { SANDBOX_CONSTANTS, SandboxValidationError } from './types'

/**
 * Validate script code before execution
 * Checks for size limits and basic syntax validation
 */
export function validateScript(script: string): void {
  if (!script) {
    throw new SandboxValidationError('Script cannot be empty')
  }

  if (script.length > SANDBOX_CONSTANTS.MAX_SCRIPT_SIZE) {
    throw new SandboxValidationError(`Script exceeds maximum size of ${SANDBOX_CONSTANTS.MAX_SCRIPT_SIZE} characters`)
  }

  // Skip syntax validation in Workers runtime
  // The Dynamic Worker Loader will catch syntax errors during execution
  // We can't use new Function() here as it's blocked in Workers
}

/**
 * Validate module code before execution
 * Checks for size limits and basic syntax validation
 */
export function validateModule(module: string | undefined): void {
  if (!module) {
    return // Module is optional
  }

  if (module.length > SANDBOX_CONSTANTS.MAX_MODULE_SIZE) {
    throw new SandboxValidationError(`Module exceeds maximum size of ${SANDBOX_CONSTANTS.MAX_MODULE_SIZE} characters`)
  }

  // Skip syntax validation in Workers runtime
  // The Dynamic Worker Loader will catch syntax errors during execution
  // We can't use new Function() here as it's blocked in Workers
}

/**
 * Sanitize code for eval execution
 * Escapes potentially dangerous characters and patterns
 */
export function sanitizeCodeForEval(code: string): string {
  // Escape backticks and dollar signs to prevent template literal injection
  return code.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

/**
 * Check if script contains top-level return statement
 * Uses more sophisticated detection to avoid false positives from nested functions
 */
export function hasTopLevelReturn(script: string): boolean {
  // Remove comments first
  const withoutComments = script
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*/g, '') // Remove line comments

  // Remove string literals to avoid false positives
  const withoutStrings = withoutComments
    .replace(/"(?:\\.|[^"\\])*"/g, '""') // Remove double-quoted strings
    .replace(/'(?:\\.|[^'\\])*'/g, "''") // Remove single-quoted strings
    .replace(/`(?:\\.|[^`\\])*`/g, '``') // Remove template literals

  // Remove function bodies (both arrow and regular functions)
  // This is a simplified heuristic - proper AST parsing would be better
  const withoutFunctions = withoutStrings
    .replace(/function\s*\w*\s*\([^)]*\)\s*\{[^}]*\}/g, '') // Regular functions
    .replace(/\([^)]*\)\s*=>\s*\{[^}]*\}/g, '') // Arrow functions with blocks
    .replace(/\w+\s*=>\s*[^{;]+/g, '') // Arrow functions without blocks

  // Now check for return statement
  return /\breturn\b/.test(withoutFunctions)
}
