/**
 * O*NET SOC (Standard Occupational Classification) types
 * Comprehensive vocabulary for all O*NET entities
 */

/**
 * Core O*NET Occupation
 */
export interface Occupation {
  code: string // SOC code (e.g., "15-1252.00")
  title: string // Occupation title
  description: string // Occupation description
  alternativeTitles: string[]
  category: OccupationCategory
  tasks: Task[]
  skills: Skill[]
  abilities: Ability[]
  knowledge: Knowledge[]
  workActivities: WorkActivity[]
  workContext: WorkContext
  workValues: WorkValue[]
  workStyles: WorkStyle[]
  tools: Tool[]
  technology: Technology[]
  education: EducationRequirement
  experience: ExperienceRequirement
  credentials: Credential[]
  interests: Interest[]
  outlook: JobOutlook
}

export enum OccupationCategory {
  Management = 'Management',
  BusinessFinancial = 'Business and Financial Operations',
  ComputerMathematical = 'Computer and Mathematical',
  ArchitectureEngineering = 'Architecture and Engineering',
  LifePhysicalSocial = 'Life, Physical, and Social Science',
  CommunityServices = 'Community and Social Service',
  Legal = 'Legal',
  EducationLibrary = 'Education, Training, and Library',
  ArtsDesign = 'Arts, Design, Entertainment, Sports, and Media',
  Healthcare = 'Healthcare Practitioners and Technical',
  HealthcareSupport = 'Healthcare Support',
  ProtectiveService = 'Protective Service',
  FoodPreparation = 'Food Preparation and Serving',
  BuildingGrounds = 'Building and Grounds Cleaning and Maintenance',
  PersonalCare = 'Personal Care and Service',
  Sales = 'Sales and Related',
  OfficeAdministrative = 'Office and Administrative Support',
  FarmingFishingForestry = 'Farming, Fishing, and Forestry',
  ConstructionExtraction = 'Construction and Extraction',
  InstallationMaintenance = 'Installation, Maintenance, and Repair',
  Production = 'Production',
  TransportationMaterial = 'Transportation and Material Moving',
  Military = 'Military Specific',
}

/**
 * Task - Specific activities performed in an occupation
 */
export interface Task {
  id: string
  occupationCode: string
  statement: string
  category?: string
  importance: number // 1-5 scale
  frequency: number // 1-5 scale
}

/**
 * Skill - Developed capacities that facilitate learning or performance
 */
export interface Skill {
  id: string
  name: string
  description: string
  category: SkillCategory
  level: number // Required level (1-7 scale)
  importance: number // Importance (1-5 scale)
  examples: string[]
}

export enum SkillCategory {
  BasicSkills = 'Basic Skills',
  ComplexProblemSolving = 'Complex Problem Solving Skills',
  ResourceManagement = 'Resource Management Skills',
  SocialSkills = 'Social Skills',
  SystemsSkills = 'Systems Skills',
  TechnicalSkills = 'Technical Skills',
}

/**
 * Ability - Enduring attributes that influence performance
 */
export interface Ability {
  id: string
  name: string
  description: string
  category: AbilityCategory
  level: number // Required level (1-7 scale)
  importance: number // Importance (1-5 scale)
}

export enum AbilityCategory {
  Cognitive = 'Cognitive Abilities',
  Psychomotor = 'Psychomotor Abilities',
  Physical = 'Physical Abilities',
  Sensory = 'Sensory Abilities',
}

/**
 * Knowledge - Organized sets of principles and facts
 */
export interface Knowledge {
  id: string
  name: string
  description: string
  category: string
  level: number // Required level (1-7 scale)
  importance: number // Importance (1-5 scale)
  examples: string[]
}

/**
 * Work Activity - General types of job behaviors
 */
export interface WorkActivity {
  id: string
  name: string
  description: string
  category: WorkActivityCategory
  level: number
  importance: number
}

export enum WorkActivityCategory {
  Information = 'Information Input',
  MentalProcesses = 'Mental Processes',
  WorkOutput = 'Work Output',
  InteractingWithOthers = 'Interacting with Others',
}

/**
 * Work Context - Physical and social factors
 */
export interface WorkContext {
  interpersonalRelationships: ContextFactor[]
  physicalWorkConditions: ContextFactor[]
  structuralJobCharacteristics: ContextFactor[]
}

export interface ContextFactor {
  id: string
  name: string
  description: string
  level: number
}

/**
 * Work Value - Global aspects of work important to a person
 */
export interface WorkValue {
  id: string
  name: string
  description: string
  category: WorkValueCategory
  importance: number
}

export enum WorkValueCategory {
  Achievement = 'Achievement',
  WorkingConditions = 'Working Conditions',
  Recognition = 'Recognition',
  Relationships = 'Relationships',
  Support = 'Support',
  Independence = 'Independence',
}

/**
 * Work Style - Personal characteristics affecting work performance
 */
export interface WorkStyle {
  id: string
  name: string
  description: string
  importance: number
  examples: string[]
}

/**
 * Tool - Physical objects used in work
 */
export interface Tool {
  id: string
  name: string
  description: string
  category: string
  examples: string[]
}

/**
 * Technology - Specific software, equipment, or systems
 */
export interface Technology {
  id: string
  name: string
  description: string
  category: TechnologyCategory
  examples: string[]
  hotTechnology?: boolean // Emerging/in-demand technology
}

export enum TechnologyCategory {
  Software = 'Software',
  Equipment = 'Equipment',
  Hardware = 'Hardware',
  Systems = 'Systems',
  Platforms = 'Platforms',
}

/**
 * Education Requirement
 */
export interface EducationRequirement {
  level: EducationLevel
  typicalPrograms: string[]
  certifications: string[]
}

export enum EducationLevel {
  LessThanHighSchool = 'Less than High School',
  HighSchoolDiploma = 'High School Diploma',
  SomeCollege = 'Some College',
  AssociateDegree = 'Associate Degree',
  BachelorDegree = "Bachelor's Degree",
  MasterDegree = "Master's Degree",
  DoctoralDegree = 'Doctoral or Professional Degree',
}

/**
 * Experience Requirement
 */
export interface ExperienceRequirement {
  relatedExperience: ExperienceLevel
  onSiteTraining: ExperienceLevel
  onTheJobTraining: ExperienceLevel
}

export enum ExperienceLevel {
  None = 'None',
  UpTo1Month = 'Up to 1 month',
  OneToThreeMonths = '1 to 3 months',
  ThreeToSixMonths = '3 to 6 months',
  SixMonthsToOneYear = '6 months to 1 year',
  OneToTwoYears = '1 to 2 years',
  TwoToFourYears = '2 to 4 years',
  FourToSixYears = '4 to 6 years',
  SixToEightYears = '6 to 8 years',
  OverEightYears = 'Over 8 years',
}

/**
 * Credential - Licenses, certifications, registrations
 */
export interface Credential {
  id: string
  name: string
  type: CredentialType
  organization: string
  required: boolean
}

export enum CredentialType {
  License = 'License',
  Certification = 'Certification',
  Registration = 'Registration',
}

/**
 * Interest - Holland RIASEC interest areas
 */
export interface Interest {
  code: RIASECCode
  level: number // Interest level (1-7 scale)
}

export enum RIASECCode {
  Realistic = 'R', // Doers
  Investigative = 'I', // Thinkers
  Artistic = 'A', // Creators
  Social = 'S', // Helpers
  Enterprising = 'E', // Persuaders
  Conventional = 'C', // Organizers
}

/**
 * Job Outlook - Employment projections
 */
export interface JobOutlook {
  growthRate: GrowthRate
  openings: number // Annual job openings
  projectionPeriod: string // e.g., "2021-2031"
  medianPay: number // Annual median wage
}

export enum GrowthRate {
  Declining = 'Declining',
  LittleOrNoChange = 'Little or no change',
  SlowerThanAverage = 'Slower than average',
  Average = 'Average',
  FasterThanAverage = 'Faster than average',
  MuchFasterThanAverage = 'Much faster than average',
}

/**
 * O*NET Vocabulary - Complete dataset
 */
export interface ONETVocabulary {
  occupations: Occupation[]
  skills: Map<string, Skill>
  abilities: Map<string, Ability>
  knowledge: Map<string, Knowledge>
  workActivities: Map<string, WorkActivity>
  tools: Map<string, Tool>
  technologies: Map<string, Technology>
  version: string
  fetchedAt: string
}

/**
 * Search and query options
 */
export interface SearchOptions {
  limit?: number
  category?: OccupationCategory
  educationLevel?: EducationLevel
  minMedianPay?: number
  growthRate?: GrowthRate
  includeOutlook?: boolean
}

export interface SearchResult {
  occupation: Occupation
  score: number
  matchedOn: string[]
}
