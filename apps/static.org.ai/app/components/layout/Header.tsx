import { FC } from 'hono/jsx'

interface HeaderProps {
  packageName: string
}

export const Header: FC<HeaderProps> = ({ packageName }) => {
  return (
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div class="container mx-auto flex h-14 items-center px-6">
        <div class="mr-4 flex items-center">
          <a href="/" class="flex items-center space-x-2 hover:opacity-80">
            <span class="text-xl font-bold text-foreground">{packageName}</span>
          </a>
        </div>

        <nav class="hidden md:flex items-center gap-6">
          <a
            href="/docs"
            class="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Documentation
          </a>
          <a
            href="/about"
            class="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            About
          </a>
        </nav>

        <div class="ml-auto flex items-center gap-2">
          <button
            id="search-button"
            class="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>

          <button
            id="theme-toggle"
            class="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle theme"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="sun"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </button>

          <button
            id="mobile-menu-button"
            class="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground md:hidden"
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
