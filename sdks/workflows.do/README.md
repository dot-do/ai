# workflows.do

Simple helpers for building AI powered workflows.

```ts
import { AI, DB, ai, db, every, on } from 'workflows.do'

// Define typed AI helpers
const myAI = AI({
  summarizeIdea: {
    summary: 'short explanation of the idea'
  }
})

// Define a collection
const myDB = DB({
  ideas: {}
})

// Schedule a workflow
every('day', async (_, { ai, db }) => {
  const idea = await myDB.ideas.create({ concept: 'AI Agents' })
  const summary = await myAI.summarizeIdea({ idea })
  await myDB.ideas.update({ ...idea, ...summary })
})

// Handle a one-off event
on('webhook', async (event, { ai }) => {
  await ai`Received ${event}`
})
```
