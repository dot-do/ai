import { NextApiResponse } from 'next'
import { withAuth, withSession } from '../../../lib/auth/api-routes'

import type { AuthApiRequest } from '../../../lib/auth/api-routes'

interface OnboardingSubmission {
  userId: string
  answers: Record<string, string>
  submittedAt: string
}

const submissions: OnboardingSubmission[] = []

const handler = async (req: AuthApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { answers } = req.body
    const user = req.session?.user

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    if (!answers || typeof answers !== 'object') {
      res.status(400).json({ error: 'Invalid answers format' })
      return
    }

    const submission: OnboardingSubmission = {
      userId: user.id,
      answers,
      submittedAt: new Date().toISOString(),
    }

    submissions.push(submission)

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully',
      links: {
        dashboard: '/dashboard',
        profile: '/profile',
        home: '/',
      },
    })
  } catch (error) {
    console.error('Error submitting onboarding:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default withSession(withAuth(handler))
