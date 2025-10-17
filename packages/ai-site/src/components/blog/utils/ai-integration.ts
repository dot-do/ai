/**
 * AI integration utilities for blog functionality
 */

/**
 * Generate blog post titles using the AI list function
 */
export async function generateBlogPostTitles(context: any, count: number = 10) {
  const aiFunctions = (await import('ai-functions')) as any
  return aiFunctions.list`Generate ${count} blog post titles for the following context: ${context}`
}

/**
 * Generate blog post content using the AI function
 */
export async function generateBlogPostContent(title: string, description: string, category: string) {
  const aiFunctions = (await import('ai-functions')) as any

  return aiFunctions.ai`Write a comprehensive blog post with the following details:
  Title: ${title}
  Description: ${description}
  Category: ${category}
  
  The blog post should be informative, engaging, and written in markdown format.`
}
