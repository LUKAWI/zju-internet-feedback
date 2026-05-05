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

const isProduction = process.env.NODE_ENV === "production"

const MOCK_MESSAGES: DanmakuMessage[] = [
  { id: '1', nickname: 'ZJUer_2024', content: '图书馆的WiFi信号最近变好了很多，点赞！', createdAt: new Date().toISOString(), likeCount: 128, dislikeCount: 5 },
  { id: '2', nickname: '校园网用户', content: '希望能增加更多校园内的5G覆盖区域', createdAt: new Date().toISOString(), likeCount: 89, dislikeCount: 3 },
  { id: '3', nickname: '网络达人', content: '建议优化晚间高峰期的网络速度', createdAt: new Date().toISOString(), likeCount: 256, dislikeCount: 8 },
  { id: '4', nickname: '新生小白', content: '第一次连接校园网，感觉很方便！', createdAt: new Date().toISOString(), likeCount: 67, dislikeCount: 2 },
  { id: '5', nickname: '研究生学长', content: '实验室网络稳定性有待提高', createdAt: new Date().toISOString(), likeCount: 145, dislikeCount: 12 },
  { id: '6', nickname: '校园网老用户', content: '最近网络质量明显提升，继续保持！', createdAt: new Date().toISOString(), likeCount: 198, dislikeCount: 4 },
  { id: '7', nickname: '学霸小明', content: '教学楼A区的网络速度超快，在线学习很流畅', createdAt: new Date().toISOString(), likeCount: 78, dislikeCount: 1 },
  { id: '8', nickname: '游戏玩家', content: '晚上打游戏延迟有点高，希望能优化一下', createdAt: new Date().toISOString(), likeCount: 342, dislikeCount: 15 },
  { id: '9', nickname: '网课达人', content: '线上课程直播从不卡顿，体验很棒！', createdAt: new Date().toISOString(), likeCount: 167, dislikeCount: 6 },
  { id: '10', nickname: '科研工作者', content: '下载论文速度很快，支持校园网！', createdAt: new Date().toISOString(), likeCount: 98, dislikeCount: 3 },
  { id: '11', nickname: '校园博主', content: '上传视频到B站速度不错，点赞！', createdAt: new Date().toISOString(), likeCount: 134, dislikeCount: 4 },
  { id: '12', nickname: '期末复习党', content: '图书馆自习时网络稳定，学习效率高', createdAt: new Date().toISOString(), likeCount: 215, dislikeCount: 8 },
  { id: '13', nickname: '远程办公族', content: '在家连接校园VPN很方便，远程办公无忧', createdAt: new Date().toISOString(), likeCount: 87, dislikeCount: 2 },
  { id: '14', nickname: '视频会议达人', content: 'Zoom会议从不掉线，网络质量给力', createdAt: new Date().toISOString(), likeCount: 156, dislikeCount: 5 },
  { id: '15', nickname: '萌新小白', content: '校园网连接教程很详细，轻松上手', createdAt: new Date().toISOString(), likeCount: 45, dislikeCount: 1 },
]


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

let globalKey = 0

export function Danmaku() {
  const [items, setItems] = useState<ItemState[]>([])
  const messagesRef = useRef<DanmakuMessage[]>(isProduction ? [] : MOCK_MESSAGES)
  const containerHeight = useRef(DESKTOP_HEIGHT)
  const laneCount = useRef(DESKTOP_LANE_COUNT)
  const itemsRef = useRef<ItemState[]>([])

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
        if (data?.messages?.length) {
          messagesRef.current = data.messages
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
      const preferred = globalKey % lanes
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

      globalKey += 1
      const laneHeight = containerHeight.current / lanes
      const top = 2 + lane * laneHeight
      const speedClass = SPEEDS[current.length % SPEEDS.length]

      setItems((prev) => [
        ...prev,
        { id: msg.id, message: msg, top, speedClass, key: globalKey, lane },
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
