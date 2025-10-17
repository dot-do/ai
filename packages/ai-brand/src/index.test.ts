import { describe, it, expect, vi } from 'vitest'
import { Brand } from './index'
import * as positioning from './positioning'
import * as visual from './visual'
import * as assets from './assets'

vi.mock('./positioning', () => ({
  generateBrandPositioning: vi.fn().mockResolvedValue({
    story: {
      hero: 'Customer',
      problem: 'Challenge',
      guide: 'Brand',
      plan: 'Solution steps',
      callToAction: 'Buy now',
      success: 'Desired outcome',
      failure: 'Risk of not acting',
    },
    voice: {
      tone: 'professional',
      personality: ['clear', 'concise', 'helpful'],
      examples: ['Example phrase 1', 'Example phrase 2'],
    },
    messaging: {
      tagline: 'Tagline',
      elevator: 'Elevator pitch',
      valueProposition: 'Value proposition',
      keyMessages: ['Key message 1', 'Key message 2'],
    },
  }),
}))

vi.mock('./visual', () => ({
  generateVisualIdentity: vi.fn().mockResolvedValue({
    colors: {
      primary: '#4285F4',
      secondary: '#34A853',
      accent: '#FBBC05',
      neutral: '#9AA0A6',
    },
    typography: {
      headings: 'Inter',
      body: 'Roboto',
    },
    themes: {
      light: {
        background: '#FFFFFF',
        text: '#202124',
        surface: '#F8F9FA',
      },
      dark: {
        background: '#202124',
        text: '#FFFFFF',
        surface: '#303134',
      },
    },
  }),
}))

vi.mock('./assets', () => ({
  generateBrandAssets: vi.fn().mockResolvedValue({
    logo: {
      url: 'https://example.com/logo.png',
      alt: 'Brand logo',
    },
    icons: {
      favicon: 'https://example.com/favicon.ico',
      social: 'https://example.com/social.png',
    },
    images: {
      openGraph: 'https://example.com/og.png',
      banner: 'https://example.com/banner.png',
    },
  }),
}))

describe('Brand', () => {
  it('should generate a complete brand identity', async () => {
    const input = {
      name: 'TestBrand',
      description: 'A test brand for unit testing',
      industry: 'technology',
      values: ['innovation', 'quality', 'reliability'],
    }

    const result = await Brand(input)

    expect(positioning.generateBrandPositioning).toHaveBeenCalledWith(input, undefined)
    expect(visual.generateVisualIdentity).toHaveBeenCalled()
    expect(assets.generateBrandAssets).toHaveBeenCalled()

    expect(result).toHaveProperty('positioning')
    expect(result).toHaveProperty('visual')
    expect(result).toHaveProperty('assets')
  })

  it('should pass options to the generator functions', async () => {
    const input = {
      name: 'TestBrand',
      description: 'A test brand for unit testing',
    }

    const options = {
      modelName: 'test-model',
      temperature: 0.5,
    }

    await Brand(input, options)

    expect(positioning.generateBrandPositioning).toHaveBeenCalledWith(input, options)
  })
})
