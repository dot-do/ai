/**
 * Crunchbase data type definitions for vc.org.ai
 *
 * Based on Crunchbase Open Data CSV export structure
 */

import type { Thing, Ref } from './base.js'

/**
 * Organization types in Crunchbase
 */
export type OrganizationType = 'company' | 'investor' | 'school' | 'group'

/**
 * Company status
 */
export type CompanyStatus = 'operating' | 'closed' | 'acquired' | 'ipo'

/**
 * Funding round types
 */
export type FundingRoundType =
  | 'pre_seed'
  | 'seed'
  | 'angel'
  | 'series_a'
  | 'series_b'
  | 'series_c'
  | 'series_d'
  | 'series_e'
  | 'series_f'
  | 'series_g'
  | 'series_h'
  | 'venture'
  | 'private_equity'
  | 'debt_financing'
  | 'convertible_note'
  | 'grant'
  | 'corporate_round'
  | 'equity_crowdfunding'
  | 'product_crowdfunding'
  | 'secondary_market'
  | 'post_ipo_equity'
  | 'post_ipo_debt'
  | 'post_ipo_secondary'
  | 'non_equity_assistance'
  | 'undisclosed'

/**
 * Company - Organization from Crunchbase
 *
 * Represents a company, startup, or organization in the Crunchbase dataset
 */
export interface Company extends Thing {
  $type: 'Company'

  // Crunchbase identifiers
  uuid: string // Crunchbase UUID
  permalink: string // Crunchbase permalink (e.g., "anthropic")
  crunchbaseUrl?: string // Full Crunchbase URL

  // Basic info
  legalName?: string // Legal entity name
  organizationType?: OrganizationType
  status?: CompanyStatus
  shortDescription?: string
  longDescription?: string

  // Location
  city?: string
  region?: string
  country?: string
  countryCode?: string

  // Dates
  foundedDate?: string // ISO 8601
  closedDate?: string // If closed/acquired
  lastFundingDate?: string

  // Funding
  totalFundingUsd?: number
  totalFundingRounds?: number
  lastFundingType?: FundingRoundType
  lastFundingAmount?: number
  employeeCount?: string // Range (e.g., "11-50")

  // Categories
  categories?: string[] // Industry categories
  categoryGroups?: string[] // Higher-level groups

  // Website & social
  homepageUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  facebookUrl?: string

  // Semantic relationships (explicit predicates)
  fundedBy?: Ref[] // $.Company.fundedBy.Investor
  acquiredBy?: Ref // $.Company.acquiredBy.Company
  founded?: Ref[] // $.Company.founded.Person
  operates?: Ref[] // $.Company.operates.Product
  competes?: Ref[] // $.Company.competes.Company
  partOf?: Ref // $.Company.partOf.Company (parent)
}

/**
 * FundingRound - Investment round from Crunchbase
 */
export interface FundingRound extends Thing {
  $type: 'FundingRound'

  // Crunchbase identifiers
  uuid: string
  permalink: string

  // Round details
  fundingType: FundingRoundType
  announcedDate?: string // ISO 8601
  closedDate?: string
  amountRaised?: number // USD
  amountRaisedUsd?: number
  targetFunding?: number
  preMoneyValuation?: number
  postMoneyValuation?: number
  investorCount?: number

  // Semantic relationships (explicit predicates)
  organization?: Ref // $.FundingRound.organization.Company
  leadInvestors?: Ref[] // $.FundingRound.leadInvestors.Investor
  investors?: Ref[] // $.FundingRound.investors.Investor
}

/**
 * Investor - VC firm, angel investor, or investment organization
 */
export interface Investor extends Thing {
  $type: 'Investor'

  // Crunchbase identifiers
  uuid: string
  permalink: string
  crunchbaseUrl?: string

  // Investor details
  investorType?: 'venture_capital' | 'angel' | 'private_equity' | 'corporate_venture_capital' | 'accelerator'
  investmentCount?: number
  totalInvestmentAmount?: number

  // Location
  city?: string
  region?: string
  country?: string

  // Profile
  description?: string
  homepageUrl?: string
  linkedinUrl?: string

  // Semantic relationships (explicit predicates)
  invested?: Ref[] // $.Investor.invested.Company
  portfolioCompanies?: Ref[] // $.Investor.portfolioCompanies.Company
  exitedFrom?: Ref[] // $.Investor.exitedFrom.Company
}

/**
 * Acquisition - Company acquisition from Crunchbase
 */
export interface Acquisition extends Thing {
  $type: 'Acquisition'

  // Crunchbase identifiers
  uuid: string
  permalink: string

  // Acquisition details
  announcedDate?: string
  completedDate?: string
  price?: number // USD
  priceUsd?: number
  acquisitionType?: 'acquisition' | 'merger' | 'buyout'
  acquisitionStatus?: 'completed' | 'pending' | 'cancelled'

  // Semantic relationships (explicit predicates)
  acquirer?: Ref // $.Acquisition.acquirer.Company
  acquiree?: Ref // $.Acquisition.acquiree.Company
}

/**
 * Person - Founder, executive, or key person from Crunchbase
 */
export interface Person extends Thing {
  $type: 'Person'

  // Crunchbase identifiers
  uuid: string
  permalink: string

  // Personal info
  firstName?: string
  lastName?: string
  gender?: string

  // Profile
  title?: string
  bio?: string
  linkedinUrl?: string
  twitterUrl?: string

  // Semantic relationships (explicit predicates)
  worksAt?: Ref[] // $.Person.worksAt.Company
  founded?: Ref[] // $.Person.founded.Company
  advisorTo?: Ref[] // $.Person.advisorTo.Company
  investedIn?: Ref[] // $.Person.investedIn.Company (as angel)
}
