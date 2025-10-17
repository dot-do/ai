import { FC } from 'hono/jsx'

interface NavItem {
  title: string
  href: string
  active?: boolean
}

interface NavFolder {
  title: string
  defaultOpen?: boolean
  items: (NavItem | NavFolder)[]
}

interface NavSection {
  title: string
  items: (NavItem | NavFolder)[]
}

interface SidebarProps {
  navigation: NavSection[]
  currentPath: string
}

const isNavItem = (item: NavItem | NavFolder): item is NavItem => {
  return 'href' in item
}

const NavItemComponent: FC<{ item: NavItem }> = ({ item }) => {
  return (
    <a
      href={item.href}
      class={`block rounded-md px-3 py-2 text-sm transition-colors ${
        item.active
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      {item.title}
    </a>
  )
}

const NavFolderComponent: FC<{ folder: NavFolder }> = ({ folder }) => {
  return (
    <div class="space-y-1">
      <button
        class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
        data-folder-toggle
      >
        <span>{folder.title}</span>
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
          class="transition-transform"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>
      <div class={`ml-4 space-y-1 ${folder.defaultOpen ? '' : 'hidden'}`} data-folder-content>
        {folder.items.map((item) =>
          isNavItem(item) ? (
            <NavItemComponent item={item} />
          ) : (
            <NavFolderComponent folder={item} />
          )
        )}
      </div>
    </div>
  )
}

const NavSectionComponent: FC<{ section: NavSection }> = ({ section }) => {
  return (
    <div class="pb-4">
      <h4 class="mb-2 px-3 text-sm font-semibold text-foreground">{section.title}</h4>
      <div class="space-y-1">
        {section.items.map((item) =>
          isNavItem(item) ? (
            <NavItemComponent item={item} />
          ) : (
            <NavFolderComponent folder={item} />
          )
        )}
      </div>
    </div>
  )
}

export const Sidebar: FC<SidebarProps> = ({ navigation, currentPath }) => {
  return (
    <aside class="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r bg-background md:block">
      <nav class="space-y-1 py-6 px-4">
        {navigation.map((section) => (
          <NavSectionComponent section={section} />
        ))}
      </nav>
    </aside>
  )
}
