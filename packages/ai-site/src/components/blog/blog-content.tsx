'use client'

import React from 'react'

/**
 * Props for the BlogContent component
 */
export interface BlogContentProps {
  markdown: string
}

/**
 * Blog content component that renders markdown content
 * Uses a simple approach with dangerouslySetInnerHTML for compatibility
 */
export function BlogContent({ markdown }: BlogContentProps) {
  const htmlContent = React.useMemo(() => {
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gm, '<em>$1</em>')
      .replace(/\n\n/gm, '<br /><br />')
  }, [markdown])

  return <div className="blog-content" dangerouslySetInnerHTML={{ __html: htmlContent || '' }} />
}
