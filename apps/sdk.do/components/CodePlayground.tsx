'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useSelection } from './ScrollyCode'

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface CodeExample {
  title: string
  code: string
  language?: string
}

interface CodePlaygroundProps {
  examples: CodeExample[]
  defaultTab?: number
}

export function CodePlayground({ examples, defaultTab = 0 }: CodePlaygroundProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { selected } = useSelection()

  // Update active tab based on scroll selection
  const effectiveTab = selected < examples.length ? selected : activeTab

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-800">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-2 py-2 bg-[#2d2d2d] border-b border-gray-800 overflow-x-auto">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-3 py-1.5 text-sm rounded transition-colors whitespace-nowrap ${
              effectiveTab === index ? 'bg-[#1e1e1e] text-white' : 'text-gray-400 hover:text-white hover:bg-[#1e1e1e]/50'
            }`}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={examples[effectiveTab]?.language || 'typescript'}
          value={examples[effectiveTab]?.code || ''}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            readOnly: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
            fontLigatures: true,
          }}
        />
      </div>
    </div>
  )
}
