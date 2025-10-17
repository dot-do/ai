import React, { useEffect, useState } from 'react'
import { LandingPage } from '../components/LandingPage'
import { parseProjectContext, ProjectContext } from '../utils/content-parser'
import { buildAIContext, AIContext } from '../utils/context-builder'

export default function Home() {
  const [projectContext, setProjectContext] = useState<ProjectContext | null>(null)
  const [aiContext, setAiContext] = useState<AIContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjectContext = async () => {
      try {
        const response = await fetch('/api/project-context')

        if (response.ok) {
          const data = await response.json()
          setProjectContext(data.projectContext)
          setAiContext(buildAIContext(data.projectContext))
        } else {
          const defaultContext = {
            readme: '# AI Waitlist\n\nA powerful waitlist system with AI-generated landing pages.',
            aiContent: {},
            aiConfig: {
              theme: 'light',
              primaryColor: '#0070f3',
              secondaryColor: '#6366f1',
            },
          }

          setProjectContext(defaultContext)
          setAiContext(buildAIContext(defaultContext))
        }
      } catch (error) {
        console.error('Error fetching project context:', error)

        const defaultContext = {
          readme: '# AI Waitlist\n\nA powerful waitlist system with AI-generated landing pages.',
          aiContent: {},
          aiConfig: {
            theme: 'light',
            primaryColor: '#0070f3',
            secondaryColor: '#6366f1',
          },
        }

        setProjectContext(defaultContext)
        setAiContext(buildAIContext(defaultContext))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectContext()
  }, [])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Generating your AI landing page...</p>
      </div>
    )
  }

  return <main>{aiContext && <LandingPage aiContext={aiContext} showAuthButton={true} authButtonText="Join Waitlist" authButtonLink="/auth" />}</main>
}
