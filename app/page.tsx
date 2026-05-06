'use client'

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare } from 'lucide-react'
import { SearchBar } from '@/components/SearchBar'
import { SortTabs } from '@/components/SortTabs'
import { MessageList } from '@/components/MessageList'
import { MessageForm } from '@/components/MessageForm'
import { Danmaku } from '@/components/Danmaku'
import Intro from '@/components/Intro'
import type { CreateMessageInput } from '@/lib/validations'

const FOOTER_TEXT = '© SQTP| 浙江大学校园网络服务用户反馈平台'

export default function HomePage() {
  const [sort, setSort] = useState('latest')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const createMessage = useMutation({
    mutationFn: async (data: CreateMessageInput) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to create message')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Intro />

      <header className="sticky top-0 z-50 w-full bg-background border-b">
        <div className="mx-auto flex h-12 items-center px-6 max-w-[720px]">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-foreground/70" />
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              浙江大学校园网络服务用户反馈平台
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-6 sm:px-6">
        <section className="pt-12 sm:pt-16 pb-8">
          <Danmaku />

          <div className="mt-8 space-y-6">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="搜索留言"
            />
            <SortTabs value={sort} onChange={setSort} />
          </div>
        </section>

        <section className="pb-16">
          <MessageList sort={sort} search={search} />
        </section>

        <section className="pb-16">
          <MessageForm onSubmit={createMessage.mutateAsync} />
        </section>
      </main>

      <footer className="border-t py-8 text-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40">
          {FOOTER_TEXT}
        </p>
      </footer>
    </div>
  )
}
