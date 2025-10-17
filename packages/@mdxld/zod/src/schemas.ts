import { z } from 'zod'
import { createTypedSchema } from './utils.js'

/**
 * Schema for BlogPost type
 * Based on schema.org BlogPosting
 */
export const BlogPostSchema = createTypedSchema(
  'BlogPost',
  z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z
      .union([
        z.string(),
        z.object({
          name: z.string(),
          url: z.string().url().optional(),
        }),
      ])
      .optional(),
    publishedAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().url().optional(),
  })
)

/**
 * Schema for Article type
 * Based on schema.org Article
 */
export const ArticleSchema = createTypedSchema(
  'Article',
  z.object({
    headline: z.string(),
    description: z.string().optional(),
    author: z
      .union([
        z.string(),
        z.object({
          name: z.string(),
          url: z.string().url().optional(),
        }),
      ])
      .optional(),
    datePublished: z.string().datetime().optional(),
    dateModified: z.string().datetime().optional(),
    image: z.string().url().optional(),
    keywords: z.array(z.string()).optional(),
  })
)

/**
 * Schema for WebPage type
 * Based on schema.org WebPage
 */
export const WebPageSchema = createTypedSchema(
  'WebPage',
  z.object({
    name: z.string(),
    description: z.string().optional(),
    url: z.string().url().optional(),
    inLanguage: z.string().optional(),
    datePublished: z.string().datetime().optional(),
    dateModified: z.string().datetime().optional(),
  })
)

/**
 * Schema for Person type
 * Based on schema.org Person
 */
export const PersonSchema = createTypedSchema(
  'Person',
  z.object({
    name: z.string(),
    givenName: z.string().optional(),
    familyName: z.string().optional(),
    email: z.string().email().optional(),
    url: z.string().url().optional(),
    image: z.string().url().optional(),
    jobTitle: z.string().optional(),
    worksFor: z
      .object({
        name: z.string(),
        url: z.string().url().optional(),
      })
      .optional(),
  })
)

/**
 * Schema for Organization type
 * Based on schema.org Organization
 */
export const OrganizationSchema = createTypedSchema(
  'Organization',
  z.object({
    name: z.string(),
    description: z.string().optional(),
    url: z.string().url().optional(),
    logo: z.string().url().optional(),
    email: z.string().email().optional(),
    telephone: z.string().optional(),
    address: z
      .object({
        streetAddress: z.string().optional(),
        addressLocality: z.string().optional(),
        addressRegion: z.string().optional(),
        postalCode: z.string().optional(),
        addressCountry: z.string().optional(),
      })
      .optional(),
  })
)

/**
 * Schema for Product type
 * Based on schema.org Product
 */
export const ProductSchema = createTypedSchema(
  'Product',
  z.object({
    name: z.string(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    brand: z
      .union([
        z.string(),
        z.object({
          name: z.string(),
        }),
      ])
      .optional(),
    offers: z
      .object({
        price: z.union([z.string(), z.number()]),
        priceCurrency: z.string(),
        availability: z.string().optional(),
      })
      .optional(),
    sku: z.string().optional(),
  })
)

/**
 * Schema for Event type
 * Based on schema.org Event
 */
export const EventSchema = createTypedSchema(
  'Event',
  z.object({
    name: z.string(),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    location: z
      .union([
        z.string(),
        z.object({
          name: z.string(),
          address: z.string().optional(),
        }),
      ])
      .optional(),
    organizer: z
      .union([
        z.string(),
        z.object({
          name: z.string(),
          url: z.string().url().optional(),
        }),
      ])
      .optional(),
    image: z.string().url().optional(),
  })
)
