import { BrandInput, BrandOptions, BrandPositioning, VisualIdentity, ColorPalette, Typography, Themes } from './types'
import { model } from 'ai-providers'
import { z } from 'zod'

/**
 * Generate visual identity based on brand attributes
 *
 * @param input - Brand input data
 * @param positioning - Brand positioning information
 * @param options - Configuration options
 * @returns Visual identity including colors, typography, and themes
 */
export async function generateVisualIdentity(input: BrandInput, positioning: BrandPositioning, options: BrandOptions = {}): Promise<VisualIdentity> {
  const colors = await generateColorPalette(input, positioning, options)

  const typography = await generateTypography(input, positioning, options)

  const themes = generateThemes(colors, options)

  return {
    colors,
    typography,
    themes,
  }
}

/**
 * Generate color palette based on brand attributes
 *
 * @param input - Brand input data
 * @param positioning - Brand positioning information
 * @param options - Configuration options
 * @returns Color palette
 */
async function generateColorPalette(input: BrandInput, positioning: BrandPositioning, options: BrandOptions = {}): Promise<ColorPalette> {
  const { modelName = options.modelName || 'google/gemini-2.5-flash-preview', temperature = options.temperature || 0.7 } = options

  const schema = z.object({
    primary: z.string().describe('primary brand color in hex format (e.g., #4285F4)'),
    secondary: z.string().describe('secondary brand color in hex format'),
    accent: z.string().describe('accent color in hex format'),
    neutral: z.string().describe('neutral color in hex format'),
    success: z.string().optional().describe('success color in hex format'),
    warning: z.string().optional().describe('warning color in hex format'),
    error: z.string().optional().describe('error color in hex format'),
    info: z.string().optional().describe('info color in hex format'),
  })

  try {
    const result = await model(modelName).generate({
      prompt: `Generate a color palette for ${input.name}, which is ${input.description}.
      The brand tone is: ${positioning.voice.tone}.
      The brand personality traits are: ${positioning.voice.personality.join(', ')}.
      ${input.customPrompt || ''}
      
      Return a color palette with primary, secondary, accent, and neutral colors, plus optional success, warning, error, and info colors.
      All colors should be in hex format (e.g., #4285F4).`,
      system: options.system || 'You are an expert brand designer specializing in color theory and brand identity',
      temperature,
      schema,
    })

    return JSON.parse(result.text)
  } catch (error) {
    console.error('Error generating color palette:', error)
    return {
      primary: '#4285F4',
      secondary: '#34A853',
      accent: '#FBBC05',
      neutral: '#9AA0A6',
      success: '#34A853',
      warning: '#FBBC05',
      error: '#EA4335',
      info: '#4285F4',
    }
  }
}

/**
 * Generate typography recommendations
 *
 * @param input - Brand input data
 * @param positioning - Brand positioning information
 * @param options - Configuration options
 * @returns Typography recommendations
 */
async function generateTypography(input: BrandInput, positioning: BrandPositioning, options: BrandOptions = {}): Promise<Typography> {
  const { modelName = options.modelName || 'google/gemini-2.5-flash-preview', temperature = options.temperature || 0.7 } = options

  const schema = z.object({
    headingFont: z.string().describe('font family for headings'),
    bodyFont: z.string().describe('font family for body text'),
    monoFont: z.string().optional().describe('font family for monospace text'),
  })

  try {
    const result = await model(modelName).generate({
      prompt: `Recommend typography for ${input.name}, which is ${input.description}.
      The brand tone is: ${positioning.voice.tone}.
      The brand personality traits are: ${positioning.voice.personality.join(', ')}.
      ${input.customPrompt || ''}
      
      Return font recommendations for headings, body text, and optionally monospace text.
      Use common web-safe fonts or Google Fonts.`,
      system: options.system || 'You are an expert brand designer specializing in typography and brand identity',
      temperature,
      schema,
    })

    return JSON.parse(result.text)
  } catch (error) {
    console.error('Error generating typography recommendations:', error)
    return {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      monoFont: 'Roboto Mono, monospace',
    }
  }
}

/**
 * Generate light and dark themes based on color palette
 *
 * @param colors - Color palette
 * @param options - Configuration options
 * @returns Light and dark themes
 */
function generateThemes(colors: ColorPalette, options: BrandOptions = {}): Themes {
  const colorScheme = options.colorScheme || 'both'

  const lightTheme = {
    background: '#FFFFFF',
    foreground: '#1F2937',
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    muted: '#F3F4F6',
  }

  const darkTheme = {
    background: '#1F2937',
    foreground: '#F9FAFB',
    primary: lightenColor(colors.primary, 10),
    secondary: lightenColor(colors.secondary, 10),
    accent: lightenColor(colors.accent, 10),
    muted: '#374151',
  }

  return {
    light: lightTheme,
    ...(colorScheme !== 'light' ? { dark: darkTheme } : {}),
  }
}

/**
 * Generate CSS variables from themes
 *
 * @param themes - Light and dark themes
 * @returns CSS variables as a string
 */
export function generateCssVariables(themes: Themes): string {
  let css = ':root {\n'

  Object.entries(themes.light).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`
  })

  css += '}\n\n'

  if (themes.dark) {
    css += '@media (prefers-color-scheme: dark) {\n'
    css += '  :root {\n'

    Object.entries(themes.dark).forEach(([key, value]) => {
      css += `    --${key}: ${value};\n`
    })

    css += '  }\n'
    css += '}\n'
  }

  return css
}

/**
 * Generate Tailwind CSS config from color palette
 *
 * @param colors - Color palette
 * @returns Tailwind CSS config object
 */
export function generateTailwindConfig(colors: ColorPalette): { colors: Record<string, Record<string, string>> } {
  return {
    colors: {
      primary: {
        DEFAULT: colors.primary,
        light: lightenColor(colors.primary, 20),
        dark: darkenColor(colors.primary, 20),
      },
      secondary: {
        DEFAULT: colors.secondary,
        light: lightenColor(colors.secondary, 20),
        dark: darkenColor(colors.secondary, 20),
      },
      accent: {
        DEFAULT: colors.accent,
        light: lightenColor(colors.accent, 20),
        dark: darkenColor(colors.accent, 20),
      },
      neutral: {
        DEFAULT: colors.neutral,
        light: lightenColor(colors.neutral, 20),
        dark: darkenColor(colors.neutral, 20),
      },
      ...(colors.success
        ? {
            success: {
              DEFAULT: colors.success,
              light: lightenColor(colors.success, 20),
              dark: darkenColor(colors.success, 20),
            },
          }
        : {}),
      ...(colors.warning
        ? {
            warning: {
              DEFAULT: colors.warning,
              light: lightenColor(colors.warning, 20),
              dark: darkenColor(colors.warning, 20),
            },
          }
        : {}),
      ...(colors.error
        ? {
            error: {
              DEFAULT: colors.error,
              light: lightenColor(colors.error, 20),
              dark: darkenColor(colors.error, 20),
            },
          }
        : {}),
      ...(colors.info
        ? {
            info: {
              DEFAULT: colors.info,
              light: lightenColor(colors.info, 20),
              dark: darkenColor(colors.info, 20),
            },
          }
        : {}),
    },
  }
}

/**
 * Lighten a hex color by a percentage
 *
 * @param color - Hex color
 * @param percent - Percentage to lighten
 * @returns Lightened hex color
 */
export function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt

  return (
    '#' +
    (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255))
      .toString(16)
      .slice(1)
  )
}

/**
 * Darken a hex color by a percentage
 *
 * @param color - Hex color
 * @param percent - Percentage to darken
 * @returns Darkened hex color
 */
export function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) - amt
  const G = ((num >> 8) & 0x00ff) - amt
  const B = (num & 0x0000ff) - amt

  return (
    '#' +
    (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255))
      .toString(16)
      .slice(1)
  )
}
