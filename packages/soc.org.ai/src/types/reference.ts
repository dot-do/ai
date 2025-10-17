/**
 * O*NET Reference Data types
 */

export interface Ability {
  elementId: string
  elementName: string
  description: string
}

export interface Skill {
  elementId: string
  elementName: string
  description: string
}

export interface Knowledge {
  elementId: string
  elementName: string
  description: string
}

export interface WorkActivity {
  elementId: string
  elementName: string
  description: string
}

export interface DWAReference {
  dwaId: string
  dwaTitle: string
  iwaId: string
}

export interface IWAReference {
  iwaId: string
  iwaTitle: string
}

export interface JobZone {
  jobZone: number
  name: string
  experience: string
  education: string
  jobTraining: string
  examples?: string
}

export interface Interest {
  elementId: string
  elementName: string
  description: string
}

export interface WorkValue {
  elementId: string
  elementName: string
  description: string
}

export interface WorkStyle {
  elementId: string
  elementName: string
  description: string
}

export interface Scale {
  scaleId: string
  scaleName: string
  minimum?: number
  maximum?: number
}

export interface ContentModelReference {
  elementId: string
  elementName: string
  elementType: string
  description?: string
}
