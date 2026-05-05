import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createMessageSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sort = searchParams.get('sort') || 'latest'
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where = search
    ? {
        OR: [
          { content: { contains: search, mode: 'insensitive' as const } },
          { nickname: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const orderBy =
    sort === 'popular'
      ? { votes: { _count: 'desc' as const } }
      : { createdAt: 'desc' as const }

  try {
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          votes: {
            select: { type: true },
          },
        },
      }),
      prisma.message.count({ where }),
    ])

    const formattedMessages = messages.map((msg: { id: string; nickname: string; content: string; createdAt: Date; votes: { type: string }[] }) => ({
      id: msg.id,
      nickname: msg.nickname,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
      likeCount: msg.votes.filter((v: { type: string }) => v.type === 'like').length,
      dislikeCount: msg.votes.filter((v: { type: string }) => v.type === 'dislike').length,
      score: msg.votes.filter((v: { type: string }) => v.type === 'like').length -
             msg.votes.filter((v: { type: string }) => v.type === 'dislike').length,
    }))

    return NextResponse.json({
      success: true,
      data: {
        messages: formattedMessages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '获取留言失败' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = createMessageSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: result.error.issues[0].message 
          } 
        },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        nickname: result.data.nickname,
        content: result.data.content,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: message.id,
          nickname: message.nickname,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          likeCount: 0,
          dislikeCount: 0,
          score: 0,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create message:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '创建留言失败' } },
      { status: 500 }
    )
  }
}
