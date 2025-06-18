'use client'

import { useState, useEffect } from 'react'
import { Heart, X, MessageCircle, User, LogIn } from 'lucide-react'
import Link from 'next/link'

interface Profile {
  id: string
  name: string
  age: number
  bio: string
  location: string
  photos: string[]
  interests: string[]
}

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles')
      const data = await response.json()
      setProfiles(data)
      setLoading(false)
    } catch (error) {
      console.error('プロフィール取得エラー:', error)
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (currentIndex < profiles.length) {
      const profile = profiles[currentIndex]
      console.log('いいね:', profile.name)
      
      try {
        // デモ用に最初のユーザーをカレントユーザーとして使用
        const currentUserId = profiles[0]?.id || 'demo-user'
        
        const response = await fetch('/api/like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            giverId: currentUserId,
            receiverId: profile.id
          })
        })
        
        const result = await response.json()
        
        if (result.match) {
          alert(result.match.message)
        }
        
        console.log('いいね結果:', result)
      } catch (error) {
        console.error('いいね送信エラー:', error)
      }
      
      nextProfile()
    }
  }

  const handlePass = () => {
    if (currentIndex < profiles.length) {
      const profile = profiles[currentIndex]
      console.log('パス:', profile.name)
      nextProfile()
    }
  }

  const nextProfile = () => {
    setCurrentIndex(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">プロフィールを読み込み中...</p>
        </div>
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">全てのプロフィールを確認しました！</h2>
          <p className="text-gray-600 mb-4">新しいメンバーが加入するまでお待ちください</p>
          <button 
            onClick={() => { setCurrentIndex(0); fetchProfiles() }}
            className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
          >
            最初から見直す
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-800">DeepMatch</h1>
          </div>
          <div className="flex space-x-2">
            {user ? (
              <>
                <Link href="/matches" className="p-2 text-gray-600 hover:text-pink-500 transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('user')
                    setUser(null)
                  }}
                  className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                >
                  <User className="h-6 w-6" />
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center space-x-1 bg-pink-500 text-white px-3 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="text-sm">ログイン</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Profile Image */}
          <div className="relative h-96 bg-gradient-to-r from-pink-200 to-purple-200">
            <img
              src={currentProfile.photos[0]}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h2 className="text-2xl font-bold text-white mb-1">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <p className="text-white/90 text-sm mb-2">📍 {currentProfile.location}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <p className="text-gray-700 mb-4 leading-relaxed">{currentProfile.bio}</p>
            
            {currentProfile.interests.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">趣味・興味</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={handlePass}
            className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-gray-300"
          >
            <X className="h-8 w-8 text-gray-500" />
          </button>
          <button
            onClick={handleLike}
            className="bg-pink-500 rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:bg-pink-600 transform hover:scale-105"
          >
            <Heart className="h-8 w-8 text-white" />
          </button>
        </div>

        {/* Progress */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {currentIndex + 1} / {profiles.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / profiles.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  )
}