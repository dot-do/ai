/**
 * Override schema-dts types to use $ prefix instead of @ prefix
 * All properties use $ for consistency with mdxld
 */
type ReplaceAtPrefix<T> = {
  [K in keyof T as K extends `@${infer Rest}` ? `$${Rest}` : K]: T[K]
}

/**
 * Base Schema.org Thing type with $ prefix
 */
export interface Thing {
  $context?: string | Record<string, any>
  $type: string | string[]
  $id?: string
  name?: string
  description?: string
  url?: string
  image?: string | ImageObject | ImageObject[]
  alternateName?: string
  sameAs?: string | string[]
  [key: string]: any
}

/**
 * ImageObject type
 */
export interface ImageObject extends Thing {
  $type: 'ImageObject'
  contentUrl?: string
  thumbnail?: ImageObject
  width?: number | string
  height?: number | string
}

/**
 * Property definition
 */
export interface Property {
  name: string
  label: string
  comment?: string
  domainIncludes?: string[]
  rangeIncludes?: string[]
  url?: string
}

/**
 * Type definition
 */
export interface Type {
  name: string
  label: string
  comment?: string
  subTypeOf?: string[]
  properties?: string[]
  url?: string
}

/**
 * Schema.org datatype
 */
export interface Datatype {
  name: string
  label: string
  comment?: string
  url?: string
}

/**
 * Schema.org enumeration
 */
export interface Enumeration extends Type {
  members?: string[]
}

/**
 * Schema.org enumeration member
 */
export interface EnumerationMember {
  name: string
  label: string
  comment?: string
  enumeration?: string
  url?: string
}
