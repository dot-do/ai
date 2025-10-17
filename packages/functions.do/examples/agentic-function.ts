/**
 * Agentic Function Examples
 *
 * Multi-step AI reasoning with tools
 */

import { defineAgenticFunction, execute } from '../src'
import { z } from 'zod'

// Research with web search
export const researchTopic = defineAgenticFunction({
  name: 'researchTopic',
  description: 'Research a topic using web search and analysis',
  input: z.object({
    topic: z.string(),
    depth: z.enum(['quick', 'detailed', 'comprehensive']),
  }),
  output: z.object({
    findings: z.array(
      z.object({
        source: z.string(),
        summary: z.string(),
        relevance: z.number(),
      })
    ),
    conclusion: z.string(),
    confidence: z.number(),
  }),
  model: 'gpt-5',
  tools: ['webSearch', 'readUrl', 'summarize'],
  maxSteps: 15,
  instructions: `
    Research the given topic thoroughly:
    1. Start with web searches to find relevant sources
    2. Read and analyze the most promising URLs
    3. Summarize key findings from each source
    4. Synthesize information into a coherent conclusion
    5. Rate your confidence in the findings
  `,
  handler: async (input, ctx) => {
    // Agent worker handles multi-step reasoning
    return {
      findings: [],
      conclusion: '',
      confidence: 0,
    }
  },
})

// Data analysis with multiple steps
export const analyzeData = defineAgenticFunction({
  name: 'analyzeData',
  description: 'Analyze data using multiple analysis techniques',
  input: z.object({
    data: z.array(z.record(z.any())),
    questions: z.array(z.string()),
  }),
  output: z.object({
    insights: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
        charts: z.array(z.any()),
      })
    ),
    summary: z.string(),
  }),
  model: 'gpt-5',
  tools: ['calculateStats', 'generateChart', 'findPatterns', 'summarize'],
  maxSteps: 20,
  instructions: `
    Analyze the data to answer the questions:
    1. For each question, determine what analysis is needed
    2. Use tools to calculate stats, find patterns, generate visualizations
    3. Synthesize findings into clear answers
    4. Provide an executive summary
  `,
  handler: async (input, ctx) => {
    // Agent worker handles analysis
    return {
      insights: [],
      summary: '',
    }
  },
})

// Competitive analysis
export const analyzeCompetitor = defineAgenticFunction({
  name: 'analyzeCompetitor',
  description: 'Analyze a competitor across multiple dimensions',
  input: z.object({
    competitor: z.string(),
    dimensions: z.array(z.enum(['product', 'pricing', 'marketing', 'technology', 'team'])),
  }),
  output: z.object({
    analysis: z.record(
      z.object({
        findings: z.string(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        opportunities: z.array(z.string()),
      })
    ),
    overallAssessment: z.string(),
  }),
  model: 'gpt-5',
  tools: ['webSearch', 'readUrl', 'extractData', 'analyzeText'],
  maxSteps: 25,
  instructions: `
    Conduct comprehensive competitor analysis:
    1. Research each requested dimension
    2. Gather data from multiple sources
    3. Identify strengths, weaknesses, and opportunities
    4. Provide overall strategic assessment
  `,
  handler: async (input, ctx) => {
    // Agent worker handles competitive analysis
    return {
      analysis: {},
      overallAssessment: '',
    }
  },
})

// Content creation workflow
export const createMarketingCampaign = defineAgenticFunction({
  name: 'createMarketingCampaign',
  description: 'Create a complete marketing campaign',
  input: z.object({
    product: z.string(),
    audience: z.string(),
    channels: z.array(z.enum(['email', 'social', 'blog', 'ads'])),
  }),
  output: z.object({
    strategy: z.string(),
    content: z.record(z.array(z.string())),
    schedule: z.array(
      z.object({
        date: z.string(),
        channel: z.string(),
        action: z.string(),
      })
    ),
  }),
  model: 'gpt-5',
  tools: ['webSearch', 'generateText', 'analyzeAudience', 'createSchedule'],
  maxSteps: 30,
  instructions: `
    Create a comprehensive marketing campaign:
    1. Research the product and target audience
    2. Develop overall strategy
    3. Generate content for each channel
    4. Create a detailed schedule
    5. Ensure all content is cohesive and on-brand
  `,
  handler: async (input, ctx) => {
    // Agent worker handles campaign creation
    return {
      strategy: '',
      content: {},
      schedule: [],
    }
  },
})

// Problem solving
export const debugIssue = defineAgenticFunction({
  name: 'debugIssue',
  description: 'Debug a technical issue using multiple diagnostic tools',
  input: z.object({
    description: z.string(),
    logs: z.string().optional(),
    environment: z.string().optional(),
  }),
  output: z.object({
    diagnosis: z.string(),
    rootCause: z.string(),
    solution: z.string(),
    steps: z.array(z.string()),
    confidence: z.number(),
  }),
  model: 'gpt-5-codex',
  tools: ['searchDocs', 'analyzeLogs', 'searchCode', 'testHypothesis'],
  maxSteps: 20,
  instructions: `
    Debug the issue systematically:
    1. Analyze the error description and logs
    2. Search documentation for relevant information
    3. Form hypotheses about root cause
    4. Test hypotheses using available tools
    5. Provide detailed solution with step-by-step instructions
  `,
  handler: async (input, ctx) => {
    // Agent worker handles debugging
    return {
      diagnosis: '',
      rootCause: '',
      solution: '',
      steps: [],
      confidence: 0,
    }
  },
})

// Example usage
async function main() {
  // Research a topic
  const research = await execute('fn_research_topic', {
    topic: 'Serverless computing trends in 2025',
    depth: 'detailed',
  })
  console.log('Research findings:', research.output)

  // Analyze competitor
  const competitive = await execute('fn_analyze_competitor', {
    competitor: 'Vercel',
    dimensions: ['product', 'pricing', 'technology'],
  })
  console.log('Competitive analysis:', competitive.output)

  // Debug an issue
  const debug = await execute('fn_debug_issue', {
    description: 'API returns 500 error on POST requests',
    logs: 'Error: Connection timeout...',
    environment: 'production',
  })
  console.log('Debug results:', debug.output)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
