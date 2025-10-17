import { parseProjectContext } from '../../utils/content-parser.js'
import { buildAIContext } from '../../utils/context-builder.js'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

interface LandingPageOptions {
  projectDir?: string
  theme?: 'light' | 'dark'
  primaryColor?: string
  secondaryColor?: string
}

export const generateLandingPage = async (options: LandingPageOptions = {}) => {
  const { projectDir = process.cwd(), theme = 'light', primaryColor = '#0070f3', secondaryColor = '#6366f1' } = options

  console.log('Parsing project context...')
  const projectContext = parseProjectContext(projectDir)

  console.log('Building AI context...')
  const aiContext = buildAIContext(projectContext)

  aiContext.theme = theme
  aiContext.primaryColor = primaryColor
  aiContext.secondaryColor = secondaryColor

  return { projectContext, aiContext }
}

interface AuthOptions {
  providers?: string[]
  callbackUrl?: string
}

export const setupAuth = (options: AuthOptions = {}) => {
  const { providers = ['github', 'google'], callbackUrl = '/onboarding' } = options

  return {
    providers,
    callbackUrl,
    routes: {
      signIn: '/auth',
      signOut: '/auth/signout',
      callback: '/api/auth/callback',
      error: '/auth/error',
    },
  }
}

interface Question {
  id: string
  question: string
  type: 'text' | 'select' | 'radio' | 'checkbox'
  options?: string[]
  required?: boolean
}

interface OnboardingOptions {
  questions?: Question[]
  onComplete?: (answers: Record<string, string>) => void
}

export const createOnboardingFlow = (options: OnboardingOptions = {}) => {
  const { questions = [], onComplete } = options

  const defaultQuestions: Question[] = [
    {
      id: 'useCase',
      question: 'What is your primary use case?',
      type: 'text',
      required: true,
    },
    {
      id: 'painPoints',
      question: 'What problems are you trying to solve?',
      type: 'text',
      required: true,
    },
    {
      id: 'teamSize',
      question: 'How large is your team?',
      type: 'select',
      options: ['1-5', '6-20', '21-100', '100+'],
      required: true,
    },
  ]

  return {
    questions: questions.length > 0 ? questions : defaultQuestions,
    onComplete,
  }
}

interface AiWaitlistAppOptions {
  outputDir?: string
  theme?: 'light' | 'dark'
  primaryColor?: string
  secondaryColor?: string
  auth?: AuthOptions
  onboarding?: OnboardingOptions
}

export const createAiWaitlistApp = async (options: AiWaitlistAppOptions = {}) => {
  const { outputDir = './ai-waitlist-app', theme = 'light', primaryColor = '#0070f3', secondaryColor = '#6366f1' } = options

  console.log('Creating AI Waitlist app...')

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const { projectContext, aiContext } = await generateLandingPage({
    projectDir: process.cwd(),
    theme,
    primaryColor,
    secondaryColor,
  })

  const authConfig = setupAuth(options.auth || {})

  const onboardingFlow = createOnboardingFlow(options.onboarding || {})

  fs.writeFileSync(path.join(outputDir, 'ai-waitlist-config.json'), JSON.stringify({ aiContext, authConfig, onboardingFlow }, null, 2))

  console.log('AI Waitlist app created successfully!')
  console.log(`Configuration saved to ${path.join(outputDir, 'ai-waitlist-config.json')}`)

  return { outputDir, aiContext, authConfig, onboardingFlow }
}

export async function cli() {
  console.log('AI Waitlist - Generate AI-powered landing pages with authentication and onboarding')

  try {
    const result = await createAiWaitlistApp()
    console.log('AI Waitlist landing page generated successfully!')
    console.log(`Configuration saved to ${result.outputDir}/ai-waitlist-config.json`)
  } catch (error) {
    console.error('Error generating AI Waitlist app:', error)
    process.exit(1)
  }
}
