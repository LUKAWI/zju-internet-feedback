'use client'

import { useEffect, useRef, useCallback } from 'react'
import { VoteButtons } from './VoteButtons'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  nickname: string
  content: string
  createdAt: string
  likeCount: number
  dislikeCount: number
  score: number
}

interface MessageCardProps {
  message: Message
  index?: number
}

let scrollObserver: IntersectionObserver | null = null

function getScrollObserver(): IntersectionObserver {
  if (!scrollObserver) {
    scrollObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            scrollObserver?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -24px 0px' }
    )
  }
  return scrollObserver
}

let rafPending = false

export function MessageCard({ message, index = 0 }: MessageCardProps) {
  const blockRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canHoverRef = useRef(false)

  useEffect(() => {
    canHoverRef.current = window.matchMedia('(hover: hover)').matches
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canHoverRef.current || rafPending) return

      const target = e.currentTarget
      if (!target) return

      const clientX = e.clientX
      const clientY = e.clientY

      rafPending = true
      requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect()
        const x = ((clientX - rect.left) / rect.width) * 100
        const y = ((clientY - rect.top) / rect.height) * 100
        target.style.setProperty('--mx', `${x}%`)
        target.style.setProperty('--my', `${y}%`)
        rafPending = false
      })
    },
    []
  )

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const observer = getScrollObserver()
    observer.observe(el)

    return () => {
      observer.unobserve(el)
    }
  }, [])

  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
    locale: zhCN,
  })

  const delayClass = index > 0 ? `scroll-reveal-delay-${index % 6}` : ''

  return (
    <div
      ref={wrapperRef}
      className={cn('scroll-reveal', delayClass)}
    >
      <div
        ref={blockRef}
        className="message-block reading-indicator spotlight-card"
        onMouseMove={handleMouseMove}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <span className="message-block-nickname">
            {message.nickname}
          </span>
          <span className="message-block-time">{timeAgo}</span>

          <div className="ml-auto flex items-center gap-2">
            <VoteButtons
              messageId={message.id}
              initialLikeCount={message.likeCount}
              initialDislikeCount={message.dislikeCount}
            />
            {message.score > 10 && (
              <span className="message-block-meta">热门</span>
            )}
          </div>
        </div>

        <p className="message-block-body whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  )
}
