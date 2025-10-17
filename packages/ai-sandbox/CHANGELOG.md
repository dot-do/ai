# Changelog

All notable changes to the `ai-sandbox` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Integration test suite for full worker lifecycle
- Performance optimizations (worker pooling, caching)
- Configurable execution timeouts
- AST-based validation option

## [0.1.1] - 2025-10-10

### Added

- Client-side validation in SDK client for fail-fast error handling
- Better error messages that include response body details
- Type-only imports for better tree-shaking optimization
- `getErrorStatus()` utility function to reduce code duplication
- Comprehensive CONTRIBUTING.md with development guidelines
- CHANGELOG.md to track version history

### Changed

- Improved error handling in `sandbox.do` SDK with better error messages
- Refactored error handling in `workers/sandbox` using shared utility
- Updated `createSDKGlobals()` to use `ServiceBindings` type instead of generic `Record`

### Fixed

- SDK client now validates requests before making network calls
- Error responses now include server error messages, not just status text
- Type safety improvements in wrapper utilities

## [0.1.0] - 2025-10-10

### Added

- Initial release of `ai-sandbox` package
- Dynamic Worker Loader abstraction for isolated code execution
- Code wrapper utilities (`wrapModule`, `wrapCode`, `createSDKGlobals`)
- Complete Cloudflare Sandbox SDK interface implementation
- TypeScript SDK (`sandbox.do`) for accessing sandbox worker
- Comprehensive security features:
  - Input validation with size limits (1MB for scripts/modules)
  - Code sanitization to prevent template literal injection
  - Prototype pollution prevention (freezes built-in prototypes)
  - Production error sanitization to prevent information disclosure
  - Function constructor instead of `eval()` for better security
- Complete test suite:
  - Security tests (prototype pollution, injection, isolation)
  - Validation tests (size limits, syntax checking, edge cases)
  - Wrapper tests (code generation, console capture, SDK globals)
- Documentation:
  - Comprehensive README with usage examples
  - Detailed SECURITY.md with threat model and best practices
  - JSDoc comments throughout codebase
  - Architecture diagrams

### Security

- Input validation at all entry points
- Template literal injection prevention via `sanitizeCodeForEval()`
- Prototype pollution prevention by freezing built-in prototypes
- Smart return detection to avoid false positives
- Production-ready error sanitization based on `NODE_ENV`
- Size limits (1MB) for scripts and modules
- Syntax validation before execution

### Breaking Changes

None - initial release

## Version History

- **0.1.1** (2025-10-10) - Follow-up improvements from code review
- **0.1.0** (2025-10-10) - Initial release extracted from `workers/do`

---

## Migration Guide

### From workers/do to ai-sandbox

If you were using the Dynamic Worker Loader directly from `workers/do`, here's how to migrate:

**Before** (workers/do):

```typescript
// Direct usage of workers/do internal functions
import { executeInSandbox } from '../workers/do/src/loader'
```

**After** (ai-sandbox):

```typescript
// Use the published package
import { executeInSandbox } from 'ai-sandbox'
```

The API remains the same, but now you get:

- Better security features
- Comprehensive tests
- Type-safe interfaces
- Regular updates and maintenance

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

## Security

See [SECURITY.md](./SECURITY.md) for security guidelines and threat model.
