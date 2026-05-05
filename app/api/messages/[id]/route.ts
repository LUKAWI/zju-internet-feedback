import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        votes: {
          select: { type: true },
        },
      },
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '留言不存在' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        nickname: message.nickname,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
        likeCount: message.votes.filter((v: { type: string }) => v.type === 'like').length,
        dislikeCount: message.votes.filter((v: { type: string }) => v.type === 'dislike').length,
        score: message.votes.filter((v: { type: string }) => v.type === 'like').length -
               message.votes.filter((v: { type: string }) => v.type === 'dislike').length,
      },
    })
  } catch (error) {
    console.error('Failed to fetch message:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '获取留言失败' } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const message = await prisma.message.findUnique({
      where: { id },
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '留言不存在' } },
        { status: 404 }
      )
    }

    await prisma.message.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete message:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '删除留言失败' } },
      { status: 500 }
    )
  }
}
