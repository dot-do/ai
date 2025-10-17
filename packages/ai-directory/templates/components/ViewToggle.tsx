import React from 'react'

export interface ViewToggleProps {
  viewMode: string
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => onViewModeChange('grid')}>
        Grid
      </button>
      <button className={viewMode === 'list' ? 'active' : ''} onClick={() => onViewModeChange('list')}>
        List
      </button>
    </div>
  )
}
