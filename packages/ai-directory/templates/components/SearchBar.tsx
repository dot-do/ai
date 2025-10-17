import React, { useState } from 'react'

export interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input type="text" className="search-input" placeholder="Search directory..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </form>
    </div>
  )
}
