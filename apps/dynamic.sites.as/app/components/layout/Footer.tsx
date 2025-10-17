import { ExternalLink, Edit } from 'lucide-react'

interface FooterProps {
  packageName: string
  editUrl?: string
}

export function Footer({ packageName, editUrl }: FooterProps) {
  return (
    <footer className="mt-12 border-t pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          {editUrl && (
            <a
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit this page
            </a>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          Powered by{' '}
          <a
            href="https://sdk.do"
            className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            sdk.do
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}
