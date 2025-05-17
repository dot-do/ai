# [`workflows.do`](https://workflows.do)

```ts
import { ai, db } from 'workflows.do'

await db.ideas.create({ concept: 'Digital AI Workers' })
await db.ideas.create({ concept: 'Agentic Workflow Platform' })

const ideas = await db.ideas.search('AI Agents')

ideas.forEach(async (idea) => {
  idea.status = 'Evaluating market potential'
  const leanCanvas = await ai.defineLeanCanvas({ idea })
  const marketResearch = await ai.research({ idea, leanCanvas })
  await db.ideas.update({ ...idea, leanCanvas, marketResearch })
})

```

Or define the Functions & Workflows explicitly:

```ts
import { AI } from 'workflows.do'

const ai = AI({

  // Specify a strongly-typed schema for the AI to generate a structured output
  defineLeanCanvas: {
    productName: 'name of the product or service',
    problem: ['top 3 problems the product solves'],
    solution: ['top 3 solutions the product offers'],
    uniqueValueProposition: 'clear message that states the benefit of your product',
    unfairAdvantage: 'something that cannot be easily copied or bought',
    customerSegments: ['list of target customer segments'],
    keyMetrics: ['list of key numbers that tell you how your business is doing'],
    channels: ['path to acquire customers'],
    costStructure: ['list of operational costs'],
    revenueStreams: ['list of revenue sources'],
  },

  // The type can also be a string array
  brainstormIdeas: ['List 25 startup ideas leveraging AI Agents, Agentic Workflows, and/or Services delivered by AI Agents']

  // Explicitly define the AI model, prompt, and output type
  research: {
    model: 'perplexity/sonar-deep-research',
    prompt: 'Research {input}',
    output: 'markdown',
  },

  // Define functions that will be durably executed with automatic retries
  ideate: async (args, { ai, db }) => {
    const ideas = await ai.brainstormIdeas(args)

    const results = Promise.all(ideas.map(async (idea) => {
      idea.status = 'Evaluating market potential'
      idea.leanCanvas = await ai.defineLeanCanvas({ idea })
      idea.marketResearch = await ai.research({ idea, leanCanvas: idea.leanCanvas })
      db.ideas.update(idea)
      return idea
    }))

    return results
  }

})

const ideas = await ai.ideate({ icp: 'Early-stage Startup Founders' })

```

Or define the Data Models explicitly:

```ts
import { DB } from 'workflows.do'

const db = DB({
  leanCanvas: {

  }
})
```

```ts
import { every, on } from 'workflows.do'

every('hour during business hours', async (event, { ai, db }) => {
  
})
```

