# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-10

### Added

- Initial implementation of Product Manager (pdm) agent based on OpenAI AgentKit
- Core agent types: `Agent`, `AgentTool`, `AgentTrigger`, `AgentHandoff`, `AgentGuardrail`
- pdm agent implementation with decision utilities
- PR merge criteria validation with `canMergePR()`
- Auto-merge detection with `shouldAutoMerge()`
- Human review detection with `requiresHumanReview()`
- PR review comment generation with `generatePRReviewComment()`
- Issue clarification comment generation with `generateClarificationComment()`
- Blocking issue SMS generation with `generateBlockingSMS()`
- Comprehensive test suite with 313 lines of tests
- Full TypeScript type definitions with strict mode
- Input validation and sanitization for all utility functions
- Configurable GitHub repository URL via environment variable
- Documentation in README.md and platform/agents/pdm.mdx
- Implementation notes for Phases 2-4

### Security

- Input sanitization to prevent markdown injection attacks
- Type validation on all function inputs
- Error handling with descriptive TypeError messages

## [Unreleased]

### Planned for Phase 2

- GitHub App integration and webhook handlers
- OpenAI GPT-5 API connection
- Webhook signature verification
- Rate limiting enforcement
- End-to-end PR review workflow

### Planned for Phase 3

- Vapi integration for SMS/voice/email
- Multi-channel communication
- SMS escalation for blocking issues
- Weekly summary emails

### Planned for Phase 4

- Workflow automation testing
- Production deployment
- Monitoring and observability
