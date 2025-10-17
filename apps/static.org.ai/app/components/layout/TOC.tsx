import { FC } from 'hono/jsx'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TOCProps {
  items: TOCItem[]
}

export const TOC: FC<TOCProps> = ({ items }) => {
  if (items.length === 0) return null

  return (
    <aside class="fixed right-0 top-14 hidden h-[calc(100vh-3.5rem)] w-50 overflow-y-auto xl:block">
      <div class="py-6 px-4">
        <h4 class="mb-4 text-sm font-semibold text-foreground">On this page</h4>
        <nav class="text-sm">
          <ul class="space-y-2">
            {items.map((item) => (
              <li class={item.level > 2 ? 'pl-4' : ''}>
                <a
                  href={`#${item.id}`}
                  class="text-muted-foreground hover:text-foreground transition-colors"
                  data-toc-link={item.id}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
