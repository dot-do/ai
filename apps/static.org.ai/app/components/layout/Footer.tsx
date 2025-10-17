import { FC } from 'hono/jsx'

interface FooterProps {
  packageName: string
  editUrl?: string
}

export const Footer: FC<FooterProps> = ({ packageName, editUrl }) => {
  return (
    <footer class="mt-12 border-t pt-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          {editUrl && (
            <a
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit this page
            </a>
          )}
        </div>

        <div class="text-sm text-muted-foreground">
          Powered by{' '}
          <a
            href="https://sdk.do"
            class="font-medium text-foreground hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            sdk.do
          </a>
        </div>
      </div>
    </footer>
  )
}
