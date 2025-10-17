import { describe, it, expect } from 'vitest'
import { AI } from '../src'
import { AIContext } from '../src/types'

describe('AI Workflows', () => {
  describe('AI function', () => {
    it('should create functions from schema objects', async () => {
      const testAI = AI({
        leanCanvas: {
          productName: 'name of the product or service',
          problem: ['top 3 problems the product solves'],
          solution: ['solutions to the problems'],
          uniqueValueProposition: 'why this product is different and worth buying',
        },
      })

      expect(typeof testAI.leanCanvas).toBe('function')

      const result = await testAI.leanCanvas({ prompt: 'AI-powered project management' })

      expect(result).toHaveProperty('productName')
      expect(result).toHaveProperty('problem')
      expect(result).toHaveProperty('solution')
      expect(result).toHaveProperty('uniqueValueProposition')

      expect(Array.isArray(result.problem)).toBe(true)
    })

    it('should allow functions to access other AI functions through context', async () => {
      const testAI = AI({
        ideate: async (
          args: { topic: string },
          ctx: AIContext<{
            leanCanvas: {
              productName: string
              problem: string[]
              solution: string[]
              uniqueValueProposition: string
            }
          }>
        ) => {
          const { ai } = ctx
          const results = await ai.leanCanvas({ topic: args.topic })

          return {
            ideas: [`Idea based on ${results.productName}`],
            problemStatements: results.problem,
          }
        },

        leanCanvas: {
          productName: 'name of the product or service',
          problem: ['top 3 problems the product solves'],
          solution: ['solutions to the problems'],
          uniqueValueProposition: 'why this product is different and worth buying',
        },
      })

      expect(typeof testAI.ideate).toBe('function')
      expect(typeof testAI.leanCanvas).toBe('function')

      const result = await testAI.ideate({ topic: 'AI-powered project management' }, { ai: testAI })

      expect(result).toHaveProperty('ideas')
      expect(result).toHaveProperty('problemStatements')

      expect(Array.isArray(result.ideas)).toBe(true)
      expect(typeof result.ideas[0]).toBe('string')

      expect(Array.isArray(result.problemStatements)).toBe(true)
    })

    it('should handle nested AI configurations', async () => {
      const nestedAI = AI({
        generateReport: async (
          args: { data: any },
          ctx: AIContext<{
            summarize: {
              summary: string
              keyPoints: string[]
            }
            analyzeSentiment: {
              score: number
              label: string
            }
          }>
        ) => {
          const { ai } = ctx
          const summary = await ai.summarize({ text: 'Some text to summarize' })
          const sentiment = await ai.analyzeSentiment({ text: 'Some text to analyze' })

          return {
            summary: summary.summary,
            sentiment: sentiment.label,
            score: sentiment.score,
          }
        },

        summarize: {
          summary: 'concise summary of the text',
          keyPoints: ['array of key points from the text'],
        },

        analyzeSentiment: {
          score: 0.8,
          label: 'positive or negative sentiment',
        },
      })

      expect(typeof nestedAI.generateReport).toBe('function')
      expect(typeof nestedAI.summarize).toBe('function')
      expect(typeof nestedAI.analyzeSentiment).toBe('function')

      const result = await nestedAI.generateReport({ data: 'test data' }, { ai: nestedAI })

      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('sentiment')
      expect(result).toHaveProperty('score')

      expect(typeof result.summary).toBe('string')
      expect(typeof result.sentiment).toBe('string')
      expect(typeof result.score).toBe('number')
    })
  })
})
