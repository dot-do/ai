import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SDK.do - TypeScript SDK for .do Platform',
  description: 'Build autonomous Business-as-Code with AI-native TypeScript SDKs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
