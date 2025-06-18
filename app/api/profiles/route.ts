import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get real users (non-bot users)
    const realUsers = await prisma.user.findMany({
      include: {
        profile: true
      },
      where: {
        isBot: false,
        profile: {
          isActive: true
        }
      }
    })

    // Get bot users
    const botUsers = await prisma.user.findMany({
      include: {
        profile: true
      },
      where: {
        isBot: true,
        profile: {
          isActive: true
        }
      }
    })

    // If there are few real users, include some bot users to populate the experience
    let usersToShow = realUsers
    if (realUsers.length < 3) {
      usersToShow = [...realUsers, ...botUsers.slice(0, 5 - realUsers.length)]
    }

    const profiles = usersToShow.map(user => ({
      id: user.id,
      name: user.name,
      age: user.profile?.age || 0,
      bio: user.profile?.bio || '',
      location: user.profile?.location || '',
      photos: user.profile?.photos ? JSON.parse(user.profile.photos) : [],
      interests: user.profile?.interests ? JSON.parse(user.profile.interests) : [],
      isBot: user.isBot
    }))

    // Shuffle the profiles to mix real and bot users
    const shuffledProfiles = profiles.sort(() => Math.random() - 0.5)

    return NextResponse.json(shuffledProfiles)
  } catch (error) {
    console.error('プロフィール取得エラー:', error)
    return NextResponse.json(
      { error: 'プロフィールの取得に失敗しました' },
      { status: 500 }
    )
  }
}