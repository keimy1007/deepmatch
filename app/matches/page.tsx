'use client'

import { useState, useEffect } from 'react'
import { Heart, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

interface Match {
  id: string
  user1: {
    id: string
    name: string
    photos: string[]
    age: number
  }
  user2: {
    id: string
    name: string
    photos: string[]
    age: number
  }
  matchedAt: string
  lastMessage: {
    content: string
    createdAt: string
    senderId: string
  } | null
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches')
      const data = await response.json()
      setMatches(data)
      setLoading(false)
    } catch (error) {
      console.error('マッチ取得エラー:', error)
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'たった今'
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}日前`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">マッチを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-800">マッチ</h1>
          </div>
        </div>
      </header>

      {/* Matches List */}
      <main className="max-w-md mx-auto px-4 py-6">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">マッチがありません</h2>
            <p className="text-gray-500">いいねを送ってマッチを作りましょう！</p>
            <Link 
              href="/"
              className="inline-block mt-4 bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
            >
              プロフィールを見る
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              // デモ用に最初のユーザーを現在のユーザーとして設定
              const currentUserId = matches[0]?.user1.id || ''
              const otherUser = match.user1.id === currentUserId ? match.user2 : match.user1
              
              return (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={otherUser.photos[0]}
                          alt={otherUser.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {otherUser.name}, {otherUser.age}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(match.lastMessage?.createdAt || match.matchedAt)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                          {match.lastMessage ? match.lastMessage.content : '新しいマッチです！メッセージを送ってみましょう'}
                        </p>
                      </div>
                      
                      <Send className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}