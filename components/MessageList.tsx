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

const MOCK_MESSAGES: Message[] = [
  { id: '1', nickname: 'ZJUer_2024', content: '图书馆的WiFi信号最近变好了很多，点赞！', createdAt: new Date(Date.now() - 3600000).toISOString(), likeCount: 128, dislikeCount: 5, score: 123 },
  { id: '2', nickname: '校园网用户', content: '希望能增加更多校园内的5G覆盖区域', createdAt: new Date(Date.now() - 7200000).toISOString(), likeCount: 89, dislikeCount: 3, score: 86 },
  { id: '3', nickname: '网络达人', content: '建议优化晚间高峰期的网络速度', createdAt: new Date(Date.now() - 14400000).toISOString(), likeCount: 256, dislikeCount: 8, score: 248 },
  { id: '4', nickname: '新生小白', content: '第一次连接校园网，感觉很方便！', createdAt: new Date(Date.now() - 21600000).toISOString(), likeCount: 67, dislikeCount: 2, score: 65 },
  { id: '5', nickname: '研究生学长', content: '实验室网络稳定性有待提高，尤其在雷雨天气时经常断网，希望能加强基础设施建设', createdAt: new Date(Date.now() - 43200000).toISOString(), likeCount: 145, dislikeCount: 12, score: 133 },
  { id: '6', nickname: '校园网老用户', content: '最近网络质量明显提升，继续保持！', createdAt: new Date(Date.now() - 86400000).toISOString(), likeCount: 198, dislikeCount: 4, score: 194 },
  { id: '7', nickname: '学霸小明', content: '教学楼A区的网络速度超快，在线学习很流畅', createdAt: new Date(Date.now() - 90000000).toISOString(), likeCount: 78, dislikeCount: 1, score: 77 },
  { id: '8', nickname: '游戏玩家', content: '晚上打游戏延迟有点高，希望能优化一下', createdAt: new Date(Date.now() - 100000000).toISOString(), likeCount: 342, dislikeCount: 15, score: 327 },
  { id: '9', nickname: '网课达人', content: '线上课程直播从不卡顿，体验很棒！', createdAt: new Date(Date.now() - 120000000).toISOString(), likeCount: 167, dislikeCount: 6, score: 161 },
]

function getMockResponse(sort: string, search: string): MessagesResponse {
  let messages = [...MOCK_MESSAGES]
  if (search) {
    const q = search.toLowerCase()
    messages = messages.filter((m) => m.content.toLowerCase().includes(q) || m.nickname.toLowerCase().includes(q))
  }
  if (sort === 'hot') {
    messages.sort((a, b) => b.score - a.score)
  } else {
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return {
    messages,
    pagination: { page: 1, limit: 20, total: messages.length, totalPages: 1, hasNext: false, hasPrev: false },
  }
}

let useMock = process.env.NODE_ENV !== "production"

async function fetchMessages({
  pageParam = 1,
  sort,
  search,
}: {
  pageParam?: number
  sort: string
  search: string
}): Promise<MessagesResponse> {
  if (useMock) return getMockResponse(sort, search)

  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: '20',
    sort,
    search,
  })

  try {
    const response = await fetch(`/api/messages?${params}`)
    if (!response.ok) throw new Error('API error')
    return response.json()
  } catch {
    useMock = true
    return getMockResponse(sort, search)
  }
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
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-8 border-b border-border last:border-b-0">
            <div className="h-7 w-7 bg-muted shrink-0" />
            <div className="flex-1 space-y-2.5 pt-0.5">
              <div className="skeleton-line skeleton-line-sm" />
              <div className="skeleton-line skeleton-line-xl" />
              <div className="skeleton-line skeleton-line-md" />
            </div>
          </div>
        ))}
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
