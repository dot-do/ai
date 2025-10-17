# gdpval.org.ai Package

**Date**: 2025-10-16
**Status**: Planning
**Purpose**: Connect HuggingFace GDP Val datasets with O*NET abstractions

## Overview

The `gdpval.org.ai` package provides AI automation scoring for occupations, tasks, and technologies by connecting HuggingFace's [GDP Val datasets](https://huggingface.co/datasets/GDPval) with our O*NET-based packages.

## Data Source

**HuggingFace Dataset**: https://huggingface.co/datasets/GDPval

The GDP Val project scores occupations and tasks for:
- **Automation potential** - How easily can AI replace this?
- **AI capability** - Current AI capability to perform this task
- **Value at risk** - Economic value that could be automated
- **Time to automation** - Expected timeline for automation

## Package Structure

```
ai/packages/gdpval.org.ai/
├── package.json
├── README.mdx
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts
│   ├── types/
│   │   ├── base.ts
│   │   ├── automation-score.ts
│   │   ├── occupation-score.ts
│   │   ├── task-score.ts
│   │   └── index.ts
│   └── data/
│       ├── occupation-scores.ts (generated)
│       ├── task-scores.ts (generated)
│       └── technology-scores.ts (generated)
└── scripts/
    ├── import-huggingface.ts
    └── import.ts
```

## Type Definitions

### AutomationScore

```typescript
export interface AutomationScore extends Thing {
  $type: 'AutomationScore'
  $id: string // https://gdpval.org.ai/scores/[entity-id]

  // Entity being scored
  entity: Ref // Reference to Occupation, Task, or Technology
  entityType: 'Occupation' | 'Task' | 'Technology'

  // Scoring dimensions (0-100 scale)
  automationPotential: number // How automatable (0 = not at all, 100 = fully)
  aiCapability: number // Current AI capability (0 = none, 100 = complete)
  valueAtRisk: number // Economic value percentage at risk
  impactScore: number // Overall impact score

  // Timeline predictions
  timeToAutomation?: AutomationTimeline
  confidenceLevel: ConfidenceLevel

  // Methodology
  scoringMethod: ScoringMethod
  dataVersion: string // GDP Val dataset version
  scoredAt: string // ISO 8601 timestamp

  // Breakdown by task components (for occupations)
  taskBreakdown?: TaskAutomationBreakdown[]

  // Semantic relationships
  appliesTo?: Ref // $.AutomationScore.appliesTo.Occupation
  replacedBy?: Ref[] // $.AutomationScore.replacedBy.Technology
}

export type AutomationTimeline =
  | 'Immediate' // < 1 year
  | 'Near-term' // 1-3 years
  | 'Mid-term' // 3-7 years
  | 'Long-term' // 7-15 years
  | 'Distant' // 15+ years
  | 'Unlikely' // Not foreseeable

export type ConfidenceLevel =
  | 'Very High' // 90-100%
  | 'High' // 75-90%
  | 'Medium' // 50-75%
  | 'Low' // 25-50%
  | 'Very Low' // <25%

export type ScoringMethod =
  | 'Expert Assessment'
  | 'ML Model'
  | 'Task Decomposition'
  | 'Comparative Analysis'
  | 'Hybrid'

interface TaskAutomationBreakdown {
  task: Ref // Reference to Task
  taskAutomationScore: number
  contributionToOccupation: number // 0-100%
}
```

### OccupationScore

```typescript
export interface OccupationScore extends AutomationScore {
  $type: 'OccupationScore'

  // O*NET occupation reference
  occupation: Ref // $.OccupationScore.occupation.Occupation
  socCode: string

  // Task-level analysis
  taskCount: number
  automatedTasksPercentage: number
  criticalNonAutomatableTasks: number

  // Technology requirements
  requiredTechnologies?: TechnologyRequirement[]

  // Economic impact
  employmentCount?: number
  annualWages?: number
  gdpAtRisk?: number

  // Skill changes required
  skillsToLearn?: Ref[] // $.OccupationScore.skillsToLearn.Skill
  skillsBecomingObsolete?: Ref[] // $.OccupationScore.skillsBecomingObsolete.Skill
}

interface TechnologyRequirement {
  technology: Ref
  requiredForAutomation: boolean
  currentlyAvailable: boolean
  maturityLevel: 'Prototype' | 'Alpha' | 'Beta' | 'Production' | 'Mature'
}
```

### TaskScore

```typescript
export interface TaskScore extends AutomationScore {
  $type: 'TaskScore'

  // O*NET task reference
  task: Ref // $.TaskScore.task.Task
  taskId: string

  // Task characteristics
  complexity: ComplexityLevel
  routineness: RoutinenessLevel
  cognitiveLoad: CognitiveLoad

  // Automation dimensions
  perceptionRequired: number // 0-100
  manipulationRequired: number // 0-100
  decisionMakingRequired: number // 0-100
  creativityRequired: number // 0-100
  socialInteractionRequired: number // 0-100

  // Technology mapping
  technologiesCapable?: Ref[] // $.TaskScore.technologiesCapable.Technology
}

export type ComplexityLevel = 'Simple' | 'Moderate' | 'Complex' | 'Very Complex'
export type RoutinenessLevel = 'Highly Routine' | 'Routine' | 'Semi-Routine' | 'Non-Routine'
export type CognitiveLoad = 'Low' | 'Medium' | 'High' | 'Very High'
```

## Data Import Pipeline

### Phase 1: HuggingFace Dataset Import

```typescript
// scripts/import-huggingface.ts
import { AutoFileIterable } from '@huggingface/hub'

async function importGDPVal() {
  // Download GDP Val datasets from HuggingFace
  const datasets = [
    'GDPval/occupation-automation-scores',
    'GDPval/task-automation-potential',
    'GDPval/technology-capability-matrix',
  ]

  for (const dataset of datasets) {
    const files = await downloadDataset(dataset)
    await processDataset(files)
  }
}

async function downloadDataset(datasetName: string) {
  // Use HuggingFace API to download
  const files = await AutoFileIterable.list({
    repo: datasetName,
    path: '',
  })

  return files
}
```

### Phase 2: O*NET Mapping

Map GDP Val entities to our O*NET packages:

```typescript
async function mapToONET(gdpvalScore: any): Promise<OccupationScore> {
  // Find matching O*NET occupation
  const occupation = await findOccupation(gdpvalScore.socCode)

  // Get related tasks
  const tasks = await db.related(occupation, $.performs, $.Task)

  // Calculate task-level breakdowns
  const taskBreakdown = tasks.map((task) => ({
    task: { $id: task.$id },
    taskAutomationScore: calculateTaskScore(task, gdpvalScore),
    contributionToOccupation: calculateContribution(task, occupation),
  }))

  return {
    $type: 'OccupationScore',
    $id: `https://gdpval.org.ai/scores/occupation/${gdpvalScore.socCode}`,
    entity: { $id: occupation.$id },
    entityType: 'Occupation',
    occupation: { $id: occupation.$id },
    socCode: gdpvalScore.socCode,
    automationPotential: gdpvalScore.automationScore,
    aiCapability: gdpvalScore.currentAICapability,
    valueAtRisk: gdpvalScore.valueAtRisk,
    impactScore: gdpvalScore.overallImpact,
    timeToAutomation: mapTimeline(gdpvalScore.timeline),
    confidenceLevel: 'High',
    scoringMethod: 'Hybrid',
    dataVersion: 'GDP Val 2024-Q4',
    scoredAt: new Date().toISOString(),
    taskCount: tasks.length,
    taskBreakdown,
  }
}
```

## Semantic Integration

### With O*NET Packages

```typescript
import { getOccupation } from 'soc.org.ai'
import { getTechnology } from 'tech.org.ai'
import { getTask } from 'tasks.org.ai'
import { getOccupationScore } from 'gdpval.org.ai'

// Get occupation and its automation score
const softwareDev = getOccupation('15-1252.00')
const automationScore = getOccupationScore('15-1252.00')

console.log(`${softwareDev.title}:`)
console.log(`  Automation Potential: ${automationScore.automationPotential}%`)
console.log(`  Timeline: ${automationScore.timeToAutomation}`)

// Find technologies that can automate tasks
const tasks = await db.related(softwareDev, $.performs, $.Task)
for (const task of tasks) {
  const taskScore = getTaskScore(task.$id)
  const capableTech = taskScore.technologiesCapable

  console.log(`\n${task.description}:`)
  console.log(`  Automation: ${taskScore.automationPotential}%`)
  console.log(`  Technologies: ${capableTech.map((t) => t.$id).join(', ')}`)
}
```

### Query Patterns

```typescript
import { $ } from 'sdk.do'

// Find highly automatable occupations
const highRisk = await db.query({
  subject: $.OccupationScore,
  where: {
    automationPotential: { $gte: 80 },
    timeToAutomation: { $in: ['Immediate', 'Near-term'] },
  },
})

// Find occupations safe from automation
const lowRisk = await db.query({
  subject: $.OccupationScore,
  where: {
    automationPotential: { $lte: 30 },
  },
})

// Technology-occupation automation matrix
const matrix = await db.query({
  select: {
    technology: '$.Technology.name',
    occupation: '$.Occupation.title',
    automationScore: '$.TaskScore.automationPotential',
  },
  from: $.TaskScore,
  join: [
    { table: $.Task, on: '$.TaskScore.task = $.Task.$id' },
    { table: $.Occupation, on: '$.Task.performedBy = $.Occupation.$id' },
    { table: $.Technology, on: '$.TaskScore.technologiesCapable = $.Technology.$id' },
  ],
  where: {
    '$.TaskScore.automationPotential': { $gte: 70 },
  },
})
```

## Use Cases

### 1. Career Guidance

```typescript
// Help users understand automation risk
function getCareerAdvice(occupation: Occupation) {
  const score = getOccupationScore(occupation.code)

  if (score.automationPotential > 70) {
    return {
      risk: 'High',
      advice: 'Consider upskilling or transitioning',
      recommendedSkills: score.skillsToLearn,
      timeline: score.timeToAutomation,
    }
  } else if (score.automationPotential > 40) {
    return {
      risk: 'Medium',
      advice: 'Stay current with emerging technologies',
      skillsToMaintain: score.requiredTechnologies,
    }
  } else {
    return {
      risk: 'Low',
      advice: 'Focus on uniquely human skills',
      strengths: score.criticalNonAutomatableTasks,
    }
  }
}
```

### 2. Service Generation Prioritization

```typescript
// Use automation scores to prioritize service generation
const highValueServices = await db.query({
  select: {
    task: '$.Task.description',
    automation: '$.TaskScore.automationPotential',
    gdpImpact: '$.TaskScore.valueAtRisk',
    techReady: '$.TaskScore.aiCapability',
  },
  from: $.TaskScore,
  where: {
    automationPotential: { $gte: 70 },
    aiCapability: { $gte: 60 },
    valueAtRisk: { $gte: 50 },
  },
  orderBy: [{ field: 'gdpImpact', direction: 'DESC' }],
  limit: 100,
})

// Generate services for these high-value, automatable tasks
for (const opportunity of highValueServices) {
  await generateService({
    task: opportunity.task,
    estimatedImpact: opportunity.gdpImpact,
    feasibility: opportunity.techReady,
  })
}
```

### 3. Economic Impact Analysis

```typescript
// Calculate GDP at risk by industry
const industryImpact = await db.query({
  aggregate: [
    {
      $group: {
        _id: '$industry',
        totalEmployment: { $sum: '$employmentCount' },
        gdpAtRisk: { $sum: '$gdpAtRisk' },
        avgAutomation: { $avg: '$automationPotential' },
      },
    },
    { $sort: { gdpAtRisk: -1 } },
  ],
  from: $.OccupationScore,
})

console.log('Industries by GDP at Risk:')
industryImpact.forEach((i) => {
  console.log(`${i._id}: $${(i.gdpAtRisk / 1e9).toFixed(1)}B (${i.avgAutomation.toFixed(1)}% automation)`)
})
```

## Implementation Timeline

### Phase 1: Core Package (Week 1)
- [ ] Create package structure
- [ ] Define TypeScript types
- [ ] Setup HuggingFace API client
- [ ] Import sample scores (top 100 occupations)

### Phase 2: O*NET Integration (Week 2)
- [ ] Map GDP Val SOC codes to soc.org.ai
- [ ] Link task scores to tasks.org.ai
- [ ] Connect technology capabilities to tech.org.ai
- [ ] Generate semantic relationships

### Phase 3: Analysis Tools (Week 3)
- [ ] Build automation risk calculator
- [ ] Create career guidance engine
- [ ] Develop service prioritization scorer
- [ ] Implement economic impact analyzer

### Phase 4: Visualization & API (Week 4)
- [ ] Build automation matrix visualizations
- [ ] Create career path recommendations
- [ ] Expose REST API endpoints
- [ ] Generate interactive dashboards

## Semantic Relationships

```typescript
// Occupation → Automation Score
await db.relate(
  { $id: 'https://soc.org.ai/15-1252.00' },
  $.hasAutomationScore,
  { $id: 'https://gdpval.org.ai/scores/occupation/15-1252.00' }
)

// Task → Automation Score
await db.relate(
  { $id: 'https://tasks.org.ai/task-12345' },
  $.hasAutomationScore,
  { $id: 'https://gdpval.org.ai/scores/task/12345' }
)

// Technology → Automation Capability
await db.relate(
  { $id: 'https://tech.org.ai/Python' },
  $.enablesAutomation,
  { $id: 'https://tasks.org.ai/task-12345' }
)
```

## Metrics to Track

```typescript
interface GDPValMetrics {
  // Coverage
  occupationsScored: number
  tasksScored: number
  technologiesAssessed: number

  // Automation statistics
  highRiskOccupations: number // >70% automation
  mediumRiskOccupations: number // 40-70%
  lowRiskOccupations: number // <40%

  // Economic impact
  totalGDPAtRisk: number
  affectedWorkers: number
  timelineDistribution: Record<AutomationTimeline, number>

  // Data quality
  averageConfidence: number
  lastUpdated: string
}
```

## Next Steps

1. **Create GitHub issue** for gdpval.org.ai package
2. **Research** HuggingFace GDP Val datasets structure
3. **Prototype** mapping to O*NET occupations
4. **Test** automation scoring calculations
5. **Deploy** integration with services generation

## Resources

- **GDP Val Dataset**: https://huggingface.co/datasets/GDPval
- **HuggingFace Hub**: https://huggingface.co/docs/hub/
- **O*NET Database**: https://www.onetonline.org/
- **Automation Research**: Papers on AI automation potential

## Related Packages

- **onet.org.ai** - O*NET meta-package
- **soc.org.ai** - Occupations
- **tasks.org.ai** - Tasks
- **tech.org.ai** - Technologies
- **tools.org.ai** - Tools
- **jobs.org.ai** - Job titles
