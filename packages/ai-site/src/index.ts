import { loadSiteConfig } from './config-loader'
import { resolveNextConfig } from './next-config'
import { resolveAppDirectory } from './app-directory'

/**
 * Initialize the site with configurations
 */
export async function initSite() {
  const siteConfig = await loadSiteConfig()
  const nextConfig = resolveNextConfig(siteConfig)
  const appDir = resolveAppDirectory(siteConfig)

  return {
    siteConfig,
    nextConfig,
    appDir,
  }
}

export { loadSiteConfig } from './config-loader'
export type { SiteConfig, LandingPageConfig, HeroSection, FeaturesSection, TestimonialsSection, PricingSection, CTASection, FAQSection } from './config-loader'
export { resolveNextConfig } from './next-config'
export { resolveAppDirectory } from './app-directory'
export { landingPageSchema, themeSchema, abTestingSchema } from './schemas/landing-page'

export * from './components/blog'
