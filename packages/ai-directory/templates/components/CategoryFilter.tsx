import React from 'react'

export interface CategoryFilterProps {
  categories: any[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <select className="category-select" value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name} {category.count ? `(${category.count})` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
