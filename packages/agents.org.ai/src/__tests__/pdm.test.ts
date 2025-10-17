/**
 * Tests for pdm agent utilities
 * Run: pnpm test
 */

import { describe, it, expect } from 'vitest'
import {
  canMergePR,
  shouldAutoMerge,
  requiresHumanReview,
  generatePRReviewComment,
  generateClarificationComment,
  generateBlockingSMS,
  type MergeCriteria,
} from '../pdm'

describe('canMergePR', () => {
  it('should allow merge when all criteria met', () => {
    const criteria: MergeCriteria = {
      ciPassing: true,
      codeReviewComplete: true,
      testsIncluded: true,
      documentationUpdated: true,
      noUnresolvedComments: true,
      alignedWithRoadmap: true,
    }

    const result = canMergePR(criteria)
    expect(result.canMerge).toBe(true)
    expect(result.reasons).toHaveLength(0)
  })

  it('should block merge when CI failing', () => {
    const criteria: MergeCriteria = {
      ciPassing: false,
      codeReviewComplete: true,
      testsIncluded: true,
      documentationUpdated: true,
      noUnresolvedComments: true,
      alignedWithRoadmap: true,
    }

    const result = canMergePR(criteria)
    expect(result.canMerge).toBe(false)
    expect(result.reasons).toContain('CI/CD checks must pass')
  })

  it('should return all blocking reasons', () => {
    const criteria: MergeCriteria = {
      ciPassing: false,
      codeReviewComplete: false,
      testsIncluded: false,
      documentationUpdated: true,
      noUnresolvedComments: true,
      alignedWithRoadmap: true,
    }

    const result = canMergePR(criteria)
    expect(result.canMerge).toBe(false)
    expect(result.reasons).toHaveLength(3)
  })

  it('should throw TypeError for invalid input', () => {
    expect(() => canMergePR(null as any)).toThrow(TypeError)
    expect(() => canMergePR({} as any)).toThrow(TypeError)
    expect(() => canMergePR({ ciPassing: 'true' } as any)).toThrow(TypeError)
  })
})

describe('shouldAutoMerge', () => {
  it('should auto-merge dependency updates', () => {
    const pr = {
      title: 'chore(deps): update dependencies',
      files: ['package.json', 'pnpm-lock.yaml'],
      labels: ['dependencies'],
    }

    expect(shouldAutoMerge(pr)).toBe(true)
  })

  it('should auto-merge docs-only changes', () => {
    const pr = {
      title: 'docs: update readme',
      files: ['README.md', 'docs/guide.mdx'],
      labels: ['documentation'],
    }

    expect(shouldAutoMerge(pr)).toBe(true)
  })

  it('should not auto-merge mixed changes', () => {
    const pr = {
      title: 'feat: add new feature',
      files: ['src/index.ts', 'README.md'],
      labels: ['feature'],
    }

    expect(shouldAutoMerge(pr)).toBe(false)
  })

  it('should auto-merge bug fixes with tests', () => {
    const pr = {
      title: 'fix: resolve authentication bug',
      files: ['src/auth.ts', 'src/__tests__/auth.test.ts'],
      labels: ['bug', 'has-tests'],
    }

    expect(shouldAutoMerge(pr)).toBe(true)
  })

  it('should throw TypeError for invalid input', () => {
    expect(() => shouldAutoMerge(null as any)).toThrow(TypeError)
    expect(() => shouldAutoMerge({ title: 123 } as any)).toThrow(TypeError)
    expect(() => shouldAutoMerge({ title: 'test', files: 'not-array' } as any)).toThrow(TypeError)
  })
})

describe('requiresHumanReview', () => {
  it('should flag breaking changes', () => {
    const pr = {
      title: 'feat!: BREAKING change to API',
      files: ['src/api.ts'],
      labels: ['breaking-change'],
    }

    expect(requiresHumanReview(pr)).toBe(true)
  })

  it('should flag large PRs (>20 files)', () => {
    const pr = {
      title: 'feat: large refactor',
      files: new Array(25).fill('file.ts'),
      labels: [],
    }

    expect(requiresHumanReview(pr)).toBe(true)
  })

  it('should flag security changes', () => {
    const pr = {
      title: 'fix: update auth logic',
      files: ['src/auth.ts', 'src/security.ts'],
      labels: ['security'],
    }

    expect(requiresHumanReview(pr)).toBe(true)
  })

  it('should not flag small feature PRs', () => {
    const pr = {
      title: 'feat: add helper function',
      files: ['src/utils.ts', 'src/__tests__/utils.test.ts'],
      labels: ['feature'],
    }

    expect(requiresHumanReview(pr)).toBe(false)
  })

  it('should throw TypeError for invalid input', () => {
    expect(() => requiresHumanReview(null as any)).toThrow(TypeError)
    expect(() => requiresHumanReview({ files: [] } as any)).toThrow(TypeError)
  })
})

describe('generatePRReviewComment', () => {
  it('should generate human review required message', () => {
    const pr = {
      number: 123,
      author: 'testuser',
      title: 'Breaking change',
      canMerge: true,
      autoMerge: false,
      requiresHumanReview: true,
    }

    const comment = generatePRReviewComment(pr)
    expect(comment).toContain('@testuser')
    expect(comment).toContain('requires human review')
    expect(comment).toContain('cc: @nathanclevenger') // Default review owner
  })

  it('should use custom review owner when provided', () => {
    const pr = {
      number: 123,
      author: 'testuser',
      title: 'Breaking change',
      canMerge: true,
      autoMerge: false,
      requiresHumanReview: true,
    }

    const comment = generatePRReviewComment(pr, 'customowner')
    expect(comment).toContain('@testuser')
    expect(comment).toContain('cc: @customowner')
    expect(comment).not.toContain('@nathanclevenger')
  })

  it('should generate auto-merge message', () => {
    const pr = {
      number: 123,
      author: 'testuser',
      title: 'docs: update',
      canMerge: true,
      autoMerge: true,
      requiresHumanReview: false,
    }

    const comment = generatePRReviewComment(pr)
    expect(comment).toContain('Auto-merging now')
  })

  it('should generate blocked message with reasons', () => {
    const pr = {
      number: 123,
      author: 'testuser',
      title: 'feat: new feature',
      canMerge: false,
      reasons: ['CI/CD checks must pass', 'Tests must be included'],
      autoMerge: false,
      requiresHumanReview: false,
    }

    const comment = generatePRReviewComment(pr)
    expect(comment).toContain('needs attention')
    expect(comment).toContain('CI/CD checks must pass')
  })

  it('should sanitize author input', () => {
    const pr = {
      number: 123,
      author: 'test<script>alert("xss")</script>user',
      title: 'test',
      canMerge: true,
      autoMerge: false,
      requiresHumanReview: false,
    }

    const comment = generatePRReviewComment(pr)
    expect(comment).not.toContain('<script>')
    expect(comment).not.toContain('</script>')
    // Enhanced sanitization removes dangerous characters entirely
    expect(comment).toContain('@testscriptalert"xss"/scriptuser') // Sanitized output
  })

  it('should remove markdown injection attempts', () => {
    const pr = {
      number: 123,
      author: 'test[link](http://evil.com)`code`user',
      title: 'test',
      canMerge: true,
      autoMerge: false,
      requiresHumanReview: false,
    }

    const comment = generatePRReviewComment(pr)
    // Sanitization removes dangerous characters entirely (more secure than escaping)
    expect(comment).toContain('@testlinkhttp://evil.comcodeuser') // All brackets, parens, backticks removed
    expect(comment).not.toContain('[link]')
    expect(comment).not.toContain('`code`')
    expect(comment).not.toContain('(http')
  })

  it('should throw TypeError for invalid input', () => {
    expect(() => generatePRReviewComment(null as any)).toThrow(TypeError)
    expect(() => generatePRReviewComment({ number: '123' } as any)).toThrow(TypeError)
  })
})

describe('generateClarificationComment', () => {
  it('should generate clarification request', () => {
    const issue = {
      author: 'testuser',
      title: 'Feature request',
      missingInfo: ['Use case', 'Expected behavior', 'Example data'],
    }

    const comment = generateClarificationComment(issue)
    expect(comment).toContain('@testuser')
    expect(comment).toContain('Use case')
    expect(comment).toContain('Expected behavior')
  })

  it('should sanitize author and info', () => {
    const issue = {
      author: 'test<user>',
      title: 'test',
      missingInfo: ['Info <script>'],
    }

    const comment = generateClarificationComment(issue)
    expect(comment).not.toContain('<user>')
    expect(comment).not.toContain('<script>')
  })

  it('should throw TypeError for invalid input', () => {
    expect(() => generateClarificationComment(null as any)).toThrow(TypeError)
    expect(() => generateClarificationComment({ author: 123 } as any)).toThrow(TypeError)
  })
})

describe('generateBlockingSMS', () => {
  it('should generate blocking SMS with default URL', () => {
    const issue = {
      number: 456,
      title: 'Critical bug',
      duration: '6 hours',
    }

    const sms = generateBlockingSMS(issue)
    expect(sms).toContain('🚨 BLOCKING: Critical bug')
    expect(sms).toContain('Duration: 6 hours')
    expect(sms).toContain('/issues/456')
  })

  it('should use custom repository URL', () => {
    const issue = {
      number: 456,
      title: 'Critical bug',
      duration: '6 hours',
    }

    const sms = generateBlockingSMS(issue, 'https://github.com/custom/repo')
    expect(sms).toContain('https://github.com/custom/repo/issues/456')
  })

  it('should sanitize title and duration', () => {
    const issue = {
      number: 456,
      title: 'Bug <script>',
      duration: '6<hours>',
    }

    const sms = generateBlockingSMS(issue)
    expect(sms).not.toContain('<script>')
    expect(sms).not.toContain('<hours>')
  })

  it('should throw TypeError for invalid input', () => {
    expect(() => generateBlockingSMS(null as any)).toThrow(TypeError)
    expect(() => generateBlockingSMS({ number: '456' } as any)).toThrow(TypeError)
  })
})
