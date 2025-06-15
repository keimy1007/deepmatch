import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const sampleUsers = [
  {
    name: "田中 美咲",
    email: "misaki.tanaka@example.com",
    age: 26,
    location: "東京都渋谷区",
    bio: "旅行と写真撮影が大好きです！週末はカフェ巡りをしています。同じ趣味の方と出会えたら嬉しいです✨",
    interests: '["旅行", "写真", "カフェ", "読書", "ヨガ"]',
    photos: '["https://picsum.photos/400/500?random=1", "https://picsum.photos/400/500?random=2", "https://picsum.photos/400/500?random=3"]'
  },
  {
    name: "佐藤 健太",
    email: "kenta.sato@example.com",
    age: 29,
    location: "東京都新宿区",
    bio: "IT企業で働いています。映画鑑賞とゲームが趣味で、休日はアクティブに過ごすのが好きです。一緒に楽しめる人を探しています！",
    interests: '["映画", "ゲーム", "スポーツ", "料理", "ドライブ"]',
    photos: '["https://picsum.photos/400/500?random=4", "https://picsum.photos/400/500?random=5", "https://picsum.photos/400/500?random=6"]'
  },
  {
    name: "鈴木 花音",
    email: "kanon.suzuki@example.com",
    age: 24,
    location: "神奈川県横浜市",
    bio: "美容師をしています💄 お洒落とスイーツが大好き！一緒にお出かけできる優しい人と出会いたいです",
    interests: '["美容", "ファッション", "スイーツ", "ショッピング", "映画"]',
    photos: '["https://picsum.photos/400/500?random=7", "https://picsum.photos/400/500?random=8", "https://picsum.photos/400/500?random=9"]'
  },
  {
    name: "山田 大輔",
    email: "daisuke.yamada@example.com",
    age: 31,
    location: "大阪府大阪市",
    bio: "関西出身です！お笑いと美味しい食べ物が好きで、明るい性格です。一緒に笑えるパートナーを探しています😊",
    interests: '["お笑い", "グルメ", "野球", "旅行", "音楽"]',
    photos: '["https://picsum.photos/400/500?random=10", "https://picsum.photos/400/500?random=11", "https://picsum.photos/400/500?random=12"]'
  },
  {
    name: "小林 あかり",
    email: "akari.kobayashi@example.com",
    age: 28,
    location: "愛知県名古屋市",
    bio: "看護師として働いています。動物が大好きで、休日は愛犬と散歩をしています🐕 優しくて思いやりのある方と出会いたいです",
    interests: '["動物", "散歩", "読書", "料理", "ガーデニング"]',
    photos: '["https://picsum.photos/400/500?random=13", "https://picsum.photos/400/500?random=14", "https://picsum.photos/400/500?random=15"]'
  },
  {
    name: "伊藤 翔太",
    email: "shota.ito@example.com",
    age: 27,
    location: "埼玉県さいたま市",
    bio: "エンジニアです。プログラミングとバンド活動をしています🎸 音楽好きな方と一緒に過ごしたいです",
    interests: '["音楽", "バンド", "プログラミング", "ゲーム", "アニメ"]',
    photos: '["https://picsum.photos/400/500?random=16", "https://picsum.photos/400/500?random=17", "https://picsum.photos/400/500?random=18"]'
  },
  {
    name: "中村 咲良",
    email: "sakura.nakamura@example.com",
    age: 25,
    location: "福岡県福岡市",
    bio: "アパレル店員をしています👗 ファッションとアートが好きで、美術館によく行きます。感性豊かな方と出会えたらと思います",
    interests: '["ファッション", "アート", "美術館", "ダンス", "カフェ"]',
    photos: '["https://picsum.photos/400/500?random=19", "https://picsum.photos/400/500?random=20", "https://picsum.photos/400/500?random=21"]'
  },
  {
    name: "高橋 隆司",
    email: "takashi.takahashi@example.com",
    age: 30,
    location: "北海道札幌市",
    bio: "スキーインストラクターをしています⛷️ アウトドアが大好きで、自然の中で過ごすのが一番です！アクティブな方歓迎",
    interests: '["スキー", "登山", "キャンプ", "写真", "自然"]',
    photos: '["https://picsum.photos/400/500?random=22", "https://picsum.photos/400/500?random=23", "https://picsum.photos/400/500?random=24"]'
  },
  {
    name: "渡辺 由美",
    email: "yumi.watanabe@example.com",
    age: 26,
    location: "京都府京都市",
    bio: "京都で日本文化を学んでいます。茶道と書道を習っています🍵 和文化に興味のある方とお話したいです",
    interests: '["茶道", "書道", "和文化", "神社仏閣", "着物"]',
    photos: '["https://picsum.photos/400/500?random=25", "https://picsum.photos/400/500?random=26", "https://picsum.photos/400/500?random=27"]'
  },
  {
    name: "松本 勇太",
    email: "yuta.matsumoto@example.com",
    age: 32,
    location: "宮城県仙台市",
    bio: "会社員です。サッカーと筋トレが趣味で、健康的な生活を心がけています⚽ 一緒に運動を楽しめる方を探しています",
    interests: '["サッカー", "筋トレ", "ランニング", "料理", "映画"]',
    photos: '["https://picsum.photos/400/500?random=28", "https://picsum.photos/400/500?random=29", "https://picsum.photos/400/500?random=30"]'
  }
]

async function main() {
  console.log('🌱 データベースにサンプルデータを投入中...')

  // Create users and profiles
  for (const userData of sampleUsers) {
    const hashedPassword = await hash('password123', 12)
    
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
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
    
    console.log(`✅ ユーザー作成: ${user.name}`)
  }

  // Create some likes
  const users = await prisma.user.findMany()
  const likePairs = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 0],
    [0, 3], [1, 4], [2, 5], [3, 6], [4, 7]
  ]

  for (const [giverIndex, receiverIndex] of likePairs) {
    try {
      await prisma.like.create({
        data: {
          giverId: users[giverIndex].id,
          receiverId: users[receiverIndex].id
        }
      })
    } catch (error) {
      console.error(`❌ いいね作成エラー:`, error)
    }
  }

  // Create mutual matches
  const mutualMatches = [
    [0, 1], [2, 3], [4, 5], [6, 7]
  ]

  for (const [user1Index, user2Index] of mutualMatches) {
    try {
      // Create mutual likes first using upsert to avoid duplicates
      await prisma.like.upsert({
        where: {
          giverId_receiverId: {
            giverId: users[user1Index].id,
            receiverId: users[user2Index].id
          }
        },
        create: {
          giverId: users[user1Index].id,
          receiverId: users[user2Index].id
        },
        update: {}
      })
      
      await prisma.like.upsert({
        where: {
          giverId_receiverId: {
            giverId: users[user2Index].id,
            receiverId: users[user1Index].id
          }
        },
        create: {
          giverId: users[user2Index].id,
          receiverId: users[user1Index].id
        },
        update: {}
      })

      // Create match
      const match = await prisma.match.create({
        data: {
          user1Id: users[user1Index].id,
          user2Id: users[user2Index].id,
          status: 'MATCHED',
          matchedAt: new Date()
        }
      })

      console.log(`💕 マッチ作成: ${users[user1Index].name} ⭐ ${users[user2Index].name}`)

      // Add some messages
      const messages = [
        `こんにちは！${users[user2Index].name}さん、はじめまして😊`,
        `こんにちは！よろしくお願いします✨`,
        `プロフィール見させていただきました！共通の趣味がありそうですね`,
        `そうですね！今度お時間があるときにお話しできればと思います`,
        `ぜひ！楽しみにしています😊`
      ]

      for (let i = 0; i < messages.length; i++) {
        await prisma.message.create({
          data: {
            matchId: match.id,
            senderId: i % 2 === 0 ? users[user1Index].id : users[user2Index].id,
            receiverId: i % 2 === 0 ? users[user2Index].id : users[user1Index].id,
            content: messages[i],
            isRead: i < messages.length - 1
          }
        })
      }
    } catch (error) {
      console.error(`❌ マッチ作成エラー:`, error)
    }
  }

  console.log('🎉 サンプルデータの投入が完了しました!')
  console.log('📊 データベース内容:')
  
  const userCount = await prisma.user.count()
  const likeCount = await prisma.like.count()
  const matchCount = await prisma.match.count()
  const messageCount = await prisma.message.count()
  
  console.log(`- ユーザー: ${userCount}人`)
  console.log(`- いいね: ${likeCount}件`)
  console.log(`- マッチ: ${matchCount}件`)
  console.log(`- メッセージ: ${messageCount}件`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })