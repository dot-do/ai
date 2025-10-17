import { NextApiRequest, NextApiResponse } from 'next'
import { parseProjectContext, ProjectContext } from '../../utils/content-parser'
import { buildAIContext } from '../../utils/context-builder'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const projectContext: ProjectContext = {
      readme: '# AI Waitlist\n\nA powerful waitlist system with AI-generated landing pages.',
      aiContent: {
        features: '- AI-powered landing page generation\n- Authentication via oauth.do\n- Multi-step onboarding flow\n- Product-solution fit assessment',
        benefits: '- Save time creating landing pages\n- Collect valuable user feedback\n- Identify ideal customers\n- Streamline your waitlist process',
        cta: 'Join Waitlist',
      },
      projectName: 'AI Waitlist',
      projectDescription: 'A powerful waitlist system with AI-generated landing pages',
      aiConfig: {
        theme: 'light',
        primaryColor: '#0070f3',
        secondaryColor: '#6366f1',
        prioritizeAiContent: true,
      },
    }

    return res.status(200).json({
      projectContext,
      aiContext: buildAIContext(projectContext),
    })
  } catch (error) {
    console.error('Error generating project context:', error)
    return res.status(500).json({ error: 'Failed to generate project context' })
  }
}
