/**
 * NAICS (North American Industry Classification System) Data Ingestion
 * Source: https://www.census.gov/naics/
 */

import { join } from 'path'
import type { IngestionResult, NAICSCode, FrontmatterValue } from './types.js'
import { toFilename, logResult, writeMDXFile } from './types.js'

const OUTPUT_DIR = join(process.cwd(), '.db', 'NAICS')

/**
 * NAICS 2-digit sector codes (top level)
 * Source: https://www.census.gov/naics/
 *
 * TODO: Future enhancement - fetch from Census Bureau API
 * API endpoint: https://api.census.gov/data/2022/naics
 */
const NAICS_SECTORS: NAICSCode[] = [
  {
    code: '11',
    title: 'Agriculture, Forestry, Fishing and Hunting',
    description:
      'Industries engaged in growing crops, raising animals, harvesting timber, and harvesting fish and other animals from farms, ranches, or their natural habitats.',
    parent: null,
    children: ['111', '112', '113', '114', '115'],
    level: 1,
  },
  {
    code: '21',
    title: 'Mining, Quarrying, and Oil and Gas Extraction',
    description:
      'Industries engaged in extracting naturally occurring mineral solids, such as coal and ores; liquid minerals, such as crude petroleum; and gases.',
    parent: null,
    children: ['211', '212', '213'],
    level: 1,
  },
  {
    code: '22',
    title: 'Utilities',
    description: 'Industries engaged in providing electric power, natural gas, steam supply, water supply, and sewage removal.',
    parent: null,
    children: ['221'],
    level: 1,
  },
  {
    code: '23',
    title: 'Construction',
    description: 'Industries engaged in the construction of buildings and other structures, heavy construction (except buildings), and specialty trade work.',
    parent: null,
    children: ['236', '237', '238'],
    level: 1,
  },
  {
    code: '31-33',
    title: 'Manufacturing',
    description: 'Industries engaged in the mechanical, physical, or chemical transformation of materials, substances, or components into new products.',
    parent: null,
    children: [
      '311',
      '312',
      '313',
      '314',
      '315',
      '316',
      '321',
      '322',
      '323',
      '324',
      '325',
      '326',
      '327',
      '331',
      '332',
      '333',
      '334',
      '335',
      '336',
      '337',
      '339',
    ],
    level: 1,
  },
  {
    code: '42',
    title: 'Wholesale Trade',
    description:
      'Industries engaged in wholesaling merchandise, generally without transformation, and rendering services incidental to the sale of merchandise.',
    parent: null,
    children: ['423', '424', '425'],
    level: 1,
  },
  {
    code: '44-45',
    title: 'Retail Trade',
    description: 'Industries engaged in retailing merchandise, generally without transformation, and rendering services incidental to the sale of merchandise.',
    parent: null,
    children: ['441', '442', '443', '444', '445', '446', '447', '448', '451', '452', '453', '454'],
    level: 1,
  },
  {
    code: '48-49',
    title: 'Transportation and Warehousing',
    description:
      'Industries engaged in providing transportation of passengers and cargo, warehousing and storage, and services related to these modes of transportation.',
    parent: null,
    children: ['481', '482', '483', '484', '485', '486', '487', '488', '491', '492', '493'],
    level: 1,
  },
  {
    code: '51',
    title: 'Information',
    description:
      'Industries engaged in producing and distributing information and cultural products, providing the means to transmit or distribute these products, and processing data.',
    parent: null,
    children: ['511', '512', '515', '517', '518', '519'],
    level: 1,
  },
  {
    code: '52',
    title: 'Finance and Insurance',
    description:
      'Industries engaged in financial transactions and facilitating financial transactions, including raising funds, pooling risk, and facilitating investment.',
    parent: null,
    children: ['521', '522', '523', '524', '525'],
    level: 1,
  },
  {
    code: '53',
    title: 'Real Estate and Rental and Leasing',
    description: 'Industries engaged in renting, leasing, or allowing the use of tangible or intangible assets, and providing related services.',
    parent: null,
    children: ['531', '532', '533'],
    level: 1,
  },
  {
    code: '54',
    title: 'Professional, Scientific, and Technical Services',
    description: 'Industries engaged in processes where human capital is the major input, providing services where labor is the primary cost component.',
    parent: null,
    children: ['541'],
    level: 1,
  },
  {
    code: '55',
    title: 'Management of Companies and Enterprises',
    description:
      'Industries engaged in holding securities or financial assets of companies and enterprises for purposes of owning controlling interest or influencing management decisions.',
    parent: null,
    children: ['551'],
    level: 1,
  },
  {
    code: '56',
    title: 'Administrative and Support and Waste Management and Remediation Services',
    description: 'Industries engaged in performing routine support activities for the day-to-day operations of other organizations.',
    parent: null,
    children: ['561', '562'],
    level: 1,
  },
  {
    code: '61',
    title: 'Educational Services',
    description: 'Industries engaged in providing instruction and training in a wide variety of subjects.',
    parent: null,
    children: ['611'],
    level: 1,
  },
  {
    code: '62',
    title: 'Health Care and Social Assistance',
    description: 'Industries engaged in providing health care and social assistance for individuals.',
    parent: null,
    children: ['621', '622', '623', '624'],
    level: 1,
  },
  {
    code: '71',
    title: 'Arts, Entertainment, and Recreation',
    description:
      'Industries engaged in operating facilities or providing services to meet cultural, entertainment, and recreational interests of their patrons.',
    parent: null,
    children: ['711', '712', '713'],
    level: 1,
  },
  {
    code: '72',
    title: 'Accommodation and Food Services',
    description: 'Industries engaged in providing customers with lodging and/or preparing meals, snacks, and beverages for immediate consumption.',
    parent: null,
    children: ['721', '722'],
    level: 1,
  },
  {
    code: '81',
    title: 'Other Services (except Public Administration)',
    description: 'Industries engaged in providing services not specifically provided for elsewhere in the classification system.',
    parent: null,
    children: ['811', '812', '813', '814'],
    level: 1,
  },
  {
    code: '92',
    title: 'Public Administration',
    description:
      'Industries engaged in activities of a governmental nature, including legislative, taxation, national defense, public order and safety, and administration of government programs.',
    parent: null,
    children: ['921', '922', '923', '924', '925', '926', '927', '928'],
    level: 1,
  },
]

/**
 * Converts NAICS code to frontmatter and content
 */
function naicsToDocument(naics: NAICSCode): { frontmatter: Record<string, FrontmatterValue>; content: string } {
  const frontmatter = {
    $id: `naics:${naics.code}`,
    $type: 'IndustryClassification',
    code: naics.code,
    title: naics.title,
    description: naics.description,
    parent: naics.parent,
    children: naics.children,
    level: naics.level,
  }

  const content = `# ${naics.title} (NAICS ${naics.code})

${naics.description}

## Classification Details

- **Code**: ${naics.code}
- **Level**: ${naics.level} (${naics.level === 1 ? 'Sector' : naics.level === 2 ? 'Subsector' : naics.level === 3 ? 'Industry Group' : naics.level === 4 ? 'NAICS Industry' : 'National Industry'})
${naics.parent ? `- **Parent**: ${naics.parent}` : ''}
${naics.children.length > 0 ? `- **Children**: ${naics.children.length} subcategories` : ''}

## Related Classifications

${naics.children.length > 0 ? `### Subcategories\n\n${naics.children.map((c) => `- [${c}](${c}.mdx)`).join('\n')}` : 'No subcategories available.'}

## Sources

- [NAICS Official Site](https://www.census.gov/naics/)
- [Census Bureau NAICS ${naics.code}](https://www.census.gov/naics/?code=${naics.code})
`

  return { frontmatter, content }
}

/**
 * Ingests NAICS data into .db/NAICS/
 */
export async function ingestNAICS(): Promise<IngestionResult> {
  const startTime = Date.now()
  const result: IngestionResult = {
    source: 'NAICS',
    totalRecords: NAICS_SECTORS.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    duration: 0,
  }

  try {
    // Process each NAICS sector
    for (const sector of NAICS_SECTORS) {
      try {
        const filename = `${toFilename(sector.code)}.mdx`
        const { frontmatter, content } = naicsToDocument(sector)

        writeMDXFile(OUTPUT_DIR, filename, frontmatter, content)
        result.successCount++
      } catch (error) {
        result.errorCount++
        result.errors.push(`Failed to process NAICS ${sector.code} (${sector.title}): ${error instanceof Error ? error.message : String(error)}`)
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
  ingestNAICS().catch(console.error)
}
