/**
 * O*NET Tools and Technology Data Ingestion
 * Source: O*NET database / Tools & Technology listings
 */

import { join } from 'path'
import type { IngestionResult, ONetTool, FrontmatterValue } from './types.js'
import { toFilename, logResult, writeMDXFile } from './types.js'

const OUTPUT_DIR = join(process.cwd(), '.db', 'ONet', 'Tools')

/**
 * O*NET Tools and Technology
 * Sample data from O*NET database for various occupations
 *
 * TODO: Future enhancement - fetch from O*NET database API
 * Database: https://www.onetcenter.org/database.html
 * API: https://services.onetcenter.org/
 */
const ONET_TOOLS: ONetTool[] = [
  // Software Development Tools
  {
    code: 'TOOL-001',
    name: 'Git',
    description: 'Distributed version control system for tracking changes in source code',
    category: 'Software',
    occupations: ['15-1252.00'], // Software Developers
    vendor: 'Git SCM',
  },
  {
    code: 'TOOL-002',
    name: 'Visual Studio Code',
    description: 'Source code editor with support for debugging and version control',
    category: 'Software',
    occupations: ['15-1252.00', '15-1299.08'], // Software Developers, Web Developers
    vendor: 'Microsoft',
  },
  {
    code: 'TOOL-003',
    name: 'TypeScript',
    description: 'Strongly typed programming language that builds on JavaScript',
    category: 'Technology',
    occupations: ['15-1252.00', '15-1299.08'], // Software Developers, Web Developers
    vendor: 'Microsoft',
  },
  {
    code: 'TOOL-004',
    name: 'Docker',
    description: 'Platform for developing, shipping, and running applications in containers',
    category: 'Software',
    occupations: ['15-1252.00', '15-1244.00'], // Software Developers, Network Architects
    vendor: 'Docker Inc',
  },
  {
    code: 'TOOL-005',
    name: 'Kubernetes',
    description: 'Container orchestration system for automating deployment and scaling',
    category: 'Software',
    occupations: ['15-1252.00', '15-1244.00'], // Software Developers, Network Architects
  },
  // Data Science Tools
  {
    code: 'TOOL-006',
    name: 'Python',
    description: 'High-level programming language for data analysis and machine learning',
    category: 'Technology',
    occupations: ['15-2051.00', '15-1252.00'], // Data Scientists, Software Developers
  },
  {
    code: 'TOOL-007',
    name: 'TensorFlow',
    description: 'Open source platform for machine learning',
    category: 'Software',
    occupations: ['15-2051.00', '15-2099.01'], // Data Scientists, Machine Learning Engineers
    vendor: 'Google',
  },
  {
    code: 'TOOL-008',
    name: 'Jupyter Notebook',
    description: 'Web application for creating and sharing computational documents',
    category: 'Software',
    occupations: ['15-2051.00', '15-2041.00'], // Data Scientists, Statisticians
  },
  {
    code: 'TOOL-009',
    name: 'PyTorch',
    description: 'Machine learning framework for deep learning applications',
    category: 'Software',
    occupations: ['15-2051.00', '15-2099.01'], // Data Scientists, Machine Learning Engineers
    vendor: 'Meta',
  },
  {
    code: 'TOOL-010',
    name: 'Apache Spark',
    description: 'Unified analytics engine for large-scale data processing',
    category: 'Software',
    occupations: ['15-2051.00', '15-1243.00'], // Data Scientists, Database Architects
  },
  // Design Tools
  {
    code: 'TOOL-011',
    name: 'Figma',
    description: 'Collaborative interface design tool',
    category: 'Software',
    occupations: ['27-1021.00', '15-1255.00'], // Graphic Designers, Web and Digital Interface Designers
    vendor: 'Figma Inc',
  },
  {
    code: 'TOOL-012',
    name: 'Adobe Photoshop',
    description: 'Raster graphics editor for image editing and compositing',
    category: 'Software',
    occupations: ['27-1021.00', '27-1024.00'], // Graphic Designers, Multimedia Artists
    vendor: 'Adobe',
  },
  {
    code: 'TOOL-013',
    name: 'Sketch',
    description: 'Vector graphics editor for digital design',
    category: 'Software',
    occupations: ['27-1021.00', '15-1255.00'], // Graphic Designers, Web Designers
    vendor: 'Sketch B.V.',
  },
  // Project Management Tools
  {
    code: 'TOOL-014',
    name: 'Jira',
    description: 'Issue tracking and project management software',
    category: 'Software',
    occupations: ['11-3021.00', '15-1252.00'], // Project Managers, Software Developers
    vendor: 'Atlassian',
  },
  {
    code: 'TOOL-015',
    name: 'Trello',
    description: 'Web-based kanban-style project management application',
    category: 'Software',
    occupations: ['11-3021.00', '13-1082.00'], // Project Managers, Business Analysts
    vendor: 'Atlassian',
  },
  {
    code: 'TOOL-016',
    name: 'Asana',
    description: 'Work management platform for organizing and tracking tasks',
    category: 'Software',
    occupations: ['11-3021.00', '13-1082.00'], // Project Managers, Business Analysts
    vendor: 'Asana Inc',
  },
  // Communication Tools
  {
    code: 'TOOL-017',
    name: 'Slack',
    description: 'Business communication platform with channels and direct messaging',
    category: 'Software',
    occupations: ['11-3021.00', '15-1252.00', '13-1082.00'], // Various
    vendor: 'Slack Technologies',
  },
  {
    code: 'TOOL-018',
    name: 'Microsoft Teams',
    description: 'Collaboration platform with chat, meetings, and file sharing',
    category: 'Software',
    occupations: ['11-3021.00', '43-6011.00'], // Project Managers, Office Clerks
    vendor: 'Microsoft',
  },
  {
    code: 'TOOL-019',
    name: 'Zoom',
    description: 'Video conferencing and online meeting software',
    category: 'Software',
    occupations: ['11-3021.00', '27-3031.00'], // Project Managers, Public Relations Specialists
    vendor: 'Zoom Video Communications',
  },
  // Database Tools
  {
    code: 'TOOL-020',
    name: 'PostgreSQL',
    description: 'Open source relational database management system',
    category: 'Software',
    occupations: ['15-1243.00', '15-1252.00'], // Database Architects, Software Developers
  },
]

/**
 * Converts O*NET tool to frontmatter and content
 */
function onetToDocument(tool: ONetTool): { frontmatter: Record<string, FrontmatterValue>; content: string } {
  const frontmatter = {
    $id: `onet:tool:${tool.code}`,
    $type: 'ONetTool',
    code: tool.code,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    occupations: tool.occupations,
    vendor: tool.vendor || '',
  }

  const content = `# ${tool.name}

${tool.description}

## Tool Details

- **Tool Code**: ${tool.code}
- **Category**: ${tool.category}
${tool.vendor ? `- **Vendor**: ${tool.vendor}` : ''}
- **Associated Occupations**: ${tool.occupations.length}

## Associated Occupations

This tool is commonly used by the following occupations:

${tool.occupations.map((occ) => `- **${occ}**: [View on O*NET](https://www.onetonline.org/link/summary/${occ})`).join('\n')}

## Tool Type

**${tool.category}**: ${
    tool.category === 'Software'
      ? 'Application software used for specific tasks'
      : tool.category === 'Technology'
        ? 'Programming languages, frameworks, and technical platforms'
        : tool.category === 'Tools'
          ? 'Physical or digital tools used in work'
          : 'Equipment and hardware used in work'
  }

## Common Use Cases

### Professional Applications

1. **Daily Work**: Core tool used in regular work activities
2. **Collaboration**: Facilitates teamwork and communication
3. **Productivity**: Enhances efficiency and output quality
4. **Problem Solving**: Enables solutions to complex challenges
5. **Innovation**: Supports creative and technical work

### Skills Required

To effectively use ${tool.name}, professionals typically need:
- Technical proficiency in ${tool.category.toLowerCase()} tools
- Understanding of relevant workflows and processes
- Problem-solving and analytical skills
- Continuous learning and adaptation
- Collaboration and communication abilities

## Learning Resources

### Getting Started

- Search for "${tool.name} tutorial" online
- Visit official documentation and guides
${tool.vendor ? `- Check ${tool.vendor}'s official website` : ''}
- Join community forums and user groups
- Practice with hands-on projects

### Certifications

Some tools offer professional certifications that can enhance career prospects:
- Look for vendor-provided certification programs
- Explore industry-recognized credentials
- Consider bootcamps and training courses

## Career Implications

### Job Market

${tool.name} is a valuable skill in the job market:
- Listed in job postings for ${tool.occupations.length} occupation${tool.occupations.length > 1 ? 's' : ''}
- Increasingly important in digital workplace
- Enhances employability and career advancement
- May qualify for higher compensation

### Related Occupations

Explore careers that use ${tool.name}:
${tool.occupations.map((occ) => `- [${occ}](https://www.onetonline.org/link/summary/${occ})`).join('\n')}

## Industry Adoption

**${tool.category}** tools like ${tool.name} are widely adopted across industries:
- Technology and Software Development
- Finance and Business Services
- Healthcare and Life Sciences
- Education and Research
- Manufacturing and Engineering

## Support and Resources

- [O*NET OnLine](https://www.onetonline.org/)
- [O*NET Tools & Technology](https://www.onetonline.org/find/descriptor/browse/Tools_and_Technology/)
${tool.vendor ? `- ${tool.vendor} official website` : ''}
- Community forums and user groups
- Training platforms (LinkedIn Learning, Coursera, Udemy)

## Related Tools

Browse more tools in the ${tool.category} category:
- Explore similar tools on [O*NET](https://www.onetonline.org/)
- Compare features and capabilities
- Research emerging tools and technologies
`

  return { frontmatter, content }
}

/**
 * Ingests O*NET tools data into .db/ONet/Tools/
 */
export async function ingestONet(): Promise<IngestionResult> {
  const startTime = Date.now()
  const result: IngestionResult = {
    source: 'O*NET Tools',
    totalRecords: ONET_TOOLS.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    duration: 0,
  }

  try {
    // Process each O*NET tool
    for (const tool of ONET_TOOLS) {
      try {
        const filename = `${toFilename(tool.name)}.mdx`
        const { frontmatter, content } = onetToDocument(tool)

        writeMDXFile(OUTPUT_DIR, filename, frontmatter, content)
        result.successCount++
      } catch (error) {
        result.errorCount++
        result.errors.push(`Failed to process O*NET tool ${tool.name}: ${error instanceof Error ? error.message : String(error)}`)
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
  ingestONet().catch(console.error)
}
