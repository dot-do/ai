import React, { useState } from 'react'
import { getBlogPosts, BlogPostData } from './utils/blog-data'
import { BlogCard } from './blog-card'

/**
 * Props for the BlogList component
 */
export interface BlogListProps {
  context: any
  filters?: boolean
  search?: boolean
  initialPosts?: BlogPostData[]
}

export function BlogList({ context, filters = true, search = true, initialPosts }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [posts, setPosts] = useState<BlogPostData[]>(initialPosts || [])
  const [loading, setLoading] = useState(!initialPosts)

  React.useEffect(() => {
    if (!initialPosts) {
      const fetchPosts = async () => {
        setLoading(true)
        const fetchedPosts = await getBlogPosts(context)
        setPosts(fetchedPosts)
        setLoading(false)
      }

      fetchPosts()
    }
  }, [context, initialPosts])

  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchTerm || post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = !selectedCategory || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [posts, searchTerm, selectedCategory])

  const categories = React.useMemo(() => {
    return Array.from(new Set(posts.map((post) => post.category)))
  }, [posts])

  return (
    <div className="blog-list">
      {(search || filters) && (
        <div className="blog-list-controls">
          {search && (
            <input type="text" className="blog-list-search" placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          )}

          {filters && categories.length > 0 && (
            <select className="blog-list-filter" value={selectedCategory || ''} onChange={(e) => setSelectedCategory(e.target.value || null)}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {loading ? (
        <div className="blog-list-loading">Loading posts...</div>
      ) : (
        <div className="blog-list-grid">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug || post.title} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
