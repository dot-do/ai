export interface BrandInput {
  name: string
  description: string
  industry?: string
  values?: string[]
  targetAudience?: string
  mission?: string
  vision?: string
  customPrompt?: string
}

export interface BrandOptions {
  modelName?: string
  system?: string
  temperature?: number
  maxTokens?: number
  imageModel?: string
  imageStyle?: 'natural' | 'vivid'
  imageQuality?: 'standard' | 'hd'
  colorScheme?: 'light' | 'dark' | 'both'
  iconStyle?: string
  tailwindConfig?: boolean
}

export interface BrandPositioning {
  story: BrandStory
  voice: BrandVoice
  messaging: BrandMessaging
}

export interface BrandStory {
  hero: string
  problem: string
  guide: string
  plan: string
  callToAction: string
  success: string
  failure: string
}

export interface BrandVoice {
  tone: string
  personality: string[]
  examples: string[]
}

export interface BrandMessaging {
  tagline: string
  elevator: string
  valueProposition: string
  keyMessages: string[]
}

export interface VisualIdentity {
  colors: ColorPalette
  typography: Typography
  themes: Themes
}

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  neutral: string
  success?: string
  warning?: string
  error?: string
  info?: string
}

export interface Typography {
  headingFont: string
  bodyFont: string
  monoFont?: string
}

export interface Themes {
  light: ThemeColors
  dark?: ThemeColors
}

export interface ThemeColors {
  background: string
  foreground: string
  primary: string
  secondary: string
  accent: string
  muted: string
}

export interface BrandAssets {
  logo: LogoAsset
  icons: IconSet
  images: ImageAssets
}

export interface LogoAsset {
  url: string
  alt: string
  variants?: {
    light?: string
    dark?: string
    monochrome?: string
  }
}

export interface IconSet {
  collection?: string
  primary: string[]
  custom?: Record<string, string>
}

export interface ImageAssets {
  openGraph: string
  banner?: string
  favicon?: string
  patterns?: string[]
}

export interface BrandResult {
  positioning: BrandPositioning
  visual: VisualIdentity
  assets: BrandAssets
}
