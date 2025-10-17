# enterprises.org.ai Package

**Date**: 2025-10-16
**Status**: Planning
**Purpose**: Complete the .org.ai portfolio cycle connecting do.industries → do.enterprises

## Overview

The `enterprises.org.ai` package will provide structured data about large companies and enterprises, completing the organizational hierarchy:

```
startups.org.ai         → AI-first startups (vc.org.ai data)
vc.org.ai               → Venture capital ecosystem
enterprises.org.ai      → Large companies and enterprises
industries.org.ai       → Industry classifications
business.org.ai         → Business abstractions
```

## Data Sources

### 1. Crunchbase (Large Companies)

Filter organizations by:
- Status: Operating, Public
- Employee count: >1000
- Total funding: >$100M or IPO status

### 2. SEC EDGAR

Public company filings:
- **10-K** - Annual reports
- **10-Q** - Quarterly reports
- **8-K** - Material events
- **DEF 14A** - Proxy statements

**API**: https://www.sec.gov/edgar/sec-api-documentation

### 3. Fortune 500/1000

- Revenue rankings
- Industry classifications
- Headquarters locations

### 4. S&P 500/Russell 3000

- Market cap data
- Stock symbols
- Index memberships

### 5. LinkedIn Company Pages

- Employee counts
- Company size
- Growth metrics
- Technology stack

## Package Structure

```
ai/packages/enterprises.org.ai/
├── package.json
├── README.mdx
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts
│   ├── types/
│   │   ├── base.ts
│   │   ├── enterprise.ts
│   │   ├── sec-filing.ts
│   │   └── index.ts
│   └── data/
│       ├── enterprises.ts (generated)
│       └── filings.ts (generated)
└── scripts/
    ├── import-crunchbase.ts
    ├── import-edgar.ts
    ├── import-fortune.ts
    └── import.ts (orchestrator)
```

## Type Definitions

### Enterprise

```typescript
export interface Enterprise extends Thing {
  $type: 'Enterprise'
  $id: string // https://enterprises.org.ai/[ticker-or-slug]

  // Identifiers
  ticker?: string // Stock symbol (AAPL, GOOGL)
  cik?: string // SEC CIK number
  lei?: string // Legal Entity Identifier
  duns?: string // Dun & Bradstreet number
  crunchbaseUuid?: string // Crunchbase reference

  // Basic Info
  legalName: string
  tradingName?: string
  foundedYear?: number
  status: EnterpriseStatus

  // Location
  headquarters: Address
  locations?: Location[]
  countries?: string[] // Operating countries

  // Size & Scale
  employeeCount?: number
  employeeCountRange?: EmployeeRange
  revenue?: number // Annual revenue (USD)
  revenueRange?: RevenueRange
  marketCap?: number // For public companies

  // Classification
  primaryIndustry: string // NAICS code
  secondaryIndustries?: string[]
  sectorClassification?: Sector
  fortune500Rank?: number
  fortune1000Rank?: number

  // Public Company Data
  isPublic: boolean
  stockExchange?: StockExchange
  ipoDate?: string
  indexMembership?: IndexMembership[]

  // Digital Transformation
  digitalMaturity?: DigitalMaturity
  aiAdoption?: AIAdoptionLevel
  cloudStrategy?: CloudStrategy
  techStack?: string[] // Known technologies

  // Semantic Relationships
  operatesIn?: Ref[] // $.Enterprise.operatesIn.Industry
  acquired?: Ref[] // $.Enterprise.acquired.Company
  competes?: Ref[] // $.Enterprise.competes.Enterprise
  partneredWith?: Ref[] // $.Enterprise.partneredWith.Organization
  subsidiaries?: Ref[] // $.Enterprise.subsidiaries.Company
  parent?: Ref // $.Enterprise.parent.Enterprise
  secFilings?: Ref[] // $.Enterprise.secFilings.SECFiling
}

export type EnterpriseStatus =
  | 'operating'
  | 'acquired'
  | 'merged'
  | 'bankrupt'
  | 'dissolved'

export type EmployeeRange =
  | '1K-5K'
  | '5K-10K'
  | '10K-50K'
  | '50K-100K'
  | '100K-500K'
  | '500K+'

export type RevenueRange =
  | '100M-500M'
  | '500M-1B'
  | '1B-5B'
  | '5B-10B'
  | '10B-50B'
  | '50B-100B'
  | '100B-500B'
  | '500B+'

export type StockExchange =
  | 'NYSE'
  | 'NASDAQ'
  | 'LSE'
  | 'TSE'
  | 'HKSE'

export type Sector =
  | 'Technology'
  | 'Healthcare'
  | 'Financial Services'
  | 'Consumer Goods'
  | 'Industrial'
  | 'Energy'
  | 'Telecommunications'
  | 'Retail'
  | 'Real Estate'

export type IndexMembership =
  | 'S&P 500'
  | 'Dow Jones Industrial Average'
  | 'NASDAQ-100'
  | 'Russell 1000'
  | 'Russell 3000'
  | 'FTSE 100'

export type DigitalMaturity =
  | 'Digital Native'
  | 'Digital Leader'
  | 'Digital Adopter'
  | 'Digital Beginner'
  | 'Pre-Digital'

export type AIAdoptionLevel =
  | 'AI Leader'
  | 'AI Adopter'
  | 'AI Experimenter'
  | 'AI Aware'
  | 'AI Unaware'

export type CloudStrategy =
  | 'Cloud Native'
  | 'Cloud First'
  | 'Hybrid Cloud'
  | 'Multi-Cloud'
  | 'On-Premise'
```

### SECFiling

```typescript
export interface SECFiling extends Thing {
  $type: 'SECFiling'
  $id: string // https://enterprises.org.ai/filings/[cik]-[accession]

  // Identifiers
  cik: string
  accessionNumber: string
  filingType: FilingType

  // Dates
  filingDate: string
  reportDate: string
  acceptedDate: string

  // Content
  documentUrl: string
  htmlUrl: string
  xmlUrl?: string

  // Company
  company: Ref // $.SECFiling.company.Enterprise
  fiscalYear?: number
  fiscalPeriod?: FiscalPeriod

  // Extracted Data
  revenueReported?: number
  netIncomeReported?: number
  assetsTotal?: number
  liabilitiesTotal?: number
  shareholdersEquity?: number
}

export type FilingType =
  | '10-K'  // Annual report
  | '10-Q'  // Quarterly report
  | '8-K'   // Material events
  | 'DEF 14A' // Proxy statement
  | '13F'   // Institutional holdings
  | 'S-1'   // IPO registration

export type FiscalPeriod = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY'
```

## Data Import Pipeline

### Phase 1: Crunchbase Large Companies

```typescript
// scripts/import-crunchbase.ts
async function importLargeCompanies() {
  // Filter Crunchbase organizations
  const enterprises = organizations.filter((org) => {
    const employeeRange = parseEmployeeRange(org.employee_count)
    const funding = org.total_funding_usd || 0

    return (
      org.status === 'operating' &&
      (employeeRange >= 1000 || org.status === 'ipo' || funding > 100_000_000)
    )
  })

  // Transform to Enterprise type
  const transformed = enterprises.map(transformToEnterprise)

  // Generate TypeScript file
  await generateDataFile('enterprises', transformed)
}
```

### Phase 2: SEC EDGAR Filings

```typescript
// scripts/import-edgar.ts
async function importEDGARFilings() {
  // Fetch company tickers from SEC
  const tickersUrl = 'https://www.sec.gov/files/company_tickers.json'
  const tickers = await fetch(tickersUrl).then(r => r.json())

  for (const company of tickers) {
    // Get latest filings for each company
    const filings = await fetchCompanyFilings(company.cik_str)

    // Filter for key filing types
    const keyFilings = filings.filter((f) =>
      ['10-K', '10-Q', '8-K', 'DEF 14A'].includes(f.form)
    )

    // Store filings data
    await storeFilings(company.cik_str, keyFilings)
  }
}

async function fetchCompanyFilings(cik: string) {
  const url = `https://data.sec.gov/submissions/CIK${cik.padStart(10, '0')}.json`
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'platform.do contact@platform.do',
    },
  })
  return await response.json()
}
```

### Phase 3: Fortune Rankings

```typescript
// scripts/import-fortune.ts
async function importFortuneRankings() {
  // Note: Fortune data requires web scraping or paid API
  // Alternative: Use public datasets or partner with data providers

  const fortune500 = await fetchFortune500()

  for (const company of fortune500) {
    // Match with existing enterprises by name/ticker
    const enterprise = await matchEnterprise(company)

    if (enterprise) {
      // Enrich with Fortune data
      enterprise.fortune500Rank = company.rank
      enterprise.revenue = company.revenue
      enterprise.sectorClassification = company.sector
    }
  }
}
```

## Ingestion Architecture

Similar to vc.org.ai, but more complex due to multiple sources:

```
Data Sources (Crunchbase, EDGAR, Fortune, S&P)
  ↓
Cloudflare Worker (scheduled monthly)
  ↓
Entity Resolution (deduplicate across sources)
  ↓
R2 Storage (structured data)
  ↓
R2 SQL Catalog (query layer)
```

### Entity Resolution

Critical challenge: Match same company across different sources.

**Matching Strategy:**
1. **Exact match** - Ticker symbols (AAPL, GOOGL)
2. **CIK match** - SEC identifier
3. **Name matching** - Fuzzy matching on legal name
4. **Domain matching** - Company websites
5. **Manual curation** - For ambiguous cases

```typescript
interface EntityMatcher {
  matchByTicker(ticker: string): Enterprise | null
  matchByCIK(cik: string): Enterprise | null
  matchByName(name: string): Enterprise | null
  matchByDomain(domain: string): Enterprise | null

  // Confidence scoring
  confidence(match: Enterprise, source: DataSource): number
}
```

## R2 SQL Schema

```sql
CREATE TABLE enterprises.companies (
  id STRING,
  ticker STRING,
  cik STRING,
  legal_name STRING,
  trading_name STRING,
  founded_year INT,
  status STRING,

  -- Location
  hq_city STRING,
  hq_state STRING,
  hq_country STRING,

  -- Size
  employee_count INT,
  revenue DECIMAL,
  market_cap DECIMAL,

  -- Classification
  primary_industry STRING,
  sector STRING,
  fortune500_rank INT,

  -- Public company data
  is_public BOOLEAN,
  stock_exchange STRING,
  ipo_date DATE,

  -- Digital transformation
  digital_maturity STRING,
  ai_adoption STRING,

  updated_at TIMESTAMP
)
USING iceberg
LOCATION 'r2://enterprises-catalog/companies'
PARTITIONED BY (sector, hq_country)

CREATE TABLE enterprises.filings (
  id STRING,
  cik STRING,
  accession_number STRING,
  filing_type STRING,
  filing_date DATE,
  report_date DATE,
  company_id STRING,

  -- Financial data
  revenue DECIMAL,
  net_income DECIMAL,
  total_assets DECIMAL,

  updated_at TIMESTAMP
)
USING iceberg
LOCATION 'r2://enterprises-catalog/filings'
PARTITIONED BY (year(filing_date), filing_type)
```

## Use Cases

### 1. do.enterprises ICP Targeting

```typescript
// Find enterprises in AI transformation phase
const aiTargets = await db.query({
  subject: $.Enterprise,
  where: {
    aiAdoption: { $in: ['AI Aware', 'AI Experimenter'] },
    digitalMaturity: { $in: ['Digital Adopter', 'Digital Beginner'] },
    revenue: { $gte: 1_000_000_000 }, // $1B+
    employeeCount: { $gte: 5000 },
  },
})

// Rank by transformation potential
const ranked = aiTargets
  .map((e) => ({
    enterprise: e,
    score: calculateTransformationPotential(e),
  }))
  .sort((a, b) => b.score - a.score)
```

### 2. Industry Analysis

```typescript
// Compare digital maturity across sectors
const sectorAnalysis = await db.query({
  aggregate: [
    { $group: { _id: '$sector', avgMaturity: { $avg: '$digitalMaturity' } } },
    { $sort: { avgMaturity: -1 } },
  ],
  subject: $.Enterprise,
})
```

### 3. Competitive Intelligence

```typescript
// Find competitors of a company
const enterprise = await db.get($.Enterprise, 'https://enterprises.org.ai/AAPL')

const competitors = await db.related(enterprise, $.competes, $.Enterprise)

// Analyze competitive positioning
const analysis = {
  target: enterprise,
  competitors: competitors.map((c) => ({
    name: c.name,
    marketCap: c.marketCap,
    revenue: c.revenue,
    digitalMaturity: c.digitalMaturity,
    aiAdoption: c.aiAdoption,
  })),
}
```

## Semantic Relationships

### With Other .org.ai Packages

```typescript
// Enterprise → Industries
await db.relate(
  enterprise,
  $.operatesIn,
  { $id: 'https://industries.org.ai/ArtificialIntelligence' }
)

// Enterprise → Startups (acquisitions)
await db.relate(
  enterprise,
  $.acquired,
  { $id: 'https://vc.org.ai/companies/anthropic' }
)

// Enterprise → Technologies
const techStack = await db.related(enterprise, $.uses, $.Technology)

// Enterprise → Occupations
const employedRoles = await db.related(enterprise, $.employs, $.Occupation)

// Enterprise → Processes
const runningProcesses = await db.related(enterprise, $.implements, $.BusinessProcess)
```

## Implementation Phases

### Phase 1: Core Package (Week 1)
- [ ] Create package structure
- [ ] Define TypeScript types
- [ ] Setup Crunchbase import
- [ ] Generate sample data (top 100)

### Phase 2: SEC Integration (Week 2)
- [ ] Implement EDGAR API client
- [ ] Parse 10-K/10-Q filings
- [ ] Extract financial data
- [ ] Link filings to enterprises

### Phase 3: Entity Resolution (Week 3)
- [ ] Build matching algorithms
- [ ] Deduplicate across sources
- [ ] Manual curation interface
- [ ] Confidence scoring

### Phase 4: Enrichment (Week 4)
- [ ] Fortune rankings integration
- [ ] S&P/Russell index data
- [ ] Digital maturity scoring
- [ ] AI adoption assessment

### Phase 5: Production (Week 5)
- [ ] R2 SQL catalog
- [ ] Ingestion workers
- [ ] API endpoints
- [ ] Analytics dashboards

## Metrics & Analytics

Track key metrics for do.enterprises ICP:

```typescript
interface EnterpriseMetrics {
  // Market
  totalEnterprises: number
  byRevenueBand: Record<RevenueRange, number>
  bySector: Record<Sector, number>
  byCountry: Record<string, number>

  // Digital transformation
  digitalMaturityDistribution: Record<DigitalMaturity, number>
  aiAdoptionDistribution: Record<AIAdoptionLevel, number>
  cloudStrategyDistribution: Record<CloudStrategy, number>

  // ICP targeting
  icpMatchCount: number
  icpByStage: Record<string, number>
  icpByIndustry: Record<string, number>
}
```

## Next Steps

1. **Create GitHub issue** for enterprises.org.ai package
2. **Prototype** with Crunchbase data
3. **Test** SEC EDGAR integration
4. **Build** entity resolution
5. **Deploy** ingestion pipeline

## Related

- **vc.org.ai** - Startups and venture capital
- **industries.org.ai** - Industry classifications
- **business.org.ai** - Business abstractions
- **do.enterprises** - ICP brand
- **do.industries** - Industry brand
