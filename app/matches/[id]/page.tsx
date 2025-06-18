'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send, Heart } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  sender: {
    id: string
    name: string
  }
}

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
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [match, setMatch] = useState<Match | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [matchId, setMatchId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then(({ id }) => {
      setMatchId(id)
      fetchMatch(id)
      fetchMessages(id)
    })
  }, [params])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMatch = async (id: string) => {
    try {
      const response = await fetch('/api/matches')
      const matches = await response.json()
      const currentMatch = matches.find((m: Match) => m.id === id)
      setMatch(currentMatch)
    } catch (error) {
      console.error('マッチ取得エラー:', error)
    }
  }

  const fetchMessages = async (id: string) => {
    try {
      const response = await fetch(`/api/messages?matchId=${id}`)
      const data = await response.json()
      setMessages(data)
      setLoading(false)
    } catch (error) {
      console.error('メッセージ取得エラー:', error)
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !match) return

    setSending(true)
    
    try {
      // デモ用に最初のユーザーを現在のユーザーとして使用
      const senderId = match.user1.id
      const receiverId = match.user2.id

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: matchId,
          senderId,
          receiverId,
          content: newMessage
        })
      })

      const sentMessage = await response.json()
      
      setMessages(prev => [...prev, sentMessage])
      setNewMessage('')
    } catch (error) {
      console.error('メッセージ送信エラー:', error)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">チャットを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">マッチが見つかりません</p>
          <Link href="/matches" className="text-pink-500 hover:underline">
            マッチ一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  // デモ用に相手のユーザーを決定
  const otherUser = match.user2

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Link href="/matches" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <img
            src={otherUser.photos[0]}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">
              {otherUser.name}
            </h1>
            <p className="text-sm text-green-500">オンライン</p>
          </div>
          <Heart className="h-6 w-6 text-pink-500" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-4 py-4">
        <div className="space-y-4">
          {/* Match notification */}
          <div className="text-center py-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-pink-100">
              <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                あなたと{otherUser.name}さんがマッチしました！
              </p>
            </div>
          </div>

          {messages.map((message) => {
            const isOwnMessage = message.senderId === match.user1.id
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isOwnMessage
                      ? 'bg-pink-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-pink-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-pink-500"
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}