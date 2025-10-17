import React from 'react'
import { AI } from '../src'

export const EnumOptionsExample = () => {
  return (
    <AI
      model="gpt-4o"
      schema={{
        productType: 'App | API | Marketplace | Platform',
        profile: {
          customer: 'customer description',
          solution: 'solution description',
        },
      }}
      prompt="Generate a product profile for a developer tool"
    >
      {(props, { isStreaming, error }) => (
        <div className={isStreaming ? 'animate-pulse' : ''}>
          {error ? (
            <div className="text-red-500">Error: {error.message}</div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">Product Type: {props.productType}</h2>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Customer</h3>
                <p>{props.profile.customer}</p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Solution</h3>
                <p>{props.profile.solution}</p>
              </div>
              {isStreaming && <div className="text-gray-500 mt-4">Generating content...</div>}
            </>
          )}
        </div>
      )}
    </AI>
  )
}
