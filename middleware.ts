import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

const PUBLIC_ROUTES = ['/', '/api/health']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const { success, limit, remaining, reset } = await ratelimit.limit(ip)

  const response = success
    ? NextResponse.next()
    : NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: '请求过于频繁，请稍后重试',
            limit,
            remaining: 0,
            reset,
          },
        },
        { status: 429 }
      )

  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())

  return response
}

export const config = {
  matcher: ['/api/:path*'],
}
