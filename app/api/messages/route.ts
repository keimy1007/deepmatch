import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')

    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId が必要です' },
        { status: 400 }
      )
    }

    const messages = await prisma.message.findMany({
      where: {
        matchId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('メッセージ取得エラー:', error)
    return NextResponse.json(
      { error: 'メッセージの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { matchId, senderId, receiverId, content } = await request.json()

    if (!matchId || !senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        matchId,
        senderId,
        receiverId,
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('メッセージ送信エラー:', error)
    return NextResponse.json(
      { error: 'メッセージの送信に失敗しました' },
      { status: 500 }
    )
  }
}