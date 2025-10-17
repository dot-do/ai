import { z } from 'zod'

/**
 * Blog post data structure
 */
export interface BlogPostData {
  slug?: string
  title: string
  description: string
  category: string
  image?: string
  markdown?: string
  readingTime?: string
}

/**
 * Generate a slug from a title
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Fetch blog posts using the AI list function
 */
export async function getBlogPosts(context: any): Promise<BlogPostData[]> {
  try {
    // Dynamically import the list function
    const aiFunctions = (await import('ai-functions')) as any
    const titles = await aiFunctions.list`Generate blog post titles for ${context}`

    const posts: BlogPostData[] = []

    for await (const title of titles) {
      posts.push({
        title,
        slug: slugify(title),
        description: `This is a blog post about ${title}`,
        category: 'General',
        readingTime: '3 min read',
      })
    }

    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

/**
 * Generate blog post content using the AI function
 */
export async function getBlogPostContent(post: BlogPostData): Promise<string> {
  const aiFunctions = (await import('ai-functions')) as any

  return aiFunctions.ai`Write a blog post about ${post.title}. 
  Description: ${post.description}
  Category: ${post.category}`
}
