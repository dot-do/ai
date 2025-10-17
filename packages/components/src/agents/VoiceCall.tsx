/**
 * VoiceCall Component - VAPI Integration
 *
 * Enables voice calls with AI agents using VAPI (Voice API Platform)
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { $, db, agent, send } from 'sdk.do'

interface VoiceCallProps {
  agent: 'tom' | 'amy' | 'dara' | string
  autoStart?: boolean
  onCallStart?: (session: any) => void
  onCallEnd?: (session: any) => void
  onTranscript?: (transcript: string) => void
}

export function VoiceCall({ agent: agentName, autoStart = false, onCallStart, onCallEnd, onTranscript }: VoiceCallProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  const [session, setSession] = useState<any>(null)
  const vapiRef = useRef<any>(null)

  // Initialize VAPI
  useEffect(() => {
    const initVAPI = async () => {
      // @ts-ignore - VAPI SDK loaded via script
      const { default: Vapi } = await import('@vapi-ai/web')

      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '')

      // Event handlers
      vapiRef.current.on('call-start', () => {
        setIsConnected(true)
        setIsConnecting(false)
        console.log('Call started')
      })

      vapiRef.current.on('call-end', () => {
        setIsConnected(false)
        setIsConnecting(false)
        console.log('Call ended')
        if (session && onCallEnd) {
          onCallEnd(session)
        }
      })

      vapiRef.current.on('speech-start', () => {
        console.log('Agent speaking')
      })

      vapiRef.current.on('speech-end', () => {
        console.log('Agent finished speaking')
      })

      vapiRef.current.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcript) {
          const newTranscript = `${message.role}: ${message.transcript}`
          setTranscript((prev) => [...prev, newTranscript])
          if (onTranscript) {
            onTranscript(newTranscript)
          }
        }
      })

      vapiRef.current.on('error', (error: any) => {
        console.error('VAPI error:', error)
        setIsConnecting(false)
        setIsConnected(false)
      })
    }

    initVAPI()

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop()
      }
    }
  }, [])

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && !isConnected && !isConnecting) {
      startCall()
    }
  }, [autoStart])

  const startCall = async () => {
    if (isConnected || isConnecting) return

    setIsConnecting(true)

    try {
      // Create agent session in database
      const newSession = await db.create($.AgentSession, {
        $type: $.AgentSession,
        agent: agentName,
        user: $.user.$id,
        mode: 'voice_call',
        status: 'connecting',
        started_at: new Date(),
      })

      setSession(newSession)

      // Get agent configuration
      const agentConfig = await agent.get(agentName)

      // Start VAPI call with agent configuration
      await vapiRef.current.start({
        // Agent configuration
        model: {
          provider: 'anthropic',
          model: 'claude-sonnet-4.5',
          temperature: agentConfig.temperature || 0.7,
          systemPrompt: agentConfig.systemPrompt || `You are ${agentName}, an AI agent helping users.`,
        },

        // Voice configuration
        voice: {
          provider: 'elevenlabs',
          voiceId: getVoiceId(agentName),
        },

        // Transcription
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en',
        },

        // Call metadata
        metadata: {
          agent: agentName,
          session_id: newSession.$id,
          user_id: $.user.$id,
        },

        // First message
        firstMessage: getGreeting(agentName),
      })

      // Update session status
      await db.update($.AgentSession, newSession.$id, {
        status: 'active',
      })

      if (onCallStart) {
        onCallStart(newSession)
      }

      // Log event
      await send($.AgentCall.started, {
        agent: agentName,
        session: newSession.$id,
        user: $.user.$id,
      })
    } catch (error) {
      console.error('Failed to start call:', error)
      setIsConnecting(false)

      if (session) {
        await db.update($.AgentSession, session.$id, {
          status: 'failed',
          error: String(error),
        })
      }
    }
  }

  const endCall = async () => {
    if (!vapiRef.current || !isConnected) return

    vapiRef.current.stop()

    if (session) {
      await db.update($.AgentSession, session.$id, {
        status: 'ended',
        ended_at: new Date(),
        transcript: transcript.join('\n'),
      })

      // Log event
      await send($.AgentCall.ended, {
        agent: agentName,
        session: session.$id,
        duration: Date.now() - new Date(session.started_at).getTime(),
        transcript_length: transcript.length,
      })
    }
  }

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!vapiRef.current.isMuted())
    }
  }

  return (
    <div className="voice-call-widget border rounded-lg p-6 bg-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <AgentAvatar agent={agentName} size="lg" />
          <div>
            <h3 className="font-semibold text-lg capitalize">{agentName}</h3>
            <p className="text-sm text-gray-500">{isConnected ? 'On call' : isConnecting ? 'Connecting...' : 'Available'}</p>
          </div>
        </div>

        {isConnected && (
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="flex items-center justify-center space-x-4 my-6">
        {!isConnected ? (
          <button
            onClick={startCall}
            disabled={isConnecting}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isConnecting ? (
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            )}
          </button>
        ) : (
          <>
            <button
              onClick={toggleMute}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>

            <button
              onClick={endCall}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Live Transcript */}
      {isConnected && transcript.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Live Transcript</h4>
          <div className="max-h-40 overflow-y-auto space-y-2 text-sm">
            {transcript.map((line, i) => (
              <p key={i} className={line.startsWith('user:') ? 'text-blue-600' : 'text-gray-700'}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getVoiceId(agent: string): string {
  const voices = {
    tom: 'pNInz6obpgDQGcFmaJgB', // Professional male voice
    amy: '21m00Tcm4TlvDq8ikWAM', // Energetic female voice
    dara: 'EXAVITQu4vr4xnSDxMaL', // Calm analytical voice
  }
  return voices[agent as keyof typeof voices] || voices.tom
}

function getGreeting(agent: string): string {
  const greetings = {
    tom: "Hey! Tom here. I'm ready to help with any engineering challenges. What are you working on?",
    amy: "Hi there! Amy here. Let's talk about your marketing strategy. What's on your mind?",
    dara: 'Hello! Dara here. Ready to dive into your business metrics and operations. What should we review?',
  }
  return greetings[agent as keyof typeof greetings] || `Hi! ${agent} here. How can I help?`
}

function AgentAvatar({ agent, size = 'md' }: { agent: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const colors = {
    tom: 'bg-blue-500',
    amy: 'bg-purple-500',
    dara: 'bg-green-500',
  }

  return (
    <div
      className={`${sizeClasses[size]} ${colors[agent as keyof typeof colors] || 'bg-gray-500'} rounded-full flex items-center justify-center text-white font-bold text-lg`}
    >
      {agent[0].toUpperCase()}
    </div>
  )
}
