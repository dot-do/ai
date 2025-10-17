import '@/app/global.css'

import type { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { RootProvider } from 'fumadocs-ui/provider'
import { Analytics } from '@vercel/analytics/react'

import { cn } from '@/utils/cn'
import { baseUrl, createMetadata } from '@/utils/metadata'

export const metadata = createMetadata({
  title: {
    template: '%s | .do Platform',
    default: '.do Platform Documentation',
  },
  description: 'Build autonomous Business-as-Code with AI-delivered Services-as-Software on the .do platform.',
  metadataBase: baseUrl,
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  )
}
