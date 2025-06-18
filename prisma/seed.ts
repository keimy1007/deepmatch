import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// サクラデータ（システム側のユーザー）
const botUsers = [
  {
    name: "田中 美咲",
    email: "bot.misaki@deepmatch.app",
    age: 26,
    location: "東京都渋谷区",
    bio: "旅行と写真撮影が大好きです！週末はカフェ巡りをしています。同じ趣味の方と出会えたら嬉しいです✨",
    interests: '["旅行", "写真", "カフェ", "読書", "ヨガ"]',
    photos: '["https://picsum.photos/400/500?random=1", "https://picsum.photos/400/500?random=2", "https://picsum.photos/400/500?random=3"]',
    isBot: true
  },
  {
    name: "佐藤 健太",
    email: "bot.kenta@deepmatch.app",
    age: 29,
    location: "東京都新宿区",
    bio: "IT企業で働いています。映画鑑賞とゲームが趣味で、休日はアクティブに過ごすのが好きです。一緒に楽しめる人を探しています！",
    interests: '["映画", "ゲーム", "スポーツ", "料理", "ドライブ"]',
    photos: '["https://picsum.photos/400/500?random=4", "https://picsum.photos/400/500?random=5", "https://picsum.photos/400/500?random=6"]',
    isBot: true
  },
  {
    name: "鈴木 花音",
    email: "bot.kanon@deepmatch.app",
    age: 24,
    location: "神奈川県横浜市",
    bio: "美容師をしています💄 お洒落とスイーツが大好き！一緒にお出かけできる優しい人と出会いたいです",
    interests: '["美容", "ファッション", "スイーツ", "ショッピング", "映画"]',
    photos: '["https://picsum.photos/400/500?random=7", "https://picsum.photos/400/500?random=8", "https://picsum.photos/400/500?random=9"]',
    isBot: true
  },
  {
    name: "山田 大輔",
    email: "bot.daisuke@deepmatch.app",
    age: 31,
    location: "大阪府大阪市",
    bio: "関西出身です！お笑いと美味しい食べ物が好きで、明るい性格です。一緒に笑えるパートナーを探しています😊",
    interests: '["お笑い", "グルメ", "野球", "旅行", "音楽"]',
    photos: '["https://picsum.photos/400/500?random=10", "https://picsum.photos/400/500?random=11", "https://picsum.photos/400/500?random=12"]',
    isBot: true
  },
  {
    name: "小林 あかり",
    email: "bot.akari@deepmatch.app",
    age: 28,
    location: "愛知県名古屋市",
    bio: "看護師として働いています。動物が大好きで、休日は愛犬と散歩をしています🐕 優しくて思いやりのある方と出会いたいです",
    interests: '["動物", "散歩", "読書", "料理", "ガーデニング"]',
    photos: '["https://picsum.photos/400/500?random=13", "https://picsum.photos/400/500?random=14", "https://picsum.photos/400/500?random=15"]',
    isBot: true
  }
]

async function main() {
  console.log('🌱 サクラデータ（ボットユーザー）を投入中...')

  // Create bot users only
  for (const userData of botUsers) {
    const hashedPassword = await hash('bot-password-secure', 12)
    
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        isBot: userData.isBot,
        profile: {
          create: {
            bio: userData.bio,
            age: userData.age,
            location: userData.location,
            interests: userData.interests,
            photos: userData.photos,
            preferences: {
              ageMin: userData.age - 5,
              ageMax: userData.age + 5,
              maxDistance: 50,
              interestedIn: "all"
            }
          }
        }
      }
    })
    
    console.log(`✅ サクラユーザー作成: ${user.name}`)
  }

  console.log('🎉 サクラデータの投入が完了しました!')
  console.log('📊 データベース内容:')
  
  const userCount = await prisma.user.count()
  const botCount = await prisma.user.count({ where: { isBot: true } })
  
  console.log(`- 総ユーザー数: ${userCount}人`)
  console.log(`- サクラユーザー数: ${botCount}人`)
  console.log(`- 実際のユーザー数: ${userCount - botCount}人`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })