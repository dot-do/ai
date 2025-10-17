'use client'

import React, { useState, useEffect } from 'react'
import { DirectoryList } from '../components/DirectoryList'
import { SearchBar } from '../components/SearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { Pagination } from '../components/Pagination'
import { ViewToggle } from '../components/ViewToggle'

export default function DirectoryPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams()
        params.append('page', currentPage.toString())
        params.append('limit', itemsPerPage.toString())

        if (searchQuery) {
          params.append('search', searchQuery)
        }

        if (selectedCategory) {
          params.append('category', selectedCategory)
        }

        const response = await fetch(`/api/directory?${params.toString()}`)
        const data = await response.json()

        setItems(data.items || [])
        setTotalItems(data.total || 0)

        if (!data.categories) {
          const categoriesResponse = await fetch('/api/directory/categories')
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || [])
        } else {
          setCategories(data.categories)
        }

        setError(null)
      } catch (err) {
        setError('Failed to load directory data')
        console.error('Error fetching directory data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, itemsPerPage, searchQuery, selectedCategory])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page on category change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  return (
    <div className="container">
      <h1 className="title">Directory</h1>
      <p className="description">Browse our collection of items</p>

      <div className="directory-controls">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
        <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
      </div>

      {loading ? (
        <p>Loading directory items...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : items.length === 0 ? (
        <p>No items found. Try adjusting your search or filters.</p>
      ) : (
        <>
          <DirectoryList items={items} viewMode={viewMode} />

          <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}
