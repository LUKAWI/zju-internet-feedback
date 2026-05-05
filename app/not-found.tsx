import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">页面未找到</h2>
      <p className="text-muted-foreground">抱歉，您访问的页面不存在</p>
      <Link href="/" className={buttonVariants()}>
        返回首页
      </Link>
    </div>
  )
}
