import React, { useState } from 'react'

interface OnboardingProps {
  user?: any
  onComplete?: (answers: Record<string, string>) => void
}

interface Question {
  id: string
  question: string
  type: 'text' | 'select' | 'radio' | 'checkbox'
  options?: string[]
  required?: boolean
}

export function Onboarding({ user, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

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
      id: 'currentSolution',
      question: 'How are you currently solving this problem?',
      type: 'text',
      required: false,
    },
    {
      id: 'teamSize',
      question: 'How large is your team?',
      type: 'select',
      options: ['1-5', '6-20', '21-100', '100+'],
      required: true,
    },
    {
      id: 'timeline',
      question: 'What is your timeline for implementing a solution?',
      type: 'radio',
      options: ['Immediately', 'Within 3 months', 'Within 6 months', 'No specific timeline'],
      required: true,
    },
  ]

  const [questions] = useState<Question[]>(defaultQuestions)

  const currentQuestion = questions[step]

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      try {
        const response = await fetch('/api/onboarding/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        })

        const data = await response.json()

        if (response.ok) {
          if (onComplete) {
            onComplete(answers)
          } else {
            window.location.href = data.links?.dashboard || '/'
          }
        } else {
          console.error('Error submitting onboarding:', data.error)
          alert('There was an error submitting your responses. Please try again.')
        }
      } catch (error) {
        console.error('Error submitting onboarding:', error)
        alert('There was an error submitting your responses. Please try again.')
      }
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value,
    })
  }

  const canProceed = !currentQuestion.required || answers[currentQuestion.id]

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h2>Tell us about your needs</h2>
        <p>
          Step {step + 1} of {questions.length}
        </p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="question-container">
        <h3>{currentQuestion.question}</h3>

        {currentQuestion.type === 'text' && <textarea value={answers[currentQuestion.id] || ''} onChange={handleChange} placeholder="Your answer" rows={4} />}

        {currentQuestion.type === 'select' && (
          <select value={answers[currentQuestion.id] || ''} onChange={handleChange}>
            <option value="">Select an option</option>
            {currentQuestion.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {currentQuestion.type === 'radio' && (
          <div className="radio-options">
            {currentQuestion.options?.map((option) => (
              <label key={option} className="radio-label">
                <input type="radio" name={currentQuestion.id} value={option} checked={answers[currentQuestion.id] === option} onChange={handleChange} />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="onboarding-actions">
        {step > 0 && (
          <button className="btn-secondary" onClick={handlePrevious}>
            Previous
          </button>
        )}

        <button className="btn-primary" onClick={handleNext} disabled={!canProceed}>
          {step < questions.length - 1 ? 'Next' : 'Complete'}
        </button>
      </div>
    </div>
  )
}
