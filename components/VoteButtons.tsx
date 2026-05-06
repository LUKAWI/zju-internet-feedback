'use client'

import { useState, useRef, useEffect } from 'react'
import { Heart } from 'lucide-react'

interface VoteButtonsProps {
  messageId: string
  initialLikeCount: number
}

export function VoteButtons({
  messageId,
  initialLikeCount,
}: VoteButtonsProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [userVote, setUserVote] = useState<'like' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [popTarget, setPopTarget] = useState<'like' | null>(null)
  const popTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (popTimerRef.current) clearTimeout(popTimerRef.current)
    }
  }, [])

  const triggerPop = () => {
    if (popTimerRef.current) clearTimeout(popTimerRef.current)
    setPopTarget('like')
    popTimerRef.current = setTimeout(() => setPopTarget(null), 300)
  }

  const handleVote = async () => {
    if (isLoading) return

    const prevLike = likeCount
    const prevVote = userVote

    if (userVote === 'like') {
      setLikeCount((prev) => prev - 1)
      setUserVote(null)
    } else {
      setLikeCount((prev) => prev + 1)
      setUserVote('like')
    }

    triggerPop()

    setIsLoading(true)
    try {
      const response = await fetch(`/api/messages/${messageId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' }),
      })

      if (!response.ok) throw new Error('Vote failed')

      const json = await response.json()
      const resolved = json.data

      setLikeCount(resolved.likeCount)

      if (resolved.action === 'removed') {
        setUserVote(null)
      } else {
        setUserVote('like')
      }
    } catch (error) {
      setLikeCount(prevLike)
      setUserVote(prevVote)
      console.error('Failed to vote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      className={`vote-tag${userVote === 'like' ? ' is-active' : ''}`}
      onClick={handleVote}
      disabled={isLoading}
    >
      <Heart
        className={`h-3.5 w-3.5${userVote === 'like' ? ' fill-current' : ''}`}
      />
      <span className={`vote-count${popTarget === 'like' ? ' number-pop' : ''}`}>
        {likeCount}
      </span>
    </button>
  )
}
