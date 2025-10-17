import React from 'react'
import type { BlogPostData } from './utils/blog-data'

/**
 * Props for the BlogCard component
 */
export interface BlogCardProps {
  post: BlogPostData
  compact?: boolean
}

export function BlogCard({ post, compact = false }: BlogCardProps) {
  return (
    <div className="blog-card">
      {post.image && (
        <div className="blog-card-image">
          <img src={post.image} alt={post.title} className="blog-card-img" />
        </div>
      )}
      <div className="blog-card-content">
        <h3 className="blog-card-title">{post.title}</h3>
        {!compact && <p className="blog-card-description">{post.description}</p>}
        <div className="blog-card-footer">
          <span className="blog-card-category">{post.category}</span>
          {post.readingTime && <span className="blog-card-reading-time">{post.readingTime}</span>}
        </div>
      </div>
    </div>
  )
}
