import React from 'react'
import { AI } from '../src'

export const ArrayOutputExample = () => {
  return (
    <AI
      model="gpt-4o"
      output="array"
      cols={3}
      schema={{
        name: 'string',
        description: 'string',
        category: 'Frontend | Backend | DevOps | Design',
      }}
      prompt="Generate 6 product ideas for developer tools"
    >
      {(props, { isStreaming, error }) => (
        <div className="p-4 border rounded-lg shadow-sm">
          {error ? (
            <div className="text-red-500">Error: {error.message}</div>
          ) : (
            <>
              <h2 className="text-lg font-bold">{props.name}</h2>
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full">{props.category}</span>
              <p className="mt-2 text-sm">{props.description}</p>
              {isStreaming && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <div className="text-gray-500">Generating...</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </AI>
  )
}
