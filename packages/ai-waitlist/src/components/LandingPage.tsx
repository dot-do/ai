import React from 'react'
import { AI } from 'ai-props'

interface LandingPageProps {
  projectContext?: {
    projectName: string
    projectDescription: string
    features: string[]
    benefits: string[]
    callToAction: {
      text: string
      link: string
    }
    rawReadme: string
    rawAiContent: Record<string, any>
  }
  aiContext?: {
    title: string
    description: string
    features: string[]
    benefits: string[]
    cta: {
      text: string
      link: string
    }
    theme?: 'light' | 'dark'
    primaryColor?: string
    secondaryColor?: string
    rawReadme?: string
  }
  theme?: 'light' | 'dark'
  primaryColor?: string
  secondaryColor?: string
  showAuthButton?: boolean
  authButtonText?: string
  authButtonLink?: string
}

interface AIContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  features: {
    title: string
    items: Array<{
      title: string
      description: string
      icon?: string
    }>
  }
  benefits: {
    title: string
    items: Array<{
      title: string
      description: string
    }>
  }
  cta: {
    title: string
    description: string
    button: {
      text: string
      link: string
    }
  }
}

export function LandingPage({
  projectContext,
  aiContext,
  theme = 'light',
  primaryColor = '#0070f3',
  secondaryColor = '#6366f1',
  showAuthButton = false,
  authButtonText = 'Join Waitlist',
  authButtonLink = '/auth',
}: LandingPageProps) {
  // Use aiContext if provided, otherwise use projectContext
  let projectName = ''
  let projectDescription = ''
  let features: string[] = []
  let benefits: string[] = []
  let callToAction = { text: '', link: '' }
  let rawReadme = ''

  if (aiContext) {
    projectName = aiContext.title
    projectDescription = aiContext.description
    features = aiContext.features
    benefits = aiContext.benefits
    callToAction = aiContext.cta
    rawReadme = aiContext.rawReadme || ''
    theme = aiContext.theme || theme
    primaryColor = aiContext.primaryColor || primaryColor
    secondaryColor = aiContext.secondaryColor || secondaryColor
  } else if (projectContext) {
    ;({ projectName, projectDescription, features, benefits, callToAction, rawReadme } = projectContext)
  }

  return (
    <div className={`landing-page ${theme}`}>
      <AI
        model="gpt-4o"
        prompt={`Generate a landing page for a project with the following details:
        
Project Name: ${projectName}
Project Description: ${projectDescription}
Features: ${features.join(', ')}
Benefits: ${benefits.join(', ')}
Call to Action: ${callToAction.text}

Additional context from README:
${rawReadme.substring(0, 1000)}...

Generate a modern, visually appealing landing page with sections for hero, features, benefits, and call to action.
Use a ${theme} theme with ${primaryColor} as the primary color and ${secondaryColor} as the secondary color.`}
        schema={{
          hero: {
            title: 'Main heading for the landing page',
            subtitle: 'Compelling subtitle',
            description: 'Brief description of the project',
          },
          features: {
            title: 'Section title for features',
            items: [
              {
                title: 'Feature title',
                description: 'Feature description',
                icon: 'Icon name (optional)',
              },
            ],
          },
          benefits: {
            title: 'Section title for benefits',
            items: [
              {
                title: 'Benefit title',
                description: 'Benefit description',
              },
            ],
          },
          cta: {
            title: 'Call to action heading',
            description: 'Call to action description',
            button: {
              text: 'Button text',
              link: 'Button link',
            },
          },
        }}
        stream={true}
      >
        {(content: AIContent, { isStreaming }: { isStreaming: boolean }) => (
          <div className="ai-landing-page">
            {isStreaming ? (
              <div className="loading">Generating your landing page...</div>
            ) : (
              <>
                {/* Hero Section */}
                <section className="hero">
                  <h1>{content.hero.title}</h1>
                  <h2>{content.hero.subtitle}</h2>
                  <p>{content.hero.description}</p>
                  <a href={showAuthButton ? authButtonLink : callToAction.link} className="cta-button">
                    {showAuthButton ? authButtonText : callToAction.text}
                  </a>
                </section>

                {/* Features Section */}
                <section className="features">
                  <h2>{content.features.title}</h2>
                  <div className="features-grid">
                    {content.features.items.map((feature, index: number) => (
                      <div key={index} className="feature-card">
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Benefits Section */}
                <section className="benefits">
                  <h2>{content.benefits.title}</h2>
                  <div className="benefits-grid">
                    {content.benefits.items.map((benefit, index: number) => (
                      <div key={index} className="benefit-card">
                        <h3>{benefit.title}</h3>
                        <p>{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Call to Action Section */}
                <section className="cta-section">
                  <h2>{content.cta.title}</h2>
                  <p>{content.cta.description}</p>
                  <a href={content.cta.button.link || callToAction.link} className="cta-button">
                    {content.cta.button.text || callToAction.text}
                  </a>
                </section>
              </>
            )}
          </div>
        )}
      </AI>
    </div>
  )
}
