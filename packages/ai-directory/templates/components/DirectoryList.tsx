import React from 'react'
import { DirectoryItem } from './DirectoryItem'

export interface DirectoryListProps {
  items: any[]
  viewMode: 'grid' | 'list'
}

export function DirectoryList({ items, viewMode = 'grid' }: DirectoryListProps) {
  const containerClass = viewMode === 'grid' ? 'directory-grid' : 'directory-list'

  return (
    <div className={containerClass}>
      {items.map((item) => (
        <DirectoryItem key={item.id} item={item} viewMode={viewMode} />
      ))}
    </div>
  )
}
