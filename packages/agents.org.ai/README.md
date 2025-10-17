# agents.org.ai

Agent type definitions and implementations for the `.do` platform based on OpenAI AgentKit primitives.

## Overview

This package provides TypeScript type definitions and concrete implementations for autonomous agents that power the `.do` Business-as-Code platform. Built on OpenAI's AgentKit architecture, these agents enable autonomous workflows, multi-channel communication, and intelligent decision-making.

## Installation

```bash
pnpm add agents.org.ai
```

## Features

- 🤖 **OpenAI AgentKit Integration** - Built on AgentKit primitives (Agents, Handoffs, Guardrails, Sessions)
- 🔄 **Multi-Agent Workflows** - Coordinate between specialized agents
- 🛡️ **Guardrails** - Input/output validation and safety constraints
- 📞 **Multi-Channel Communication** - GitHub, SMS, Email, Voice via Vapi
- 🎯 **Workflow Triggers** - Event-driven automation
- 📊 **Decision Framework** - PR review, issue triage, escalation rules

## Usage

### Import Agent Types

```typescript
import type { Agent, AgentTool, AgentTrigger } from 'agents.org.ai'
```

### Use pdm Agent

```typescript
import { pdmAgent, canMergePR, generatePRReviewComment } from 'agents.org.ai/pdm'

// Check if PR can be merged
const result = canMergePR({
  ciPassing: true,
  codeReviewComplete: true,
  testsIncluded: true,
  documentationUpdated: true,
  noUnresolvedComments: true,
  alignedWithRoadmap: true,
})

if (result.canMerge) {
  // Generate review comment
  const comment = generatePRReviewComment({
    number: 123,
    author: 'developer',
    title: 'feat: add new feature',
    canMerge: true,
    autoMerge: true,
    requiresHumanReview: false,
  })

  // Post comment to GitHub
  await github.issues.createComment({
    issue_number: 123,
    body: comment,
  })
}
```

### Create Custom Agent

```typescript
import type { Agent } from 'agents.org.ai'

const myAgent: Agent = {
  $type: 'Agent',
  $id: 'https://example.com/agents/my-agent',
  name: 'my-agent',
  version: '1.0.0',
  description: 'My custom agent',
  model: 'gpt-5',
  agent: 'AgentName',
  role: 'Agent Role',

  capabilities: ['capability1', 'capability2'],

  tools: [
    {
      name: 'tool_name',
      description: 'Tool description',
      type: 'integration',
      enabled: true,
    },
  ],

  triggers: [
    {
      event: 'event_name',
      action: 'action_name',
      priority: 'high',
      enabled: true,
    },
  ],

  guardrails: [
    {
      type: 'output',
      rule: 'rule_description',
      action: 'block',
      message: 'Error message',
    },
  ],

  sessions: true,
}
```

## Agent Types

### Core Types

- `Agent` - Main agent configuration
- `AgentTool` - Tool/capability definition
- `AgentTrigger` - Workflow trigger
- `AgentHandoff` - Delegation to other agents
- `AgentGuardrail` - Safety constraint
- `AgentContext` - Runtime execution context
- `AgentResult` - Execution result

### Configuration Types

- `CommunicationChannel` - Communication configuration
- `EscalationRule` - Escalation logic
- `PrioritizationRule` - Issue prioritization
- `WorkflowTrigger` - Workflow automation
- `SessionConfig` - Session management
- `GitHubConfig` - GitHub integration
- `VapiConfig` - Vapi integration

## Implemented Agents

### pdm (Product Manager Agent)

**Name**: Dara
**Role**: Product Manager
**Model**: GPT-5

**Capabilities**:

- Review and manage pull requests
- Coordinate roadmap implementation
- Triage and clarify issues
- Make merge/close decisions
- Multi-channel communication (GitHub, SMS, Email, Voice)
- Monitor code review completions
- Escalate blocking issues

**Triggers**:

- `claude_code_review_complete` - Review PR after code review
- `issue_needs_clarification` - Request clarification from author
- `blocking_issue_detected` - Escalate via SMS

**Tools**:

- `github_repos` - Repository access
- `github_issues` - Issue management
- `github_projects` - Project board coordination
- `github_pull_requests` - PR review and merge
- `vapi_phone` - Voice calls
- `vapi_sms` - Text messaging
- `vapi_email` - Email communication

See [platform/agents/pdm.mdx](../../../platform/agents/pdm.mdx) for complete documentation.

## OpenAI AgentKit Primitives

### Agents

LLMs equipped with instructions and tools. The core unit of autonomous work.

```typescript
const agent: Agent = {
  $type: 'Agent',
  name: 'agent-name',
  model: 'gpt-5',
  tools: [...],
  instructions: '...'
}
```

### Handoffs

Allow agents to delegate to other agents when tasks require different expertise.

```typescript
const handoff: AgentHandoff = {
  toAgent: 'specialist-agent',
  condition: 'requires_specialist_knowledge',
  context: ['key', 'information'],
  priority: 'high',
}
```

### Guardrails

Enable validation of agent inputs and outputs to ensure safety and correctness.

```typescript
const guardrail: AgentGuardrail = {
  type: 'output',
  rule: 'never_perform_dangerous_action',
  action: 'block',
  message: 'Action blocked by safety guardrail',
}
```

### Sessions

Automatically maintain conversation history across interactions.

```typescript
const agent: Agent = {
  // ...
  sessions: true,
}
```

## Integration Examples

### GitHub Workflow Integration

```yaml
# .github/workflows/pdm-agent.yml
name: PdM Agent - Code Review Complete

on:
  workflow_run:
    workflows: ['Code Review']
    types:
      - completed

jobs:
  pdm-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger pdm Agent
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          VAPI_API_KEY: ${{ secrets.VAPI_API_KEY }}
        run: |
          node scripts/trigger-pdm-agent.js
```

### Vapi Integration

```typescript
import { VapiConfig } from 'agents.org.ai'

const vapiConfig: VapiConfig = {
  apiKey: process.env.VAPI_API_KEY,
  phoneNumber: process.env.VAPI_PHONE_NUMBER,
  assistantId: process.env.VAPI_ASSISTANT_ID,
  capabilities: {
    phone: true,
    sms: true,
    email: true,
  },
  rateLimits: {
    smsPerHour: 10,
    callsPerDay: 5,
  },
}
```

## Development

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm typecheck
```

### Watch Mode

```bash
pnpm dev
```

## Related Packages

- [agents](../agents) - Universal agent configuration format
- [sdk.do](../sdk.do) - .do platform SDK
- [graphdl](../graphdl) - Semantic graph types

## Resources

- [OpenAI AgentKit Documentation](https://openai.com/index/introducing-agentkit/)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [.do Platform Documentation](https://github.com/dot-do/platform)

## License

MIT
