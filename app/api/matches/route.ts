import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      where: {
        status: 'MATCHED'
      },
      include: {
        user1: {
          include: {
            profile: true
          }
        },
        user2: {
          include: {
            profile: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        matchedAt: 'desc'
      }
    })

    const formattedMatches = matches.map(match => {
      const user1 = {
        id: match.user1.id,
        name: match.user1.name,
        photos: match.user1.profile?.photos ? JSON.parse(match.user1.profile.photos) : [],
        age: match.user1.profile?.age || 0
      }
      
      const user2 = {
        id: match.user2.id,
        name: match.user2.name,
        photos: match.user2.profile?.photos ? JSON.parse(match.user2.profile.photos) : [],
        age: match.user2.profile?.age || 0
      }

      const lastMessage = match.messages[0]

      return {
        id: match.id,
        user1,
        user2,
        matchedAt: match.matchedAt,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId
        } : null
      }
    })

    return NextResponse.json(formattedMatches)
  } catch (error) {
    console.error('マッチ取得エラー:', error)
    return NextResponse.json(
      { error: 'マッチの取得に失敗しました' },
      { status: 500 }
    )
  }
}