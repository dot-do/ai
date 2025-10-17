# Contributing to `.do` AI & SDK

Thank you for your interest in contributing to the `.do` open-source AI platform! This guide will help you understand our development workflow, CI/CD processes, and contribution standards.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [CI/CD Pipelines](#cicd-pipelines)
- [Code Quality Standards](#code-quality-standards)
- [Publishing Packages](#publishing-packages)
- [Branch Protection](#branch-protection)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- **Node.js**: 20.x or later (we test on 18, 20, and 22)
- **pnpm**: 9.x or later
- **Git**: Latest version

### Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/dot-do/ai.git
cd ai
pnpm install
```

### Project Structure

```
ai/
├── packages/           # npm packages (@dotdo/* scoped)
│   ├── sdk.do/        # Core SDK with $ proxy
│   ├── cli.do/        # CLI interface
│   ├── mcp.do/        # MCP server
│   ├── graphdl/       # Semantic graphs
│   ├── mdxld/         # Linked data in MDX
│   ├── schema.org.ai/ # Schema.org types
│   ├── gs1.org.ai/    # GS1 supply chain
│   └── soc.org.ai/    # O*NET occupations
├── sdks/              # SDK implementations
├── sites/             # Documentation sites
├── apps/              # Applications
└── .github/
    └── workflows/     # CI/CD pipelines
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions**:

- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation changes
- `refactor/*` - Code refactoring
- `test/*` - Test additions/changes
- `chore/*` - Maintenance tasks

### 2. Make Changes

Edit files, add tests, and update documentation as needed.

### 3. Run Quality Checks Locally

Before committing, run all quality checks:

```bash
# Run individual checks
pnpm lint              # ESLint
pnpm format            # Prettier (auto-fix)
pnpm format:check      # Prettier (check only)
pnpm typecheck         # TypeScript
pnpm test              # Tests
pnpm build             # Build all packages

# Or run everything at once
pnpm ci                # Runs all checks
```

### 4. Commit Changes

We follow conventional commits:

```bash
git add .
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in db module"
git commit -m "docs: update SDK documentation"
git commit -m "test: add tests for ai.generate"
```

**Commit message format**:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub:

1. Go to https://github.com/dot-do/ai/pulls
2. Click "New pull request"
3. Select your branch
4. Fill in PR template
5. Submit for review

## CI/CD Pipelines

Our CI/CD pipelines automatically run on every pull request and push to `main`. All checks must pass before merging.

### CI Workflow (`ci.yml`)

**Triggers**: Push to `main`, Pull Requests

**Jobs**:

1. **Lint** - Runs ESLint and Prettier checks
   - Validates code style and formatting
   - Must pass for PR approval

2. **Type Check** - Runs TypeScript compiler
   - Ensures type safety across all packages
   - Catches type errors early

3. **Test** - Runs test suite on Node.js 18, 20, and 22
   - Matrix testing across Node versions
   - Uploads coverage to Codecov
   - Enforces 50% minimum coverage threshold

4. **Build** - Builds all packages
   - Verifies no build errors
   - Uploads build artifacts
   - Tests package bundling

**Status**: [![CI](https://github.com/dot-do/ai/actions/workflows/ci.yml/badge.svg)](https://github.com/dot-do/ai/actions/workflows/ci.yml)

### Lint Workflow (`lint.yml`)

**Triggers**: Push to `main`, Pull Requests

**Jobs**:

1. **ESLint** - JavaScript/TypeScript linting
2. **Prettier** - Code formatting validation
3. **TypeScript** - Type checking
4. **Markdown** - Markdown file linting
5. **Spell Check** - Spelling validation using typos

**Status**: [![Lint](https://github.com/dot-do/ai/actions/workflows/lint.yml/badge.svg)](https://github.com/dot-do/ai/actions/workflows/lint.yml)

### Security Workflow (`security.yml`)

**Triggers**: Push to `main`, Pull Requests, Weekly schedule (Sundays)

**Jobs**:

1. **npm Audit** - Scans for vulnerable dependencies
2. **CodeQL** - Advanced code security analysis
3. **Dependency Review** - Reviews dependency changes in PRs

**Status**: [![Security](https://github.com/dot-do/ai/actions/workflows/security.yml/badge.svg)](https://github.com/dot-do/ai/actions/workflows/security.yml)

### Publish Workflow (`publish.yml`)

**Triggers**: Manual workflow dispatch, GitHub Releases

**Purpose**: Publish packages to npm

**Status**: [![Publish](https://github.com/dot-do/ai/actions/workflows/publish.yml/badge.svg)](https://github.com/dot-do/ai/actions/workflows/publish.yml)

See [Publishing Packages](#publishing-packages) section below.

## Code Quality Standards

### ESLint

We use ESLint to enforce code quality:

```bash
pnpm lint           # Check for issues
pnpm lint:fix       # Auto-fix issues
```

**Rules**:

- No unused variables
- No console.log (use proper logging)
- Consistent naming conventions
- No any types (use proper TypeScript types)

### Prettier

Code formatting is handled by Prettier:

```bash
pnpm format         # Auto-format all files
pnpm format:check   # Check formatting (CI uses this)
```

**Configuration**:

- 160 character line width
- Single quotes
- No semicolons
- 2 space indentation
- ES5 trailing commas

### TypeScript

All code must be properly typed:

```bash
pnpm typecheck      # Run type checking
```

**Best practices**:

- Use explicit types for public APIs
- Avoid `any` - use `unknown` or proper types
- Export types from packages
- Use type guards for runtime checks

### Testing

Write tests for all new features and bug fixes:

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # Generate coverage report
```

**Requirements**:

- Minimum 50% code coverage (enforced by CI)
- Unit tests for all functions
- Integration tests for workflows
- E2E tests for CLI commands

**Test structure**:

```typescript
import { describe, it, expect } from 'vitest'

describe('Feature name', () => {
  it('should do something', () => {
    expect(result).toBe(expected)
  })
})
```

## Publishing Packages

### npm Token Setup

Publishing requires an npm token with publish permissions:

1. Generate token at [npmjs.com](https://www.npmjs.com/settings/YOUR_USERNAME/tokens)
2. Create "Automation" token
3. Add to GitHub: Settings → Secrets → Actions → New repository secret
4. Name: `NPM_TOKEN`

### Publishing Process

**Option 1: Manual Trigger** (Recommended)

1. Go to [Actions → Publish to npm](https://github.com/dot-do/ai/actions/workflows/publish.yml)
2. Click "Run workflow"
3. Enter version (e.g., `1.0.0-beta.1`)
4. Select dist-tag:
   - `beta` - Beta releases (default)
   - `latest` - Stable releases
   - `next` - Next/RC releases
   - `canary` - Canary/nightly releases
5. Click "Run workflow"

**Option 2: GitHub Release**

1. Create a new release on GitHub
2. Tag format: `v1.0.0`
3. Publish release
4. Workflow automatically publishes to npm

### Version Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features (backwards compatible)
- **Patch** (0.0.1): Bug fixes

**Pre-release tags**:

- `1.0.0-beta.1` - Beta releases
- `1.0.0-rc.1` - Release candidates
- `1.0.0-canary.1` - Canary/nightly builds

### Publish Workflow Steps

The workflow automatically:

1. ✅ Installs dependencies
2. ✅ Builds all packages
3. ✅ Runs test suite
4. ✅ Updates package versions (if manual trigger)
5. ✅ Publishes to npm with provenance
6. ✅ Creates GitHub release with notes
7. ✅ Tags commit with version

## Branch Protection

The `main` branch is protected with the following rules:

### Required Status Checks

All PRs must pass these checks before merging:

- ✅ `lint / ESLint`
- ✅ `lint / Prettier`
- ✅ `lint / TypeScript`
- ✅ `ci / Test`
- ✅ `ci / Build`

### Protection Rules

- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ✅ No force pushes
- ✅ No branch deletions
- ✅ No bypassing (even for admins)

### Configuring Branch Protection

**For repository admins**:

1. Go to Settings → Branches → Branch protection rules
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable settings above
5. Save changes

**Via GitHub CLI**:

```bash
gh api repos/dot-do/ai/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=lint \
  --field required_status_checks[contexts][]=test \
  --field required_status_checks[contexts][]=build \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field enforce_admins=true \
  --field required_conversation_resolution[enabled]=true
```

## Troubleshooting

### Workflow Failures

**"command not found" errors**:

- Verify `package.json` has the required scripts
- Check pnpm installation: `pnpm --version`

**TypeScript errors**:

- Run `pnpm typecheck` locally to see full errors
- Ensure all packages are built: `pnpm build`

**Test failures**:

- Run tests locally: `pnpm test`
- Check Node.js version: `node --version`
- Clear cache: `pnpm store prune`

**Linting errors**:

- Auto-fix: `pnpm lint:fix`
- Format: `pnpm format`
- Check `.eslintrc.json` for rules

### npm Publish Failures

**Authentication errors**:

- Verify `NPM_TOKEN` secret is set correctly
- Check token permissions on npmjs.com
- Generate new token if needed

**Package name conflicts**:

- Ensure packages are scoped: `@dotdo/*`
- Check package names on npmjs.com
- Update `package.json` name field

**Permission errors**:

- Verify you're a maintainer of the `@dotdo` scope
- Contact @nathanclevenger for access

### Coverage Thresholds

If coverage drops below 50%:

1. Add tests for new code
2. Run coverage report: `pnpm test:coverage`
3. Check `coverage/` directory for details
4. Focus on untested branches and functions

### Security Alerts

**Vulnerable dependencies**:

- Check Dependabot alerts
- Update dependencies: `pnpm update`
- Review security advisory details

**CodeQL alerts**:

- Review alert details on GitHub
- Fix security issues promptly
- Add suppression only if false positive

## Getting Help

- **Issues**: [github.com/dot-do/ai/issues](https://github.com/dot-do/ai/issues)
- **Discussions**: [github.com/dot-do/ai/discussions](https://github.com/dot-do/ai/discussions)
- **Maintainer**: [@nathanclevenger](https://github.com/nathanclevenger)

## Code of Conduct

Be respectful, inclusive, and professional. We're all here to build great software together.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to `.do` Business-as-Code! 🎉
