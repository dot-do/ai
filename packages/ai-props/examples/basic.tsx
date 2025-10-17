import React from 'react'
import { AI } from '../src'

export const BasicExample = () => {
  return (
    <AI
      model="gpt-4o"
      schema={{
        title: 'string',
        content: 'string',
      }}
      prompt="Generate a short article about React components"
    >
      {(props, { isStreaming, error }) => (
        <div className={isStreaming ? 'animate-pulse' : ''}>
          {error ? (
            <div className="text-red-500">Error: {error.message}</div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">{props.title}</h1>
              <div className="prose">{props.content}</div>
              {isStreaming && <div className="text-gray-500 mt-4">Generating content...</div>}
            </>
          )}
        </div>
      )}
    </AI>
  )
}
