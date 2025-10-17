import { z } from 'zod'

/**
 * Theme schema for MDXLD $type: Theme
 * Defines a comprehensive design system that can be exported to multiple formats
 */
export const ThemeSchema = z.object({
  /**
   * Unique identifier for this theme
   */
  $id: z.string().url(),

  /**
   * Type must be 'Theme'
   */
  $type: z.literal('Theme'),

  /**
   * Human-readable theme name
   */
  name: z.string(),

  /**
   * Optional parent theme to extend
   */
  extends: z.string().url().optional(),

  /**
   * Output format for theme generation
   * @default 'css'
   */
  format: z.enum(['css', 'tailwind', 'styled-components']).optional(),

  /**
   * Color palette
   */
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string().optional(),
    background: z.string(),
    foreground: z.string(),
    muted: z.string().optional(),
    border: z.string().optional(),
    error: z.string().optional(),
    success: z.string().optional(),
    warning: z.string().optional(),
    info: z.string().optional(),
  }),

  /**
   * Typography system
   */
  typography: z.object({
    fontFamily: z.object({
      sans: z.string(),
      serif: z.string().optional(),
      mono: z.string().optional(),
    }),
    fontSize: z.object({
      xs: z.string(),
      sm: z.string(),
      base: z.string(),
      lg: z.string(),
      xl: z.string(),
      '2xl': z.string().optional(),
      '3xl': z.string().optional(),
      '4xl': z.string().optional(),
    }),
    fontWeight: z.object({
      normal: z.union([z.string(), z.number()]),
      medium: z.union([z.string(), z.number()]),
      bold: z.union([z.string(), z.number()]),
      light: z.union([z.string(), z.number()]).optional(),
      semibold: z.union([z.string(), z.number()]).optional(),
    }),
    lineHeight: z.object({
      tight: z.string(),
      normal: z.string(),
      loose: z.string(),
      none: z.string().optional(),
    }),
  }),

  /**
   * Spacing scale
   */
  spacing: z.object({
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string().optional(),
    '3xl': z.string().optional(),
  }),

  /**
   * Border radius system
   */
  borderRadius: z.object({
    none: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    full: z.string(),
    xl: z.string().optional(),
  }),

  /**
   * Box shadow system
   */
  boxShadow: z
    .object({
      sm: z.string(),
      md: z.string(),
      lg: z.string(),
      xl: z.string().optional(),
      '2xl': z.string().optional(),
      none: z.string().optional(),
    })
    .optional(),

  /**
   * Responsive breakpoints
   */
  breakpoints: z
    .object({
      sm: z.string(),
      md: z.string(),
      lg: z.string(),
      xl: z.string(),
      '2xl': z.string().optional(),
    })
    .optional(),

  /**
   * Animation/transition settings
   */
  animation: z
    .object({
      duration: z
        .object({
          fast: z.string(),
          normal: z.string(),
          slow: z.string(),
        })
        .optional(),
      easing: z
        .object({
          linear: z.string(),
          ease: z.string(),
          easeIn: z.string(),
          easeOut: z.string(),
          easeInOut: z.string(),
        })
        .optional(),
    })
    .optional(),
})

export type ThemeConfig = z.infer<typeof ThemeSchema>

/**
 * Output from theme generation
 */
export interface ThemeOutput {
  type: 'css' | 'tailwind' | 'styled-components' | string
  content: string
}
