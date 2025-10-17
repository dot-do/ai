import { describe, it, expect } from 'vitest'
import { createHumanFunction } from './factory'
import { SlackHumanFunction } from '../platforms/slack'
import { TeamsHumanFunction } from '../platforms/teams'
import { ReactHumanFunction } from '../platforms/react'
import { EmailHumanFunction } from '../platforms/email'

describe('createHumanFunction', () => {
  it('should create a Slack human function', () => {
    const humanFunction = createHumanFunction<{}, {}>({
      platform: 'slack',
      title: 'Test',
      description: 'Test description',
    })

    expect(humanFunction).toBeInstanceOf(SlackHumanFunction)
  })

  it('should create a Teams human function', () => {
    const humanFunction = createHumanFunction<{}, {}>({
      platform: 'teams',
      title: 'Test',
      description: 'Test description',
    })

    expect(humanFunction).toBeInstanceOf(TeamsHumanFunction)
  })

  it('should create a React human function', () => {
    const humanFunction = createHumanFunction<{}, {}>({
      platform: 'react',
      title: 'Test',
      description: 'Test description',
    })

    expect(humanFunction).toBeInstanceOf(ReactHumanFunction)
  })

  it('should create an Email human function', () => {
    const humanFunction = createHumanFunction<{}, {}>({
      platform: 'email',
      title: 'Test',
      description: 'Test description',
      to: 'test@example.com',
    })

    expect(humanFunction).toBeInstanceOf(EmailHumanFunction)
  })

  it('should throw an error for unsupported platforms', () => {
    expect(() => {
      createHumanFunction<{}, {}>({
        platform: 'invalid' as any,
        title: 'Test',
        description: 'Test description',
      })
    }).toThrow('Unsupported platform: invalid')
  })

  it('should throw an error for email platform without to field', () => {
    expect(() => {
      createHumanFunction<{}, {}>({
        platform: 'email',
        title: 'Test',
        description: 'Test description',
      })
    }).toThrow('Email platform requires a "to" field in options')
  })
})
