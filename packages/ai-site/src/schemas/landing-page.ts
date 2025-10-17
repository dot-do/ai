/**
 * Schema definitions for landing page sections
 * These schemas are used to generate AI-powered content for landing pages
 */

const createSchema = <T extends Record<string, any>>(schema: T) => schema

export const landingPageSchema = createSchema({
  heroSection: {
    headline: 'primary headline text that communicates value proposition',
    subheadline: 'supporting text that expands on the headline',
    ctaButton: {
      text: 'call-to-action button text',
      url: 'URL the button links to',
    },
    secondaryButton: {
      text: 'secondary button text',
      url: 'URL the secondary button links to',
    },
    image: 'URL or path to hero image',
    backgroundColor: 'background color for the section',
    textColor: 'text color for the section',
    alignment: 'content alignment (left, center, or right)',
    mobileLayout: 'layout for mobile devices (stacked or reversed)',
  },

  featuresSection: {
    headline: 'section headline highlighting key features',
    subheadline: 'supporting text explaining the value of features',
    features: [
      {
        title: 'feature title',
        description: 'concise feature description',
        icon: 'name or URL of icon to represent this feature',
        image: 'URL or path to feature image',
        link: {
          text: 'link text for the feature',
          url: 'URL for the feature link',
        },
      },
    ],
    layout: 'layout style for features (grid, list, or alternating)',
    backgroundColor: 'background color for the section',
    textColor: 'text color for the section',
  },

  testimonialsSection: {
    headline: 'section headline for testimonials',
    subheadline: 'supporting text explaining the value of testimonials',
    testimonials: [
      {
        quote: 'testimonial quote from customer',
        author: 'name of the person giving testimonial',
        role: 'job title or role of the testimonial author',
        company: 'company name of the testimonial author',
        avatar: 'URL or path to author avatar image',
        rating: 'numerical rating (1-5)',
      },
    ],
    display: 'display style for testimonials (carousel, grid, or list)',
    backgroundColor: 'background color for the section',
    textColor: 'text color for the section',
  },

  pricingSection: {
    headline: 'section headline for pricing',
    subheadline: 'supporting text explaining the pricing structure',
    pricingTiers: [
      {
        name: 'name of the pricing tier',
        price: 'price of the tier',
        description: 'short description of the pricing tier',
        features: ['list of features included in this tier'],
        ctaButton: {
          text: 'call-to-action button text',
          url: 'URL the button links to',
        },
        highlighted: 'boolean indicating if this tier should be highlighted',
        billingPeriod: 'billing period (monthly, yearly, or custom)',
        customBillingText: 'custom text for billing period',
      },
    ],
    billingToggle: 'boolean indicating if billing period toggle should be shown',
    backgroundColor: 'background color for the section',
    textColor: 'text color for the section',
  },

  ctaSection: {
    headline: 'compelling call-to-action headline',
    subheadline: 'supporting text explaining the call to action',
    ctaButton: {
      text: 'call-to-action button text',
      url: 'URL the button links to',
    },
    secondaryButton: {
      text: 'secondary button text',
      url: 'URL the secondary button links to',
    },
    backgroundColor: 'background color for the section',
    textColor: 'text color for the section',
    backgroundImage: 'URL or path to background image',
  },

  faqSection: {
    headline: 'section headline for frequently asked questions',
    subheadline: 'supporting text introducing the FAQs',
    faqs: [
      {
        question: 'frequently asked question',
        answer: 'answer to the question',
      },
    ],
    backgroundColor: 'background color for the section',
    textColor: 'text color for the section',
  },
})

/**
 * Schema for theme configuration
 * This allows for consistent styling across landing page sections
 */
export const themeSchema = createSchema({
  colors: {
    primary: 'primary brand color',
    secondary: 'secondary brand color',
    accent: 'accent color for highlights',
    background: 'default background color',
    text: 'default text color',
    heading: 'heading text color',
    link: 'link color',
    success: 'success state color',
    warning: 'warning state color',
    error: 'error state color',
  },
  typography: {
    headingFont: 'font family for headings',
    bodyFont: 'font family for body text',
    baseSize: 'base font size in pixels',
    scaleRatio: 'ratio for type scale',
    lineHeight: 'default line height',
  },
  spacing: {
    unit: 'base spacing unit in pixels',
    sectionPadding: 'padding for sections',
    contentWidth: 'maximum width for content',
  },
  borderRadius: 'default border radius',
  boxShadow: 'default box shadow style',
  transitions: {
    duration: 'default transition duration',
    easing: 'default easing function',
  },
})

/**
 * Schema for A/B testing variants
 * This allows for testing different versions of landing page sections
 */
export const abTestingSchema = createSchema({
  variants: [
    {
      id: 'unique identifier for the variant',
      name: 'descriptive name for the variant',
      sections: {
        hero: 'variant-specific hero section configuration',
        features: 'variant-specific features section configuration',
        testimonials: 'variant-specific testimonials section configuration',
        pricing: 'variant-specific pricing section configuration',
        cta: 'variant-specific CTA section configuration',
        faq: 'variant-specific FAQ section configuration',
      },
      trafficPercentage: 'percentage of traffic to show this variant',
    },
  ],
  goals: [
    {
      name: 'name of the conversion goal',
      selector: 'CSS selector for the conversion element',
      event: 'event type to track (click, submit, etc.)',
    },
  ],
  testDuration: 'duration of the A/B test in days',
})
