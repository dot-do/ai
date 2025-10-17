# Contributing to ai-sandbox

Thank you for your interest in contributing to `ai-sandbox`! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm 8+
- Familiarity with TypeScript and Cloudflare Workers
- Understanding of code sandboxing and security principles

### Development Setup

```bash
# Clone the repository
git clone https://github.com/dot-do/platform.git
cd platform

# Install dependencies from root
pnpm install

# Navigate to ai-sandbox package
cd ai/packages/ai-sandbox

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build the package
pnpm build
```

## Development Workflow

### 1. Create a Branch

Create a feature branch from `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow the existing code style (enforced by Prettier and ESLint)
- Write tests for new functionality
- Update documentation as needed
- Ensure security best practices are followed

### 3. Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode during development
pnpm test:watch

# Check test coverage
pnpm test --coverage
```

### 4. Commit Changes

Follow conventional commit format:

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve security issue"
git commit -m "docs: update README"
git commit -m "test: add integration tests"
```

Commit types:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or updates
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:

- Clear description of changes
- Reference to any related issues
- Test results and coverage information
- Security considerations if applicable

## Code Guidelines

### TypeScript Style

- Use TypeScript for all code
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and primitives
- Avoid `any` - use `unknown` when type is truly unknown
- Use strict TypeScript settings

### Code Formatting

- 2 spaces for indentation
- Single quotes for strings
- No semicolons
- Max line length: 160 characters
- Prettier handles formatting automatically

### Security Guidelines

**Critical**: All contributions must prioritize security:

1. **Input Validation**: Always validate user inputs
2. **Size Limits**: Enforce size limits on scripts and modules
3. **Sanitization**: Sanitize code before execution
4. **Error Handling**: Never leak sensitive information in errors
5. **Documentation**: Document security implications of changes

See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

### Testing Guidelines

- Write tests for all new features
- Aim for >80% code coverage
- Include security tests for user-facing APIs
- Test edge cases and error conditions
- Use descriptive test names

Example test structure:

```typescript
describe('validateScript', () => {
  it('should reject empty scripts', () => {
    expect(() => validateScript('')).toThrow('Script cannot be empty')
  })

  it('should reject oversized scripts', () => {
    const large = 'x'.repeat(1_000_001)
    expect(() => validateScript(large)).toThrow('exceeds maximum size')
  })

  it('should accept valid scripts', () => {
    expect(() => validateScript('console.log("hi")')).not.toThrow()
  })
})
```

## What to Contribute

### High Priority

- **Integration tests** - Full worker lifecycle tests
- **Performance optimizations** - Worker pooling, caching
- **Timeout support** - Configurable execution timeouts
- **Documentation** - Usage examples, tutorials
- **Security enhancements** - Additional validation, hardening

### Medium Priority

- **AST-based validation** - Replace regex with proper parsing
- **Deep prototype freezing** - More comprehensive protection
- **Rate limiting examples** - Implementation patterns
- **Error handling improvements** - Better error messages

### Low Priority

- **Additional console methods** - `console.table`, `console.dir`, etc.
- **Logging improvements** - Structured logging
- **Metrics/observability** - Performance monitoring

## Security Considerations

### Security Review Required

The following changes require security review before merging:

- Changes to `validation.ts` (input validation logic)
- Changes to `wrapper.ts` (code wrapping and execution)
- Changes to `loader.ts` (worker creation and execution)
- New features that execute user code
- Changes to error handling that might leak information

### Security Best Practices

1. **Never trust user input** - Always validate and sanitize
2. **Fail securely** - Default to deny, not allow
3. **Minimize attack surface** - Restrict capabilities where possible
4. **Defense in depth** - Use multiple security layers
5. **Audit regularly** - Review security implications of changes

## Pull Request Guidelines

### PR Checklist

- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Security implications documented
- [ ] No sensitive information in commits
- [ ] Follows code style guidelines
- [ ] Commit messages follow conventional format

### PR Description Template

```markdown
## Summary

Brief description of changes

## Changes

- List of specific changes made

## Testing

- How changes were tested
- Test coverage information

## Security Considerations

- Any security implications
- Security testing performed

## Related Issues

Closes #123
```

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v0.2.0`
4. Push tag: `git push origin v0.2.0`
5. Publish to NPM: `pnpm publish`
6. Create GitHub release with changelog

## Questions or Issues?

- Open an issue on GitHub
- Check existing issues and discussions
- Review [SECURITY.md](./SECURITY.md) for security questions
- Contact maintainers via GitHub

## License

By contributing to ai-sandbox, you agree that your contributions will be licensed under the same license as the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Prioritize security and user safety

Thank you for contributing to ai-sandbox! 🎉
