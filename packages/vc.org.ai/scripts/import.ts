/**
 * Import Crunchbase Open Data CSV files
 *
 * Downloads and processes Crunchbase CSV exports:
 * - Organizations
 * - Funding Rounds
 * - Investors
 * - Acquisitions
 * - People
 *
 * Generates TypeScript data files with semantic relationships
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import type { Company, FundingRound, Investor, Acquisition, Person } from '../src/types/crunchbase.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SAMPLE_MODE = process.argv.includes('--sample')

// Crunchbase Open Data sources
// NOTE: User needs to download from https://data.crunchbase.com/docs/open-data-map
// and place in scripts/data/ directory
const DATA_DIR = path.join(__dirname, 'data')
const OUTPUT_DIR = path.join(__dirname, '../src/data')

interface CrunchbaseOrganization {
  uuid: string
  name: string
  permalink: string
  cb_url: string
  legal_name?: string
  short_description?: string
  description?: string
  city?: string
  region?: string
  country_code?: string
  founded_on?: string
  closed_on?: string
  category_list?: string
  num_funding_rounds?: string
  total_funding_usd?: string
  last_funding_on?: string
  last_funding_type?: string
  employee_count?: string
  homepage_url?: string
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
}

interface CrunchbaseFunding {
  uuid: string
  name: string
  permalink: string
  funding_type: string
  announced_on?: string
  raised_amount_usd?: string
  investor_count?: string
  org_uuid?: string
}

interface CrunchbaseInvestor {
  uuid: string
  name: string
  permalink: string
  investor_type?: string
  city?: string
  region?: string
  country_code?: string
  investment_count?: string
}

async function readCSV<T>(filename: string): Promise<T[]> {
  const filepath = path.join(DATA_DIR, filename)
  try {
    const content = await fs.readFile(filepath, 'utf-8')
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    })
  } catch (error) {
    console.warn(`⚠️  Could not read ${filename}:`, error instanceof Error ? error.message : error)
    return []
  }
}

function parseCompany(row: CrunchbaseOrganization): Company {
  return {
    $type: 'Company',
    $id: `https://vc.org.ai/companies/${row.permalink}`,
    name: row.name,
    uuid: row.uuid,
    permalink: row.permalink,
    crunchbaseUrl: row.cb_url,
    legalName: row.legal_name,
    shortDescription: row.short_description,
    longDescription: row.description,
    city: row.city,
    region: row.region,
    countryCode: row.country_code,
    foundedDate: row.founded_on,
    closedDate: row.closed_on,
    categories: row.category_list?.split(',').map((c) => c.trim()),
    totalFundingRounds: row.num_funding_rounds ? parseInt(row.num_funding_rounds) : undefined,
    totalFundingUsd: row.total_funding_usd ? parseFloat(row.total_funding_usd) : undefined,
    lastFundingDate: row.last_funding_on,
    lastFundingType: row.last_funding_type as any,
    employeeCount: row.employee_count,
    homepageUrl: row.homepage_url,
    linkedinUrl: row.linkedin_url,
    twitterUrl: row.twitter_url,
    facebookUrl: row.facebook_url,
  }
}

function parseFundingRound(row: CrunchbaseFunding): FundingRound {
  return {
    $type: 'FundingRound',
    $id: `https://vc.org.ai/funding-rounds/${row.permalink}`,
    name: row.name,
    uuid: row.uuid,
    permalink: row.permalink,
    fundingType: row.funding_type as any,
    announcedDate: row.announced_on,
    amountRaisedUsd: row.raised_amount_usd ? parseFloat(row.raised_amount_usd) : undefined,
    investorCount: row.investor_count ? parseInt(row.investor_count) : undefined,
    organization: row.org_uuid ? { $id: `https://vc.org.ai/companies/${row.org_uuid}` } : undefined,
  }
}

function parseInvestor(row: CrunchbaseInvestor): Investor {
  return {
    $type: 'Investor',
    $id: `https://vc.org.ai/investors/${row.permalink}`,
    name: row.name,
    uuid: row.uuid,
    permalink: row.permalink,
    investorType: row.investor_type as any,
    city: row.city,
    region: row.region,
    country: row.country_code,
    investmentCount: row.investment_count ? parseInt(row.investment_count) : undefined,
  }
}

async function generateDataFile<T>(filename: string, items: T[]): Promise<void> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const content = `/**
 * Generated from Crunchbase Open Data
 * ${new Date().toISOString()}
 */

export const ${filename} = ${JSON.stringify(items, null, 2)} as const
`

  await fs.writeFile(path.join(OUTPUT_DIR, `${filename}.ts`), content)
  console.log(`✅ Generated ${filename}.ts with ${items.length} items`)
}

async function importCrunchbase() {
  console.log(SAMPLE_MODE ? '📦 Sample import mode' : '🚀 Full import mode')

  // Read CSV files
  const [orgs, funding, investors] = await Promise.all([
    readCSV<CrunchbaseOrganization>('organizations.csv'),
    readCSV<CrunchbaseFunding>('funding_rounds.csv'),
    readCSV<CrunchbaseInvestor>('investors.csv'),
  ])

  if (orgs.length === 0) {
    console.log(`
⚠️  No data found. Please download Crunchbase Open Data CSV files:
   https://data.crunchbase.com/docs/open-data-map

   Place files in: ${DATA_DIR}/
   - organizations.csv
   - funding_rounds.csv
   - investors.csv
   - acquisitions.csv
   - people.csv
`)
    return
  }

  // Parse and transform
  let companies = orgs.map(parseCompany)
  let fundingRounds = funding.map(parseFundingRound)
  let investorsList = investors.map(parseInvestor)

  // Sample mode: take first 100 of each
  if (SAMPLE_MODE) {
    companies = companies.slice(0, 100)
    fundingRounds = fundingRounds.slice(0, 100)
    investorsList = investorsList.slice(0, 100)
  }

  // Generate TypeScript files
  await Promise.all([
    generateDataFile('companies', companies),
    generateDataFile('funding_rounds', fundingRounds),
    generateDataFile('investors', investorsList),
  ])

  console.log(`
✅ Import complete!
   Companies: ${companies.length}
   Funding Rounds: ${fundingRounds.length}
   Investors: ${investorsList.length}
`)
}

// Run import
importCrunchbase().catch(console.error)
