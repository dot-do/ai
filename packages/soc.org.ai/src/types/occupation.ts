/**
 * O*NET Occupation types
 */

export interface Occupation {
  onetCode: string
  title: string
  description?: string
  alternativeTitles?: string[]
  tasks?: string[]
  jobZone?: number
}

export interface OccupationDetail extends Occupation {
  abilities?: AbilityRating[]
  skills?: SkillRating[]
  knowledge?: KnowledgeRating[]
  workActivities?: WorkActivityRating[]
  workContext?: WorkContextRating[]
  interests?: InterestRating[]
  workValues?: WorkValueRating[]
  workStyles?: WorkStyleRating[]
  education?: EducationRequirement
  experience?: ExperienceRequirement
}

export interface AbilityRating {
  elementId: string
  elementName: string
  scaleId: string
  dataValue: number
  description?: string
}

export interface SkillRating {
  elementId: string
  elementName: string
  scaleId: string
  dataValue: number
  description?: string
}

export interface KnowledgeRating {
  elementId: string
  elementName: string
  scaleId: string
  dataValue: number
  description?: string
}

export interface WorkActivityRating {
  elementId: string
  elementName: string
  scaleId: string
  dataValue: number
  description?: string
}

export interface WorkContextRating {
  elementId: string
  elementName: string
  scaleId: string
  category?: string
  dataValue: number
}

export interface InterestRating {
  elementId: string
  elementName: string
  scaleId: string
  dataValue: number
  code?: string // RIASEC code
}

export interface WorkValueRating {
  elementId: string
  elementName: string
  scaleId: string
  dataValue: number
}

export interface WorkStyleRating {
  elementId: string
  elementName: string
  scaleId: string
  dataValue: number
}

export interface EducationRequirement {
  category: string
  value: number
}

export interface ExperienceRequirement {
  category: string
  value: number
}

export interface TaskStatement {
  taskId: string
  task: string
  taskType?: string
  incumbentsResponding?: number
}

export interface AlternativeTitle {
  alternateTitle: string
  shortTitle?: string
}

export interface Tool {
  commodityCode: string
  commodityTitle: string
  example?: string
}

export interface Technology {
  commodityCode: string
  commodityTitle: string
  hotTechnology?: boolean
  example?: string
}
