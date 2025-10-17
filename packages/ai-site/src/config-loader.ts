import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export interface SiteConfig {
  name: string
  description: string
  nextConfig?: Record<string, any>
  appDir?: string
  aiFunctions?: Record<string, any>
  aiProps?: Record<string, any>
  landingPage?: LandingPageConfig
  [key: string]: any
}

export interface HeroSection {
  headline: string
  subheadline?: string
  ctaButton?: {
    text: string
    url: string
  }
  secondaryButton?: {
    text: string
    url: string
  }
  image?: string
  backgroundColor?: string
  textColor?: string
  alignment?: 'left' | 'center' | 'right'
  mobileLayout?: 'stacked' | 'reversed'
}

export interface FeatureItem {
  title: string
  description: string
  icon?: string
  image?: string
  link?: {
    text: string
    url: string
  }
}

export interface FeaturesSection {
  headline: string
  subheadline?: string
  features: FeatureItem[]
  layout?: 'grid' | 'list' | 'alternating'
  backgroundColor?: string
  textColor?: string
}

export interface TestimonialItem {
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: string
  rating?: number
}

export interface TestimonialsSection {
  headline: string
  subheadline?: string
  testimonials: TestimonialItem[]
  display?: 'carousel' | 'grid' | 'list'
  backgroundColor?: string
  textColor?: string
}

export interface PricingTier {
  name: string
  price: string
  description?: string
  features: string[]
  ctaButton: {
    text: string
    url: string
  }
  highlighted?: boolean
  billingPeriod?: 'monthly' | 'yearly' | 'custom'
  customBillingText?: string
}

export interface PricingSection {
  headline: string
  subheadline?: string
  pricingTiers: PricingTier[]
  billingToggle?: boolean
  backgroundColor?: string
  textColor?: string
}

export interface CTASection {
  headline: string
  subheadline?: string
  ctaButton: {
    text: string
    url: string
  }
  secondaryButton?: {
    text: string
    url: string
  }
  backgroundColor?: string
  textColor?: string
  backgroundImage?: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQSection {
  headline: string
  subheadline?: string
  faqs: FAQItem[]
  backgroundColor?: string
  textColor?: string
}

export interface LandingPageConfig {
  sections: {
    hero?: HeroSection
    features?: FeaturesSection
    testimonials?: TestimonialsSection
    pricing?: PricingSection
    cta?: CTASection
    faq?: FAQSection
  }
  globalStyles?: Record<string, any>
  theme?: Record<string, any>
}

const DEFAULT_CONFIG: SiteConfig = {
  name: 'AI-Powered Site',
  description: 'Generated with ai-site',
}

/**
 * Load and validate the site configuration
 */
export async function loadSiteConfig(): Promise<SiteConfig> {
  const cwd = process.cwd()

  const tsConfigPath = path.join(cwd, 'site.config.ts')
  if (fs.existsSync(tsConfigPath)) {
    try {
      const configModule = await import(pathToFileURL(tsConfigPath).href)
      return validateConfig(configModule.default || configModule)
    } catch (error) {
      console.error('Error loading TypeScript config:', error)
    }
  }

  const jsConfigPath = path.join(cwd, 'site.config.js')
  if (fs.existsSync(jsConfigPath)) {
    try {
      const configModule = await import(pathToFileURL(jsConfigPath).href)
      return validateConfig(configModule.default || configModule)
    } catch (error) {
      console.error('Error loading JavaScript config:', error)
    }
  }

  console.warn('No site.config.{ts|js} found, using default configuration')
  return DEFAULT_CONFIG
}

/**
 * Validate the configuration and apply defaults
 */
function validateConfig(config: any): SiteConfig {
  if (!config || typeof config !== 'object') {
    console.warn('Invalid configuration, using default')
    return DEFAULT_CONFIG
  }

  return {
    ...DEFAULT_CONFIG,
    ...config,
  }
}
