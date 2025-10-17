/**
 * GroupChat Component - Multi-Agent Conversations
 *
 * Enable group conversations between multiple AI agents and users
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { $, db, agent, send } from 'sdk.do'

interface Participant {
  id: string
  type: 'user' | 'agent'
  name: string
  agent?: string
  avatar?: string
}

interface GroupMessage {
  id: string
  participant: Participant
  content: string
  timestamp: Date
  mentions?: string[]
  reactions?: { emoji: string; count: number }[]
}

interface GroupChatProps {
  agents: string[]
  topic?: string
  initialParticipants?: Participant[]
  onMessage?: (message: GroupMessage) => void
  height?: string
}

export function GroupChat({ agents, topic, initialParticipants = [], onMessage, height = '600px' }: GroupChatProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    // Current user
    {
      id: $.user.$id,
      type: 'user',
      name: $.user.name || 'You',
    },
    // Agents
    ...agents.map((agentName) => ({
      id: `agent-${agentName}`,
      type: 'agent' as const,
      name: agentName.charAt(0).toUpperCase() + agentName.slice(1),
      agent: agentName,
    })),
    ...initialParticipants,
  ])

  const [messages, setMessages] = useState<GroupMessage[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [typingParticipants, setTypingParticipants] = useState<Set<string>>(new Set())
  const [conversation, setConversation] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Connect to group conversation WebSocket
  useEffect(() => {
    const connectGroupChat = async () => {
      // Create group conversation
      const newConversation = await db.create($.GroupConversation, {
        $type: $.GroupConversation,
        topic: topic || 'Group Discussion',
        participants: participants.map((p) => p.id),
        agents: agents,
        created_by: $.user.$id,
        status: 'active',
        started_at: new Date(),
      })

      setConversation(newConversation)

      // Connect to group WebSocket
      const wsUrl = getGroupWebSocketUrl(newConversation.$id)
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('Group chat connected')
        setIsConnected(true)

        // Announce participants
        send($.GroupChat.joined, {
          conversation: newConversation.$id,
          participants: participants,
        })
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === 'message') {
          const message: GroupMessage = {
            id: data.id || crypto.randomUUID(),
            participant: data.participant,
            content: data.content,
            timestamp: new Date(data.timestamp),
            mentions: data.mentions,
            reactions: data.reactions,
          }

          setMessages((prev) => [...prev, message])

          // Remove from typing
          setTypingParticipants((prev) => {
            const next = new Set(prev)
            next.delete(data.participant.id)
            return next
          })

          if (onMessage) {
            onMessage(message)
          }
        } else if (data.type === 'typing') {
          if (data.isTyping) {
            setTypingParticipants((prev) => new Set(prev).add(data.participantId))
          } else {
            setTypingParticipants((prev) => {
              const next = new Set(prev)
              next.delete(data.participantId)
              return next
            })
          }
        } else if (data.type === 'participant_joined') {
          setParticipants((prev) => [...prev, data.participant])
        } else if (data.type === 'participant_left') {
          setParticipants((prev) => prev.filter((p) => p.id !== data.participantId))
        }
      }

      ws.onerror = (error) => {
        console.error('Group chat WebSocket error:', error)
      }

      ws.onclose = () => {
        console.log('Group chat disconnected')
        setIsConnected(false)

        if (conversation) {
          db.update($.GroupConversation, conversation.$id, {
            status: 'ended',
            ended_at: new Date(),
          })
        }
      }

      wsRef.current = ws
    }

    connectGroupChat()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [agents, topic])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !isConnected || !wsRef.current) return

    // Detect mentions (@tom, @amy, @dara)
    const mentions = detectMentions(input, participants)

    const userMessage: GroupMessage = {
      id: crypto.randomUUID(),
      participant: participants[0], // Current user
      content: input.trim(),
      timestamp: new Date(),
      mentions,
    }

    // Add to messages
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Send via WebSocket
    wsRef.current.send(
      JSON.stringify({
        type: 'message',
        conversation: conversation.$id,
        participant: participants[0],
        content: userMessage.content,
        mentions: mentions,
        timestamp: userMessage.timestamp.toISOString(),
      })
    )

    // Store in database
    await db.create($.GroupMessage, {
      $type: $.GroupMessage,
      conversation: conversation.$id,
      participant: participants[0].id,
      content: userMessage.content,
      mentions: mentions,
      timestamp: userMessage.timestamp,
    })

    // If agents were mentioned, they'll respond
    if (mentions && mentions.length > 0) {
      for (const mention of mentions) {
        const mentionedAgent = participants.find((p) => p.agent === mention)
        if (mentionedAgent) {
          // Agent will receive mention and respond via WebSocket
          await send($.Agent.mentioned, {
            agent: mention,
            conversation: conversation.$id,
            message: userMessage,
          })
        }
      }
    }
  }

  const addReaction = async (messageId: string, emoji: string) => {
    wsRef.current?.send(
      JSON.stringify({
        type: 'reaction',
        messageId: messageId,
        emoji: emoji,
        participant: participants[0].id,
      })
    )
  }

  const typingIndicator = () => {
    if (typingParticipants.size === 0) return null

    const typingNames = Array.from(typingParticipants)
      .map((id) => participants.find((p) => p.id === id)?.name)
      .filter(Boolean)

    return (
      <div className="text-xs text-gray-500 italic">
        {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'} typing...
      </div>
    )
  }

  return (
    <div className="group-chat-widget border rounded-lg bg-white shadow-lg flex flex-col" style={{ height }}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{topic || 'Group Discussion'}</h3>
          <span className="text-xs text-gray-500">{participants.length} participants</span>
        </div>

        {/* Participants */}
        <div className="flex items-center space-x-2 mt-2">
          {participants.map((p) => (
            <ParticipantBadge key={p.id} participant={p} />
          ))}
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
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <p className="text-sm">Start a group conversation</p>
            <p className="text-xs mt-1">Mention agents with @tom, @amy, or @dara</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="flex space-x-3">
            <ParticipantAvatar participant={message.participant} />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-sm">{message.participant.name}</span>
                <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <p className="text-sm whitespace-pre-wrap">{highlightMentions(message.content)}</p>
              </div>
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex items-center space-x-1 mt-1">
                  {message.reactions.map((reaction, i) => (
                    <button
                      key={i}
                      onClick={() => addReaction(message.id, reaction.emoji)}
                      className="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {reaction.emoji} {reaction.count}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {typingIndicator()}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-gray-50">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message the group... (use @name to mention)"
            disabled={!isConnected}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isConnected || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">Tip: Mention agents with @tom, @amy, or @dara to get their attention</div>
      </form>
    </div>
  )
}

// Helper components and functions
function ParticipantBadge({ participant }: { participant: Participant }) {
  const colors = {
    tom: 'bg-blue-100 text-blue-700',
    amy: 'bg-purple-100 text-purple-700',
    dara: 'bg-green-100 text-green-700',
    user: 'bg-gray-100 text-gray-700',
  }

  const colorClass = participant.type === 'agent' ? colors[participant.agent as keyof typeof colors] : colors.user

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {participant.type === 'agent' && '🤖 '}
      {participant.name}
    </div>
  )
}

function ParticipantAvatar({ participant }: { participant: Participant }) {
  const colors = {
    tom: 'bg-blue-500',
    amy: 'bg-purple-500',
    dara: 'bg-green-500',
    user: 'bg-gray-500',
  }

  const colorClass = participant.type === 'agent' ? colors[participant.agent as keyof typeof colors] : colors.user

  return (
    <div className={`w-8 h-8 ${colorClass} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
      {participant.name[0].toUpperCase()}
    </div>
  )
}

function detectMentions(text: string, participants: Participant[]): string[] {
  const mentions: string[] = []
  const mentionRegex = /@(\w+)/g
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    const name = match[1].toLowerCase()
    const participant = participants.find((p) => p.name.toLowerCase() === name || p.agent === name)
    if (participant && participant.agent) {
      mentions.push(participant.agent)
    }
  }

  return mentions
}

function highlightMentions(text: string): React.ReactNode {
  const parts = text.split(/(@\w+)/g)

  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      return (
        <span key={i} className="text-blue-600 font-semibold">
          {part}
        </span>
      )
    }
    return part
  })
}

function getGroupWebSocketUrl(conversationId: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = process.env.NEXT_PUBLIC_GROUP_WS_HOST || 'group.do'

  return `${protocol}//${host}/ws?conversation=${conversationId}`
}

// Companion component for inviting to group chats
export function GroupChatInvite({
  agents,
  topic,
  agenda,
  scheduleSuggestions,
}: {
  agents: string[]
  topic: string
  agenda?: string[]
  scheduleSuggestions?: { day: string; time: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  const startGroupChat = async () => {
    // Create and open group chat
    setIsOpen(true)

    await send($.GroupChat.created, {
      agents: agents,
      topic: topic,
      creator: $.user.$id,
    })
  }

  return (
    <div className="group-chat-invite border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <h3 className="text-lg font-semibold mb-2">{topic}</h3>

      {agenda && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Agenda:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {agenda.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm text-gray-600">With:</span>
        {agents.map((agent) => (
          <span key={agent} className="px-2 py-1 bg-white rounded-full text-xs font-medium">
            🤖 {agent}
          </span>
        ))}
      </div>

      <button onClick={startGroupChat} className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
        Start Group Chat
      </button>

      {isOpen && <GroupChat agents={agents} topic={topic} />}
    </div>
  )
}
