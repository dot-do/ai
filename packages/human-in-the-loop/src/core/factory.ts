import type { CreateHumanFunctionOptions, HumanFunction } from './types'
import { SlackHumanFunction } from '../platforms/slack'
import { TeamsHumanFunction } from '../platforms/teams'
import { ReactHumanFunction } from '../platforms/react'
import { EmailHumanFunction } from '../platforms/email'

/**
 * Create a strongly-typed human function
 */
export function createHumanFunction<TInput, TOutput>(options: CreateHumanFunctionOptions): HumanFunction<TInput, TOutput> {
  const { platform } = options

  switch (platform) {
    case 'slack':
      return new SlackHumanFunction<TInput, TOutput>(options)
    case 'teams':
      return new TeamsHumanFunction<TInput, TOutput>(options)
    case 'react':
      return new ReactHumanFunction<TInput, TOutput>(options)
    case 'email':
      if (!options.to) {
        throw new Error('Email platform requires a "to" field in options')
      }
      return new EmailHumanFunction<TInput, TOutput>(options as any)
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}
