import { expectTypeOf } from 'vitest'
import { AI } from '../src'
import { AIContext } from '../src/types'

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

    expectTypeOf(results.productName).toBeString()

    expectTypeOf(results.problem).toBeArray()
    expectTypeOf(results.problem[0]).toBeString()

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

expectTypeOf(testAI.ideate).toBeFunction()
expectTypeOf(testAI.leanCanvas).toBeFunction()

expectTypeOf(testAI.ideate).parameter(0).toMatchTypeOf<{ topic: string }>()

expectTypeOf(testAI.leanCanvas).returns.resolves.toMatchTypeOf<{
  productName: string
  problem: string[]
  solution: string[]
  uniqueValueProposition: string
}>()

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

    expectTypeOf(summary.summary).toBeString()
    expectTypeOf(summary.keyPoints).toBeArray()

    expectTypeOf(sentiment.score).toBeNumber()
    expectTypeOf(sentiment.label).toBeString()

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

expectTypeOf(nestedAI.generateReport).toBeFunction()
expectTypeOf(nestedAI.summarize).toBeFunction()
expectTypeOf(nestedAI.analyzeSentiment).toBeFunction()
