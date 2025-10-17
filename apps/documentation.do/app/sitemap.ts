import type { MetadataRoute } from 'next'
import { baseUrl } from '@/utils/metadata'
import { source } from '@/app/source'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string): string => new URL(path, baseUrl).toString()

  return [
    {
      url: url('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: url('/docs'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...source.getPages().map<MetadataRoute.Sitemap[number]>((page) => {
      const pageData = page.data as any
      return {
        url: url(page.url),
        lastModified: pageData.lastModified ? new Date(pageData.lastModified) : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }
    }),
  ]
}
