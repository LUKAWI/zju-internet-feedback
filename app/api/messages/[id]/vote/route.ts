import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { voteSchema } from '@/lib/validations'

async function getVoteCounts(messageId: string) {
  const likeCount = await prisma.vote.count({
    where: { messageId, type: 'like' },
  })
  return { likeCount }
}

function buildVoteResponse(
  action: 'created' | 'removed',
  voteType: string,
  sessionId: string,
  counts: { likeCount: number }
) {
  const response = NextResponse.json({
    success: true,
    data: {
      action,
      type: voteType,
      ...counts,
    },
  })

  response.cookies.set('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const result = voteSchema.safeParse(body)

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

    let sessionId = request.cookies.get('sessionId')?.value
    if (!sessionId) {
      sessionId = crypto.randomUUID()
    }

    const { id: messageId } = await params

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '留言不存在' } },
        { status: 404 }
      )
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        messageId_sessionId: {
          messageId,
          sessionId,
        },
      },
    })

    if (existingVote) {
      if (existingVote.type === result.data.type) {
        await prisma.vote.delete({
          where: { id: existingVote.id },
        })
        const counts = await getVoteCounts(messageId)
        return buildVoteResponse('removed', result.data.type, sessionId, counts)
      } else {
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: result.data.type },
        })
        const counts = await getVoteCounts(messageId)
        return buildVoteResponse('created', result.data.type, sessionId, counts)
      }
    }

    await prisma.vote.create({
      data: {
        type: result.data.type,
        sessionId,
        messageId,
      },
    })

    const counts = await getVoteCounts(messageId)
    return buildVoteResponse('created', result.data.type, sessionId, counts)
  } catch (error) {
    console.error('Failed to vote:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '投票失败' } },
      { status: 500 }
    )
  }
}
