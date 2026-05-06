'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { MessageCard } from './MessageCard'

interface Message {
  id: string
  nickname: string
  content: string
  createdAt: string
  likeCount: number
  dislikeCount: number
  score: number
}

interface MessageListProps {
  sort: string
  search: string
}

interface MessagesResponse {
  messages: Message[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

async function fetchMessages({
  pageParam = 1,
  sort,
  search,
}: {
  pageParam?: number
  sort: string
  search: string
}): Promise<MessagesResponse> {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: '20',
    sort,
    search,
  })

  const response = await fetch(`/api/messages?${params}`)
  if (!response.ok) throw new Error('API error')
  const json = await response.json()
  return json.data as MessagesResponse
}

export function MessageList({ sort, search }: MessageListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['messages', sort, search],
    queryFn: ({ pageParam }) => fetchMessages({ pageParam, sort, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    })

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  const messages = data?.pages.flatMap((page) => page.messages) ?? []

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground">加载失败: {error?.message}</p>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl font-light text-foreground/30">暂无留言</p>
        <p className="text-xs text-muted-foreground mt-3 tracking-wider uppercase">成为第一个发表看法的人</p>
      </div>
    )
  }

  return (
    <div>
      {messages.map((message, index) => (
        <MessageCard key={message.id} message={message} index={index} />
      ))}

      <div ref={loadMoreRef}>
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
          </div>
        )}
      </div>

      {!hasNextPage && messages.length > 0 && (
        <p className="text-center py-8 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40">
          —— FIN ——
        </p>
      )}
    </div>
  )
}
