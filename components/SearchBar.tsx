'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = '搜索留言...',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  return (
    <div className="flex items-center gap-2">
      <Search
        className={`h-3.5 w-3.5 shrink-0 transition-colors duration-200 ${
          isFocused ? 'text-foreground' : 'text-muted-foreground'
        }`}
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="underline-input flex-1 min-w-0"
      />
      {localValue && (
        <button
          type="button"
          className="text-link-btn shrink-0"
          onClick={() => {
            setLocalValue('')
            onChange('')
          }}
        >
          清除
        </button>
      )}
    </div>
  )
}
