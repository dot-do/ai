/**
 * APQC Process Classification Framework (PCF) Data Ingestion
 * Source: APQC PCF - https://www.apqc.org/
 */

import { join } from 'path'
import type { IngestionResult, APQCProcess, FrontmatterValue } from './types.js'
import { toFilename, logResult, writeMDXFile } from './types.js'

const OUTPUT_DIR = join(process.cwd(), '.db', 'APQC')

/**
 * APQC PCF Framework - Top Level Categories
 * Based on APQC's Cross-Industry Process Classification Framework
 *
 * TODO: Future enhancement - fetch from APQC API or structured data source
 * License consideration: APQC PCF is copyrighted, verify usage rights for production
 */
const APQC_PROCESSES: APQCProcess[] = [
  {
    id: '1.0',
    code: '1.0',
    title: 'Develop Vision and Strategy',
    description: 'Define the business concept and long-term vision. Develop business strategy and manage strategic initiatives.',
    category: 'Operating Processes',
    parent: null,
    children: ['1.1', '1.2', '1.3', '1.4'],
    level: 1,
  },
  {
    id: '2.0',
    code: '2.0',
    title: 'Develop and Manage Products and Services',
    description: 'Manage the product/service portfolio, design and develop products and services, and manage product/service lifecycle.',
    category: 'Operating Processes',
    parent: null,
    children: ['2.1', '2.2', '2.3', '2.4'],
    level: 1,
  },
  {
    id: '3.0',
    code: '3.0',
    title: 'Market and Sell Products and Services',
    description: 'Understand markets, customers and capabilities. Develop marketing strategy and manage marketing campaigns. Develop and manage sales.',
    category: 'Operating Processes',
    parent: null,
    children: ['3.1', '3.2', '3.3', '3.4', '3.5'],
    level: 1,
  },
  {
    id: '4.0',
    code: '4.0',
    title: 'Deliver Physical Products',
    description: 'Plan for and align supply chain resources. Procure materials and services. Produce/Manufacture products. Deliver products. Manage logistics.',
    category: 'Operating Processes',
    parent: null,
    children: ['4.1', '4.2', '4.3', '4.4', '4.5'],
    level: 1,
  },
  {
    id: '5.0',
    code: '5.0',
    title: 'Deliver Services',
    description: 'Manage service delivery. Design and develop service delivery infrastructure. Schedule service delivery. Deliver service to customer.',
    category: 'Operating Processes',
    parent: null,
    children: ['5.1', '5.2', '5.3', '5.4'],
    level: 1,
  },
  {
    id: '6.0',
    code: '6.0',
    title: 'Manage Customer Service',
    description: 'Develop customer care/customer service strategy. Plan and manage customer service operations. Measure and evaluate customer service.',
    category: 'Operating Processes',
    parent: null,
    children: ['6.1', '6.2', '6.3', '6.4'],
    level: 1,
  },
  {
    id: '7.0',
    code: '7.0',
    title: 'Develop and Manage Human Capital',
    description:
      'Develop and manage HR planning, policies and strategies. Recruit, source and select employees. Develop and counsel employees. Reward and retain employees.',
    category: 'Management and Support Processes',
    parent: null,
    children: ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6'],
    level: 1,
  },
  {
    id: '8.0',
    code: '8.0',
    title: 'Manage Information Technology',
    description: 'Manage the IT portfolio. Develop and maintain IT architecture. Manage IT infrastructure. Manage IT operations.',
    category: 'Management and Support Processes',
    parent: null,
    children: ['8.1', '8.2', '8.3', '8.4', '8.5'],
    level: 1,
  },
  {
    id: '9.0',
    code: '9.0',
    title: 'Manage Financial Resources',
    description:
      'Perform planning and management accounting. Perform revenue accounting. Perform general accounting. Manage fixed assets. Process payroll. Manage treasury operations.',
    category: 'Management and Support Processes',
    parent: null,
    children: ['9.1', '9.2', '9.3', '9.4', '9.5', '9.6'],
    level: 1,
  },
  {
    id: '10.0',
    code: '10.0',
    title: 'Acquire, Construct and Manage Assets',
    description: 'Design and construct productive assets. Maintain productive assets. Dispose of productive assets.',
    category: 'Management and Support Processes',
    parent: null,
    children: ['10.1', '10.2', '10.3'],
    level: 1,
  },
  {
    id: '11.0',
    code: '11.0',
    title: 'Manage Enterprise Risk, Compliance and Governance',
    description: 'Manage enterprise risk. Ensure compliance with regulations. Manage corporate governance. Manage environmental health and safety.',
    category: 'Management and Support Processes',
    parent: null,
    children: ['11.1', '11.2', '11.3', '11.4'],
    level: 1,
  },
  {
    id: '12.0',
    code: '12.0',
    title: 'Manage External Relationships',
    description:
      'Build and manage investor relationships. Manage government and industry relationships. Manage relations with board of directors. Manage legal and ethical issues.',
    category: 'Management and Support Processes',
    parent: null,
    children: ['12.1', '12.2', '12.3', '12.4'],
    level: 1,
  },
  {
    id: '13.0',
    code: '13.0',
    title: 'Develop and Manage Business Capabilities',
    description:
      'Manage business processes. Manage portfolio of enterprise programs. Manage enterprise quality. Manage change. Develop and manage enterprise-wide knowledge management.',
    category: 'Management and Support Processes',
    parent: null,
    children: ['13.1', '13.2', '13.3', '13.4', '13.5'],
    level: 1,
  },
]

/**
 * Converts APQC process to frontmatter and content
 */
function apqcToDocument(process: APQCProcess): { frontmatter: Record<string, FrontmatterValue>; content: string } {
  const frontmatter = {
    $id: `apqc:${process.id}`,
    $type: 'BusinessProcess',
    id: process.id,
    code: process.code,
    title: process.title,
    description: process.description,
    category: process.category,
    parent: process.parent,
    children: process.children,
    level: process.level,
  }

  const content = `# ${process.code} ${process.title}

${process.description}

## Process Details

- **Process ID**: ${process.id}
- **Code**: ${process.code}
- **Category**: ${process.category}
- **Level**: ${process.level} (${process.level === 1 ? 'Category' : process.level === 2 ? 'Process Group' : process.level === 3 ? 'Process' : 'Activity'})
${process.parent ? `- **Parent Process**: [${process.parent}](${toFilename(process.parent)}.mdx)` : ''}

## Process Hierarchy

${process.children.length > 0 ? `### Sub-Processes\n\n${process.children.map((c) => `- [${c}](${toFilename(c)}.mdx)`).join('\n')}` : 'No sub-processes defined at this level.'}

## Integration Points

This process typically integrates with:
- Strategic planning systems
- Project management tools
- Performance measurement systems
- Enterprise resource planning (ERP)

## Key Performance Indicators

Common KPIs for measuring this process include:
- Process efficiency metrics
- Quality indicators
- Cost measurements
- Time-to-completion metrics
- Compliance and governance metrics

## Best Practices

APQC benchmarking data shows that leading organizations in this process area:
- Standardize processes across the enterprise
- Leverage technology and automation
- Focus on continuous improvement
- Align processes with strategic objectives

## Resources

- [APQC Process Classification Framework](https://www.apqc.org/process-frameworks)
- [APQC Benchmarking](https://www.apqc.org/benchmarking)
- [APQC Best Practices](https://www.apqc.org/best-practices)
`

  return { frontmatter, content }
}

/**
 * Ingests APQC PCF data into .db/APQC/
 */
export async function ingestAPQC(): Promise<IngestionResult> {
  const startTime = Date.now()
  const result: IngestionResult = {
    source: 'APQC',
    totalRecords: APQC_PROCESSES.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    duration: 0,
  }

  try {
    // Process each APQC process
    for (const process of APQC_PROCESSES) {
      try {
        const filename = `${toFilename(process.id)}.mdx`
        const { frontmatter, content } = apqcToDocument(process)

        writeMDXFile(OUTPUT_DIR, filename, frontmatter, content)
        result.successCount++
      } catch (error) {
        result.errorCount++
        result.errors.push(`Failed to process APQC ${process.id} (${process.title}): ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  } catch (error) {
    result.errorCount++
    result.errors.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`)
  }

  result.duration = Date.now() - startTime
  logResult(result)

  return result
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestAPQC().catch(console.error)
}
