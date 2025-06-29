'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/app/providers'
import { 
  MessageSquare, Send, User, Clock, CheckCircle2,
  AlertCircle, RefreshCw, Paperclip
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'

interface Message {
  id: string
  content: string
  type: string
  isFromAdmin: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

interface ChatComponentProps {
  projectId?: string
  title?: string
}

export default function ChatComponent({ projectId, title = 'Chat General' }: ChatComponentProps) {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const { success, error: showError } = useToast()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true)
      const url = projectId 
        ? `/api/messages?projectId=${projectId}`
        : '/api/messages'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data || [])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      showError(t('common.error'), t('dashboard.chat.messageError'))
    } finally {
      setIsLoading(false)
    }
  }, [projectId, showError, t])

  useEffect(() => {
    loadMessages()
  }, [projectId, loadMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    try {
      setIsSending(true)
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          projectId: projectId || undefined,
          type: 'TEXT'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => [...prev, data.data])
        setNewMessage('')
        success(t('dashboard.chat.messageSent'), t('dashboard.chat.messageSuccess'))
      } else {
        showError(t('common.error'), data.error || t('dashboard.chat.messageError'))
      }
    } catch (error) {
      console.error('Error sending message:', error)
      showError(t('common.error'), t('dashboard.chat.messageError'))
    } finally {
      setIsSending(false)
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return t('common.now')
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    
    return date.toLocaleDateString(t('common.locale'), { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isCurrentUser = (message: Message) => {
    // Si el mensaje es del admin y el usuario actual es admin, es mensaje propio
    if (message.isFromAdmin && session?.user?.email === 'admin@codesolutionstudio.com.mx') {
      return true
    }
    // Si el mensaje NO es del admin y el usuario actual NO es admin, es mensaje propio
    if (!message.isFromAdmin && session?.user?.email !== 'admin@codesolutionstudio.com.mx') {
      return message.user.email === session?.user?.email
    }
    // En otros casos, no es mensaje propio
    return false
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-primary-600" />
          <span className="text-gray-600">{t('dashboard.chat.loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-96 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <button
          onClick={loadMessages}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          title={t('common.refresh')}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t('dashboard.chat.empty')}</p>
            <p className="text-sm text-gray-400">{t('dashboard.chat.startConversation')}</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${isCurrentUser(message) ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md ${
                isCurrentUser(message) 
                  ? 'bg-primary-600 text-white' 
                  : message.isFromAdmin 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-gray-100 text-gray-900'
              } rounded-lg px-4 py-2`}>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex items-center space-x-1">
                    {message.isFromAdmin ? (
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {isCurrentUser(message) 
                        ? t('common.you') 
                        : message.isFromAdmin 
                          ? `${t('common.team')}` 
                          : (message.user.name || t('common.user'))
                      }
                    </span>
                  </div>
                  <span className={`text-xs ${
                    isCurrentUser(message) ? 'text-primary-200' : 'text-gray-500'
                  }`}>
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('dashboard.chat.placeholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              disabled={isSending}
            />
          </div>
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isSending ? t('dashboard.chat.sending') : t('dashboard.chat.send')}</span>
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          {projectId ? t('dashboard.chat.projectMessages') : t('dashboard.chat.generalChat')}
        </p>
      </div>
    </div>
  )
}

