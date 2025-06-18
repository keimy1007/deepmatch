import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, age, bio, location, interests } = body

    // Validation
    if (!name || !email || !password || !age) {
      return NextResponse.json(
        { error: '名前、メールアドレス、パスワード、年齢は必須です' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate random profile photos
    const randomPhotoId = Math.floor(Math.random() * 100) + 100
    const defaultPhotos = [
      `https://picsum.photos/400/500?random=${randomPhotoId}`,
      `https://picsum.photos/400/500?random=${randomPhotoId + 1}`,
      `https://picsum.photos/400/500?random=${randomPhotoId + 2}`
    ]

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isBot: false,
        profile: {
          create: {
            bio: bio || '',
            age: parseInt(age),
            location: location || '',
            interests: Array.isArray(interests) ? JSON.stringify(interests) : '[]',
            photos: JSON.stringify(defaultPhotos),
            preferences: {
              ageMin: Math.max(18, parseInt(age) - 10),
              ageMax: parseInt(age) + 10,
              maxDistance: 50,
              interestedIn: "all"
            }
          }
        }
      },
      include: {
        profile: true
      }
    })

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: removedPassword, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'ユーザー登録が完了しました',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}