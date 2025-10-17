import { icons } from 'lucide-react'
import { createElement } from 'react'
import { type InferMetaType, type InferPageType, loader } from 'fumadocs-core/source'
import { createMDXSource } from 'fumadocs-mdx'

import { meta, docs } from '@/.source'
import { IconContainer } from '@/components/ui/icon'

export const source = loader({
  baseUrl: '/docs',
  icon(icon) {
    if (icon && icon in icons)
      // @ts-expect-error - React 18 types compatibility issue with createElement
      return createElement(IconContainer, {
        icon: icons[icon as keyof typeof icons],
      })
  },
  // @ts-expect-error - Type compatibility issue with fumadocs types
  source: createMDXSource(docs, meta),
})

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
