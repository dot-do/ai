# Security Model for ai-sandbox

## Overview

The `ai-sandbox` package provides isolated code execution using Cloudflare's Dynamic Worker Loader. This document describes the security model, trust boundaries, and best practices for using this package safely.

## Trust Model

### Who Should Use This Package?

`ai-sandbox` is designed for scenarios where you need to execute **user-provided code** in an isolated environment. This includes:

- AI code generation platforms
- Educational coding environments
- API automation platforms
- Low-code/no-code development tools

### Trust Boundaries

**What is Isolated:**

- User code runs in separate Cloudflare Workers with resource limits
- Each execution gets its own isolated JavaScript context
- No access to parent worker's memory or state
- No network access unless explicitly provided via bindings

**What is NOT Isolated:**

- Code runs with full JavaScript capabilities within the worker context
- Can consume CPU/memory up to worker limits
- Can execute synchronous/asynchronous operations
- Has access to any bindings explicitly provided

## Security Features

### 1. Input Validation

All user-provided code is validated before execution:

```typescript
import { validateScript, validateModule } from 'ai-sandbox'

// Validates:
// - Script is not empty
// - Script size < 1MB (configurable)
// - Basic syntax validation (prevents obvious syntax errors)
validateScript(userCode)
```

**Size Limits:**

- `MAX_SCRIPT_SIZE`: 1,000,000 characters (1MB)
- `MAX_MODULE_SIZE`: 1,000,000 characters (1MB)

### 2. Code Sanitization

All module code is sanitized before `eval()` execution:

```typescript
import { sanitizeCodeForEval } from 'ai-sandbox'

// Escapes template literal injection:
// - Backticks (`) → \`
// - Template expressions (${) → \${
const safe = sanitizeCodeForEval(userModule)
```

### 3. Error Handling

Error messages are categorized to prevent information disclosure:

- **Validation errors**: Indicate security/size issues
- **Execution errors**: General runtime errors (stack traces sanitized)
- **Worker creation errors**: Infrastructure issues

### 4. Isolated Execution

Each execution creates a new worker instance:

```typescript
executeInSandbox({
  script: userCode,
  bindings: {}, // Explicitly empty - no access to services
  env: {}, // Explicitly empty - no environment variables
})
```

## Known Limitations

### 1. Dynamic Code Execution

The package uses the `Function` constructor to execute module code. While sandboxed, this has inherent risks:

**Risk**: Code execution with full JavaScript capabilities
**Mitigation**:

- All code is validated at entry points before any processing
- All code is sanitized before execution (escapes template literals)
- Built-in prototypes are frozen to prevent prototype pollution
- Size limits prevent resource exhaustion
- Isolated worker context prevents parent access
- Error messages are sanitized in production

**Recommendation**: Only use with code from trusted sources or with additional security layers.

### 2. Resource Exhaustion

**Risk**: Infinite loops or memory-intensive operations
**Mitigation**:

- Cloudflare Workers have built-in CPU time limits (50ms on free tier, configurable on paid tiers)
- Memory limits enforced by Workers runtime
- Each execution is isolated (cannot affect other executions)

**Recommendation**: Implement additional timeout mechanisms at the application level if needed.

### 3. Prototype Pollution

**Risk**: User code could modify built-in prototypes
**Mitigation**:

- Built-in prototypes (Object, Array, Function, String, Number, Boolean) are frozen before user code executes
- Each worker has fresh JavaScript context
- Modifications don't affect other executions or parent worker

**Known Limitation**: Only first-level prototypes are frozen. Properties of prototypes can still be modified if they are objects themselves. For example:

```typescript
// This is prevented:
Object.prototype.hack = 'value' // ❌ TypeError: Cannot add property

// But this may still work:
Object.prototype.toString.customProp = 'value' // ⚠️ Possible if toString is mutable
```

**Recommendation**: If using shared data structures, validate and sanitize all inputs. Consider deep-freezing for additional protection if needed.

## Best Practices

### 1. Validate All Inputs

```typescript
import { validateScript, validateModule, SandboxValidationError } from 'ai-sandbox'

try {
  validateScript(userScript)
  validateModule(userModule)
  // Proceed with execution
} catch (error) {
  if (error instanceof SandboxValidationError) {
    // Handle validation error
    console.error('Invalid input:', error.message)
  }
}
```

### 2. Limit Service Access

Only provide bindings that are absolutely necessary:

```typescript
// ❌ Bad - gives access to all services
executeInSandbox({
  script: userCode,
  bindings: env, // All environment bindings
})

// ✅ Good - only specific services
executeInSandbox({
  script: userCode,
  bindings: {
    AI: env.AI, // Only AI service
  },
})
```

### 3. Implement Rate Limiting

Protect your infrastructure from abuse:

```typescript
// Implement rate limiting at the application level
const rateLimiter = new RateLimiter({ maxRequestsPerMinute: 60 })

app.post('/execute', async (req) => {
  if (!rateLimiter.check(req.ip)) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  return executeInSandbox(req.body)
})
```

**Using Cloudflare Rate Limiting:**

```typescript
// In wrangler.jsonc
{
  "rules": [
    {
      "action": "block",
      "description": "Rate limit sandbox executions",
      "enabled": true,
      "expression": "(http.request.uri.path eq \"/do\" and rate(60s) > 100)"
    }
  ]
}
```

### 4. Sanitize Error Messages in Production

Don't expose internal implementation details:

```typescript
try {
  const result = await executeInSandbox(request)
  if (result.error) {
    // In production, sanitize errors
    const sanitizedError = process.env.NODE_ENV === 'production' ? 'Execution failed' : result.error

    return Response.json({ error: sanitizedError }, { status: 400 })
  }
} catch (error) {
  // Never expose full stack traces in production
  console.error('Execution error:', error)
  return Response.json({ error: 'Internal error' }, { status: 500 })
}
```

### 5. Implement Timeout Protection

Add application-level timeouts to prevent long-running executions:

```typescript
// Timeout wrapper function
async function executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Execution timeout')), timeoutMs)
  })

  return Promise.race([promise, timeoutPromise])
}

// Use with sandbox execution
try {
  const result = await executeWithTimeout(
    executeInSandbox(request),
    5000 // 5 second timeout
  )
} catch (error) {
  if (error.message === 'Execution timeout') {
    return Response.json({ error: 'Execution timed out' }, { status: 408 })
  }
  throw error
}
```

**Note**: Cloudflare Workers have built-in CPU time limits (50ms free tier, up to 30s on paid plans), but application-level timeouts provide better control and user feedback.

### 6. Monitor and Log Executions

Keep audit logs for security monitoring:

```typescript
const result = await executeInSandbox(request)

// Log execution for security monitoring
console.log({
  timestamp: new Date().toISOString(),
  userId: req.user.id,
  scriptHash: crypto.subtle.digest('SHA-256', request.script),
  success: !result.error,
  error: result.error,
})
```

## Security Configuration

### Adjusting Size Limits

If you need different size limits, modify the constants:

```typescript
import { SANDBOX_CONSTANTS } from 'ai-sandbox'

// Override constants (do this carefully!)
const customLimits = {
  ...SANDBOX_CONSTANTS,
  MAX_SCRIPT_SIZE: 500_000, // 500KB instead of 1MB
}
```

### Custom Validation

Implement additional validation for your use case:

```typescript
function validateUserCode(code: string): void {
  // Basic validation from ai-sandbox
  validateScript(code)

  // Custom validation
  if (code.includes('import(')) {
    throw new Error('Dynamic imports not allowed')
  }

  if (code.includes('fetch(')) {
    throw new Error('Network requests not allowed')
  }
}
```

## Reporting Security Issues

If you discover a security vulnerability in `ai-sandbox`, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Email security concerns to: [security contact]
3. Include details about the vulnerability and steps to reproduce

## Security Checklist

Before deploying `ai-sandbox` to production:

- [ ] Input validation enabled for all user code
- [ ] Size limits appropriate for your use case
- [ ] Rate limiting implemented at application level
- [ ] Error messages sanitized in production
- [ ] Bindings restricted to minimum necessary services
- [ ] Audit logging in place for security monitoring
- [ ] Regular security reviews scheduled
- [ ] Monitoring alerts configured for suspicious activity

## Additional Resources

- [Cloudflare Workers Security Best Practices](https://developers.cloudflare.com/workers/platform/security/)
- [OWASP Code Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)
- [JavaScript Sandbox Security](https://www.npmjs.com/package/vm2#security) (for comparison)

---

**Last Updated**: 2025-10-10
**Version**: 1.0.0
