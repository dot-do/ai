import { notFound } from 'next/navigation'
import { DocsBody, DocsCategory, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page'

import { GitHubIcon } from '@/icons'
import { source } from '@/app/source'
import { createMetadata } from '@/utils/metadata'
import { mdxComponents } from '@/utils/mdx-components'

interface Params {
  slug: string[]
}

export const dynamicParams = false

export default async function Page({ params }: { params: Params }) {
  const page = source.getPage(params.slug)

  if (page == null) notFound()

  const path = `apps/docs/content/docs/${page.file.path}`

  const footer = (
    <a
      href={`https://github.com/sunarjs/sunar/blob/main/${path}`}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-x-2 text-stone-700 hover:text-stone-600 dark:text-stone-400 dark:hover:text-stone-300"
    >
      <GitHubIcon className="size-3" />
      <span className="text-xs">Edit on Github ↗</span>
    </a>
  )

  const pageData = page.data as any

  return (
    <DocsPage
      toc={pageData.toc}
      lastUpdate={pageData.lastModified}
      tableOfContent={{
        enabled: true,
        style: 'clerk',
        footer,
      }}
      tableOfContentPopover={{ footer }}
    >
      <DocsTitle>{pageData.title}</DocsTitle>
      <DocsDescription>{pageData.description}</DocsDescription>
      <DocsBody>
        <pageData.body components={mdxComponents} />
        {pageData.index ? <DocsCategory page={page} pages={source.getPages()} /> : null}
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams(): Params[] {
  return source.generateParams()
}

export async function generateMetadata({ params }: { params: Params }) {
  const page = source.getPage(params.slug)

  if (page == null) notFound()

  const pageData = page.data as any
  const description = pageData.description ?? 'Build autonomous Business-as-Code with AI-delivered Services-as-Software on the .do platform.'

  const imageParams = new URLSearchParams()
  imageParams.set('title', pageData.title)
  imageParams.set('description', description)

  const image = {
    alt: 'Banner',
    url: `/api/og?${imageParams.toString()}`,
    width: 1200,
    height: 630,
  }

  return createMetadata({
    title: pageData.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
      images: image,
    },
    twitter: {
      images: image,
    },
  })
}
