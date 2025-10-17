import { BrandInput, BrandOptions, BrandPositioning, VisualIdentity, ColorPalette } from '../types'
import { lightenColor, darkenColor } from '../visual'

/**
 * Tailwind CSS integration for brand colors
 *
 * This module provides utilities to connect brand colors to Tailwind color palette
 * and generate Tailwind-compatible color configurations.
 */

/**
 * Generate Tailwind CSS config from color palette
 *
 * @param colors - Brand color palette
 * @param options - Configuration options
 * @returns Tailwind CSS config object
 */
export function generateTailwindConfig(colors: ColorPalette, options: BrandOptions = {}): Record<string, unknown> {
  const colorConfig = generateTailwindColors(colors)

  return {
    theme: {
      extend: {
        colors: colorConfig,
      },
    },
  }
}

/**
 * Generate Tailwind CSS colors from brand color palette
 *
 * @param colors - Brand color palette
 * @returns Tailwind CSS colors object
 */
export function generateTailwindColors(colors: ColorPalette): Record<string, Record<string, string>> {
  return {
    primary: generateColorScale(colors.primary),
    secondary: generateColorScale(colors.secondary),
    accent: generateColorScale(colors.accent),
    neutral: generateColorScale(colors.neutral),
    ...(colors.success ? { success: generateColorScale(colors.success) } : {}),
    ...(colors.warning ? { warning: generateColorScale(colors.warning) } : {}),
    ...(colors.error ? { error: generateColorScale(colors.error) } : {}),
    ...(colors.info ? { info: generateColorScale(colors.info) } : {}),
  }
}

/**
 * Generate a color scale for Tailwind CSS
 *
 * @param baseColor - Base color in hex format
 * @returns Color scale object with 50-900 values
 */
export function generateColorScale(baseColor: string): Record<string, string> {
  return {
    '50': lightenColor(baseColor, 45),
    '100': lightenColor(baseColor, 40),
    '200': lightenColor(baseColor, 30),
    '300': lightenColor(baseColor, 20),
    '400': lightenColor(baseColor, 10),
    '500': baseColor,
    '600': darkenColor(baseColor, 10),
    '700': darkenColor(baseColor, 20),
    '800': darkenColor(baseColor, 30),
    '900': darkenColor(baseColor, 40),
    DEFAULT: baseColor,
  }
}

/**
 * Generate CSS variables from Tailwind colors
 *
 * @param colors - Tailwind colors object
 * @returns CSS variables string
 */
export function generateCssVariables(colors: Record<string, Record<string, string>>): string {
  let css = ':root {\n'

  Object.entries(colors).forEach(([colorName, colorScale]) => {
    Object.entries(colorScale).forEach(([shade, value]) => {
      if (shade === 'DEFAULT') {
        css += `  --color-${colorName}: ${value};\n`
      } else {
        css += `  --color-${colorName}-${shade}: ${value};\n`
      }
    })
  })

  css += '}\n'

  return css
}

/**
 * Extend Tailwind config with custom colors
 *
 * @param baseConfig - Base Tailwind config
 * @param customColors - Custom colors to add
 * @returns Extended Tailwind config
 */
export function extendTailwindConfig(
  baseConfig: Record<string, unknown>,
  customColors: Record<string, string | Record<string, string>>
): Record<string, unknown> {
  const baseTheme = (baseConfig.theme as Record<string, unknown>) || {}
  const baseExtend = (baseTheme.extend as Record<string, unknown>) || {}
  const baseColors = (baseExtend.colors as Record<string, unknown>) || {}

  const processedColors: Record<string, unknown> = {}

  Object.entries(customColors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'string') {
      processedColors[colorName] = generateColorScale(colorValue)
    } else {
      processedColors[colorName] = colorValue
    }
  })

  return {
    ...baseConfig,
    theme: {
      ...baseTheme,
      extend: {
        ...baseExtend,
        colors: {
          ...baseColors,
          ...processedColors,
        },
      },
    },
  }
}

/**
 * Generate a Tailwind plugin for brand colors
 *
 * @param colors - Brand color palette
 * @returns Tailwind plugin function string
 */
export function generateTailwindPlugin(colors: ColorPalette): string {
  const colorConfig = JSON.stringify(generateTailwindColors(colors), null, 2)

  return `
const plugin = require('tailwindcss/plugin')

module.exports = plugin(function({ addBase }) {
  addBase({
    ':root': {
      ${Object.entries(colors)
        .map(([name, value]) => `'--color-${name}': '${value}'`)
        .join(',\n      ')}
    }
  })
}, {
  theme: {
    extend: {
      colors: ${colorConfig}
    }
  }
})
`
}

/**
 * Convert brand colors to Tailwind CSS utility classes
 *
 * @param colors - Brand color palette
 * @returns Object mapping semantic color names to Tailwind utility classes
 */
export function brandColorsToTailwindClasses(colors: ColorPalette): Record<string, string> {
  return {
    primary: `bg-primary text-white`,
    secondary: `bg-secondary text-white`,
    accent: `bg-accent text-white`,
    neutral: `bg-neutral text-white`,
    success: colors.success ? `bg-success text-white` : `bg-green-500 text-white`,
    warning: colors.warning ? `bg-warning text-black` : `bg-yellow-500 text-black`,
    error: colors.error ? `bg-error text-white` : `bg-red-500 text-white`,
    info: colors.info ? `bg-info text-white` : `bg-blue-500 text-white`,
  }
}
