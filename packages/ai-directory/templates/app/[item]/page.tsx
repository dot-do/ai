'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const itemId = params?.item

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/directory/${itemId}`)

        if (!response.ok) {
          throw new Error('Item not found')
        }

        const data = await response.json()
        setItem(data)
        setError(null)
      } catch (err) {
        setError('Failed to load item details')
        console.error('Error fetching item details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [itemId])

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="container">
        <p>Loading item details...</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="container">
        <p className="error">{error || 'Item not found'}</p>
        <button onClick={handleBack} className="back-button">
          Back to Directory
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <button onClick={handleBack} className="back-button">
        &larr; Back to Directory
      </button>

      <div className="item-detail">
        {item.image && <img src={item.image} alt={item.name} className="item-detail-image" />}

        <h1 className="item-detail-title">{item.name}</h1>

        {item.category && <div className="item-category">Category: {item.category}</div>}

        {item.description && <p className="item-description">{item.description}</p>}

        {item.tags && item.tags.length > 0 && (
          <div className="item-tags">
            {item.tags.map((tag: string) => (
              <span key={tag} className="item-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Render additional item properties */}
        <div className="item-properties">
          {Object.entries(item).map(([key, value]) => {
            if (['id', 'name', 'description', 'image', 'category', 'tags'].includes(key) || typeof value === 'object') {
              return null
            }

            return (
              <div key={key} className="item-property">
                <strong>{key}:</strong> {String(value)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
