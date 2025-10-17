/**
 * Semantic predicates for graph relationships
 */

/**
 * Schema.org predicates
 */
export type SchemaPredicate =
  | 'name'
  | 'description'
  | 'url'
  | 'image'
  | 'author'
  | 'publisher'
  | 'dateCreated'
  | 'dateModified'
  | 'datePublished'
  | 'about'
  | 'mentions'
  | 'knowsAbout'
  | 'hasOccupation'
  | 'worksFor'
  | 'memberOf'
  | 'owns'
  | 'seeks'
  | 'alumni'
  | 'children'
  | 'colleague'
  | 'follows'
  | 'knows'
  | 'parent'
  | 'relatedTo'
  | 'sibling'
  | 'spouse'
  | 'additionalType'
  | 'alternateName'
  | 'sameAs'
  | 'subjectOf'

/**
 * GS1/EPCIS predicates
 */
export type EPCISPredicate =
  | 'containedIn'
  | 'transformedFrom'
  | 'transformedTo'
  | 'assembledFrom'
  | 'disassembledTo'
  | 'ownedBy'
  | 'possessedBy'
  | 'locatedAt'
  | 'shippedTo'
  | 'receivedFrom'
  | 'commissionedBy'
  | 'decommissionedBy'
  | 'inspectedBy'

/**
 * O*NET predicates
 */
export type OnetPredicate =
  | 'requiresAbility'
  | 'requiresSkill'
  | 'requiresKnowledge'
  | 'performsActivity'
  | 'hasTask'
  | 'worksInContext'
  | 'hasInterest'
  | 'valuesWork'
  | 'requiresEducation'
  | 'requiresExperience'
  | 'usesTool'
  | 'usesTechnology'
  | 'relatedOccupation'

/**
 * Universal predicates
 */
export type UniversalPredicate =
  | 'is'
  | 'isA'
  | 'has'
  | 'partOf'
  | 'relatedTo'
  | 'contains'
  | 'references'
  | 'dependsOn'
  | 'causes'
  | 'enables'
  | 'prevents'
  | 'requires'

/**
 * All predicates
 */
export type Predicate = SchemaPredicate | EPCISPredicate | OnetPredicate | UniversalPredicate | string

/**
 * All entities from Schema.org, GS1, and O*NET
 */
export type Entity = string // Will be overridden with imports from other packages

/**
 * Arrays of predicates by category
 */
export const schemaPredicates: SchemaPredicate[] = [
  'name',
  'description',
  'url',
  'image',
  'author',
  'publisher',
  'dateCreated',
  'dateModified',
  'datePublished',
  'about',
  'mentions',
  'knowsAbout',
  'hasOccupation',
  'worksFor',
  'memberOf',
  'owns',
  'seeks',
  'alumni',
  'children',
  'colleague',
  'follows',
  'knows',
  'parent',
  'relatedTo',
  'sibling',
  'spouse',
  'additionalType',
  'alternateName',
  'sameAs',
  'subjectOf',
]

export const epcisPredicates: EPCISPredicate[] = [
  'containedIn',
  'transformedFrom',
  'transformedTo',
  'assembledFrom',
  'disassembledTo',
  'ownedBy',
  'possessedBy',
  'locatedAt',
  'shippedTo',
  'receivedFrom',
  'commissionedBy',
  'decommissionedBy',
  'inspectedBy',
]

export const onetPredicates: OnetPredicate[] = [
  'requiresAbility',
  'requiresSkill',
  'requiresKnowledge',
  'performsActivity',
  'hasTask',
  'worksInContext',
  'hasInterest',
  'valuesWork',
  'requiresEducation',
  'requiresExperience',
  'usesTool',
  'usesTechnology',
  'relatedOccupation',
]

export const universalPredicates: UniversalPredicate[] = [
  'is',
  'isA',
  'has',
  'partOf',
  'relatedTo',
  'contains',
  'references',
  'dependsOn',
  'causes',
  'enables',
  'prevents',
  'requires',
]

/**
 * All predicates as an array
 */
export const allPredicates: Predicate[] = [...schemaPredicates, ...epcisPredicates, ...onetPredicates, ...universalPredicates]
