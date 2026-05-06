'use client'

import { VoteButtons } from './VoteButtons'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

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

export function MessageCard({ message }: MessageCardProps) {
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
    locale: zhCN,
  })

  return (
    <div className="message-block">
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
  )
}
