import React from 'react'
import { AI } from '../src'

export const StreamingExample = () => {
  return (
    <AI
      model="gpt-4o"
      stream={true}
      schema={{
        title: 'string',
        content: 'string',
      }}
      prompt="Generate an article about AI-powered React components"
    >
      {(props, { isStreaming, error }) => (
        <article className={isStreaming ? 'animate-pulse' : ''}>
          {error ? (
            <div className="text-red-500">Error: {error.message}</div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">{props.title}</h1>
              <div className="prose">{props.content}</div>
              {isStreaming && <div className="text-gray-500 mt-4">Generating content...</div>}
            </>
          )}
        </article>
      )}
    </AI>
  )
}
