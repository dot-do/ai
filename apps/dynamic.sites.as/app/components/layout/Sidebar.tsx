import { Link, useLocation } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '~/lib/utils'
import { useState } from 'react'

interface NavItem {
  title: string
  href: string
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
  isOpen?: boolean
  onClose?: () => void
}

function isNavItem(item: NavItem | NavFolder): item is NavItem {
  return 'href' in item
}

function NavItemComponent({ item }: { item: NavItem }) {
  const location = useLocation()
  const isActive = location.pathname === item.href

  return (
    <Link
      to={item.href}
      className={cn(
        'block rounded-md px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {item.title}
    </Link>
  )
}

function NavFolderComponent({ folder }: { folder: NavFolder }) {
  const [isOpen, setIsOpen] = useState(folder.defaultOpen ?? false)

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        <span>{folder.title}</span>
        <ChevronRight
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')}
        />
      </button>
      {isOpen && (
        <div className="ml-4 space-y-1">
          {folder.items.map((item, index) =>
            isNavItem(item) ? (
              <NavItemComponent key={index} item={item} />
            ) : (
              <NavFolderComponent key={index} folder={item} />
            )
          )}
        </div>
      )}
    </div>
  )
}

function NavSectionComponent({ section }: { section: NavSection }) {
  return (
    <div className="pb-4">
      <h4 className="mb-2 px-3 text-sm font-semibold text-foreground">{section.title}</h4>
      <div className="space-y-1">
        {section.items.map((item, index) =>
          isNavItem(item) ? (
            <NavItemComponent key={index} item={item} />
          ) : (
            <NavFolderComponent key={index} folder={item} />
          )
        )}
      </div>
    </div>
  )
}

export function Sidebar({ navigation, isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r bg-background md:block">
        <nav className="space-y-1 py-6 px-4">
          {navigation.map((section, index) => (
            <NavSectionComponent key={index} section={section} />
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <aside className="fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r bg-background md:hidden">
            <nav className="space-y-1 py-6 px-4">
              {navigation.map((section, index) => (
                <NavSectionComponent key={index} section={section} />
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  )
}
