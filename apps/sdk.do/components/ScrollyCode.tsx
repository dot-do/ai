'use client'

import { ReactNode, createContext, useContext, useState, useEffect } from 'react'

interface SelectionContextType {
  selected: number
  setSelected: (index: number) => void
}

const SelectionContext = createContext<SelectionContextType>({
  selected: 0,
  setSelected: () => {},
})

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState(0)

  return <SelectionContext.Provider value={{ selected, setSelected }}>{children}</SelectionContext.Provider>
}

export function useSelection() {
  return useContext(SelectionContext)
}

interface SelectableProps {
  index: number
  children: ReactNode
  className?: string
}

export function Selectable({ index, children, className = '' }: SelectableProps) {
  const { selected, setSelected } = useSelection()
  const isSelected = selected === index

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setSelected(index)
          }
        })
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById(`selectable-${index}`)
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [index, setSelected])

  return (
    <div id={`selectable-${index}`} className={`min-h-screen flex items-center ${className}`} onClick={() => setSelected(index)}>
      <div className={`transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-40'}`}>{children}</div>
    </div>
  )
}

interface ScrollyLayoutProps {
  steps: ReactNode[]
  code: ReactNode
}

export function ScrollyLayout({ steps, code }: ScrollyLayoutProps) {
  return (
    <SelectionProvider>
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scrollable steps */}
          <div className="space-y-16 py-16">{steps}</div>

          {/* Sticky code panel */}
          <div className="lg:sticky lg:top-24 lg:h-screen lg:overflow-hidden">{code}</div>
        </div>
      </div>
    </SelectionProvider>
  )
}
