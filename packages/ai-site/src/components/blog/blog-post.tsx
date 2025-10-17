import React, { useState, useEffect } from 'react'
import { getBlogPostContent, BlogPostData } from './utils/blog-data'
import { BlogContent } from './blog-content'
import { BlogCard } from './blog-card'

/**
 * Props for the BlogPost component
 */
export interface BlogPostProps {
  post: BlogPostData
  showRelatedPosts?: boolean
  relatedPosts?: BlogPostData[]
}

export function BlogPost({ post, showRelatedPosts = false, relatedPosts = [] }: BlogPostProps) {
  const [postContent, setPostContent] = useState<string | undefined>(post.markdown)
  const [loading, setLoading] = useState(!post.markdown)

  useEffect(() => {
    if (!postContent) {
      const generateContent = async () => {
        setLoading(true)
        try {
          const content = await getBlogPostContent(post)
          setPostContent(content)
        } catch (error) {
          console.error('Error generating blog post content:', error)
        } finally {
          setLoading(false)
        }
      }

      generateContent()
    }
  }, [post, postContent])

  return (
    <div className="blog-post">
      <h1 className="blog-post-title">{post.title}</h1>

      <div className="blog-post-meta">
        <span className="blog-post-category">{post.category}</span>
        {post.readingTime && <span className="blog-post-reading-time">{post.readingTime}</span>}
      </div>

      {post.image && (
        <div className="blog-post-image">
          <img src={post.image} alt={post.title} className="blog-post-img" />
        </div>
      )}

      {loading ? <div className="blog-post-loading">Loading content...</div> : <BlogContent markdown={postContent || ''} />}

      {showRelatedPosts && relatedPosts.length > 0 && (
        <div className="blog-post-related">
          <h2 className="blog-post-related-title">Related Posts</h2>
          <div className="blog-post-related-list">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.slug || relatedPost.title} post={relatedPost} compact={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
