import { FC } from 'hono/jsx'
import { resolveWikilinkUrl } from '@/lib/wikilinks'

interface WikiLinkProps {
  link: string
  alias?: string
  class?: string
}

export const WikiLink: FC<WikiLinkProps> = ({ link, alias, class: className }) => {
  const url = resolveWikilinkUrl(link)
  const displayText = alias || link

  // Determine if cross-package link
  const isCrossPackage = link.includes('.org.ai') || link.includes('.sites.as')

  return (
    <a
      href={url}
      class={`wikilink inline-flex items-center gap-1 text-primary hover:underline ${className || ''}`}
      {...(isCrossPackage ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {displayText}
      {isCrossPackage && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="inline-block"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" x2="21" y1="14" y2="3"></line>
        </svg>
      )}
    </a>
  )
}
