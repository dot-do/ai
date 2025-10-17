'use client'

import { useState } from 'react'

interface HeroProps {
  title: string
  description: string
  packageName: string
  gradient?: string
}

export function Hero({ title, description, packageName, gradient = 'from-blue-500 to-purple-600' }: HeroProps) {
  const [copied, setCopied] = useState(false)

  const installCommand = `pnpm add ${packageName}`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />

      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{title}</h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">{description}</p>

        {/* Install command */}
        <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
          <div className="flex-1 relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
            <div className="relative bg-[#1e1e1e] rounded-lg border border-gray-800 px-6 py-4 flex items-center justify-between">
              <code className="text-lg font-mono text-gray-300">{installCommand}</code>
              <button onClick={copyToClipboard} className="ml-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors text-sm font-medium">
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <a href="#getting-started" className="text-gray-400 hover:text-white transition-colors">
            Get Started →
          </a>
          <a href="/docs" className="text-gray-400 hover:text-white transition-colors">
            Documentation
          </a>
          <a href="/examples" className="text-gray-400 hover:text-white transition-colors">
            Examples
          </a>
        </div>
      </div>
    </div>
  )
}
