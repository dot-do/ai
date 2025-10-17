import { FC } from 'hono/jsx'

export interface Backlink {
  title: string
  href: string
  excerpt: string
}

interface BacklinksProps {
  backlinks: Backlink[]
}

export const Backlinks: FC<BacklinksProps> = ({ backlinks }) => {
  if (backlinks.length === 0) return null

  return (
    <div class="mt-12 border-t pt-6">
      <h2 class="mb-4 text-lg font-semibold text-foreground">Backlinks</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        {backlinks.length} {backlinks.length === 1 ? 'page links' : 'pages link'} to this page:
      </p>
      <ul class="space-y-3">
        {backlinks.map((backlink) => (
          <li class="rounded-md border p-3 hover:bg-accent transition-colors">
            <a href={backlink.href} class="block">
              <div class="mb-1 font-medium text-foreground hover:text-primary">
                {backlink.title}
              </div>
              <div class="text-sm text-muted-foreground line-clamp-2">
                {backlink.excerpt}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
