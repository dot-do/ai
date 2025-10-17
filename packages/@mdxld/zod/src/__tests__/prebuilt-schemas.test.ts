import { describe, it, expect } from 'vitest'
import { BlogPostSchema, ArticleSchema, WebPageSchema, PersonSchema, OrganizationSchema, ProductSchema, EventSchema } from '../schemas.js'

describe('Pre-built Schemas', () => {
  describe('BlogPostSchema', () => {
    it('should validate valid blog post', () => {
      const data = {
        $type: 'BlogPost',
        title: 'My First Blog Post',
        author: 'John Doe',
        publishedAt: '2024-01-01T00:00:00Z',
      }

      const result = BlogPostSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate minimal blog post', () => {
      const data = {
        $type: 'BlogPost',
        title: 'Minimal Post',
      }

      const result = BlogPostSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate blog post with author object', () => {
      const data = {
        $type: 'BlogPost',
        title: 'My Post',
        author: {
          name: 'John Doe',
          url: 'https://example.com/john',
        },
      }

      const result = BlogPostSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject wrong type', () => {
      const data = {
        $type: 'Article',
        title: 'My Post',
      }

      const result = BlogPostSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('ArticleSchema', () => {
    it('should validate valid article', () => {
      const data = {
        $type: 'Article',
        headline: 'Breaking News',
        author: 'Jane Smith',
        datePublished: '2024-01-01T00:00:00Z',
      }

      const result = ArticleSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate minimal article', () => {
      const data = {
        $type: 'Article',
        headline: 'News Article',
      }

      const result = ArticleSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('WebPageSchema', () => {
    it('should validate valid web page', () => {
      const data = {
        $type: 'WebPage',
        name: 'Home Page',
        description: 'Welcome to our site',
        url: 'https://example.com',
      }

      const result = WebPageSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate minimal web page', () => {
      const data = {
        $type: 'WebPage',
        name: 'Page',
      }

      const result = WebPageSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('PersonSchema', () => {
    it('should validate valid person', () => {
      const data = {
        $type: 'Person',
        name: 'John Doe',
        givenName: 'John',
        familyName: 'Doe',
        email: 'john@example.com',
        url: 'https://johndoe.com',
      }

      const result = PersonSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate minimal person', () => {
      const data = {
        $type: 'Person',
        name: 'John Doe',
      }

      const result = PersonSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate email format', () => {
      const data = {
        $type: 'Person',
        name: 'John Doe',
        email: 'invalid-email',
      }

      const result = PersonSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('OrganizationSchema', () => {
    it('should validate valid organization', () => {
      const data = {
        $type: 'Organization',
        name: 'Acme Corp',
        description: 'We make great products',
        url: 'https://acme.com',
        email: 'info@acme.com',
      }

      const result = OrganizationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate organization with address', () => {
      const data = {
        $type: 'Organization',
        name: 'Acme Corp',
        address: {
          streetAddress: '123 Main St',
          addressLocality: 'New York',
          addressRegion: 'NY',
          postalCode: '10001',
          addressCountry: 'US',
        },
      }

      const result = OrganizationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('ProductSchema', () => {
    it('should validate valid product', () => {
      const data = {
        $type: 'Product',
        name: 'Widget',
        description: 'A great widget',
        offers: {
          price: 29.99,
          priceCurrency: 'USD',
        },
      }

      const result = ProductSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate product with string price', () => {
      const data = {
        $type: 'Product',
        name: 'Widget',
        offers: {
          price: '29.99',
          priceCurrency: 'USD',
        },
      }

      const result = ProductSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate minimal product', () => {
      const data = {
        $type: 'Product',
        name: 'Widget',
      }

      const result = ProductSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('EventSchema', () => {
    it('should validate valid event', () => {
      const data = {
        $type: 'Event',
        name: 'Tech Conference',
        description: 'Annual tech conference',
        startDate: '2024-06-01T09:00:00Z',
        endDate: '2024-06-03T18:00:00Z',
        location: {
          name: 'Convention Center',
          address: '456 Event Blvd',
        },
      }

      const result = EventSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate minimal event', () => {
      const data = {
        $type: 'Event',
        name: 'Meeting',
        startDate: '2024-06-01T09:00:00Z',
      }

      const result = EventSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate event with string location', () => {
      const data = {
        $type: 'Event',
        name: 'Conference',
        startDate: '2024-06-01T09:00:00Z',
        location: 'Convention Center',
      }

      const result = EventSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
