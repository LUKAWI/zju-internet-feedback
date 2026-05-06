'use client'

import { useState, useEffect, useRef } from 'react'

interface DanmakuMessage {
  id: string
  nickname: string
  content: string
  createdAt: string
  likeCount: number
  dislikeCount: number
}

const MAX_DANMAKU = 7
const MAX_CONTENT_LENGTH = 30
const SPEEDS = ['danmaku-speed-fast', 'danmaku-speed-normal', 'danmaku-speed-slow']
const DESKTOP_LANE_COUNT = 3
const MOBILE_LANE_COUNT = 2
const DESKTOP_HEIGHT = 140
const MOBILE_HEIGHT = 120

function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max) + '…'
}

function pickNext(messages: DanmakuMessage[], excludeIds: Set<string>): DanmakuMessage | null {
  const available = messages.filter((m) => !excludeIds.has(m.id))
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

interface ItemState {
  id: string
  message: DanmakuMessage
  top: number
  speedClass: string
  key: number
  lane: number
}

export function Danmaku() {
  const [items, setItems] = useState<ItemState[]>([])
  const messagesRef = useRef<DanmakuMessage[]>([])
  const containerHeight = useRef(DESKTOP_HEIGHT)
  const laneCount = useRef(DESKTOP_LANE_COUNT)
  const itemsRef = useRef<ItemState[]>([])
  const keyCounterRef = useRef(0)

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth <= 640
      containerHeight.current = mobile ? MOBILE_HEIGHT : DESKTOP_HEIGHT
      laneCount.current = mobile ? MOBILE_LANE_COUNT : DESKTOP_LANE_COUNT
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    fetch('/api/messages?limit=50')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.messages?.length) {
          messagesRef.current = data.data.messages
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    const timer = setInterval(() => {
      const current = itemsRef.current
      if (current.length >= MAX_DANMAKU) return

      const excludeIds = new Set(current.map((i) => i.id))
      const msg = pickNext(messagesRef.current, excludeIds)
      if (!msg) return

      const lanes = laneCount.current
      const occupied = new Set(current.map((i) => i.lane))

      let lane = -1
      const preferred = keyCounterRef.current % lanes
      if (!occupied.has(preferred)) {
        lane = preferred
      } else {
        for (let i = 0; i < lanes; i++) {
          if (!occupied.has(i)) {
            lane = i
            break
          }
        }
      }
      if (lane === -1) return

      keyCounterRef.current += 1
      const laneHeight = containerHeight.current / lanes
      const top = 2 + lane * laneHeight
      const speedClass = SPEEDS[current.length % SPEEDS.length]

      setItems((prev) => [
        ...prev,
        { id: msg.id, message: msg, top, speedClass, key: keyCounterRef.current, lane },
      ])
    }, 1400)

    return () => clearInterval(timer)
  }, [])

  const handleAnimationEnd = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="danmaku-container">
      {items.map((item) => (
        <div
          key={item.key}
          className={`danmaku-item ${item.speedClass}`}
          style={{ top: `${item.top}px` }}
          onAnimationEnd={() => handleAnimationEnd(item.id)}
        >
          <div className="danmaku-content">
            <span className="danmaku-username">{item.message.nickname}</span>
            <span className="danmaku-text">{truncate(item.message.content, MAX_CONTENT_LENGTH)}</span>
          </div>
          <div className="danmaku-tooltip">{item.message.content}</div>
        </div>
      ))}
    </div>
  )
}
