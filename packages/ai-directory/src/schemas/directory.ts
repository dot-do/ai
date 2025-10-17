import { z } from 'zod'

export const directoryItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
  .and(z.record(z.any()))

export const directoryCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  count: z.number().optional(),
})

export const directoryDataSourceSchema = z.object({
  database: z
    .object({
      uri: z.string().optional(),
      instance: z.any().optional(),
      collection: z.string().optional(),
    })
    .optional(),
  api: z
    .object({
      endpoint: z.string().optional(),
      listEndpoint: z.string().optional(),
      detailEndpoint: z.string().optional(),
      searchEndpoint: z.string().optional(),
    })
    .optional(),
  items: z.array(directoryItemSchema).optional(),
  categories: z.array(directoryCategorySchema).optional(),
})

export const directorySchema = z.object({
  name: z.string(),
  description: z.string(),
  nextConfig: z.record(z.any()).optional(),
  appDir: z.string().optional(),
  aiFunctions: z.record(z.any()).optional(),
  aiProps: z.record(z.any()).optional(),

  dataSource: directoryDataSourceSchema,

  searchFields: z.array(z.string()).optional(),
  defaultSortField: z.string().optional(),
  defaultSortOrder: z.enum(['asc', 'desc']).optional(),
  itemsPerPage: z.number().optional(),

  layoutOptions: z
    .object({
      showSearch: z.boolean().optional(),
      showCategories: z.boolean().optional(),
      showFilters: z.boolean().optional(),
      gridColumns: z.number().optional(),
      listView: z.boolean().optional(),
    })
    .optional(),
})
