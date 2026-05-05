'use client'

import { useState, useRef, useEffect } from 'react'

interface VoteButtonsProps {
  messageId: string
  initialLikeCount: number
  initialDislikeCount: number
}

export function VoteButtons({
  messageId,
  initialLikeCount,
  initialDislikeCount,
}: VoteButtonsProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount)
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [popTarget, setPopTarget] = useState<'like' | 'dislike' | null>(null)
  const popTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (popTimerRef.current) clearTimeout(popTimerRef.current)
    }
  }, [])

  const triggerPop = (type: 'like' | 'dislike') => {
    if (popTimerRef.current) clearTimeout(popTimerRef.current)
    setPopTarget(type)
    popTimerRef.current = setTimeout(() => setPopTarget(null), 300)
  }

  const handleVote = async (type: 'like' | 'dislike') => {
    if (isLoading) return

    const prevLike = likeCount
    const prevDislike = dislikeCount
    const prevVote = userVote

    if (userVote === type) {
      if (type === 'like') setLikeCount((prev) => prev - 1)
      else setDislikeCount((prev) => prev - 1)
      setUserVote(null)
    } else if (userVote) {
      if (type === 'like') {
        setLikeCount((prev) => prev + 1)
        setDislikeCount((prev) => prev - 1)
      } else {
        setLikeCount((prev) => prev - 1)
        setDislikeCount((prev) => prev + 1)
      }
      setUserVote(type)
    } else {
      if (type === 'like') setLikeCount((prev) => prev + 1)
      else setDislikeCount((prev) => prev + 1)
      setUserVote(type)
    }

    triggerPop(type)

    setIsLoading(true)
    try {
      const response = await fetch(`/api/messages/${messageId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) throw new Error('Vote failed')

      const data = await response.json()

      if (data.action === 'removed') {
        if (type === 'like') setLikeCount((prev) => prev - 1)
        else setDislikeCount((prev) => prev - 1)
        setUserVote(null)
      } else if (data.action === 'changed') {
        if (type === 'like') {
          setLikeCount((prev) => prev + 1)
          setDislikeCount((prev) => prev - 1)
        } else {
          setLikeCount((prev) => prev - 1)
          setDislikeCount((prev) => prev + 1)
        }
        setUserVote(type)
      } else {
        if (type === 'like') setLikeCount((prev) => prev + 1)
        else setDislikeCount((prev) => prev + 1)
        setUserVote(type)
      }
    } catch (error) {
      setLikeCount(prevLike)
      setDislikeCount(prevDislike)
      setUserVote(prevVote)
      console.error('Failed to vote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        className={`vote-tag${userVote === 'like' ? ' is-active' : ''}`}
        onClick={() => handleVote('like')}
        disabled={isLoading}
      >
        <span>+</span>
        <span className={`vote-count${popTarget === 'like' ? ' number-pop' : ''}`}>
          {likeCount}
        </span>
      </button>
      <button
        className={`vote-tag${userVote === 'dislike' ? ' is-active' : ''}`}
        onClick={() => handleVote('dislike')}
        disabled={isLoading}
      >
        <span>−</span>
        <span className={`vote-count${popTarget === 'dislike' ? ' number-pop' : ''}`}>
          {dislikeCount}
        </span>
      </button>
    </>
  )
}
