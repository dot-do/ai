/**
 * TextChat Component - WebSocket Chat Interface
 *
 * Real-time text chat with AI agents via WebSocket
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { $, db, send } from 'sdk.do'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TextChatProps {
  agent: 'tom' | 'amy' | 'dara' | string
  initialMessages?: Message[]
  onMessage?: (message: Message) => void
  placeholder?: string
  height?: string
}

export function TextChat({ agent: agentName, initialMessages = [], onMessage, placeholder, height = '500px' }: TextChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [session, setSession] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Connect to WebSocket
  useEffect(() => {
    const connectWebSocket = async () => {
      // Create session
      const newSession = await db.create($.AgentSession, {
        $type: $.AgentSession,
        agent: agentName,
        user: $.user.$id,
        mode: 'text_chat',
        status: 'connecting',
        started_at: new Date(),
      })

      setSession(newSession)

      // Connect to agent WebSocket
      const wsUrl = getWebSocketUrl(agentName, newSession.$id)
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)

        // Update session
        db.update($.AgentSession, newSession.$id, {
          status: 'active',
        })

        // Log event
        send($.AgentChat.started, {
          agent: agentName,
          session: newSession.$id,
          user: $.user.$id,
        })
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === 'message') {
          const message: Message = {
            id: data.id || crypto.randomUUID(),
            role: 'assistant',
            content: data.text,
            timestamp: new Date(data.timestamp),
          }

          setMessages((prev) => [...prev, message])
          setIsTyping(false)

          if (onMessage) {
            onMessage(message)
          }
        } else if (data.type === 'typing') {
          setIsTyping(data.isTyping)
        } else if (data.type === 'history') {
          // Load conversation history
          if (data.messages) {
            setMessages(data.messages)
          }
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)

        // Update session
        if (session) {
          db.update($.AgentSession, session.$id, {
            status: 'ended',
            ended_at: new Date(),
          })
        }
      }

      wsRef.current = ws
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [agentName])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !isConnected || !wsRef.current) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    // Add to messages
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Send via WebSocket
    wsRef.current.send(
      JSON.stringify({
        type: 'command',
        text: userMessage.content,
        timestamp: userMessage.timestamp.toISOString(),
      })
    )

    // Store in database
    await db.create($.Message, {
      $type: $.Message,
      session: session.$id,
      role: 'user',
      content: userMessage.content,
      timestamp: userMessage.timestamp,
    })
  }

  const clearChat = async () => {
    setMessages([])

    if (session) {
      await db.update($.AgentSession, session.$id, {
        messages_cleared: true,
      })
    }
  }

  return (
    <div className="text-chat-widget border rounded-lg bg-white shadow-lg flex flex-col" style={{ height }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <AgentAvatar agent={agentName} />
          <div>
            <h3 className="font-semibold capitalize">{agentName}</h3>
            <p className="text-xs text-gray-500">{isConnected ? 'Online' : 'Connecting...'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected && (
            <div className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-600">Connected</span>
            </div>
          )}

          <button onClick={clearChat} className="text-gray-400 hover:text-gray-600 transition-colors" title="Clear chat">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm">Start a conversation with {agentName}</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{message.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-gray-50">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder || `Message ${agentName}...`}
            disabled={!isConnected}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!isConnected || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

// Helper functions
function getWebSocketUrl(agent: string, sessionId: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = process.env.NEXT_PUBLIC_WS_HOST || `${agent}.do`

  return `${protocol}//${host}/ws?sessionId=${sessionId}`
}

function AgentAvatar({ agent }: { agent: string }) {
  const colors = {
    tom: 'bg-blue-500',
    amy: 'bg-purple-500',
    dara: 'bg-green-500',
  }

  return (
    <div className={`w-10 h-10 ${colors[agent as keyof typeof colors] || 'bg-gray-500'} rounded-full flex items-center justify-center text-white font-bold`}>
      {agent[0].toUpperCase()}
    </div>
  )
}
