import { Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

export default jsxRenderer(({ children, title, frontmatter }) => {
  const pageTitle = title || frontmatter?.title || 'Documentation'
  const packageName = 'static.sites.as'

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle} | {packageName}</title>
        <link rel="stylesheet" href="/app/styles/global.css" />
        <Script src="/app/islands/theme-toggle.ts" />
        <Script src="/app/islands/mobile-menu.ts" />
        <Script src="/app/islands/folder-toggle.ts" />
        <Style />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
})
