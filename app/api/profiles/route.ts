import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true
      },
      where: {
        profile: {
          isActive: true
        }
      }
    })

    const profiles = users.map(user => ({
      id: user.id,
      name: user.name,
      age: user.profile?.age || 0,
      bio: user.profile?.bio || '',
      location: user.profile?.location || '',
      photos: user.profile?.photos ? JSON.parse(user.profile.photos) : [],
      interests: user.profile?.interests ? JSON.parse(user.profile.interests) : []
    }))

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('プロフィール取得エラー:', error)
    return NextResponse.json(
      { error: 'プロフィールの取得に失敗しました' },
      { status: 500 }
    )
  }
}