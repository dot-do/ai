/**
 * Code wrapper utilities
 *
 * Functions for wrapping user code for execution in sandboxed environments
 */

import type { WrapOptions } from './types'
import { SANDBOX_CONSTANTS } from './types'
import type { ServiceBindings } from './types'
import { validateScript, validateModule, sanitizeCodeForEval, hasTopLevelReturn } from './validation'

/**
 * Wrap module code for execution with SDK primitives
 * Automatically wraps script in async function and awaits/returns the result
 * This allows users to write: ai.generateText('Hello') instead of: return await ai.generateText('Hello')
 */
export function wrapModule(script: string, module: string | undefined, options: WrapOptions = {}): string {
  const { captureConsole = true, autoReturn = true, sdkGlobals = '' } = options

  // Validate inputs
  validateScript(script)

  // Check if script already has a top-level return statement
  const hasReturn = hasTopLevelReturn(script)

  // If no return statement and autoReturn is enabled, wrap the script so the last expression is returned
  const wrappedScript = hasReturn || !autoReturn ? script : `return (${script})`

  // Check if SDK globals include RPC initialization code
  const hasRPCBinding = sdkGlobals.includes('createRPCProxy')

  if (captureConsole) {
    return `
      ${sdkGlobals}

      export default {
        async fetch(request, env) {
          // Initialize SDK globals with RPC binding if available
          if (typeof globalThis.__initializeSDK === 'function' && env.RPC) {
            globalThis.__initializeSDK(env.RPC)
          }

          const consoleLogs = []
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info,
            debug: console.debug,
          }

          console.log = (...args) => consoleLogs.push(['log', ...args])
          console.error = (...args) => consoleLogs.push(['error', ...args])
          console.warn = (...args) => consoleLogs.push(['warn', ...args])
          console.info = (...args) => consoleLogs.push(['info', ...args])
          console.debug = (...args) => consoleLogs.push(['debug', ...args])

          // Freeze built-in prototypes to prevent prototype pollution
          Object.freeze(Object.prototype)
          Object.freeze(Array.prototype)
          Object.freeze(Function.prototype)
          Object.freeze(String.prototype)
          Object.freeze(Number.prototype)
          Object.freeze(Boolean.prototype)

          let result
          try {
            // Execute the script in an async function that auto-awaits and returns
            result = await (async () => {
              ${wrappedScript}
            })()
          } catch (error) {
            // Restore console before throwing
            console.log = originalConsole.log
            console.error = originalConsole.error
            console.warn = originalConsole.warn
            console.info = originalConsole.info
            console.debug = originalConsole.debug
            throw error
          }

          // Restore console
          console.log = originalConsole.log
          console.error = originalConsole.error
          console.warn = originalConsole.warn
          console.info = originalConsole.info
          console.debug = originalConsole.debug

          return Response.json({
            result,
            console: consoleLogs
          })
        }
      }
    `
  }

  return `
    ${sdkGlobals}

    export default {
      async fetch(request, env) {
        // Initialize SDK globals with RPC binding if available
        if (typeof globalThis.__initializeSDK === 'function' && env.RPC) {
          globalThis.__initializeSDK(env.RPC)
        }

        // Freeze built-in prototypes to prevent prototype pollution
        Object.freeze(Object.prototype)
        Object.freeze(Array.prototype)
        Object.freeze(Function.prototype)
        Object.freeze(String.prototype)
        Object.freeze(Number.prototype)
        Object.freeze(Boolean.prototype)

        let result
        try {
          // Execute the script in an async function that auto-awaits and returns
          result = await (async () => {
            ${wrappedScript}
          })()
        } catch (error) {
          throw error
        }

        return Response.json({
          result
        })
      }
    }
  `
}

/**
 * Wrap user code for execution in isolated worker (legacy/simple)
 */
export function wrapCode(code: string, captureConsole = true): string {
  // Validate input
  validateScript(code)

  if (captureConsole) {
    return `
      const consoleLogs = [];
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug,
      };

      console.log = (...args) => consoleLogs.push(['log', ...args]);
      console.error = (...args) => consoleLogs.push(['error', ...args]);
      console.warn = (...args) => consoleLogs.push(['warn', ...args]);
      console.info = (...args) => consoleLogs.push(['info', ...args]);
      console.debug = (...args) => consoleLogs.push(['debug', ...args]);

      let result;
      try {
        result = (function() {
          ${code}
        })();
      } catch (error) {
        throw error;
      }

      export default {
        fetch() {
          return Response.json({
            result,
            console: consoleLogs
          });
        }
      };
    `
  }

  return `
    let result;
    try {
      result = (function() {
        ${code}
      })();
    } catch (error) {
      throw error;
    }

    export default {
      fetch() {
        return Response.json({ result });
      }
    };
  `
}

/**
 * Create SDK globals that will be injected into worker context
 * These provide RPC proxies using Workers RPC / Cap'n Web via the RPC gateway
 */
export function createSDKGlobals(bindings?: ServiceBindings): string {
  // Check if we have an RPC binding for Workers RPC
  const hasRPCBinding = bindings && 'RPC' in bindings

  if (hasRPCBinding) {
    // Use Workers RPC via the RPC binding (Workers RPC / Cap'n Web)
    // This enables promise pipelining for better performance
    return `
    // Workers RPC Bridge - Access to RPC worker via service binding
    // This enables promise pipelining and Cap'n Web optimizations

    // Create RPC service proxy using the RPC binding from env
    // The RPC binding is available in env.RPC and must be accessed within the fetch handler
    const createRPCServiceProxy = (rpcBinding, serviceName) => {
      return new Proxy({}, {
        get: (_, method) => {
          return async (...args) => {
            // Use Workers RPC by calling the service method directly
            // Format: /rpc/:method with args in body
            const params = args[0] || {}

            const response = await rpcBinding.fetch('http://service/rpc/' + method, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ args: [params] })
            })

            const result = await response.json()
            if (!result.success) {
              throw new Error(result.error || serviceName + '.' + method + ' failed')
            }
            return result.data
          }
        }
      })
    }

    // Note: SDK globals will be initialized in the fetch handler where env.RPC is available
    // This function creates a factory that will be called with the RPC binding
    globalThis.__initializeSDK = (rpcBinding) => {
      // Initialize SDK globals with RPC proxy
      const ai = createRPCServiceProxy(rpcBinding, 'ai')
      const api = createRPCServiceProxy(rpcBinding, 'api')
      const db = createRPCServiceProxy(rpcBinding, 'db')
      const mcp = createRPCServiceProxy(rpcBinding, 'mcp')
      const pipeline = createRPCServiceProxy(rpcBinding, 'pipeline')
      const user = createRPCServiceProxy(rpcBinding, 'user')
      const on = createRPCServiceProxy(rpcBinding, 'on')
      const send = createRPCServiceProxy(rpcBinding, 'send')
      const every = createRPCServiceProxy(rpcBinding, 'every')
      const $ = { ai, api, db, mcp, pipeline, user, on, send, every }

      // Make available globally for user code
      globalThis.ai = ai
      globalThis.api = api
      globalThis.db = db
      globalThis.mcp = mcp
      globalThis.pipeline = pipeline
      globalThis.user = user
      globalThis.on = on
      globalThis.send = send
      globalThis.every = every
      globalThis.$ = $

      return $
    }
  `
  }

  // Fallback to HTTP-based RPC (when RPC binding not available)
  // Use individual service bindings if provided
  const bindingNames = bindings ? Object.keys(bindings).filter((name) => name !== 'RPC') : []

  if (bindingNames.length > 0) {
    // Use individual service bindings (legacy mode)
    return `
      // HTTP-based RPC proxy (legacy/fallback)
      const createServiceProxy = (service, serviceName) => {
        return new Proxy({}, {
          get: (_, method) => {
            return async (...args) => {
              const response = await service.fetch('${SANDBOX_CONSTANTS.SERVICE_URL}/rpc/' + method, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ args })
              })
              const result = await response.json()
              if (!result.success) {
                throw new Error(result.error || serviceName + '.' + method + ' failed')
              }
              return result.data
            }
          }
        })
      }

      ${bindingNames
        .map((name) => {
          // Strip _SERVICE suffix and convert to lowercase (e.g., AI_SERVICE -> ai)
          const serviceName = name.replace(/_SERVICE$/, '').toLowerCase()
          return `
      // Inject ${name} into globalThis as ${serviceName}
      if (typeof ${name} !== 'undefined' && ${name} !== null) {
        globalThis.${serviceName} = createServiceProxy(${name}, '${serviceName}')
      }
      `
        })
        .join('\n')}

      // Create $ as the main runtime context
      globalThis.$ = {
        ${bindingNames
          .map((name) => {
            const serviceName = name.replace(/_SERVICE$/, '').toLowerCase()
            return `${serviceName}: globalThis.${serviceName}`
          })
          .join(',\n        ')}
      }
    `
  }

  // No bindings available - provide stub implementations
  return `
    console.warn('No service bindings available - SDK methods will not work')
    globalThis.ai = null
    globalThis.api = null
    globalThis.db = null
    globalThis.mcp = null
    globalThis.pipeline = null
    globalThis.user = null
    globalThis.on = null
    globalThis.send = null
    globalThis.every = null
    globalThis.$ = {
      ai: null,
      api: null,
      db: null,
      mcp: null,
      pipeline: null,
      user: null,
      on: null,
      send: null,
      every: null
    }
  `
}
