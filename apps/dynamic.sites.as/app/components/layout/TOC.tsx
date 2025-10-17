import { cn } from '~/lib/utils'
import { useEffect, useState } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TOCProps {
  items: TOCItem[]
}

export function TOC({ items }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%' }
    )

    items.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <aside className="fixed right-0 top-14 hidden h-[calc(100vh-3.5rem)] w-50 overflow-y-auto xl:block">
      <div className="py-6 px-4">
        <h4 className="mb-4 text-sm font-semibold text-foreground">On this page</h4>
        <nav className="text-sm">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className={item.level > 2 ? 'pl-4' : ''}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    'text-muted-foreground hover:text-foreground transition-colors',
                    activeId === item.id && 'text-foreground font-medium'
                  )}
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
