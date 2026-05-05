'use client'

import { useCallback } from 'react'

interface SortTabsProps {
  value: string
  onChange: (value: string) => void
}

export function SortTabs({ value, onChange }: SortTabsProps) {
  const handleLatest = useCallback(() => onChange('latest'), [onChange])
  const handlePopular = useCallback(() => onChange('popular'), [onChange])

  return (
    <div className="flex items-center gap-4 text-sm">
      <button
        onClick={handleLatest}
        className={`sort-underline cursor-pointer transition-colors duration-200 ${
          value === 'latest'
            ? 'text-foreground is-active'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        最新
      </button>
      <span className="text-muted-foreground select-none">|</span>
      <button
        onClick={handlePopular}
        className={`sort-underline cursor-pointer transition-colors duration-200 ${
          value === 'popular'
            ? 'text-foreground is-active'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        最热
      </button>
    </div>
  )
}
