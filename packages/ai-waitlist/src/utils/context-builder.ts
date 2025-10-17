import { parseProjectContext, ProjectContext } from './content-parser.js'

/**
 * Interface for AI context
 */
export interface AIContext {
  projectName: string
  projectDescription: string
  features: string[]
  benefits: string[]
  callToAction: {
    text: string
    link: string
  }
  questions: string[]
  theme: string
  primaryColor: string
  secondaryColor: string
  rawReadme: string
  rawAiContent: Record<string, any>
}

/**
 * Build AI context for landing page generation
 * @param projectContext - Project context from README and .ai folder
 * @returns AI context for landing page generation
 */
export const buildAIContext = (projectContext: ProjectContext): AIContext => {
  const { readme, aiContent, aiConfig } = projectContext

  const projectName = extractProjectName(readme, aiContent)
  const projectDescription = extractProjectDescription(readme, aiContent)

  const features = extractFeatures(readme, aiContent)
  const benefits = extractBenefits(readme, aiContent)
  const callToAction = extractCallToAction(readme, aiContent)
  const questions = extractQuestions(readme, aiContent)

  const theme = aiConfig?.theme || 'light'
  const primaryColor = aiConfig?.primaryColor || '#0070f3'
  const secondaryColor = aiConfig?.secondaryColor || '#6366f1'

  return {
    projectName,
    projectDescription,
    features,
    benefits,
    callToAction,
    questions,
    theme,
    primaryColor,
    secondaryColor,
    rawReadme: readme,
    rawAiContent: aiContent,
  }
}

/**
 * Extract project name from README or .ai/name.md
 * @param readme - README content
 * @param aiContent - AI folder content
 * @returns Project name
 */
const extractProjectName = (readme: string, aiContent: Record<string, any>): string => {
  if (aiContent.name) {
    const name = aiContent.name.trim()
    if (name) {
      return name
    }
  }

  const headingMatch = readme.match(/^#\s+(.+)$/m)
  if (headingMatch && headingMatch[1]) {
    return headingMatch[1].trim()
  }

  return 'My Project'
}

/**
 * Extract project description from README or .ai/description.md
 * @param readme - README content
 * @param aiContent - AI folder content
 * @returns Project description
 */
const extractProjectDescription = (readme: string, aiContent: Record<string, any>): string => {
  if (aiContent.description) {
    const description = aiContent.description.trim()
    if (description) {
      return description
    }
  }

  const paragraphMatch = readme.match(/^#\s+.+\n+(.+?)(\n\n|$)/m)
  if (paragraphMatch && paragraphMatch[1]) {
    return paragraphMatch[1].trim()
  }

  return 'A description of my project'
}

/**
 * Extract features from README or .ai/features.md
 * @param readme - README content
 * @param aiContent - AI folder content
 * @returns Features array
 */
const extractFeatures = (readme: string, aiContent: Record<string, any>): string[] => {
  if (aiContent.features) {
    const features = extractListItems(aiContent.features)
    if (features.length > 0) {
      return features
    }
  }

  // Try to extract from README
  const featuresSection = readme.match(/##\s+Features\s+(.+?)(?=##|$)/s)
  if (featuresSection && featuresSection[1]) {
    const features = extractListItems(featuresSection[1])
    if (features.length > 0) {
      return features
    }
  }

  return ['Feature 1', 'Feature 2', 'Feature 3']
}

/**
 * Extract benefits from README or .ai/benefits.md
 * @param readme - README content
 * @param aiContent - AI folder content
 * @returns Benefits array
 */
const extractBenefits = (readme: string, aiContent: Record<string, any>): string[] => {
  if (aiContent.benefits) {
    const benefits = extractListItems(aiContent.benefits)
    if (benefits.length > 0) {
      return benefits
    }
  }

  // Try to extract from README
  const benefitsSection = readme.match(/##\s+Benefits\s+(.+?)(?=##|$)/s)
  if (benefitsSection && benefitsSection[1]) {
    const benefits = extractListItems(benefitsSection[1])
    if (benefits.length > 0) {
      return benefits
    }
  }

  return ['Benefit 1', 'Benefit 2', 'Benefit 3']
}

/**
 * Extract call to action from README or .ai/cta.md
 * @param readme - README content
 * @param aiContent - AI folder content
 * @returns Call to action object
 */
const extractCallToAction = (readme: string, aiContent: Record<string, any>): { text: string; link: string } => {
  if (aiContent.cta) {
    const ctaText = aiContent.cta.trim()

    try {
      const ctaJson = JSON.parse(ctaText)
      if (ctaJson.text && ctaJson.link) {
        return {
          text: ctaJson.text,
          link: ctaJson.link,
        }
      }
    } catch (e) {}

    return {
      text: ctaText || 'Join the Waitlist',
      link: '/waitlist',
    }
  }

  // Try to extract from README
  const ctaSection = readme.match(/##\s+Call\s+to\s+Action\s+(.+?)(?=##|$)/s)
  if (ctaSection && ctaSection[1]) {
    const ctaText = ctaSection[1].trim()
    return {
      text: ctaText || 'Join the Waitlist',
      link: '/waitlist',
    }
  }

  return {
    text: 'Join the Waitlist',
    link: '/waitlist',
  }
}

/**
 * Extract questions from README or .ai/questions.md
 * @param readme - README content
 * @param aiContent - AI folder content
 * @returns Questions array
 */
const extractQuestions = (readme: string, aiContent: Record<string, any>): string[] => {
  if (aiContent.questions) {
    const questions = extractListItems(aiContent.questions)
    if (questions.length > 0) {
      return questions
    }
  }

  // Try to extract from README
  const questionsSection = readme.match(/##\s+Questions\s+(.+?)(?=##|$)/s)
  if (questionsSection && questionsSection[1]) {
    const questions = extractListItems(questionsSection[1])
    if (questions.length > 0) {
      return questions
    }
  }

  return [
    'What is your primary use case?',
    'What problems are you trying to solve?',
    'How are you currently solving this problem?',
    'How large is your team?',
    'What is your timeline for implementing a solution?',
  ]
}

/**
 * Extract list items from markdown content
 * @param content - Markdown content
 * @returns Array of list items
 */
const extractListItems = (content: string): string[] => {
  return content
    .split('\n')
    .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map((line) => line.trim().replace(/^[-*]\s+/, ''))
    .filter(Boolean)
}
