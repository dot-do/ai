import React from 'react'

export interface DirectoryItemProps {
  item: any
  viewMode: 'grid' | 'list'
}

export function DirectoryItem({ item, viewMode = 'grid' }: DirectoryItemProps) {
  const { id, name, description, image, category } = item

  return (
    <a href={`/${id}`} className="directory-item-link">
      <div className={`directory-item directory-item-${viewMode}`}>
        {image && <img src={image} alt={name} className="directory-item-image" />}

        <h2>{name}</h2>

        {category && <div className="item-category">{category}</div>}

        {description && <p>{description.length > 150 ? `${description.substring(0, 150)}...` : description}</p>}

        <div className="item-link">View Details &rarr;</div>
      </div>
    </a>
  )
}
