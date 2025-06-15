import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { giverId, receiverId } = await request.json()

    if (!giverId || !receiverId) {
      return NextResponse.json(
        { error: 'giverId と receiverId が必要です' },
        { status: 400 }
      )
    }

    // いいねを作成（既に存在する場合は無視）
    const like = await prisma.like.upsert({
      where: {
        giverId_receiverId: {
          giverId,
          receiverId
        }
      },
      create: {
        giverId,
        receiverId
      },
      update: {}
    })

    // 相手からもいいねが来ているかチェック
    const mutualLike = await prisma.like.findUnique({
      where: {
        giverId_receiverId: {
          giverId: receiverId,
          receiverId: giverId
        }
      }
    })

    let match = null
    if (mutualLike) {
      // マッチが成立！
      match = await prisma.match.upsert({
        where: {
          user1Id_user2Id: {
            user1Id: giverId < receiverId ? giverId : receiverId,
            user2Id: giverId < receiverId ? receiverId : giverId
          }
        },
        create: {
          user1Id: giverId < receiverId ? giverId : receiverId,
          user2Id: giverId < receiverId ? receiverId : giverId,
          status: 'MATCHED',
          matchedAt: new Date()
        },
        update: {
          status: 'MATCHED',
          matchedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      like,
      match: match ? {
        id: match.id,
        matched: true,
        message: 'マッチが成立しました！🎉'
      } : null
    })
  } catch (error) {
    console.error('いいね送信エラー:', error)
    return NextResponse.json(
      { error: 'いいねの送信に失敗しました' },
      { status: 500 }
    )
  }
}